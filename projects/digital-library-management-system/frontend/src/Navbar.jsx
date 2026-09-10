import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav style={styles.navbar}>

        {/* Logo */}
        <Link to="/" style={styles.logo} onClick={closeMenu}>
          📚 Digital Library
        </Link>

        {/* Hamburger button */}
        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Navigation links */}
        <div
          className={`navigation-links ${menuOpen ? "menu-open" : ""}`}
        >

          <Link to="/" style={styles.navLink} onClick={closeMenu}>
            Home
          </Link>

          <Link to="/books" style={styles.navLink} onClick={closeMenu}>
            Books
          </Link>

          {isLoggedIn && (
            <Link
              to="/borrowed"
              style={styles.navLink}
              onClick={closeMenu}
            >
              My Borrowed Books
            </Link>
          )}

          <a
            href="/#about"
            style={styles.navLink}
            onClick={closeMenu}
          >
            About
          </a>

          {isLoggedIn ? (
            <>
              {user?.role === "admin" ? (
                <Link
                  to="/admin"
                  style={styles.adminLink}
                  onClick={closeMenu}
                >
                  👤 Library Admin
                </Link>
              ) : (
                <span style={styles.userName}>
                  👤 {user?.name}
                </span>
              )}

              <button
                onClick={handleLogout}
                style={styles.logoutButton}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              style={styles.loginButton}
              onClick={closeMenu}
            >
              Login
            </Link>
          )}

        </div>
      </nav>

      {/* Mobile CSS */}
      <style>{`
        .mobile-menu-button {
          display: none;
          border: none;
          background: transparent;
          font-size: 28px;
          cursor: pointer;
          color: #111827;
          padding: 5px;
        }

        .navigation-links {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        @media (max-width: 768px) {

          .mobile-menu-button {
            display: block;
          }

          .navigation-links {
            display: none;
          }

          .navigation-links.menu-open {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 18px;
            position: absolute;
            top: 70px;
            left: 0;
            right: 0;
            background: #ffffff;
            padding: 25px 25px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.12);
            box-sizing: border-box;
          }

          .navigation-links.menu-open a,
          .navigation-links.menu-open span,
          .navigation-links.menu-open button {
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}

const styles = {
  navbar: {
    minHeight: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 6%",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    boxSizing: "border-box",
    position: "relative",
    zIndex: 1000,
  },

  logo: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#2563eb",
    textDecoration: "none",
    whiteSpace: "nowrap",
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