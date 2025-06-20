import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import "../doctor/doctorDashboard.css";

// Live count animation hook
const useCountUp = (target, duration = 1500) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target, 10);
    if (isNaN(end) || start === end) return;

    const increment = Math.ceil(end / (duration / 16));
    const step = () => {
      start += increment;
      if (start >= end) {
        setCount(end);
      } else {
        setCount(start);
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return count;
};

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchedPatient, setSearchedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await apiRequest("/patients");
        setPatients(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("❌ Failed to load patients.");
      }
    };
    fetchPatients();
  }, []);

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    try {
      const res = await apiRequest(`/patients/${searchId.trim()}`);
      if (res && res.ID) {
        setSearchedPatient(res);
      } else {
        setSearchedPatient({ error: "❌ No patient found with that ID." });
      }
    } catch (err) {
      console.error("Search error:", err.message);
      setSearchedPatient({ error: "❌ No patient found with that ID." });
    }
  };

  const handleEditChange = (field, value) => {
    setEditingPatient(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const res = await apiRequest(`/patients/${editingPatient.ID}`, "PUT", editingPatient);
      setPatients(patients.map(p => (p.ID === res.ID ? res : p)));
      setEditingPatient(null);
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Failed to update patient.");
    }
  };

  const handleLogout = () => {
    // Optionally remove token here
    // localStorage.removeItem("token");
    window.location.href = "/"; // Adjust route as needed
  };

  const totalPatients = patients.length;
  const maleCount = patients.filter((p) => p.gender === "male").length;
  const femaleCount = patients.filter((p) => p.gender === "female").length;

  const animatedTotal = useCountUp(totalPatients);
  const animatedMale = useCountUp(maleCount);
  const animatedFemale = useCountUp(femaleCount);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>👨‍⚕️ Doctor Dashboard</h2>
        <button className="logout-button" onClick={handleLogout}>🚪 Logout</button>
      </div>

      {!error && (
        <div className="dashboard-stats">
          <div className="stat-card"><h3>Total Patients</h3><p>{animatedTotal}</p></div>
          <div className="stat-card"><h3>Male</h3><p>{animatedMale}</p></div>
          <div className="stat-card"><h3>Female</h3><p>{animatedFemale}</p></div>
        </div>
      )}

      <div className="search-bar">
        <input
          type="number"
          placeholder="Enter Patient ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch}>🔍 Search</button>
      </div>

      {searchedPatient && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setSearchedPatient(null)}>✖</button>
            {searchedPatient.error ? (
              <p className="error">{searchedPatient.error}</p>
            ) : (
              <div className="patient-card">
                <h3>🧾 Patient Details</h3>
                <p><strong>ID:</strong> {searchedPatient.ID}</p>
                <p><strong>Name:</strong> {searchedPatient.first_name} {searchedPatient.last_name}</p>
                <p><strong>Gender:</strong> {searchedPatient.gender}</p>
                <p><strong>Age:</strong> {searchedPatient.age}</p>
                <p><strong>Mobile:</strong> {searchedPatient.mobile}</p>
                <p><strong>Email:</strong> {searchedPatient.email}</p>
                <p><strong>Address:</strong> {searchedPatient.address}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {editingPatient && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setEditingPatient(null)}>✖</button>
            <div className="patient-card">
              <h3>📝 Edit Patient</h3>
              <p><strong>Patient ID:</strong> {editingPatient.ID}</p>
              <input value={editingPatient.first_name} onChange={(e) => handleEditChange("first_name", e.target.value)} placeholder="First Name" />
              <input value={editingPatient.last_name} onChange={(e) => handleEditChange("last_name", e.target.value)} placeholder="Last Name" />
              <input value={editingPatient.gender} onChange={(e) => handleEditChange("gender", e.target.value)} placeholder="Gender" />
              <input value={editingPatient.age} onChange={(e) => handleEditChange("age", e.target.value)} type="number" placeholder="Age" />
              <input value={editingPatient.mobile} onChange={(e) => handleEditChange("mobile", e.target.value)} placeholder="Mobile" />
              <input value={editingPatient.email} onChange={(e) => handleEditChange("email", e.target.value)} placeholder="Email" />
              <input value={editingPatient.address} onChange={(e) => handleEditChange("address", e.target.value)} placeholder="Address" />
              <button onClick={handleSaveEdit}>💾 Save</button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="error">{error}</p>}
      {patients.length > 0 ? (
        <div className="table-wrapper">
          <table className="patients-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Patient ID</th>
                <th>👤 Name</th>
                <th>⚧ Gender</th>
                <th>🎂 Age</th>
                <th>📞 Mobile</th>
                <th>✉️ Email</th>
                <th>🏠 Address</th>
                <th>✏️ Edit</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p, index) => (
                <tr key={p.ID}>
                  <td>{index + 1}</td>
                  <td>{p.ID}</td>
                  <td>{p.first_name} {p.last_name}</td>
                  <td>{p.gender}</td>
                  <td>{p.age}</td>
                  <td>{p.mobile}</td>
                  <td>{p.email}</td>
                  <td>{p.address}</td>
                  <td>
                    <button className="row-edit-btn" onClick={() => setEditingPatient(p)}>✏️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && <p className="no-patients">No patients found.</p>
      )}
    </div>
  );
};

export default DoctorDashboard;
