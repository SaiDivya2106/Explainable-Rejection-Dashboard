function Competency({ transcriptData }) {

  // Simple logic (you can improve later)
  const tech = transcriptData.includes("react") ? 80 : 50;
  const comm = transcriptData.includes("team") ? 85 : 60;
  const problem = transcriptData.includes("solve") ? 75 : 55;
  const culture = transcriptData.includes("learn") ? 80 : 60;

  return (
    <div className="container mt-4">

      <h2 className="text-primary text-center mb-4">
        Competency Report
      </h2>

      {/* Technical */}
      <div className="card p-3 shadow mb-3">
        <h5>Technical Skills</h5>
        <div className="progress">
          <div className="progress-bar bg-warning" style={{ width: tech + "%" }}>
            {tech}%
          </div>
        </div>
      </div>

      {/* Communication */}
      <div className="card p-3 shadow mb-3">
        <h5>Communication</h5>
        <div className="progress">
          <div className="progress-bar bg-success" style={{ width: comm + "%" }}>
            {comm}%
          </div>
        </div>
      </div>

      {/* Problem Solving */}
      <div className="card p-3 shadow mb-3">
        <h5>Problem Solving</h5>
        <div className="progress">
          <div className="progress-bar bg-info" style={{ width: problem + "%" }}>
            {problem}%
          </div>
        </div>
      </div>

      {/* Cultural Fit */}
      <div className="card p-3 shadow mb-3">
        <h5>Cultural Fit</h5>
        <div className="progress">
          <div className="progress-bar bg-success" style={{ width: culture + "%" }}>
            {culture}%
          </div>
        </div>
      </div>

    </div>
  );
}

export default Competency;