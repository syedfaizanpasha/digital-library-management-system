import { API_URL } from "../config";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function BookDetails() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [userBorrowed, setUserBorrowed] = useState(false);
  const [loading, setLoading] = useState(true);

  // ===============================
  // Fetch Book Details
  // ===============================
  useEffect(() => {
    console.log("BOOK ID:", id);

    const token = localStorage.getItem("token");

    // --------------------------------
    // Fetch book FIRST
    // --------------------------------
    fetch(`${API_URL}/api/books/${id}`)
      .then((response) => {
        console.log(
          "BOOK RESPONSE STATUS:",
          response.status
        );

        if (!response.ok) {
          throw new Error("Book not found");
        }

        return response.json();
      })
      .then((bookData) => {
        console.log("BOOK DATA:", bookData);

        // Book loaded successfully
        setBook(bookData);
        setLoading(false);

        // --------------------------------
        // Check user's borrowed books separately
        // --------------------------------
        if (token) {
          fetch(`${API_URL}/api/books/borrowed`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => {
              console.log(
                "BORROWED RESPONSE STATUS:",
                response.status
              );

              if (!response.ok) {
                throw new Error(
                  "Failed to fetch borrowed books"
                );
              }

              return response.json();
            })
            .then((borrowedData) => {
              console.log(
                "BORROWED DATA:",
                borrowedData
              );

              const borrowedList = Array.isArray(
                borrowedData
              )
                ? borrowedData
                : [];

              const alreadyBorrowed =
                borrowedList.some(
                  (borrowedBook) =>
                    Number(borrowedBook.book_id) ===
                      Number(id) &&
                    !borrowedBook.return_date
                );

              console.log(
                "USER ALREADY BORROWED:",
                alreadyBorrowed
              );

              setUserBorrowed(
                alreadyBorrowed
              );
            })
            .catch((error) => {
              // Do NOT break the book page
              console.error(
                "BORROWED BOOKS ERROR:",
                error
              );

              setUserBorrowed(false);
            });
        }
      })
      .catch((error) => {
        console.error(
          "BOOK ERROR:",
          error
        );

        setLoading(false);
      });
  }, [id]);

  // ===============================
  // Loading
  // ===============================
  if (loading) {
    return (
      <div style={styles.page}>
        <h2>Loading book...</h2>
      </div>
    );
  }

  // ===============================
  // Book Not Found
  // ===============================
  if (!book) {
    return (
      <div style={styles.page}>
        <h2>Book not found</h2>

        <Link
          to="/books"
          style={styles.back}
        >
          ← Back to Books
        </Link>
      </div>
    );
  }

  // ===============================
  // Available
  // Supports both local and Railway
  // ===============================
  const availableQuantity =
    book.available !== undefined
      ? Number(book.available)
      : Number(book.available_quantity);

  const available =
    availableQuantity > 0;

  // ===============================
  // Borrow Book
  // ===============================
  const borrowBook = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/books/${id}/borrow`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to borrow book."
        );
        return;
      }

      // Update availability
      setBook((prev) => ({
        ...prev,

        available:
          prev.available !== undefined
            ? Number(prev.available) - 1
            : prev.available,

        available_quantity:
          prev.available_quantity !== undefined
            ? Number(
                prev.available_quantity
              ) - 1
            : prev.available_quantity,
      }));

      setUserBorrowed(true);

      alert(
        "Book borrowed successfully!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong while borrowing the book."
      );
    }
  };

  // ===============================
  // Return Book
  // ===============================
  const returnBook = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/books/${id}/return`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to return book."
        );
        return;
      }

      // Update availability
      setBook((prev) => ({
        ...prev,

        available:
          prev.available !== undefined
            ? Number(prev.available) + 1
            : prev.available,

        available_quantity:
          prev.available_quantity !== undefined
            ? Number(
                prev.available_quantity
              ) + 1
            : prev.available_quantity,
      }));

      setUserBorrowed(false);

      alert(
        "Book returned successfully!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong while returning the book."
      );
    }
  };

  // ===============================
  // Page
  // ===============================
  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Book Cover */}
        <div style={styles.cover}>
          📖
        </div>

        {/* Book Details */}
        <div style={styles.details}>

          <p style={styles.category}>
            {book.category}
          </p>

          <h1 style={styles.title}>
            {book.title}
          </h1>

          <p style={styles.author}>
            By {book.author}
          </p>

          <p style={styles.info}>
            <strong>ISBN:</strong>{" "}
            {book.isbn ||
              "Not available"}
          </p>

          <p style={styles.info}>
            <strong>
              Total Quantity:
            </strong>{" "}
            {book.quantity}
          </p>

          <p style={styles.info}>
            <strong>Available:</strong>{" "}
            {availableQuantity}
          </p>

          {/* Availability Status */}
          <p
            style={{
              ...styles.status,
              color: available
                ? "#16a34a"
                : "#dc2626",
            }}
          >
            ●{" "}
            {available
              ? "Available"
              : "Currently Borrowed"}
          </p>

          {/* ===============================
              Borrow / Return Button
             =============================== */}

          {userBorrowed ? (
            <button
              style={{
                ...styles.button,
                backgroundColor:
                  "#16a34a",
                cursor: "pointer",
              }}
              onClick={returnBook}
            >
              Return Book
            </button>
          ) : (
            <button
              style={{
                ...styles.button,
                backgroundColor: available
                  ? "#2563eb"
                  : "#9ca3af",
                cursor: available
                  ? "pointer"
                  : "not-allowed",
              }}
              disabled={!available}
              onClick={borrowBook}
            >
              {available
                ? "Borrow Book"
                : "Unavailable"}
            </button>
          )}

          {/* PDF for The Art of War */}
          {book.title ===
            "The Art of War" && (
            <a
              href="/pdfs/the-art-of-war.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...styles.button,
                backgroundColor:
                  "#7c3aed",
                textDecoration: "none",
                display: "inline-block",
                marginLeft: "10px",
              }}
            >
              📖 Read PDF
            </a>
          )}

          <br />

          <Link
            to="/books"
            style={styles.back}
          >
            ← Back to Books
          </Link>

        </div>
      </div>
    </div>
  );
}

// ===============================
// Styles
// ===============================

const styles = {
  page: {
    minHeight: "100vh",
    padding: "60px 8%",
    backgroundColor: "#f8fafc",
    fontFamily:
      "Arial, sans-serif",
  },

  card: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "40px",
    backgroundColor: "white",
    borderRadius: "16px",
    display: "flex",
    gap: "50px",
    boxShadow:
      "0 8px 30px rgba(0,0,0,0.08)",
  },

  cover: {
    width: "300px",
    height: "400px",
    backgroundColor: "#2563eb",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "80px",
    color: "white",
  },

  details: {
    flex: 1,
  },

  category: {
    color: "#2563eb",
    fontWeight: "bold",
    textTransform:
      "uppercase",
  },

  title: {
    fontSize: "32px",
    color: "#111827",
  },

  author: {
    fontSize: "20px",
    color: "#64748b",
  },

  info: {
    color: "#475569",
    fontSize: "16px",
  },

  status: {
    fontWeight: "bold",
    marginTop: "20px",
  },

  button: {
    marginTop: "20px",
    padding: "12px 25px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontSize: "16px",
  },

  back: {
    display: "inline-block",
    marginTop: "25px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default BookDetails;