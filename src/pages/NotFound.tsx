import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-primary font-mono">404</h1>
        <p className="text-muted-foreground text-lg">Page not found</p>
        <Link to="/" className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
          Go Home
        </Link>
      </div>
    </div>
  );
}
