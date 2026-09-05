import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>

      {/* Logo */}
      <Link to="/" style={styles.logo}>
        📚 Digital Library
      </Link>

      <div style={styles.navLinks}>

        {/* Home */}
        <Link to="/" style={styles.navLink}>
          Home
        </Link>

        {/* Books */}
        <Link to="/books" style={styles.navLink}>
          Books
        </Link>

        {/* Borrowed Books */}
        {isLoggedIn && (
          <Link to="/borrowed" style={styles.navLink}>
            My Borrowed Books
          </Link>
        )}

        {/* About */}
        <a href="/#about" style={styles.navLink}>
          About
        </a>

        {/* Logged in user */}
        {isLoggedIn ? (
          <>
            {/* Admin Dashboard */}
            {user?.role === "admin" && (
              <Link to="/admin" style={styles.adminLink}>
                👤 Library Admin
              </Link>
            )}

            {/* Normal user name */}
            {user?.role !== "admin" && (
              <span style={styles.userName}>
                👤 {user?.name}
              </span>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={styles.logoutButton}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={styles.loginButton}>
            Login
          </Link>
        )}

      </div>

    </nav>
  );
}

const styles = {
  navbar: {
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 8%",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    boxSizing: "border-box",
  },

  logo: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#2563eb",
    textDecoration: "none",
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
  },

  navLink: {
    textDecoration: "none",
    color: "#374151",
    fontWeight: "500",
  },

  adminLink: {
    textDecoration: "none",
    color: "#111827",
    fontWeight: "600",
    fontSize: "14px",
  },

  loginButton: {
    textDecoration: "none",
    backgroundColor: "#2563eb",
    color: "white",
    padding: "10px 22px",
    borderRadius: "8px",
    fontSize: "15px",
  },

  logoutButton: {
    border: "none",
    backgroundColor: "#dc2626",
    color: "white",
    padding: "10px 22px",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
  },

  userName: {
    color: "#374151",
    fontWeight: "600",
    fontSize: "14px",
  },
};

export default Navbar;