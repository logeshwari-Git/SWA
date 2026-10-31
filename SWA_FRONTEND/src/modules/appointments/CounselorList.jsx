import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../student-core/utils/api";

function CounselorList({ setSelectedCounselor }) {
  const [counselors, setCounselors] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/counselors`)
      .then(res => setCounselors(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Available Counselors</h2>

      {counselors.map(c => (
        <div key={c._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <p><strong>Name:</strong> {c.name}</p>
          <p><strong>Specialization:</strong> {c.specialization}</p>
          <button onClick={() => setSelectedCounselor(c)}>
            Book Appointment
          </button>
        </div>
      ))}
    </div>
  );
}

export default CounselorList;
