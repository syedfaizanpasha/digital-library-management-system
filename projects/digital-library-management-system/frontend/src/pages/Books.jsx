import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Books() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState(
  searchParams.get("search") || ""
);
  const [category, setCategory] = useState("All Categories");
  const [loading, setLoading] = useState(true);

  // Get books from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        return response.json();
      })
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setLoading(false);
      });
  },[]);
  // Search + category filter
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
  book.title.toLowerCase().includes(search.toLowerCase()) ||
  book.author.toLowerCase().includes(search.toLowerCase()) ||
  (book.category || "").toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All Categories" ||
      book.category === category;

    return matchesSearch && matchesCategory;
  });

  // Get categories from database
  const categories = [
    ...new Set(books.map((book) => book.category)),
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1>📚 Our Books</h1>
        <p>Explore our digital library collection</p>
      </div>

      <div style={styles.searchArea}>
        <input
          type="text"
          placeholder="Search books or authors..."
          style={styles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All Categories</option>

          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={styles.message}>Loading books...</p>
      ) : filteredBooks.length === 0 ? (
        <p style={styles.message}>No books found.</p>
      ) : (
        <div style={styles.grid}>
          {filteredBooks.map((book) => {
            const available =
              book.available_quantity > 0;

            return (
              <div style={styles.card} key={book.id}>
                <div style={styles.bookCover}>📖</div>

                <div style={styles.cardContent}>
                  <span style={styles.category}>
                    {book.category}
                  </span>

                  <h2 style={styles.title}>
                    {book.title}
                  </h2>

                  <p style={styles.author}>
                    By {book.author}
                  </p>

                  <p
                    style={{
                      ...styles.status,
                      color: available
                        ? "#16a34a"
                        : "#dc2626",
                    }}
                  >
                    {available
                      ? "● Available"
                      : "● Currently Borrowed"}
                  </p>

                  <button
                    style={{
                      ...styles.button,
                      backgroundColor: available
                        ? "#2563eb"
                        : "#9ca3af",
                    }}
                    disabled={!available}
                    onClick={() =>
                      navigate(`/book/${book.id}`, {
                        state: { book },
                      })
                    }
                  >
                    {available
                      ? "View Book"
                      : "Unavailable"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "50px 8%",
    backgroundColor: "#f8fafc",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    textAlign: "center",
    marginBottom: "40px",
  },

  searchArea: {
    display: "flex",
    gap: "15px",
    maxWidth: "900px",
    margin: "0 auto 40px",
  },

  search: {
    flex: 1,
    padding: "15px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
  },

  select: {
    padding: "15px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    backgroundColor: "white",
    fontSize: "16px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
  },

  card: {
    backgroundColor: "white",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
  },

  bookCover: {
    height: "180px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563eb",
    fontSize: "70px",
  },

  cardContent: {
    padding: "22px",
  },

  category: {
    fontSize: "13px",
    color: "#2563eb",
    fontWeight: "bold",
  },

  title: {
    fontSize: "21px",
    margin: "10px 0",
    color: "#111827",
  },

  author: {
    color: "#6b7280",
  },

  status: {
    fontWeight: "bold",
    marginTop: "15px",
  },

  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "10px",
  },

  message: {
    textAlign: "center",
    fontSize: "18px",
    color: "#6b7280",
    marginTop: "50px",
  },
};

export default Books;