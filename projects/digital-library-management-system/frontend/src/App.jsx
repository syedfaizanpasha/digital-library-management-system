import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BorrowedBooks from "./pages/BorrowedBooks";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBooks from "./pages/AdminBooks";
import AdminUsers from "./pages/AdminUsers";
import AdminBorrowings from "./pages/AdminBorrowings";
import Statistics from "./pages/Statistics";

function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  return (
    <div style={styles.page}>

      {/* Mobile Responsive Styles */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          overflow-x: hidden;
        }

        @media (max-width: 600px) {

          .mobile-hero {
            flex-direction: column !important;
            text-align: center !important;
            padding: 40px 20px !important;
            min-height: auto !important;
            gap: 35px !important;
          }

          .mobile-hero-content {
            width: 100% !important;
            max-width: 100% !important;
          }

          .mobile-welcome {
            font-size: 12px !important;
            letter-spacing: 1px !important;
          }

          .mobile-title {
            font-size: 36px !important;
            line-height: 1.2 !important;
          }

          .mobile-description {
            font-size: 16px !important;
            line-height: 1.5 !important;
            margin: 0 auto !important;
          }

          .mobile-search {
            flex-direction: column !important;
            width: 100% !important;
            max-width: 100% !important;
            gap: 10px !important;
          }

          .mobile-search-input {
            width: 100% !important;
            border-radius: 8px !important;
            padding: 14px !important;
          }

          .mobile-search-button {
            width: 100% !important;
            border-radius: 8px !important;
            padding: 14px !important;
          }

          .mobile-hero-book {
            width: 190px !important;
            height: 220px !important;
          }

          .mobile-book-icon {
            font-size: 60px !important;
          }

          .mobile-features {
            padding: 50px 20px !important;
          }

          .mobile-section-title {
            font-size: 28px !important;
          }

          .mobile-section-text {
            font-size: 15px !important;
            line-height: 1.5 !important;
          }

          .mobile-cards {
            flex-direction: column !important;
            align-items: center !important;
            gap: 20px !important;
            margin-top: 30px !important;
          }

          .mobile-card {
            width: 100% !important;
            max-width: 330px !important;
            padding: 25px 20px !important;
          }

          .mobile-about {
            padding: 45px 20px !important;
          }

          .mobile-about p {
            line-height: 1.6 !important;
          }

          .mobile-footer {
            padding: 20px 10px !important;
            font-size: 13px !important;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section
        id="home"
        style={styles.hero}
        className="mobile-hero"
      >

        <div
          style={styles.heroContent}
          className="mobile-hero-content"
        >

          <p
            style={styles.welcome}
            className="mobile-welcome"
          >
            WELCOME TO DIGITAL LIBRARY
          </p>

          <h1
            style={styles.title}
            className="mobile-title"
          >
            Discover Your Next
            <br />
            <span style={styles.highlight}>
              Great Book
            </span>
          </h1>

          <p
            style={styles.description}
            className="mobile-description"
          >
            Explore thousands of books, find your favorites,
            and manage your library experience in one place.
          </p>

          <div
            style={styles.searchBox}
            className="mobile-search"
          >

            <input
              type="text"
              placeholder="Search for books, authors..."
              style={styles.searchInput}
              className="mobile-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(
                    `/books?search=${encodeURIComponent(e.target.value)}`
                  );
                }
              }}
            />

            <button
              style={styles.searchButton}
              className="mobile-search-button"
              onClick={() => {
                navigate(
                  `/books?search=${encodeURIComponent(search)}`
                );
              }}
            >
              🔍 Search
            </button>

          </div>

        </div>

        <div
          style={styles.heroBook}
          className="mobile-hero-book"
        >

          <div
            style={styles.bookIcon}
            className="mobile-book-icon"
          >
            📖
          </div>

          <h2>
            Knowledge
          </h2>

          <p>
            is always within reach.
          </p>

        </div>

      </section>

      {/* Features */}
      <section
        id="books"
        style={styles.features}
        className="mobile-features"
      >

        <h2
          style={styles.sectionTitle}
          className="mobile-section-title"
        >
          Everything You Need
        </h2>

        <p
          style={styles.sectionText}
          className="mobile-section-text"
        >
          A simple and powerful way to manage your digital library.
        </p>

        <div
          style={styles.cards}
          className="mobile-cards"
        >

          <div
            style={styles.card}
            className="mobile-card"
          >

            <div style={styles.cardIcon}>
              📚
            </div>

            <h3>
              Browse Books
            </h3>

            <p>
              Explore our collection and discover books across
              different categories.
            </p>

          </div>

          <div
            style={styles.card}
            className="mobile-card"
          >

            <div style={styles.cardIcon}>
              🔎
            </div>

            <h3>
              Search Easily
            </h3>

            <p>
              Quickly find books using titles, authors, or
              categories.
            </p>

          </div>

          <div
            style={styles.card}
            className="mobile-card"
          >

            <div style={styles.cardIcon}>
              📋
            </div>

            <h3>
              Manage Borrowing
            </h3>

            <p>
              Keep track of borrowed books, returns, and
              availability.
            </p>

          </div>

        </div>

      </section>

      {/* About */}
      <section
        id="about"
        style={styles.about}
        className="mobile-about"
      >

        <h2>
          About Our Library
        </h2>

        <p>
          Digital Library Management System provides a modern,
          convenient way to discover and manage books online.
        </p>

      </section>

      {/* Footer */}
      <footer
        style={styles.footer}
        className="mobile-footer"
      >

        <p>
          © 2026 Digital Library Management System
        </p>

      </footer>

    </div>
  );
}


function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Books */}
        <Route
          path="/books"
          element={<Books />}
        />

        {/* Book Details */}
        <Route
          path="/book/:id"
          element={<BookDetails />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Borrowed Books */}
        <Route
          path="/borrowed"
          element={
            <ProtectedRoute>
              <BorrowedBooks />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Books */}
        <Route
          path="/admin/books"
          element={
            <ProtectedRoute role="admin">
              <AdminBooks />
            </ProtectedRoute>
          }
        />

        {/* Admin Users */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        {/* Admin Borrowings */}
        <Route
          path="/admin/borrowings"
          element={
            <ProtectedRoute role="admin">
              <AdminBorrowings />
            </ProtectedRoute>
          }
        />

        {/* Admin Statistics */}
        <Route
          path="/admin/statistics"
          element={
            <ProtectedRoute role="admin">
              <Statistics />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}


const styles = {

  page: {
    margin: 0,
    fontFamily: "Arial, sans-serif",
    color: "#1f2937",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    width: "100%",
    overflowX: "hidden",
  },

  navbar: {
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 8%",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  logo: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#2563eb",
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

  loginButton: {
    textDecoration: "none",
    backgroundColor: "#2563eb",
    color: "white",
    padding: "10px 22px",
    borderRadius: "8px",
    fontSize: "15px",
  },

  hero: {
    minHeight: "520px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "60px 10%",
    background: "linear-gradient(135deg, #eff6ff, #ffffff)",
    boxSizing: "border-box",
  },

  heroContent: {
    maxWidth: "650px",
  },

  welcome: {
    color: "#2563eb",
    fontWeight: "bold",
    letterSpacing: "2px",
    fontSize: "14px",
  },

  title: {
    fontSize: "52px",
    lineHeight: "1.15",
    margin: "15px 0",
    color: "#111827",
  },

  highlight: {
    color: "#2563eb",
  },

  description: {
    fontSize: "18px",
    lineHeight: "1.7",
    color: "#6b7280",
    maxWidth: "560px",
  },

  searchBox: {
    display: "flex",
    marginTop: "30px",
    maxWidth: "600px",
  },

  searchInput: {
    flex: 1,
    padding: "16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px 0 0 8px",
    fontSize: "16px",
    outline: "none",
    minWidth: 0,
  },

  searchButton: {
    padding: "16px 24px",
    border: "none",
    borderRadius: "0 8px 8px 0",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  heroBook: {
    width: "260px",
    height: "300px",
    backgroundColor: "#2563eb",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    boxShadow: "0 20px 40px rgba(37,99,235,0.25)",
    flexShrink: 0,
  },

  bookIcon: {
    fontSize: "80px",
    marginBottom: "15px",
  },

  features: {
    padding: "70px 10%",
    textAlign: "center",
    backgroundColor: "#ffffff",
  },

  sectionTitle: {
    fontSize: "34px",
    marginBottom: "10px",
  },

  sectionText: {
    color: "#6b7280",
    fontSize: "17px",
  },

  cards: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    marginTop: "40px",
    flexWrap: "wrap",
  },

  card: {
    width: "280px",
    padding: "30px",
    backgroundColor: "#f8fafc",
    borderRadius: "15px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
  },

  cardIcon: {
    fontSize: "40px",
  },

  about: {
    padding: "60px 10%",
    textAlign: "center",
    backgroundColor: "#eff6ff",
  },

  footer: {
    padding: "25px",
    textAlign: "center",
    backgroundColor: "#111827",
    color: "#ffffff",
  },

};

<style>
  {`
    /* ================================
       MOBILE RESPONSIVE DESIGN
       ================================ */

    @media (max-width: 768px) {

      /* Home hero */
      #home {
        flex-direction: column !important;
        min-height: auto !important;
        padding: 45px 20px !important;
        text-align: center !important;
        gap: 35px !important;
      }

      /* Hero content */
      #home > div:first-child {
        max-width: 100% !important;
        width: 100% !important;
      }

      /* Welcome text */
      #home p {
        max-width: 100% !important;
      }

      /* Main heading */
      #home h1 {
        font-size: 40px !important;
        line-height: 1.15 !important;
        margin: 15px 0 !important;
      }

      /* Description */
      #home .description {
        font-size: 16px !important;
        line-height: 1.6 !important;
      }

      /* Search box */
      #home .searchBox {
        flex-direction: column !important;
        width: 100% !important;
        max-width: 100% !important;
        gap: 10px !important;
      }

      /* Search input */
      #home .searchInput {
        width: 100% !important;
        box-sizing: border-box !important;
        border-radius: 8px !important;
        padding: 15px !important;
      }

      /* Search button */
      #home .searchButton {
        width: 100% !important;
        border-radius: 8px !important;
        padding: 15px !important;
      }

      /* Book card */
      #home .heroBook {
        width: 220px !important;
        height: 260px !important;
        flex-shrink: 0 !important;
      }

      /* Features */
      #books {
        padding: 55px 20px !important;
      }

      #books h2 {
        font-size: 30px !important;
      }

      #books .cards {
        flex-direction: column !important;
        align-items: center !important;
      }

      #books .card {
        width: 100% !important;
        max-width: 320px !important;
        box-sizing: border-box !important;
      }

      /* About */
      #about {
        padding: 50px 20px !important;
      }

      #about h2 {
        font-size: 28px !important;
      }

      #about p {
        font-size: 16px !important;
        line-height: 1.6 !important;
      }

      /* Footer */
      footer {
        padding: 20px !important;
        font-size: 14px !important;
      }
    }
  `}
</style>

export default App;