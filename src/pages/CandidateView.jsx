import { useNavigate } from "react-router-dom";

function CandidateView({ transcriptData }) {
  const navigate = useNavigate();

  // ✅ Get data from localStorage
  const storedData = localStorage.getItem("transcript");

  // ✅ Final data source (works for navbar + refresh)
  const finalData = transcriptData || storedData || "";
  const text = finalData.toLowerCase();

  // 🚫 No data case
  if (!finalData) {
    return (
      <div className="container text-center mt-4">
        <h4>No transcript found</h4>
        <p>Please analyze a transcript first.</p>

        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/transcript")}
        >
          Go to Transcript
        </button>
      </div>
    );
  }

  // 🎯 Scores
  const tech = text.includes("react") ? 4 : 2;
  const comm = text.length > 100 ? 4 : 3;
  const problem = text.includes("solve") ? 4 : 2;

  // 🎯 Role suggestion
  const role = tech >= 4 ? "Frontend Developer" : "Junior Developer";

  return (
    <div className="container-fluid container-sm mt-3 px-2 px-md-4">

      {/* 🔥 Title */}
      <h2 className="text-center mb-3 fs-4 fs-md-2 fw-bold">
        Candidate Feedback
      </h2>

      <p className="text-center text-muted small">
        Based on your recent transcript analysis
      </p>

      {/* 👋 Greeting */}
      <div className="card p-3 shadow-sm mb-3 text-center">
        <h5>Hello 👋</h5>
        <p className="small mb-0">
          Here is your personalized interview feedback.
        </p>
      </div>

      {/* ⭐ Scores */}
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div className="card p-3 shadow-sm text-center">
            <h6>Technical</h6>
            <p className="fs-5">{"⭐".repeat(tech)}</p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card p-3 shadow-sm text-center">
            <h6>Communication</h6>
            <p className="fs-5">{"⭐".repeat(comm)}</p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card p-3 shadow-sm text-center">
            <h6>Problem Solving</h6>
            <p className="fs-5">{"⭐".repeat(problem)}</p>
          </div>
        </div>
      </div>

      {/* 💪 Strengths */}
      <div className="card p-3 shadow-sm mt-3">
        <h6>💪 Strengths</h6>
        <ul className="small mb-0">
          {tech >= 4 && <li>Strong technical knowledge</li>}
          {comm >= 4 && <li>Good communication</li>}
          {problem >= 4 && <li>Problem-solving ability</li>}
        </ul>
      </div>

      {/* ⚠️ Improvements */}
      <div className="card p-3 shadow-sm mt-3">
        <h6>⚠️ Areas to Improve</h6>
        <ul className="small mb-0">
          {tech < 4 && <li>Improve technical skills</li>}
          {problem < 4 && <li>Practice solving problems</li>}
          {comm < 4 && <li>Enhance communication clarity</li>}
        </ul>
      </div>

      {/* 🤖 Suggestions */}
      <div className="card p-3 shadow-sm mt-3">
        <h6>🤖 AI Suggestions</h6>
        <p className="small mb-0">
          Build more projects, practice coding regularly, and clearly explain
          your approach during interviews.
        </p>
      </div>

      {/* 📚 Learning Path */}
      <div className="card p-3 shadow-sm mt-3">
        <h6>📚 Recommended Learning Path</h6>
        <ul className="small mb-0">
          <li>Learn Advanced React</li>
          <li>Practice DSA problems</li>
          <li>Build 2–3 real-world projects</li>
        </ul>
      </div>

      {/* 🎯 Role */}
      <div className="card p-3 shadow-sm mt-3 text-center">
        <h6>🎯 Suggested Role</h6>
        <p className="fw-bold text-primary mb-0">{role}</p>
      </div>

      {/* 🚀 Motivation */}
      <div className="alert alert-success mt-3 text-center">
        🚀 You are on the right track. Keep learning and improving!
      </div>

      {/* 🔘 Buttons */}
      <div className="text-center mt-3">
        <button
          className="btn btn-primary w-100 w-md-auto me-md-2 mb-2"
          onClick={() => navigate("/transcript")}
        >
          Analyze Another Candidate
        </button>

        <button
          className="btn btn-danger w-100 w-md-auto"
          onClick={() => {
            localStorage.removeItem("transcript");
            navigate("/transcript");
          }}
        >
          Reset Data
        </button>
      </div>

    </div>
  );
}

export default CandidateView;