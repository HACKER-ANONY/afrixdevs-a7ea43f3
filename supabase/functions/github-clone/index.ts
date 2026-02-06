import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function githubFetch(url: string, token: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `GitHub API error: ${res.status}`);
  return data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, token, sourceOwner, sourceRepo, newRepoName, newRepoDescription, isPrivate, query } = await req.json();

    if (!token) throw new Error("GitHub token is required");

    // Validate token by getting user info
    if (action === "validate") {
      const user = await githubFetch("https://api.github.com/user", token);
      const repos = await githubFetch("https://api.github.com/user/repos?per_page=5&sort=updated", token);
      return new Response(JSON.stringify({ user, recentRepos: repos }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Search repos
    if (action === "search") {
      if (!query) throw new Error("Search query is required");
      const results = await githubFetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&per_page=20`,
        token
      );
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get repo details
    if (action === "repo-info") {
      if (!sourceOwner || !sourceRepo) throw new Error("Source owner and repo required");
      const repo = await githubFetch(`https://api.github.com/repos/${sourceOwner}/${sourceRepo}`, token);
      const languages = await githubFetch(`https://api.github.com/repos/${sourceOwner}/${sourceRepo}/languages`, token);
      let readme = null;
      try {
        const readmeData = await githubFetch(`https://api.github.com/repos/${sourceOwner}/${sourceRepo}/readme`, token);
        readme = readmeData.content ? atob(readmeData.content) : null;
      } catch { /* no readme */ }
      return new Response(JSON.stringify({ repo, languages, readme }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Clone (fork + optionally rename) a repo to user's account
    if (action === "clone") {
      if (!sourceOwner || !sourceRepo) throw new Error("Source owner and repo required");

      const user = await githubFetch("https://api.github.com/user", token);
      const targetName = newRepoName || sourceRepo;

      // Step 1: Create a new empty repo
      const newRepo = await githubFetch("https://api.github.com/user/repos", token, {
        method: "POST",
        body: JSON.stringify({
          name: targetName,
          description: newRepoDescription || `Cloned from ${sourceOwner}/${sourceRepo}`,
          private: isPrivate || false,
          auto_init: false,
        }),
      });

      // Step 2: Get the default branch and its tree from source
      const sourceRepoData = await githubFetch(`https://api.github.com/repos/${sourceOwner}/${sourceRepo}`, token);
      const defaultBranch = sourceRepoData.default_branch || "main";

      // Get the reference (commit SHA) of the default branch from source
      const sourceRef = await githubFetch(
        `https://api.github.com/repos/${sourceOwner}/${sourceRepo}/git/ref/heads/${defaultBranch}`,
        token
      );
      const sourceCommitSha = sourceRef.object.sha;

      // Get the commit to find the tree SHA
      const sourceCommit = await githubFetch(
        `https://api.github.com/repos/${sourceOwner}/${sourceRepo}/git/commits/${sourceCommitSha}`,
        token
      );
      const sourceTreeSha = sourceCommit.tree.sha;

      // Get the full tree recursively
      const sourceTree = await githubFetch(
        `https://api.github.com/repos/${sourceOwner}/${sourceRepo}/git/trees/${sourceTreeSha}?recursive=1`,
        token
      );

      // Step 3: Create blobs in the new repo for each file
      const newTreeItems = [];
      for (const item of sourceTree.tree) {
        if (item.type === "blob") {
          // Get the blob content from source
          const blob = await githubFetch(
            `https://api.github.com/repos/${sourceOwner}/${sourceRepo}/git/blobs/${item.sha}`,
            token
          );

          // Create blob in new repo
          const newBlob = await githubFetch(
            `https://api.github.com/repos/${user.login}/${targetName}/git/blobs`,
            token,
            {
              method: "POST",
              body: JSON.stringify({
                content: blob.content,
                encoding: "base64",
              }),
            }
          );

          newTreeItems.push({
            path: item.path,
            mode: item.mode,
            type: "blob",
            sha: newBlob.sha,
          });
        }
      }

      // Step 4: Create tree in new repo
      const newTree = await githubFetch(
        `https://api.github.com/repos/${user.login}/${targetName}/git/trees`,
        token,
        {
          method: "POST",
          body: JSON.stringify({ tree: newTreeItems }),
        }
      );

      // Step 5: Create commit
      const newCommit = await githubFetch(
        `https://api.github.com/repos/${user.login}/${targetName}/git/commits`,
        token,
        {
          method: "POST",
          body: JSON.stringify({
            message: `Initial commit - cloned from ${sourceOwner}/${sourceRepo}`,
            tree: newTree.sha,
          }),
        }
      );

      // Step 6: Create the main branch reference
      try {
        await githubFetch(
          `https://api.github.com/repos/${user.login}/${targetName}/git/refs`,
          token,
          {
            method: "POST",
            body: JSON.stringify({
              ref: `refs/heads/${defaultBranch}`,
              sha: newCommit.sha,
            }),
          }
        );
      } catch {
        // If ref already exists, update it
        await githubFetch(
          `https://api.github.com/repos/${user.login}/${targetName}/git/refs/heads/${defaultBranch}`,
          token,
          {
            method: "PATCH",
            body: JSON.stringify({ sha: newCommit.sha, force: true }),
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          repo: newRepo,
          filesCloned: newTreeItems.length,
          message: `Successfully cloned ${sourceOwner}/${sourceRepo} to ${user.login}/${targetName}`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error(`Unknown action: ${action}`);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("GitHub clone error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
