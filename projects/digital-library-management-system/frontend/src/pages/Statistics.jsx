import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Statistics() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/stats",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch statistics"
          );
        }

        setStats(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [user]);

  if (loading) {
    return (
      <div style={styles.page}>
        <h1 style={styles.title}>Library Statistics</h1>
        <p style={styles.message}>Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <h1 style={styles.title}>Library Statistics</h1>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            Library Statistics 📊
          </h1>

          <p style={styles.subtitle}>
            Overview of your Digital Library
          </p>
        </div>

        {/* STATISTICS CARDS */}
        <div style={styles.grid}>

          {/* Total Books */}
          <div style={styles.card}>
            <div style={styles.icon}>📚</div>

            <div>
              <p style={styles.label}>Total Books</p>
              <h2 style={styles.number}>
                {stats.total_books}
              </h2>
            </div>
          </div>

          {/* Total Copies */}
          <div style={styles.card}>
            <div style={styles.icon}>📦</div>

            <div>
              <p style={styles.label}>Total Copies</p>
              <h2 style={styles.number}>
                {stats.total_copies}
              </h2>
            </div>
          </div>

          {/* Available Copies */}
          <div style={styles.card}>
            <div style={styles.icon}>✅</div>

            <div>
              <p style={styles.label}>Available Copies</p>
              <h2 style={styles.number}>
                {stats.available_copies}
              </h2>
            </div>
          </div>

          {/* Borrowed Copies */}
          <div style={styles.card}>
            <div style={styles.icon}>📖</div>

            <div>
              <p style={styles.label}>Borrowed Copies</p>
              <h2 style={styles.number}>
                {stats.borrowed_copies}
              </h2>
            </div>
          </div>

          {/* Total Users */}
          <div style={styles.card}>
            <div style={styles.icon}>👥</div>

            <div>
              <p style={styles.label}>Total Users</p>
              <h2 style={styles.number}>
                {stats.total_users}
              </h2>
            </div>
          </div>

          {/* Total Borrow Records */}
          <div style={styles.card}>
            <div style={styles.icon}>📋</div>

            <div>
              <p style={styles.label}>Borrow Records</p>
              <h2 style={styles.number}>
                {stats.total_borrow_records}
              </h2>
            </div>
          </div>

          {/* Active Borrowings */}
          <div style={styles.card}>
            <div style={styles.icon}>🔄</div>

            <div>
              <p style={styles.label}>Active Borrowings</p>
              <h2 style={styles.number}>
                {stats.active_borrowings}
              </h2>
            </div>
          </div>

          {/* Returned Books */}
          <div style={styles.card}>
            <div style={styles.icon}>↩️</div>

            <div>
              <p style={styles.label}>Returned Books</p>
              <h2 style={styles.number}>
                {stats.returned_books}
              </h2>
            </div>
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
    fontFamily: "Arial, sans-serif",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  header: {
    textAlign: "center",
    marginBottom: "45px",
  },

  title: {
    fontSize: "36px",
    color: "#1f2937",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "17px",
    color: "#64748b",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "25px",
  },

  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "15px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  icon: {
    fontSize: "40px",
  },

  label: {
    margin: 0,
    color: "#64748b",
    fontSize: "15px",
  },

  number: {
    margin: "8px 0 0",
    fontSize: "30px",
    color: "#2563eb",
  },

  message: {
    textAlign: "center",
    fontSize: "18px",
    color: "#64748b",
    marginTop: "50px",
  },

  error: {
    textAlign: "center",
    fontSize: "18px",
    color: "#dc2626",
    marginTop: "50px",
  },

};

export default Statistics;