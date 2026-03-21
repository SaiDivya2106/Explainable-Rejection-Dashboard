import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Transcript from "./pages/Transcript";
import Competency from "./pages/Competency";
import Bias from "./pages/Bias";
import Insights from "./pages/Insights";

function App() {
  // ✅ Global state to share data
  const [transcriptData, setTranscriptData] = useState("");

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />

        {/* ✅ Pass setter */}
        <Route
          path="/transcript"
          element={<Transcript setTranscriptData={setTranscriptData} />}
        />

        {/* ✅ Pass data */}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;