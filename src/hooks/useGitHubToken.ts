import { useState, useCallback } from "react";
import { callGitHubClone } from "@/lib/github";

interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  bio: string;
}

export function useGitHubToken() {
  const [token, setToken] = useState(() => localStorage.getItem("gh_token") || "");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(async (t: string) => {
    if (!t.trim()) { setError("Token is required"); return false; }
    setIsValidating(true);
    setError(null);
    try {
      const data = await callGitHubClone({ action: "validate", token: t });
      setUser(data.user);
      localStorage.setItem("gh_token", t);
      setToken(t);
      return true;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid token";
      setError(msg);
      setUser(null);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem("gh_token");
    setToken("");
    setUser(null);
    setError(null);
  }, []);

  return { token, setToken, user, isValidating, error, validate, disconnect };
}
