import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Search, Copy, Sparkles } from "lucide-react";
import GitHubTokenInput from "@/components/GitHubTokenInput";
import RepoSearch from "@/components/RepoSearch";
import ClonePanel from "@/components/ClonePanel";
import { useGitHubToken } from "@/hooks/useGitHubToken";

export default function GitHubCloner() {
  const { token, setToken, user, isValidating, error, validate, disconnect } = useGitHubToken();
  const [selectedOwner, setSelectedOwner] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");
  const [activeTab, setActiveTab] = useState<"search" | "clone">("search");

  const handleSelect = (owner: string, repo: string) => {
    setSelectedOwner(owner);
    setSelectedRepo(repo);
    setActiveTab("clone");
  };

  const tabs = [
    { id: "search" as const, label: "Search Repos", icon: Search },
    { id: "clone" as const, label: "Clone & Push", icon: Copy },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <GitBranch className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">GitHub Cloner</h1>
              <p className="text-xs text-muted-foreground">Clone any repo to your account instantly</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              AFRIX DEVS
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Token input */}
        <GitHubTokenInput
          token={token}
          setToken={setToken}
          user={user}
          isValidating={isValidating}
          error={error}
          onValidate={validate}
          onDisconnect={disconnect}
        />

        {/* Main content (only when connected) */}
        {user && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-secondary/50 border border-border w-fit">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "search" && (
              <RepoSearch token={token} onSelect={handleSelect} />
            )}
            {activeTab === "clone" && (
              <ClonePanel
                token={token}
                sourceOwner={selectedOwner}
                sourceRepo={selectedRepo}
                onClear={() => { setSelectedOwner(""); setSelectedRepo(""); }}
              />
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
