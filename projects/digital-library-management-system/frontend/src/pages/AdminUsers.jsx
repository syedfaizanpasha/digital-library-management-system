import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function AdminUsers() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // GET ALL USERS
  // =========================================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/users",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch users"
        );
      }

      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // FETCH USERS WHEN PAGE LOADS
  // =========================================
  useEffect(() => {
    if (user?.token) {
      fetchUsers();
    }
  }, [user]);

  // =========================================
  // DELETE USER
  // =========================================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete user"
        );
      }

      setUsers(
        users.filter((userItem) => userItem.id !== id)
      );

      alert("User deleted successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  // =========================================
  // PAGE
  // =========================================
  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <h1>Manage Users</h1>

        <p>
          View all registered users in the
          Digital Library.
        </p>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <p style={styles.message}>
          Loading users...
        </p>
      ) : users.length === 0 ? (
        <p style={styles.message}>
          No users found.
        </p>
      ) : (
        <div style={styles.tableContainer}>

          <h2>All Users</h2>

          <table style={styles.table}>

            <thead>
              <tr>
                <th style={styles.tableHeader}>
                  ID
                </th>

                <th style={styles.tableHeader}>
                  Name
                </th>

                <th style={styles.tableHeader}>
                  Email
                </th>

                <th style={styles.tableHeader}>
                  Role
                </th>

                <th style={styles.tableHeader}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {users.map((userItem) => (
                <tr key={userItem.id}>

                  <td style={styles.tableCell}>
                    {userItem.id}
                  </td>

                  <td style={styles.tableCell}>
                    {userItem.name}
                  </td>

                  <td style={styles.tableCell}>
                    {userItem.email}
                  </td>

                  <td style={styles.tableCell}>

                    <span
                      style={{
                        ...styles.role,
                        backgroundColor:
                          userItem.role === "admin"
                            ? "#fee2e2"
                            : "#dbeafe",

                        color:
                          userItem.role === "admin"
                            ? "#b91c1c"
                            : "#1d4ed8",
                      }}
                    >
                      {userItem.role}
                    </span>

                  </td>

                  <td style={styles.tableCell}>

                    <button
                      onClick={() =>
                        handleDelete(userItem.id)
                      }
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>

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

// =========================================
// STYLES
// =========================================

const styles = {

  page: {
    minHeight: "100vh",
    padding: "50px 8%",
    backgroundColor: "#f8fafc",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    textAlign: "center",
    marginBottom: "40px",
  },

  headerTitle: {
    fontSize: "32px",
  },

  tableContainer: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "15px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.08)",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },

  tableHeader: {
    border: "1px solid #ddd",
    padding: "14px",
    backgroundColor: "#f1f5f9",
    textAlign: "left",
  },

  tableCell: {
    border: "1px solid #ddd",
    padding: "14px",
  },

  role: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  deleteButton: {
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    padding: "7px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  message: {
    textAlign: "center",
    fontSize: "18px",
    color: "#64748b",
    marginTop: "50px",
  },

  error: {
    maxWidth: "700px",
    margin: "20px auto",
    padding: "15px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    borderRadius: "8px",
    textAlign: "center",
    fontWeight: "bold",
  },
};

export default AdminUsers;