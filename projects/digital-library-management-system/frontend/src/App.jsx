import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
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
  const[search, setSearch] = useState("");

  return (
    <div style={styles.page}>


      {/* Hero Section */}
      <section id="home" style={styles.hero}>

        <div style={styles.heroContent}>

          <p style={styles.welcome}>
            WELCOME TO DIGITAL LIBRARY
          </p>

          <h1 style={styles.title}>
            Discover Your Next
            <br />
            <span style={styles.highlight}>
              Great Book
            </span>
          </h1>

          <p style={styles.description}>
            Explore thousands of books, find your favorites,
            and manage your library experience in one place.
          </p>

          <div style={styles.searchBox}>

  <input
    type="text"
    placeholder="Search for books, authors..."
    style={styles.searchInput}
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        navigate(`/books?search=${e.target.value}`);
      }
    }}
  />

 <button
  style={styles.searchButton}
  onClick={() => {
    navigate(`/books?search=${encodeURIComponent(search)}`);
  }}
>
  🔍 Search
</button>

</div>

        </div>


        <div style={styles.heroBook}>

          <div style={styles.bookIcon}>
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
      <section id="books" style={styles.features}>

        <h2 style={styles.sectionTitle}>
          Everything You Need
        </h2>

        <p style={styles.sectionText}>
          A simple and powerful way to manage your digital library.
        </p>


        <div style={styles.cards}>

          <div style={styles.card}>

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


          <div style={styles.card}>

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


          <div style={styles.card}>

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
      <section id="about" style={styles.about}>

        <h2>
          About Our Library
        </h2>

        <p>
          Digital Library Management System provides a modern,
          convenient way to discover and manage books online.
        </p>

      </section>


      {/* Footer */}
      <footer style={styles.footer}>

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
    <ProtectedRoute>
      <AdminBooks />
    </ProtectedRoute>
  }
/>

{/* Admin Users */}
<Route
  path="/admin/users"
  element={
    <ProtectedRoute>
      <AdminUsers />
    </ProtectedRoute>
  }
/>

{/* Admin Borrowings */}
<Route
  path="/admin/borrowings"
  element={
    <ProtectedRoute>
      <AdminBorrowings />
    </ProtectedRoute>
  }
/>

{/* Admin Statistics */}
<Route
  path="/admin/statistics"
  element={
    <ProtectedRoute>
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

export default App;