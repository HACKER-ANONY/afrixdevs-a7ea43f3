import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, Eye, EyeOff, Loader2, CheckCircle2, XCircle, LogOut, ExternalLink } from "lucide-react";

interface Props {
  token: string;
  setToken: (t: string) => void;
  user: { login: string; avatar_url: string; name: string; public_repos: number; followers: number; bio: string; html_url: string } | null;
  isValidating: boolean;
  error: string | null;
  onValidate: (t: string) => Promise<boolean>;
  onDisconnect: () => void;
}

export default function GitHubTokenInput({ token, setToken, user, isValidating, error, onValidate, onDisconnect }: Props) {
  const [showToken, setShowToken] = useState(false);

  if (user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card p-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={user.avatar_url} alt={user.login} className="w-12 h-12 rounded-full ring-2 ring-primary/30" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{user.name || user.login}</h3>
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">@{user.login} · {user.public_repos} repos · {user.followers} followers</p>
              {user.bio && <p className="text-xs text-muted-foreground mt-1 max-w-md truncate">{user.bio}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onDisconnect}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-5 space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <KeyRound className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Connect GitHub</h3>
          <p className="text-sm text-muted-foreground">Enter your Personal Access Token to get started</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={showToken ? "text" : "password"}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 pr-10"
            onKeyDown={(e) => e.key === "Enter" && onValidate(token)}
          />
          <button
            onClick={() => setShowToken(!showToken)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <button
          onClick={() => onValidate(token)}
          disabled={isValidating || !token.trim()}
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
        >
          {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Connect"}
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-destructive text-sm"
          >
            <XCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-muted-foreground">
        Need a token?{" "}
        <a href="https://github.com/settings/tokens/new?scopes=repo&description=AFRIX+DEVS+Clone+Tool" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          Create one here
        </a>{" "}
        — make sure to check the <code className="text-xs bg-secondary px-1 py-0.5 rounded">repo</code> scope.
      </p>
    </motion.div>
  );
}
