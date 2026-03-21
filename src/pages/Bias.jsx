import { useNavigate } from "react-router-dom";

function Bias({ transcriptData }) {

  const navigate = useNavigate();

  // ✅ Prevent crash if data is undefined
  const lowerText = (transcriptData || "").toLowerCase();

  let biasFlags = [];

  // 🔍 Simple bias checks
  if (lowerText.includes("he") || lowerText.includes("she")) {
    biasFlags.push("Gender-specific references");
  }

  if (lowerText.includes("young") || lowerText.includes("old")) {
    biasFlags.push("Age-related wording");
  }

  if (
    lowerText.includes("he is strong") ||
    lowerText.includes("she is emotional")
  ) {
    biasFlags.push("Stereotypical language");
  }

  // 🎯 Score logic
  const biasScore = biasFlags.length === 0 ? 95 : 60;

  // 🚫 If no data
  if (!transcriptData) {
    return (
      <div className="container mt-4 text-center">
        <h4>No transcript data available</h4>
        <p>Please go to Transcript page and analyze first.</p>

        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/transcript")}
        >
          Go to Transcript →
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <h2 className="text-danger text-center mb-4">
        Bias & Fairness Report
      </h2>

      {/* ⭐ Score Card */}
      <div className="card p-4 shadow mb-4 text-center">
        <h5>Fairness Score</h5>

        <div className="progress mt-3">
          <div
            className={`progress-bar ${
              biasScore > 80 ? "bg-success" : "bg-danger"
            }`}
            style={{ width: biasScore + "%" }}
          >
            {biasScore}%
          </div>
        </div>

        <p className="mt-3">
          {biasScore > 80
            ? "✅ The evaluation is fair and unbiased."
            : "⚠️ Some potential bias detected."}
        </p>
      </div>

      {/* 🔍 Bias Detection */}
      <div className="card p-4 shadow mb-4">
        <h5>🔍 Bias Detection</h5>

        {biasFlags.length > 0 ? (
          <ul className="list-group mt-3">
            {biasFlags.map((item, index) => (
              <li
                key={index}
                className="list-group-item list-group-item-warning"
              >
                ⚠️ {item}
              </li>
            ))}
          </ul>
        ) : (
          <div className="alert alert-success mt-3">
            🎉 No bias-related language detected.
          </div>
        )}
      </div>

      {/* 🤖 AI Insight */}
      <div className="card p-4 shadow">
        <h5>🤖 AI Insight</h5>

        <p className="mt-2">
          This module evaluates whether the candidate assessment contains any
          biased or unfair language. It focuses on gender neutrality, age
          fairness, and avoiding stereotypes.
        </p>

        <div className="alert alert-info mt-3">
          💡 <strong>Tip:</strong> Use neutral, skill-based language to ensure
          fair evaluation of all candidates.
        </div>
      </div>

    </div>
  );
}

export default Bias;