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
  }, []);

  // Search + category filter
  const filteredBooks = books.filter((book) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      book.title.toLowerCase().includes(searchText) ||
      book.author.toLowerCase().includes(searchText) ||
      (book.category || "").toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All Categories" ||
      book.category === category;

    return matchesSearch && matchesCategory;
  });

  // Get categories from database
  const categories = [
    ...new Set(books.map((book) => book.category)),
  ];

  // Book cover colors/icons
  const getBookStyle = (title) => {
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes("atomic")) {
      return {
        background:
          "linear-gradient(135deg, #0f172a, #334155)",
        icon: "⚛️",
      };
    }

    if (lowerTitle.includes("alchemist")) {
      return {
        background:
          "linear-gradient(135deg, #92400e, #f59e0b)",
        icon: "🧪",
      };
    }

    if (lowerTitle.includes("war")) {
      return {
        background:
          "linear-gradient(135deg, #450a0a, #991b1b)",
        icon: "⚔️",
      };
    }

    if (lowerTitle.includes("ego")) {
      return {
        background:
          "linear-gradient(135deg, #312e81, #7c3aed)",
        icon: "🧠",
      };
    }

    if (lowerTitle.includes("clean code")) {
      return {
        background:
          "linear-gradient(135deg, #064e3b, #059669)",
        icon: "💻",
      };
    }

    if (lowerTitle.includes("great gatsby")) {
      return {
        background:
          "linear-gradient(135deg, #164e63, #0891b2)",
        icon: "🎩",
      };
    }

    if (lowerTitle.includes("rich dad")) {
      return {
        background:
          "linear-gradient(135deg, #14532d, #16a34a)",
        icon: "💰",
      };
    }

    return {
      background:
        "linear-gradient(135deg, #1d4ed8, #60a5fa)",
      icon: "📖",
    };
  };

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerIcon}>📚</div>

        <h1 style={styles.heading}>
          Explore Our Library
        </h1>

        <p style={styles.subtitle}>
          Discover books, expand your knowledge, and
          start your next great read.
        </p>
      </div>

      {/* Search Area */}
      <div style={styles.searchArea}>

        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>

          <input
            type="text"
            placeholder="Search by title, author or category..."
            style={styles.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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

      {/* Result Count */}
      {!loading && (
        <div style={styles.resultInfo}>
          <span>
            Showing <strong>{filteredBooks.length}</strong>{" "}
            {filteredBooks.length === 1 ? "book" : "books"}
          </span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <p style={styles.message}>
          📚 Loading books...
        </p>
      ) : filteredBooks.length === 0 ? (
        <div style={styles.noResults}>
          <div style={styles.noResultsIcon}>🔎</div>

          <h2>No books found</h2>

          <p>
            Try searching with a different title,
            author, or category.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>

          {filteredBooks.map((book) => {
            const available =
              Number(book.available_quantity) > 0;

            const cover = getBookStyle(book.title);

            return (
              <div
                style={styles.card}
                key={book.id}
              >

                {/* Book Cover */}
                <div
                  style={{
                    ...styles.bookCover,
                    background: cover.background,
                  }}
                >
                  <div style={styles.coverIcon}>
                    {cover.icon}
                  </div>

                  <div style={styles.coverTitle}>
                    {book.title}
                  </div>

                  <div style={styles.coverAuthor}>
                    {book.author}
                  </div>
                </div>

                {/* Card Content */}
                <div style={styles.cardContent}>

                  <div style={styles.topRow}>
                    <span style={styles.category}>
                      {book.category}
                    </span>

                    <span style={styles.bookId}>
                      #{book.id}
                    </span>
                  </div>

                  <h2 style={styles.title}>
                    {book.title}
                  </h2>

                  <p style={styles.author}>
                    By <strong>{book.author}</strong>
                  </p>

                  <div style={styles.divider}></div>

                  {/* Availability */}
                  <div style={styles.infoRow}>

                    <span style={styles.infoLabel}>
                      Availability
                    </span>

                    <span
                      style={{
                        ...styles.status,
                        color: available
                          ? "#15803d"
                          : "#dc2626",
                        backgroundColor: available
                          ? "#dcfce7"
                          : "#fee2e2",
                      }}
                    >
                      {available
                        ? "● Available"
                        : "● Borrowed"}
                    </span>
                  </div>

                  {/* Copies */}
                  <div style={styles.infoRow}>

                    <span style={styles.infoLabel}>
                      Copies Available
                    </span>

                    <strong style={styles.copies}>
                      {book.available_quantity}
                    </strong>
                  </div>

                  {/* Button */}
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
                    onClick={() =>
                      navigate(`/book/${book.id}`, {
                        state: { book },
                      })
                    }
                  >
                    {available
                      ? "View Book →"
                      : "Currently Unavailable"}
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
    padding: "55px 7%",
    background:
      "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    textAlign: "center",
    marginBottom: "40px",
  },

  headerIcon: {
    fontSize: "48px",
    marginBottom: "8px",
  },

  heading: {
    fontSize: "38px",
    margin: "0",
    color: "#111827",
    fontWeight: "800",
  },

  subtitle: {
    fontSize: "17px",
    color: "#64748b",
    marginTop: "12px",
  },

  searchArea: {
    display: "flex",
    gap: "15px",
    maxWidth: "1000px",
    margin: "0 auto 20px",
    flexWrap: "wrap",
  },

  searchBox: {
    flex: "1 1 400px",
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    border: "1px solid #dbe2ea",
    borderRadius: "12px",
    padding: "0 15px",
    boxShadow: "0 4px 15px rgba(15,23,42,0.05)",
  },

  searchIcon: {
    fontSize: "18px",
  },

  search: {
    width: "100%",
    border: "none",
    outline: "none",
    padding: "16px 12px",
    fontSize: "15px",
    backgroundColor: "transparent",
  },

  select: {
    flex: "0 1 220px",
    padding: "15px",
    border: "1px solid #dbe2ea",
    borderRadius: "12px",
    backgroundColor: "white",
    fontSize: "15px",
    color: "#374151",
    cursor: "pointer",
    outline: "none",
  },

  resultInfo: {
    maxWidth: "1000px",
    margin: "0 auto 25px",
    color: "#64748b",
    fontSize: "14px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(270px, 1fr))",
    gap: "28px",
  },

  card: {
    backgroundColor: "white",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 8px 25px rgba(15,23,42,0.08)",
    border: "1px solid #e5e7eb",
    transition: "transform 0.2s ease",
  },

  bookCover: {
    height: "235px",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "white",
  },

  coverIcon: {
    fontSize: "55px",
    marginBottom: "15px",
  },

  coverTitle: {
    fontSize: "22px",
    fontWeight: "800",
    lineHeight: "1.25",
    textShadow: "0 2px 5px rgba(0,0,0,0.25)",
  },

  coverAuthor: {
    fontSize: "13px",
    marginTop: "10px",
    opacity: "0.9",
  },

  cardContent: {
    padding: "22px",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },

  category: {
    fontSize: "12px",
    color: "#2563eb",
    backgroundColor: "#eff6ff",
    padding: "6px 10px",
    borderRadius: "20px",
    fontWeight: "700",
  },

  bookId: {
    fontSize: "12px",
    color: "#94a3b8",
  },

  title: {
    fontSize: "21px",
    margin: "12px 0 7px",
    color: "#111827",
    lineHeight: "1.3",
  },

  author: {
    color: "#64748b",
    margin: "0",
    fontSize: "14px",
  },

  divider: {
    height: "1px",
    backgroundColor: "#e5e7eb",
    margin: "18px 0",
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    fontSize: "13px",
  },

  infoLabel: {
    color: "#64748b",
  },

  status: {
    fontSize: "11px",
    fontWeight: "700",
    padding: "6px 9px",
    borderRadius: "20px",
  },

  copies: {
    color: "#111827",
  },

  button: {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontSize: "15px",
    fontWeight: "700",
    marginTop: "8px",
  },

  message: {
    textAlign: "center",
    fontSize: "18px",
    color: "#64748b",
    marginTop: "60px",
  },

  noResults: {
    textAlign: "center",
    backgroundColor: "white",
    maxWidth: "600px",
    margin: "50px auto",
    padding: "50px 20px",
    borderRadius: "18px",
    boxShadow: "0 8px 25px rgba(15,23,42,0.06)",
  },

  noResultsIcon: {
    fontSize: "45px",
  },
};

export default Books;