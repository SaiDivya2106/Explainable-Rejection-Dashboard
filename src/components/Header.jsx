import UploadModal from "./UploadModal";
import { useState } from "react";

function Header() {
  const [show, setShow] = useState(false);

  return (
    <div className="container-fluid vh-100 d-flex flex-column">

      {/* Top - Button */}
      <div className="d-flex justify-content-end p-3">
        <button
          className="btn btn-primary px-4 py-2 shadow"
          onClick={() => setShow(true)}
        >
          ⬆ Upload New Data
        </button>
      </div>

      {/* Middle - Center Content */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center">
        <h2 className="fw-bold">
          Explainable Interview Rejection Reason Inference System
        </h2>

        <p className="text-muted mt-3">
          Transparent, AI-driven competency breakdown and feedback analysis.
        </p>
      </div>

      {/* Bottom - Tagline */}
      <div className="text-center pb-4">
        <p className="fst-italic text-secondary">
          "Turning Interview Rejections into Actionable Growth."
        </p>
      </div>

      {show && <UploadModal close={() => setShow(false)} />}
    </div>
  );
}

export default Header;