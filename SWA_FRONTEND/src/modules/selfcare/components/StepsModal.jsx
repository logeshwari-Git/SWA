import "./StepsModal.css";

const API_BASE_URL = "http://127.0.0.1:5001";

export default function StepsModal({ data, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card large" onClick={(event) => event.stopPropagation()}>
        <button className="close-icon" onClick={onClose}>
          X
        </button>

        <h2 className="modal-title">{data.title}</h2>

        {data.image ? (
          <img
            src={`${API_BASE_URL}${data.image}`}
            className="modal-image"
            alt={data.title}
          />
        ) : (
          <div className="modal-image modal-image--placeholder">
            <span>{data.title?.slice(0, 1) || "S"}</span>
          </div>
        )}

        <h3 className="steps-title">Steps</h3>

        <div className="steps-scroll">
          <ul>
            {(data.steps || []).map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
