import { Routes, Route } from "react-router-dom";
import GitHubCloner from "./pages/GitHubCloner";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<GitHubCloner />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
