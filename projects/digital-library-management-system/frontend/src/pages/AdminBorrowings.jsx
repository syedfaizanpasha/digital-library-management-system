import { API_URL } from "../config";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function AdminBorrowings() {
  const { user } = useAuth();

  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // GET ALL BORROWING RECORDS
  // =========================================
  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/books/admin/borrowings`,
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
          data.message || "Failed to fetch borrowing records"
        );
      }

      setBorrowings(data);
    } catch (error) {
      console.error(
        "Error fetching borrowings:",
        error
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // FETCH WHEN PAGE LOADS
  // =========================================
  useEffect(() => {
    if (user?.token) {
      fetchBorrowings();
    }
  }, [user]);

  // =========================================
  // FORMAT DATE
  // =========================================
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString();
  };

  // =========================================
  // PAGE
  // =========================================
  return (
    <div style={styles.page}>

      <div style={styles.container}>

        <div style={styles.header}>
          <h1 style={styles.title}>
            Borrowed Books
          </h1>

          <p style={styles.subtitle}>
            View all book borrowing activity in
            the Digital Library.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <p style={styles.message}>
            Loading borrowing records...
          </p>
        ) : borrowings.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>
              📚
            </div>

            <h2>No Borrowing Records</h2>

            <p>
              There are currently no borrowing
              records in the library.
            </p>
          </div>
        ) : (
          <div style={styles.card}>

            <h2 style={styles.sectionTitle}>
              All Borrowing Records
            </h2>

            <div style={styles.tableWrapper}>

              <table style={styles.table}>

                <thead>
                  <tr>

                    <th style={styles.tableHeader}>
                      ID
                    </th>

                    <th style={styles.tableHeader}>
                      User
                    </th>

                    <th style={styles.tableHeader}>
                      Email
                    </th>

                    <th style={styles.tableHeader}>
                      Book
                    </th>

                    <th style={styles.tableHeader}>
                      Author
                    </th>

                    <th style={styles.tableHeader}>
                      Borrowed On
                    </th>

                    <th style={styles.tableHeader}>
                      Returned On
                    </th>

                    <th style={styles.tableHeader}>
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {borrowings.map((record) => (

                    <tr key={record.id}>

                      <td style={styles.tableCell}>
                        {record.id}
                      </td>

                      <td style={styles.tableCell}>
                        {record.user_name}
                      </td>

                      <td style={styles.tableCell}>
                        {record.user_email}
                      </td>

                      <td style={styles.tableCell}>
                        {record.book_title}
                      </td>

                      <td style={styles.tableCell}>
                        {record.book_author}
                      </td>

                      <td style={styles.tableCell}>
                        {formatDate(
                          record.borrow_date
                        )}
                      </td>

                      <td style={styles.tableCell}>
                        {formatDate(
                          record.return_date
                        )}
                      </td>

                      <td style={styles.tableCell}>

                        <span
                          style={{
                            ...styles.status,

                            backgroundColor:
                              record.status === "borrowed"
                                ? "#dcfce7"
                                : "#e5e7eb",

                            color:
                              record.status === "borrowed"
                                ? "#15803d"
                                : "#374151",
                          }}
                        >
                          {record.status}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

// =========================================
// STYLES
// =========================================

const styles = {

  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    padding: "50px 5%",
    fontFamily: "Arial, sans-serif",
  },

  container: {
    maxWidth: "1300px",
    margin: "0 auto",
  },

  header: {
    textAlign: "center",
    marginBottom: "40px",
  },

  title: {
    fontSize: "36px",
    marginBottom: "10px",
    color: "#1f2937",
  },

  subtitle: {
    fontSize: "17px",
    color: "#64748b",
  },

  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "15px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.08)",
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: "20px",
    color: "#1f2937",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1000px",
  },

  tableHeader: {
    border: "1px solid #d1d5db",
    padding: "13px",
    backgroundColor: "#f1f5f9",
    textAlign: "left",
    whiteSpace: "nowrap",
  },

  tableCell: {
    border: "1px solid #d1d5db",
    padding: "13px",
    color: "#374151",
  },

  status: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "bold",
    textTransform: "capitalize",
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

  message: {
    textAlign: "center",
    fontSize: "18px",
    color: "#64748b",
    marginTop: "50px",
  },

  empty: {
    backgroundColor: "white",
    padding: "60px 30px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.08)",
    color: "#64748b",
  },

  emptyIcon: {
    fontSize: "60px",
    marginBottom: "15px",
  },
};

export default AdminBorrowings;