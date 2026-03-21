function UploadModal({ close }) {
  return (
    <div className="modal-bg">
      <div className="modal-box">

        <h4>Upload Interview Data</h4>

        <textarea
          className="form-control my-3"
          placeholder="Paste transcript..."
        />

        <input type="file" className="form-control my-2" />
        <input type="file" className="form-control my-2" />

        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-secondary me-2" onClick={close}>
            Close
          </button>
          <button className="btn btn-primary">
            Run Analysis
          </button>
        </div>

      </div>
    </div>
  );
}

export default UploadModal;