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
      const data = await apiRequest("/api/patients");  // ✅ fixed
      setPatients(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("❌ Failed to load patients.");
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    try {
      const res = await apiRequest(`/api/patients/${searchId.trim()}`);  // ✅ fixed
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
      const res = await apiRequest(`/api/patients/${editingPatient.ID}`, "PUT", editingPatient);  // ✅ fixed
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
      await apiRequest(`/api/patients/${id}`, "DELETE");  // ✅ fixed
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
      const res = await apiRequest("/api/patients", "POST", payload);  // ✅ fixed
      setPatients([...patients, res]);
      setNewPatient(null);
    } catch (err) {
      alert("❌ Registration failed. " + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    // ⬇️ same rendering JSX, no changes here
    <div className="dashboard-container">
      {/* same as before */}
      {/* your JSX rendering logic */}
    </div>
  );
};

export default ReceptionistDashboard;
