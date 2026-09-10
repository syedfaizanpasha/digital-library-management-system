import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../config";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`${API_URL}/api/books/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch book");
        }

        const data = await response.json();
        setBook(data);

        // Get borrowed books separately.
        // A 401 here should NOT break the book details page.
        if (token) {
          try {
            const borrowedResponse = await fetch(
              `${API_URL}/api/books/borrowed`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (borrowedResponse.ok) {
              const borrowedData = await borrowedResponse.json();
              setBorrowedBooks(borrowedData);
            }
          } catch (error) {
            console.log("Could not fetch borrowed books:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching book:", error);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, token]);

  // Check whether this book is currently borrowed by the user
  const isBorrowed = borrowedBooks.some(
    (item) =>
      Number(item.book_id || item.id) === Number(id) &&
      !item.return_date
  );

  const handleBorrow = async () => {
    if (!token) {
      alert("Please login to borrow a book.");
      navigate("/login");
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch(`${API_URL}/api/books/${id}/borrow`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to borrow book");
        return;
      }

      alert("Book borrowed successfully!");

      // Update available quantity immediately
      setBook((prev) => ({
        ...prev,
        available: Number(prev.available) - 1,
      }));

      // Refresh borrowed books
      const borrowedResponse = await fetch(
        `${API_URL}/api/books/borrowed`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (borrowedResponse.ok) {
        const borrowedData = await borrowedResponse.json();
        setBorrowedBooks(borrowedData);
      }
    } catch (error) {
      console.error("Borrow error:", error);
      alert("Something went wrong while borrowing the book.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch(`${API_URL}/api/books/${id}/return`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to return book");
        return;
      }

      alert("Book returned successfully!");

      // Update available quantity immediately
      setBook((prev) => ({
        ...prev,
        available: Number(prev.available) + 1,
      }));

      // Remove/refresh borrowed books
      const borrowedResponse = await fetch(
        `${API_URL}/api/books/borrowed`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (borrowedResponse.ok) {
        const borrowedData = await borrowedResponse.json();
        setBorrowedBooks(borrowedData);
      }
    } catch (error) {
      console.error("Return error:", error);
      alert("Something went wrong while returning the book.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{responsiveStyles}</style>

        <div className="details-loading">
          Loading book details...
        </div>
      </>
    );
  }

  if (!book) {
    return (
      <>
        <style>{responsiveStyles}</style>

        <div className="details-error">
          <h2>Book not found</h2>

          <Link to="/books" className="back-button">
            ← Back to Books
          </Link>
        </div>
      </>
    );
  }

  const available = Number(book.available || 0);
  const quantity = Number(book.quantity || 0);

  return (
    <>
      <style>{responsiveStyles}</style>

      <main className="book-details-page">

        {/* Main Book Card */}
        <section className="book-main-card">

          {/* Book Cover */}
          <div className="book-cover">

            <div className="book-cover-icon">
              📖
            </div>

            <div className="book-cover-title">
              {book.title}
            </div>

          </div>

          {/* Book Information */}
          <div className="book-information">

            <span className="category-badge">
              {book.category}
            </span>

            <h1>
              {book.title}
            </h1>

            <p className="author">
              By {book.author}
            </p>

            {book.isbn && (
              <div className="info-item">
                <strong>ISBN:</strong>
                <span>{book.isbn}</span>
              </div>
            )}

            <div className="info-item">
              <strong>Total Quantity:</strong>
              <span>{quantity}</span>
            </div>

            <div className="info-item">
              <strong>Available:</strong>
              <span>{available}</span>
            </div>

            <div
              className={
                available > 0
                  ? "availability available"
                  : "availability unavailable"
              }
            >
              <span className="status-dot">●</span>

              {available > 0
                ? "Available"
                : "Currently Unavailable"}
            </div>

{/* Read PDF - The Art of War */}
{book.title === "The Art of War" && (
  <a
    href="/pdfs/the-art-of-war.pdf"
    target="_blank"
    rel="noopener noreferrer"
    className="read-pdf-button"
  >
    📖 Read Book
  </a>
)}

            {/* Buttons */}
            <div className="action-buttons">

              {isBorrowed ? (
                <button
                  className="borrow-button return-button"
                  onClick={handleReturn}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "Processing..."
                    : "↩ Return Book"}
                </button>
              ) : (
                <button
                  className="borrow-button"
                  onClick={handleBorrow}
                  disabled={available <= 0 || actionLoading}
                >
                  {actionLoading
                    ? "Processing..."
                    : "📖 Borrow Book"}
                </button>
              )}

              <Link
                to="/books"
                className="back-books-button"
              >
                ← Back to Books
              </Link>

            </div>

          </div>
        </section>

        {/* About Book */}
        <section className="information-card">

          <h2>
            About this book
          </h2>

          <p>
            {book.title} is part of our digital library
            collection. Explore the book details above and
            borrow it whenever copies are available.
          </p>

        </section>

        {/* Book Details */}
        <section className="information-card">

          <h2>
            Book Details
          </h2>

          <div className="detail-row">
            <span>Title</span>
            <strong>{book.title}</strong>
          </div>

          <div className="detail-row">
            <span>Author</span>
            <strong>{book.author}</strong>
          </div>

          <div className="detail-row">
            <span>ISBN</span>
            <strong>
              {book.isbn || "Not available"}
            </strong>
          </div>

          <div className="detail-row">
            <span>Category</span>
            <strong>{book.category}</strong>
          </div>

          <div className="detail-row">
            <span>Total Quantity</span>
            <strong>{quantity}</strong>
          </div>

          <div className="detail-row">
            <span>Available</span>
            <strong>{available}</strong>
          </div>

        </section>

      </main>
    </>
  );
}

const responsiveStyles = `
  * {
    box-sizing: border-box;
  }

  .book-details-page {
    min-height: 100vh;
    padding: 60px 8%;
    background: #f8fafc;
    font-family: Arial, sans-serif;
    color: #111827;
  }

  .book-main-card {
    max-width: 950px;
    margin: 0 auto;
    padding: 40px;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08);

    display: flex;
    gap: 45px;
    align-items: center;
  }

  .book-cover {
    width: 270px;
    min-width: 270px;
    height: 360px;

    background: linear-gradient(
      145deg,
      #2563eb,
      #1d4ed8
    );

    border-radius: 15px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    color: white;
    text-align: center;

    padding: 25px;

    box-shadow:
      0 15px 30px rgba(37, 99, 235, 0.25);
  }

  .book-cover-icon {
    font-size: 85px;
    margin-bottom: 25px;
  }

  .book-cover-title {
    font-size: 22px;
    font-weight: bold;
    line-height: 1.3;
  }

  .book-information {
    flex: 1;
    min-width: 0;
  }

  .category-badge {
    display: inline-block;

    padding: 8px 15px;

    background: #eff6ff;
    color: #2563eb;

    border-radius: 20px;

    font-size: 14px;
    font-weight: bold;

    text-transform: uppercase;
  }

  .book-information h1 {
    margin: 18px 0 8px;

    font-size: 38px;
    line-height: 1.2;

    overflow-wrap: anywhere;
  }

  .author {
    margin: 0 0 25px;

    color: #6b7280;

    font-size: 19px;
  }

  .info-item {
    display: flex;
    flex-direction: column;

    margin-bottom: 14px;

    font-size: 16px;
    color: #374151;
  }

  .info-item strong {
    margin-bottom: 3px;
  }

  .availability {
    margin-top: 20px;

    font-weight: bold;
    font-size: 17px;
  }

  .available {
    color: #16a34a;
  }

  .unavailable {
    color: #dc2626;
  }

  .status-dot {
    margin-right: 7px;
  }

  .read-pdf-button {
  width: 100%;
  min-height: 52px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: #7c3aed;
  color: white;

  font-size: 16px;
  font-weight: 600;

  text-decoration: none;
}

.read-pdf-button:hover {
  background: #6d28d9;
}
  
  .action-buttons {
    margin-top: 30px;

    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .borrow-button,
  .back-books-button {
    width: 100%;
    min-height: 52px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 10px;

    font-size: 16px;
    font-weight: 600;

    text-decoration: none;

    cursor: pointer;
  }

  .borrow-button {
    border: none;

    background: #2563eb;
    color: white;
  }

  .borrow-button:hover {
    background: #1d4ed8;
  }

  .borrow-button:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  .return-button {
    background: #16a34a;
  }

  .return-button:hover {
    background: #15803d;
  }

  .back-books-button {
    border: 1px solid #bfdbfe;

    background: #ffffff;
    color: #2563eb;
  }

  .back-books-button:hover {
    background: #eff6ff;
  }

  .information-card {
    max-width: 950px;
    margin: 28px auto 0;

    padding: 32px;

    background: #ffffff;

    border-radius: 20px;

    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  }

  .information-card h2 {
    margin-top: 0;
    margin-bottom: 18px;

    font-size: 28px;
  }

  .information-card p {
    margin: 0;

    color: #4b5563;

    font-size: 17px;
    line-height: 1.7;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    gap: 20px;

    padding: 15px 0;

    border-bottom: 1px solid #e5e7eb;

    font-size: 17px;
  }

  .detail-row span {
    color: #374151;
  }

  .detail-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .details-loading,
  .details-error {
    min-height: 70vh;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    gap: 20px;

    font-family: Arial, sans-serif;
  }

  .back-button {
    color: #2563eb;
    text-decoration: none;
    font-weight: bold;
  }

  @media (max-width: 700px) {

    .book-details-page {
      padding: 25px 14px 40px;
    }

    .book-main-card {
      padding: 22px 18px;

      flex-direction: column;

      gap: 25px;

      border-radius: 18px;
    }

    .book-cover {
      width: 100%;
      min-width: 0;
      max-width: 250px;

      height: 300px;

      margin: 0 auto;
    }

    .book-cover-icon {
      font-size: 70px;
    }

    .book-information {
      width: 100%;
    }

    .category-badge {
      font-size: 13px;
    }

    .book-information h1 {
      font-size: 30px;
      text-align: left;
    }

    .author {
      font-size: 17px;
    }

    .info-item {
      font-size: 15px;
    }

    .availability {
      font-size: 16px;
    }

    .information-card {
      padding: 24px 18px;

      border-radius: 18px;
    }

    .information-card h2 {
      font-size: 24px;
    }

    .information-card p {
      font-size: 16px;
    }

    .detail-row {
      font-size: 15px;
      gap: 15px;
    }

    .detail-row strong {
      max-width: 55%;
    }

  }

  @media (max-width: 400px) {

    .book-details-page {
      padding: 18px 10px 30px;
    }

    .book-main-card {
      padding: 18px 14px;
    }

    .book-cover {
      max-width: 220px;
      height: 285px;
    }

    .book-information h1 {
      font-size: 28px;
    }

    .information-card {
      padding: 20px 15px;
    }

    .detail-row {
      font-size: 14px;
    }

  }
`;

export default BookDetails;