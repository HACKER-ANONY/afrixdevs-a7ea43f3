import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitFork, Lock, Globe, Loader2, CheckCircle2, ArrowRight, FileCode2, ExternalLink } from "lucide-react";
import { callGitHubClone, parseRepoUrl } from "@/lib/github";
import { toast } from "sonner";

interface Props {
  token: string;
  sourceOwner?: string;
  sourceRepo?: string;
  onClear: () => void;
}

export default function ClonePanel({ token, sourceOwner: initOwner, sourceRepo: initRepo, onClear }: Props) {
  const [repoUrl, setRepoUrl] = useState(initOwner && initRepo ? `${initOwner}/${initRepo}` : "");
  const [newName, setNewName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const [result, setResult] = useState<{ repo: { html_url: string; full_name: string }; filesCloned: number } | null>(null);

  const handleClone = async () => {
    const parsed = parseRepoUrl(repoUrl);
    if (!parsed) { toast.error("Invalid repository URL or format (use owner/repo)"); return; }

    setIsCloning(true);
    setResult(null);
    try {
      const data = await callGitHubClone({
        action: "clone",
        token,
        sourceOwner: parsed.owner,
        sourceRepo: parsed.repo,
        newRepoName: newName || undefined,
        newRepoDescription: description || undefined,
        isPrivate,
      });
      setResult(data);
      toast.success(`Successfully cloned ${data.filesCloned} files!`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Clone failed";
      toast.error(msg);
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <GitFork className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Clone Repository</h3>
            <p className="text-sm text-muted-foreground">Copy any public repo directly to your GitHub account</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Source Repository</label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => { setRepoUrl(e.target.value); setResult(null); }}
              placeholder="owner/repo or https://github.com/owner/repo"
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">New Repo Name <span className="text-muted-foreground font-normal">(optional)</span></label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Leave empty to keep original name"
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Description <span className="text-muted-foreground font-normal">(optional)</span></label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="My awesome cloned project"
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors"
            >
              {isPrivate ? <Lock className="w-4 h-4 text-accent-foreground" /> : <Globe className="w-4 h-4 text-primary" />}
              <span className="text-foreground">{isPrivate ? "Private" : "Public"} repository</span>
            </button>

            <button
              onClick={handleClone}
              disabled={isCloning || !repoUrl.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isCloning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cloning...
                </>
              ) : (
                <>
                  <GitFork className="w-4 h-4" />
                  Clone to My GitHub
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="rounded-xl border border-primary/30 bg-primary/5 p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              <h3 className="font-semibold text-foreground text-lg">Clone Successful!</h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><FileCode2 className="w-4 h-4" />{result.filesCloned} files cloned</span>
                <span className="font-mono text-foreground">{result.repo.full_name}</span>
              </div>
              <a
                href={result.repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
              >
                <ExternalLink className="w-4 h-4" />
                View on GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
