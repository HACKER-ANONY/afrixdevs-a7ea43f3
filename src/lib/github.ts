import { supabase } from "@/integrations/supabase/client";

interface GitHubRequest {
  action: string;
  token: string;
  sourceOwner?: string;
  sourceRepo?: string;
  newRepoName?: string;
  newRepoDescription?: string;
  isPrivate?: boolean;
  query?: string;
}

export async function callGitHubClone(params: GitHubRequest) {
  const { data, error } = await supabase.functions.invoke("github-clone", {
    body: params,
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data;
}

export function parseRepoUrl(url: string): { owner: string; repo: string } | null {
  // Supports: https://github.com/owner/repo, github.com/owner/repo, owner/repo
  const patterns = [
    /github\.com\/([^/]+)\/([^/.\s]+)/,
    /^([^/\s]+)\/([^/.\s]+)$/,
  ];
  for (const pattern of patterns) {
    const match = url.trim().match(pattern);
    if (match) return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
  }
  return null;
}
