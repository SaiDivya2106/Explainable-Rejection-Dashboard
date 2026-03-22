import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Transcript from "./pages/Transcript";
import Competency from "./pages/Competency";
import Bias from "./pages/Bias";
import Insights from "./pages/Insights";
import CandidateView from "./pages/CandidateView";

function App() {
  const [transcriptData, setTranscriptData] = useState("");

  return (
    <BrowserRouter>
      <Navbar />

      {/* ✅ ALL routes must be inside this */}
      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route
          path="/transcript"
          element={<Transcript setTranscriptData={setTranscriptData} />}
        />

        <Route
          path="/competency"
          element={<Competency transcriptData={transcriptData} />}
        />

        <Route
          path="/bias"
          element={<Bias transcriptData={transcriptData} />}
        />

        <Route
          path="/insights"
          element={<Insights transcriptData={transcriptData} />}
        />

        {/* ✅ YOUR NEW ROUTE */}
        <Route
          path="/candidate"
          element={<CandidateView transcriptData={transcriptData} />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;