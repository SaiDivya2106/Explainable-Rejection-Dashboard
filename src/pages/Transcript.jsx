import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Transcript({ setTranscriptData }) {

  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const navigate = useNavigate();

  const analyzeText = () => {

    let keywords = [];

    // Keyword detection
    if (text.includes("react")) keywords.push("React");
    if (text.includes("database")) keywords.push("Database");
    if (text.includes("team")) keywords.push("Teamwork");
    if (text.includes("solve")) keywords.push("Problem Solving");
    if (text.includes("learn")) keywords.push("Learning Ability");

    // Communication logic
    let communication =
      text.length > 100 ? "Good" : text.length > 50 ? "Average" : "Poor";

    setAnalysis({
      keywords,
      communication
    });

    // store data for next page
    setTranscriptData(text);
  };

  return (
    <div className="container mt-4">

      <h2 className="text-primary text-center mb-3">
        Transcript Analysis
      </h2>

      {/* Input */}
      <div className="card p-4 shadow">
        <textarea
          className="form-control mb-3"
          rows="6"
          placeholder="Paste candidate transcript..."
          onChange={(e) => setText(e.target.value)}
        />

        <button className="btn btn-primary w-100" onClick={analyzeText}>
          Analyze Transcript
        </button>
      </div>

      {/* Analysis Result */}
      {analysis && (
        <div className="card p-4 shadow mt-4">

          <h5 className="fw-bold mb-3">🔍 Analysis Result</h5>

          <div className="row text-center">

            {/* Keywords */}
            <div className="col-md-6">
              <div className="border p-3 rounded">
                <h6>Detected Keywords</h6>
                <p className="text-warning fw-semibold">
                  {analysis.keywords.length > 0
                    ? analysis.keywords.join(", ")
                    : "No keywords found"}
                </p>
              </div>
            </div>

            {/* Communication */}
            <div className="col-md-6">
              <div className="border p-3 rounded">
                <h6>Communication Level</h6>
                <p className="text-success fw-semibold">
                  {analysis.communication}
                </p>
              </div>
            </div>

          </div>

          {/* Explanation */}
          <div className="alert alert-info mt-3">
            🤖 <strong>AI Insight:</strong> 
            The candidate shows{" "}
            <b>{analysis.communication}</b> communication and demonstrates 
            knowledge in <b>{analysis.keywords.join(", ") || "basic areas"}</b>.
          </div>

          {/* Next Button */}
          <button
            className="btn btn-success w-100 mt-3"
            onClick={() => navigate("/competency")}
          >
            View Competency Report →
          </button>

        </div>
      )}

    </div>
  );
}

export default Transcript;