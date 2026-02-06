import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, GitFork, Eye, Code2, Loader2 } from "lucide-react";
import { callGitHubClone } from "@/lib/github";

interface Repo {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string;
  owner: { login: string; avatar_url: string };
  html_url: string;
  updated_at: string;
  topics?: string[];
}

interface Props {
  token: string;
  onSelect: (owner: string, repo: string) => void;
}

export default function RepoSearch({ token, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Repo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const data = await callGitHubClone({ action: "search", token, query });
      setResults(data.items || []);
      setSearched(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const langColors: Record<string, string> = {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", Java: "#b07219",
    Go: "#00ADD8", Rust: "#dea584", C: "#555555", "C++": "#f34b7d", Ruby: "#701516",
    PHP: "#4F5D95", Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB",
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search repositories... (e.g. react, next.js, python bot)"
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            onKeyDown={(e) => e.key === "Enter" && search()}
          />
        </div>
        <button
          onClick={search}
          disabled={isSearching || !query.trim()}
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
        >
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-3 max-h-[400px] overflow-y-auto pr-1"
          >
            {results.map((repo, i) => (
              <motion.div
                key={repo.full_name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => {
                  const [owner, name] = repo.full_name.split("/");
                  onSelect(owner, name);
                }}
                className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <img src={repo.owner.avatar_url} alt="" className="w-5 h-5 rounded-full" />
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">{repo.full_name}</span>
                    </div>
                    {repo.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{repo.description}</p>
                    )}
                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {repo.topics.slice(0, 5).map((t) => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColors[repo.language] || "#888" }} />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" />{repo.stargazers_count.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5" />{repo.forks_count.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        {searched && results.length === 0 && !isSearching && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-muted-foreground py-8">
            No repositories found for "{query}"
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
