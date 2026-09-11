import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../config";

/* =========================
   BOOK COVER MAPPING
========================= */

const getBookCover = (title) => {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("alchemist")) {
    return "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg";
  }

  if (lowerTitle.includes("atomic")) {
    return "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg";
  }

  if (lowerTitle.includes("clean code")) {
    return "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg";
  }

  if (lowerTitle.includes("great gatsby")) {
    return "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg";
  }

  if (lowerTitle.includes("rich dad")) {
    return "https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg";
  }

  if (lowerTitle.includes("art of war")) {
    return "https://covers.openlibrary.org/b/isbn/9780903203210-L.jpg";
  }

  if (lowerTitle.includes("ego")) {
    return "https://covers.openlibrary.org/b/isbn/9781591847816-L.jpg";
  }

  return null;
};


/* =========================
   BOOK DETAILS COMPONENT
========================= */

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const token = localStorage.getItem("token");


  /* =========================
     FETCH BOOK DETAILS
  ========================= */

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/books/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch book");
        }

        const data = await response.json();

        setBook(data);


        /* =========================
           FETCH BORROWED BOOKS
        ========================= */

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
              const borrowedData =
                await borrowedResponse.json();

              setBorrowedBooks(borrowedData);
            }
          } catch (error) {
            console.log(
              "Could not fetch borrowed books:",
              error
            );
          }
        }
      } catch (error) {
        console.error(
          "Error fetching book:",
          error
        );

        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, token]);


  /* =========================
     CHECK IF BOOK IS BORROWED
  ========================= */

  const isBorrowed = borrowedBooks.some(
    (item) =>
      Number(item.book_id || item.id) === Number(id) &&
      !item.return_date
  );


  /* =========================
     BORROW BOOK
  ========================= */

  const handleBorrow = async () => {
    if (!token) {
      alert("Please login to borrow a book.");
      navigate("/login");
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch(
        `${API_URL}/api/books/${id}/borrow`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to borrow book"
        );
        return;
      }

      alert("Book borrowed successfully!");


      /* =========================
         UPDATE AVAILABLE QUANTITY
      ========================= */

      setBook((prev) => ({
        ...prev,
        available:
          Number(prev.available) - 1,
      }));


      /* =========================
         REFRESH BORROWED BOOKS
      ========================= */

      const borrowedResponse = await fetch(
        `${API_URL}/api/books/borrowed`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (borrowedResponse.ok) {
        const borrowedData =
          await borrowedResponse.json();

        setBorrowedBooks(borrowedData);
      }
    } catch (error) {
      console.error(
        "Borrow error:",
        error
      );

      alert(
        "Something went wrong while borrowing the book."
      );
    } finally {
      setActionLoading(false);
    }
  };


  /* =========================
     RETURN BOOK
  ========================= */

  const handleReturn = async () => {
    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch(
        `${API_URL}/api/books/${id}/return`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to return book"
        );
        return;
      }

      alert("Book returned successfully!");


      /* =========================
         UPDATE AVAILABLE QUANTITY
      ========================= */

      setBook((prev) => ({
        ...prev,
        available:
          Number(prev.available) + 1,
      }));


      /* =========================
         REFRESH BORROWED BOOKS
      ========================= */

      const borrowedResponse = await fetch(
        `${API_URL}/api/books/borrowed`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (borrowedResponse.ok) {
        const borrowedData =
          await borrowedResponse.json();

        setBorrowedBooks(borrowedData);
      }
    } catch (error) {
      console.error(
        "Return error:",
        error
      );

      alert(
        "Something went wrong while returning the book."
      );
    } finally {
      setActionLoading(false);
    }
  };


  /* =========================
     LOADING
  ========================= */

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


  /* =========================
     BOOK NOT FOUND
  ========================= */

  if (!book) {
    return (
      <>
        <style>{responsiveStyles}</style>

        <div className="details-error">
          <h2>Book not found</h2>

          <Link
            to="/books"
            className="back-button"
          >
            ← Back to Books
          </Link>
        </div>
      </>
    );
  }


  /* =========================
     BOOK DATA
  ========================= */

  const available = Number(
    book.available || 0
  );

  const quantity = Number(
    book.quantity || 0
  );

  const cover = getBookCover(book.title);


  /* =========================
     MAIN UI
  ========================= */

  return (
    <>
      <style>{responsiveStyles}</style>

      <main className="book-details-page">

        {/* =========================
            MAIN BOOK CARD
        ========================= */}

        <section className="book-main-card">

          {/* =========================
              REAL BOOK COVER
          ========================= */}

          <div className="book-cover">

            {cover ? (
              <>
                <img
                  src={cover}
                  alt={`${book.title} book cover`}
                  className="book-cover-image"

                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";

                    const fallback =
                      e.currentTarget
                        .nextElementSibling;

                    if (fallback) {
                      fallback.style.display =
                        "flex";
                    }
                  }}
                />

                {/* Fallback if image fails */}
                <div
                  className="book-cover-fallback"
                  style={{
                    display: "none",
                  }}
                >
                  📖
                </div>
              </>
            ) : (
              <div className="book-cover-fallback">
                📖
              </div>
            )}

          </div>


          {/* =========================
              BOOK INFORMATION
          ========================= */}

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


            {/* ISBN */}

            {book.isbn && (
              <div className="info-item">
                <strong>
                  ISBN:
                </strong>

                <span>
                  {book.isbn}
                </span>
              </div>
            )}


            {/* TOTAL QUANTITY */}

            <div className="info-item">
              <strong>
                Total Quantity:
              </strong>

              <span>
                {quantity}
              </span>
            </div>


            {/* AVAILABLE */}

            <div className="info-item">
              <strong>
                Available:
              </strong>

              <span>
                {available}
              </span>
            </div>


            {/* AVAILABILITY STATUS */}

            <div
              className={
                available > 0
                  ? "availability available"
                  : "availability unavailable"
              }
            >
              <span className="status-dot">
                ●
              </span>

              {available > 0
                ? "Available"
                : "Currently Unavailable"}
            </div>


            {/* =========================
                READ PDF
            ========================= */}

            {book.title ===
              "The Art of War" && (
              <a
                href="/pdfs/the-art-of-war.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="read-pdf-button"
              >
                📖 Read Book
              </a>
            )}


            {/* =========================
                ACTION BUTTONS
            ========================= */}

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
                  disabled={
                    available <= 0 ||
                    actionLoading
                  }
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


        {/* =========================
            ABOUT BOOK
        ========================= */}

        <section className="information-card">

          <h2>
            About this book
          </h2>

          <p>
            {book.title} is part of our
            digital library collection.
            Explore the book details above
            and borrow it whenever copies
            are available.
          </p>

        </section>


        {/* =========================
            BOOK DETAILS
        ========================= */}

        <section className="information-card">

          <h2>
            Book Details
          </h2>


          <div className="detail-row">
            <span>
              Title
            </span>

            <strong>
              {book.title}
            </strong>
          </div>


          <div className="detail-row">
            <span>
              Author
            </span>

            <strong>
              {book.author}
            </strong>
          </div>


          <div className="detail-row">
            <span>
              ISBN
            </span>

            <strong>
              {book.isbn ||
                "Not available"}
            </strong>
          </div>


          <div className="detail-row">
            <span>
              Category
            </span>

            <strong>
              {book.category}
            </strong>
          </div>


          <div className="detail-row">
            <span>
              Total Quantity
            </span>

            <strong>
              {quantity}
            </strong>
          </div>


          <div className="detail-row">
            <span>
              Available
            </span>

            <strong>
              {available}
            </strong>
          </div>

        </section>

      </main>
    </>
  );
}


/* =====================================================
   RESPONSIVE STYLES
===================================================== */

const responsiveStyles = `

  * {
    box-sizing: border-box;
  }


  /* =========================
     PAGE
  ========================= */

  .book-details-page {
    min-height: 100vh;

    padding: 60px 8%;

    background: #f8fafc;

    font-family: Arial, sans-serif;

    color: #111827;
  }


  /* =========================
     MAIN CARD
  ========================= */

  .book-main-card {
    max-width: 950px;

    margin: 0 auto;

    padding: 40px;

    background: #ffffff;

    border-radius: 20px;

    box-shadow:
      0 10px 35px
      rgba(0, 0, 0, 0.08);

    display: flex;

    gap: 45px;

    align-items: center;
  }


  /* =========================
     BOOK COVER CONTAINER
  ========================= */

  .book-cover {
    width: 270px;

    min-width: 270px;

    height: 360px;

    background: #f8fafc;

    border-radius: 15px;

    display: flex;

    align-items: center;

    justify-content: center;

    padding: 15px;

    overflow: hidden;

    box-shadow:
      0 15px 30px
      rgba(15, 23, 42, 0.15);
  }


  /* =========================
     REAL COVER IMAGE
  ========================= */

  .book-cover-image {
    width: 100%;

    height: 100%;

    object-fit: contain;

    border-radius: 8px;

    display: block;
  }


  /* =========================
     FALLBACK
  ========================= */

  .book-cover-fallback {
    width: 100%;

    height: 100%;

    display: flex;

    align-items: center;

    justify-content: center;

    font-size: 85px;

    background:
      linear-gradient(
        145deg,
        #2563eb,
        #1d4ed8
      );

    color: white;

    border-radius: 10px;
  }


  /* =========================
     INFORMATION
  ========================= */

  .book-information {
    flex: 1;

    min-width: 0;
  }


  /* =========================
     CATEGORY
  ========================= */

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


  /* =========================
     TITLE
  ========================= */

  .book-information h1 {
    margin: 18px 0 8px;

    font-size: 38px;

    line-height: 1.2;

    overflow-wrap: anywhere;
  }


  /* =========================
     AUTHOR
  ========================= */

  .author {
    margin: 0 0 25px;

    color: #6b7280;

    font-size: 19px;
  }


  /* =========================
     INFO ITEMS
  ========================= */

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


  /* =========================
     AVAILABILITY
  ========================= */

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


  /* =========================
     READ PDF BUTTON
  ========================= */

  .read-pdf-button {
    width: 100%;

    min-height: 52px;

    display: flex;

    align-items: center;

    justify-content: center;

    margin-top: 20px;

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


  /* =========================
     ACTION BUTTONS
  ========================= */

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


  /* =========================
     INFORMATION CARDS
  ========================= */

  .information-card {
    max-width: 950px;

    margin: 28px auto 0;

    padding: 32px;

    background: #ffffff;

    border-radius: 20px;

    box-shadow:
      0 8px 25px
      rgba(0, 0, 0, 0.05);
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


  /* =========================
     DETAIL ROW
  ========================= */

  .detail-row {
    display: flex;

    justify-content: space-between;

    gap: 20px;

    padding: 15px 0;

    border-bottom:
      1px solid #e5e7eb;

    font-size: 17px;
  }


  .detail-row span {
    color: #374151;
  }


  .detail-row strong {
    text-align: right;

    overflow-wrap: anywhere;
  }


  /* =========================
     LOADING / ERROR
  ========================= */

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


  /* =========================
     MOBILE
  ========================= */

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


    .book-cover-fallback {
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


  /* =========================
     SMALL MOBILE
  ========================= */

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