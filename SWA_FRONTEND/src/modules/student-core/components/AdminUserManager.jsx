import { useEffect, useState } from "react";
import { apiJson } from "../../../utils/api";

const defaultForm = {
  name: "",
  username: "",
  email: "",
  password: "",
  role: "student",
  studentId: "",
  specialization: "",
  department: ""
};

export default function AdminUserManager() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await apiJson("/api/admin/users");
      setUsers(data || []);
      setStatus("");
    } catch (err) {
      setStatus(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await apiJson("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      setForm(defaultForm);
      setStatus("User created successfully");
      loadUsers();
    } catch (err) {
      setStatus(err.message || "Failed to create user");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await apiJson(`/api/admin/users/${id}`, {
        method: "DELETE"
      });
      setStatus("User deleted successfully");
      loadUsers();
    } catch (err) {
      setStatus(err.message || "Failed to delete user");
    }
  };

  return (
    <div className="content-card admin-panel-card">
      <div className="panel-header">
        <div>
          <h2>User Management</h2>
          <p>Create student, counselor, and admin login IDs with passwords.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="stack" style={{ marginBottom: "20px" }}>
        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="User ID / Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="counselor">Counselor</option>
          <option value="admin">Admin</option>
        </select>

        {form.role === "student" && (
          <>
            <input
              placeholder="Student ID"
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              required
            />
            <input
              placeholder="Department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
          </>
        )}

        {form.role === "counselor" && (
          <input
            placeholder="Specialization"
            value={form.specialization}
            onChange={(e) => setForm({ ...form, specialization: e.target.value })}
          />
        )}

        <button type="submit">Create User</button>
      </form>

      {status ? <p className="form-status">{status}</p> : null}

      {loading ? (
        <p className="empty-state">Loading users...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table border="1" width="100%" cellPadding="10">
            <thead>
              <tr>
                <th>Name</th>
                <th>User ID</th>
                <th>Role</th>
                <th>Email</th>
                <th>Student ID</th>
                <th>Department / Specialization</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.id}>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td>{user.studentId || "-"}</td>
                  <td>{user.department || user.specialization || "-"}</td>
                  <td>
                    <button onClick={() => deleteUser(user._id || user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
