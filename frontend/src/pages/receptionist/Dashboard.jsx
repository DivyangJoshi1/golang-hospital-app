import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import "../receptionist/receptionistDashboard.css";

const ReceptionistDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchedPatient, setSearchedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [newPatient, setNewPatient] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, patient: null });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await apiRequest("/patients");
      setPatients(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("❌ Failed to load patients.");
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    try {
      const res = await apiRequest(`/patients/${searchId.trim()}`);
      setSearchedPatient(res);
    } catch (err) {
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
      alert("❌ Failed to update.");
    }
  };

  const confirmDelete = (patient) => {
    setDeleteConfirm({ show: true, patient });
  };

  const handleDeleteConfirmed = async () => {
    const id = deleteConfirm.patient?.ID;
    if (!id) return;

    try {
      await apiRequest(`/patients/${id}`, "DELETE");
      setPatients(patients.filter(p => p.ID !== id));
      setDeleteConfirm({ show: false, patient: null });
    } catch (err) {
      alert("❌ Deletion failed.");
    }
  };

  const handleNewChange = (field, value) => {
    setNewPatient(prev => ({
      ...prev,
      [field]: field === "age" ? parseInt(value, 10) : value
    }));
  };

  const handleRegister = async () => {
    const payload = {
      ...newPatient,
      age: parseInt(newPatient.age, 10)
    };

    try {
      const res = await apiRequest("/patients", "POST", payload);
      setPatients([...patients, res]);
      setNewPatient(null);
    } catch (err) {
      alert("❌ Registration failed. " + err.message);
    }
  };

  const handleLogout = () => {
    // You can also remove token here if used
    // localStorage.removeItem("token");
    window.location.href = "/"; // Or navigate using react-router
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>💁 Receptionist Dashboard</h2>
        <button className="logout-button" onClick={handleLogout}>🚪 Logout</button>
      </div>

      <div className="action-bar">
        <button onClick={() => setNewPatient({})}>➕ Register New Patient</button>
        <div className="search-inline">
          <input
            type="number"
            placeholder="Search by Patient ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button onClick={handleSearch}>🔍</button>
        </div>
      </div>

      {/* Search Result Modal */}
      {searchedPatient && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setSearchedPatient(null)}>✖</button>
            {searchedPatient.error ? (
              <p className="error">{searchedPatient.error}</p>
            ) : (
              <div className="patient-card">
                <h3>Patient ID: {searchedPatient.ID}</h3>
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

      {/* New Patient Modal */}
      {newPatient && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setNewPatient(null)}>✖</button>
            <h3>📝 Register New Patient</h3>
            <input placeholder="First Name" onChange={(e) => handleNewChange("first_name", e.target.value)} />
            <input placeholder="Last Name" onChange={(e) => handleNewChange("last_name", e.target.value)} />
            <input placeholder="Gender" onChange={(e) => handleNewChange("gender", e.target.value)} />
            <input placeholder="Age" type="number" onChange={(e) => handleNewChange("age", e.target.value)} />
            <input placeholder="Mobile" onChange={(e) => handleNewChange("mobile", e.target.value)} />
            <input placeholder="Email" onChange={(e) => handleNewChange("email", e.target.value)} />
            <input placeholder="Address" onChange={(e) => handleNewChange("address", e.target.value)} />
            <button onClick={handleRegister}>✅ Register</button>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {editingPatient && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setEditingPatient(null)}>✖</button>
            <h3>Edit Patient #{editingPatient.ID}</h3>
            <input value={editingPatient.first_name} onChange={(e) => handleEditChange("first_name", e.target.value)} />
            <input value={editingPatient.last_name} onChange={(e) => handleEditChange("last_name", e.target.value)} />
            <input value={editingPatient.gender} onChange={(e) => handleEditChange("gender", e.target.value)} />
            <input value={editingPatient.age} type="number" onChange={(e) => handleEditChange("age", e.target.value)} />
            <input value={editingPatient.mobile} onChange={(e) => handleEditChange("mobile", e.target.value)} />
            <input value={editingPatient.email} onChange={(e) => handleEditChange("email", e.target.value)} />
            <input value={editingPatient.address} onChange={(e) => handleEditChange("address", e.target.value)} />
            <button onClick={handleSaveEdit}>💾 Save</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setDeleteConfirm({ show: false, patient: null })}>✖</button>
            <h3>⚠️ Confirm Deletion</h3>
            <p>Are you sure you want to delete <strong>{deleteConfirm.patient.first_name} {deleteConfirm.patient.last_name}</strong> (ID: {deleteConfirm.patient.ID})?</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button style={{ backgroundColor: "#6c757d" }} onClick={() => setDeleteConfirm({ show: false, patient: null })}>Cancel</button>
              <button style={{ backgroundColor: "#e53e3e" }} onClick={handleDeleteConfirmed}>🗑️ Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Table */}
      {error && <p className="error">{error}</p>}
      {patients.length > 0 ? (
        <div className="table-wrapper">
          <table className="patients-table">
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>👤 Name</th>
                <th>⚧ Gender</th>
                <th>🎂 Age</th>
                <th>📞 Mobile</th>
                <th>✉️ Email</th>
                <th>🏠 Address</th>
                <th>✏️</th>
                <th>🗑️</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p, idx) => (
                <tr key={p.ID}>
                  <td>{idx + 1}</td>
                  <td>{p.ID}</td>
                  <td>{p.first_name} {p.last_name}</td>
                  <td>{p.gender}</td>
                  <td>{p.age}</td>
                  <td>{p.mobile}</td>
                  <td>{p.email}</td>
                  <td>{p.address}</td>
                  <td><button onClick={() => setEditingPatient(p)}>✏️</button></td>
                  <td><button onClick={() => confirmDelete(p)}>🗑️</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && <p>No patients found.</p>
      )}
    </div>
  );
};

export default ReceptionistDashboard;
