import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateContestPage from "./CreateContestPage";
import HomePage from "./HomePage";
import Entries from "./Entries";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-contest" element={<CreateContestPage />} />
        <Route path="/entries" element={<Entries />} />
      </Routes>
    </Router>
  );
}

export default App;
