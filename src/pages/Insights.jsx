import { useNavigate } from "react-router-dom";

function Insights({ transcriptData }) {

  const navigate = useNavigate();
  const text = (transcriptData || "").toLowerCase();

  // 🚫 No data
  if (!transcriptData) {
    return (
      <div className="container text-center mt-4">
        <h4>No data available</h4>
        <button
          onClick={() => navigate("/transcript")}
          className="btn btn-primary mt-3 w-100 w-md-auto"
        >
          Go to Transcript
        </button>
      </div>
    );
  }

  // 🎯 Scores
  const tech = text.includes("react") ? 80 : 50;
  const comm = text.length > 100 ? 80 : 60;
  const problem = text.includes("solve") ? 75 : 55;
  const bias = text.includes("he") || text.includes("she") ? 60 : 90;

  const overall = Math.round((tech + comm + problem + bias) / 4);

  const decision =
    overall > 80 ? "Strong Hire" :
    overall > 60 ? "Consider" :
    "Not Recommended";

  return (
    <div className="container-fluid container-sm mt-3 mt-md-4 px-2 px-md-4">

      {/* 🔥 Title */}
      <h2 className="text-center mb-4 fs-4 fs-md-2 fw-bold">
        Final AI Insights
      </h2>

      {/* ⭐ Overall Score */}
      <div className="card p-3 p-md-4 shadow-sm text-center mb-4">
        <h5 className="fs-6 fs-md-5">Overall Score</h5>

        <h1 className="text-primary display-6 display-md-4">
          {overall}%
        </h1>

        <span
          className={`badge px-3 py-2 fs-6 ${
            decision === "Strong Hire"
              ? "bg-success"
              : decision === "Consider"
              ? "bg-warning text-dark"
              : "bg-danger"
          }`}
        >
          {decision}
        </span>
      </div>

      {/* 📊 Cards Grid */}
      <div className="row g-3">

        {/* Strengths */}
        <div className="col-12 col-md-6">
          <div className="card p-3 p-md-4 shadow-sm h-100">
            <h6 className="fw-bold mb-2">💪 Strengths</h6>
            <ul className="mb-0 small">
              {tech > 70 && <li>Strong technical knowledge</li>}
              {comm > 70 && <li>Good communication</li>}
              {problem > 70 && <li>Problem-solving ability</li>}
              {!tech && !comm && !problem && <li>Basic skill level</li>}
            </ul>
          </div>
        </div>

        {/* Weakness */}
        <div className="col-12 col-md-6">
          <div className="card p-3 p-md-4 shadow-sm h-100">
            <h6 className="fw-bold mb-2">⚠️ Areas to Improve</h6>
            <ul className="mb-0 small">
              {tech <= 70 && <li>Improve technical depth</li>}
              {problem <= 70 && <li>Add problem-solving examples</li>}
              {comm <= 70 && <li>Enhance communication clarity</li>}
            </ul>
          </div>
        </div>

        {/* Bias */}
        <div className="col-12 col-md-6">
          <div className="card p-3 p-md-4 shadow-sm h-100">
            <h6 className="fw-bold mb-2">⚖️ Bias Summary</h6>
            <p className="mb-0 small">
              {bias < 80
                ? "⚠️ Some bias-related language detected"
                : "✅ No bias detected"}
            </p>
          </div>
        </div>

        {/* AI Insight */}
        <div className="col-12 col-md-6">
          <div className="card p-3 p-md-4 shadow-sm h-100">
            <h6 className="fw-bold mb-2">🤖 AI Insight</h6>
            <p className="mb-0 small">
              The candidate shows{" "}
              <strong>
                {decision === "Strong Hire" ? "excellent" : "moderate"}
              </strong>{" "}
              performance. Overall recommendation:{" "}
              <strong>{decision}</strong>.
            </p>
          </div>
        </div>

      </div>

      {/* 🔘 Navigation */}
      <div className="text-center mt-4">
        <button
          className="btn btn-primary w-100 w-md-auto"
          onClick={() => navigate("/transcript")}
        >
          🔁 Analyze Another Candidate
        </button>
      </div>
      <button
  className="btn btn-success mt-3 w-100"
  onClick={() => navigate("/candidate")}
>
  View Candidate Feedback →
</button>

    </div>
  );
}

export default Insights;