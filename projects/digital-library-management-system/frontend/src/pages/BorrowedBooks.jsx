import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function BorrowedBooks() {
const navigate = useNavigate([]);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
  navigate("/login");
  return;
}

    fetch("http://localhost:5000/api/books/borrowed", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch borrowed books");
        }

        return response.json();
      })
      .then((data) => {
        console.log("MY BORROWED BOOKS:", data);
        setBooks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("BORROWED BOOKS ERROR:", error);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div style={styles.page}>
        <h2>Loading borrowed books...</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <h1 style={styles.heading}>
          My Borrowed Books
        </h1>

        <p style={styles.subtitle}>
          Books you are currently borrowing
        </p>

        {books.length === 0 ? (
          <div style={styles.emptyCard}>
            <div style={styles.icon}>📚</div>

            <h2>No Borrowed Books</h2>

            <p>
              You haven't borrowed any books yet.
            </p>

            <Link to="/books" style={styles.button}>
              Browse Books
            </Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {books.map((book) => (
              <div style={styles.card} key={book.id}>

                <div style={styles.cover}>
                  📖
                </div>

                <div style={styles.details}>
                  <p style={styles.category}>
                    DIGITAL LIBRARY
                  </p>

                  <h2 style={styles.title}>
                    {book.title}
                  </h2>

                  <p style={styles.author}>
                    By {book.author}
                  </p>

                  <p style={styles.date}>
                    <strong>Borrowed on:</strong>{" "}
                    {new Date(
                      book.borrow_date
                    ).toLocaleDateString()}
                  </p>

                  <p style={styles.status}>
                    ● Currently Borrowed
                  </p>

                  <Link
                    to={`/book/${book.book_id}`}
                    style={styles.viewButton}
                  >
                    View Book
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

        <Link to="/books" style={styles.back}>
          ← Back to Books
        </Link>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "60px 8%",
    backgroundColor: "#f8fafc",
    fontFamily: "Arial, sans-serif",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  heading: {
    fontSize: "36px",
    color: "#111827",
    marginBottom: "8px",
  },

  subtitle: {
    fontSize: "18px",
    color: "#64748b",
    marginBottom: "40px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(450px, 1fr))",
    gap: "25px",
  },

  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "25px",
    display: "flex",
    gap: "25px",
    boxShadow:
      "0 8px 30px rgba(0,0,0,0.08)",
  },

  cover: {
    width: "140px",
    height: "190px",
    backgroundColor: "#2563eb",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "55px",
    flexShrink: 0,
  },

  details: {
    flex: 1,
  },

  category: {
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: "bold",
    letterSpacing: "1px",
  },

  title: {
    fontSize: "24px",
    color: "#111827",
    margin: "8px 0",
  },

  author: {
    color: "#64748b",
    fontSize: "16px",
  },

  date: {
    color: "#475569",
    fontSize: "14px",
    marginTop: "20px",
  },

  status: {
    color: "#16a34a",
    fontWeight: "bold",
    fontSize: "14px",
  },

  viewButton: {
    display: "inline-block",
    marginTop: "10px",
    padding: "10px 18px",
    backgroundColor: "#2563eb",
    color: "white",
    borderRadius: "7px",
    textDecoration: "none",
    fontWeight: "bold",
  },

  emptyCard: {
    backgroundColor: "white",
    padding: "50px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow:
      "0 8px 30px rgba(0,0,0,0.08)",
  },

  icon: {
    fontSize: "60px",
  },

  button: {
    display: "inline-block",
    marginTop: "15px",
    padding: "12px 25px",
    backgroundColor: "#2563eb",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },

  back: {
    display: "inline-block",
    marginTop: "35px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default BorrowedBooks;