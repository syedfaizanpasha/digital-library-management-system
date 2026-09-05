import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Admin Dashboard</h1>

        <p style={styles.subtitle}>
          Welcome to the Digital Library Administration Panel
        </p>

        <div style={styles.cards}>
          <div style={styles.card}>
            <div style={styles.icon}>📚</div>
            <h2>Manage Books</h2>
            <p>Add, edit and delete books from the library.</p>
            <button
  style={styles.button}
  onClick={() => navigate("/admin/books")}
>
  Manage Books
</button>
          </div>

          <div style={styles.card}>
  <div style={styles.icon}>👥</div>

  <h2>Manage Users</h2>

  <p>
    View and manage registered library users.
  </p>

  <button
    style={styles.button}
    onClick={() => navigate("/admin/users")}
  >
    Manage Users
  </button>
</div>

          <div style={styles.card}>
            <div style={styles.icon}>📖</div>
            <h2>Borrowed Books</h2>
            <p>View currently borrowed and returned books.</p>
            <button
  style={styles.button}
  onClick={() => navigate("/admin/borrowings")}
>
  View Borrowings
</button>
          </div>

          <div style={styles.card}>
            <div style={styles.icon}>📊</div>
            <h2>Library Statistics</h2>
            <p>View important library information and statistics.</p>
            <button
  style={styles.button}
  onClick={() => navigate("/admin/statistics")}
>
  View Statistics
</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    padding: "50px 20px",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  title: {
    fontSize: "36px",
    marginBottom: "10px",
    color: "#1f2937",
  },

  subtitle: {
    fontSize: "17px",
    color: "#64748b",
    marginBottom: "40px",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "25px",
  },

  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  },

  icon: {
    fontSize: "40px",
    marginBottom: "15px",
  },

  button: {
    marginTop: "15px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "7px",
    cursor: "pointer",
  },
};

export default AdminDashboard;