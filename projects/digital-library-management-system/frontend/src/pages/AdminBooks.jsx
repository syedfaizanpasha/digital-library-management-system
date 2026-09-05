import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function AdminBooks() {
  const { user } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    quantity: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ================================
  // GET ALL BOOKS
  // ================================
  const fetchBooks = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/books"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch books"
        );
      }

      setBooks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch books when page loads
  useEffect(() => {
    fetchBooks();
  }, []);

  // ================================
  // FORM INPUT
  // ================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================================
  // ADD NEW BOOK
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/books",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            author: formData.author,
            category: formData.category,
            isbn: formData.isbn,
            quantity: Number(formData.quantity),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add book"
        );
      }

      setMessage("Book added successfully! 🎉");

      setFormData({
        title: "",
        author: "",
        category: "",
        isbn: "",
        quantity: "",
      });

      fetchBooks();
    } catch (error) {
      setError(error.message);
    }
  };

  // ================================
  // DELETE BOOK
  // ================================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/books/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete book"
        );
      }

      setBooks(
        books.filter((book) => book.id !== id)
      );

      setMessage("Book deleted successfully!");
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  // ================================
  // EDIT BOOK
  // ================================
  const handleEdit = (book) => {
    setEditingBookId(book.id);

    setFormData({
      title: book.title,
      author: book.author,
      category: book.category || "",
      isbn: book.isbn || "",
      quantity: book.quantity,
    });

    setShowForm(true);
    setMessage("");
    setError("");
  };

  // ================================
  // UPDATE BOOK
  // ================================
  const handleUpdate = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/books/${editingBookId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            author: formData.author,
            category: formData.category,
            isbn: formData.isbn,
            quantity: Number(formData.quantity),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update book"
        );
      }

      setMessage("Book updated successfully! 🎉");

      setEditingBookId(null);

      setFormData({
        title: "",
        author: "",
        category: "",
        isbn: "",
        quantity: "",
      });

      fetchBooks();
    } catch (error) {
      setError(error.message);
    }
  };

  // ================================
  // CANCEL EDIT
  // ================================
  const handleCancelEdit = () => {
    setEditingBookId(null);

    setFormData({
      title: "",
      author: "",
      category: "",
      isbn: "",
      quantity: "",
    });

    setMessage("");
    setError("");
    setShowForm(false);
  };

  return (
    <div style={styles.page}>

      {/* ================================
          PAGE HEADER
          ================================ */}
      <h1>Manage Books</h1>

      <p>
        Here you can add, edit and delete books.
      </p>

      {/* ================================
          ADD / EDIT BOOK BUTTON
          ================================ */}
      <button
        onClick={() => {
          setShowForm(!showForm);

          if (showForm) {
            setEditingBookId(null);

            setFormData({
              title: "",
              author: "",
              category: "",
              isbn: "",
              quantity: "",
            });
          }

          setMessage("");
          setError("");
        }}
        style={styles.mainButton}
      >
        {showForm ? "Close Form" : "Add New Book"}
      </button>

      {/* ================================
          ADD / EDIT BOOK FORM
          ================================ */}
      {showForm && (
        <div style={styles.formContainer}>

          <h2>
            {editingBookId
              ? "Edit Book"
              : "Add New Book"}
          </h2>

          {/* SUCCESS MESSAGE */}
          {message && (
            <p style={styles.successMessage}>
              {message}
            </p>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <p style={styles.errorMessage}>
              {error}
            </p>
          )}

          <form
            onSubmit={
              editingBookId
                ? handleUpdate
                : handleSubmit
            }
          >

            {/* TITLE */}
            <div style={styles.formGroup}>
              <label>Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                required
                style={styles.input}
              />
            </div>

            {/* AUTHOR */}
            <div style={styles.formGroup}>
              <label>Author</label>

              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
                style={styles.input}
              />
            </div>

            {/* CATEGORY */}
            <div style={styles.formGroup}>
              <label>Category</label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category"
                style={styles.input}
              />
            </div>

            {/* ISBN */}
            <div style={styles.formGroup}>
              <label>ISBN</label>

              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Enter ISBN"
                style={styles.input}
              />
            </div>

            {/* QUANTITY */}
            <div style={styles.formGroup}>
              <label>Quantity</label>

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                min="1"
                required
                style={styles.input}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              style={styles.submitButton}
            >
              {editingBookId
                ? "Update Book"
                : "Add Book"}
            </button>

            {/* CANCEL EDIT BUTTON */}
            {editingBookId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            )}

          </form>
        </div>
      )}

      {/* ================================
          BOOK LIST
          ================================ */}
      <div style={styles.bookList}>
        <h2>All Books</h2>

        {loading ? (
          <p>Loading books...</p>
        ) : books.length === 0 ? (
          <p>No books found in the library.</p>
        ) : (

          /*
            IMPORTANT:
            This wrapper makes the table scroll
            horizontally on mobile screens.
          */
          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>
                <tr>

                  <th style={styles.tableHeader}>
                    ID
                  </th>

                  <th style={styles.tableHeader}>
                    Title
                  </th>

                  <th style={styles.tableHeader}>
                    Author
                  </th>

                  <th style={styles.tableHeader}>
                    Category
                  </th>

                  <th style={styles.tableHeader}>
                    ISBN
                  </th>

                  <th style={styles.tableHeader}>
                    Quantity
                  </th>

                  <th style={styles.tableHeader}>
                    Available
                  </th>

                  <th style={styles.tableHeader}>
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {books.map((book) => (
                  <tr key={book.id}>

                    <td style={styles.tableCell}>
                      {book.id}
                    </td>

                    <td style={styles.tableCell}>
                      {book.title}
                    </td>

                    <td style={styles.tableCell}>
                      {book.author}
                    </td>

                    <td style={styles.tableCell}>
                      {book.category || "-"}
                    </td>

                    <td style={styles.tableCell}>
                      {book.isbn || "-"}
                    </td>

                    <td style={styles.tableCell}>
                      {book.quantity}
                    </td>

                    <td style={styles.tableCell}>
                      {book.available_quantity}
                    </td>

                    <td style={styles.tableCell}>

                      <button
                        onClick={() =>
                          handleEdit(book)
                        }
                        style={styles.editButton}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(book.id)
                        }
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}
      </div>

    </div>
  );
}

// ========================================
// STYLES
// ========================================

const styles = {

  page: {
    padding: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
    boxSizing: "border-box",
  },

  mainButton: {
    padding: "10px 18px",
    cursor: "pointer",
    marginTop: "10px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: "bold",
  },

  formContainer: {
    marginTop: "30px",
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    maxWidth: "500px",
    width: "100%",
    boxSizing: "border-box",
  },

  formGroup: {
    marginBottom: "18px",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },

  submitButton: {
    padding: "10px 18px",
    cursor: "pointer",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: "bold",
  },

  cancelButton: {
    padding: "10px 18px",
    marginLeft: "10px",
    cursor: "pointer",
    border: "1px solid #999",
    borderRadius: "6px",
    backgroundColor: "#eee",
  },

  successMessage: {
    color: "green",
    fontWeight: "bold",
  },

  errorMessage: {
    color: "red",
    fontWeight: "bold",
  },

  bookList: {
    marginTop: "50px",
  },

  /*
    This is the main mobile-responsiveness fix.
    On a small screen, the table can be scrolled
    left and right instead of being cut off.
  */
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
    marginTop: "20px",
  },

  table: {
    width: "100%",
    minWidth: "900px",
    borderCollapse: "collapse",
  },

  tableHeader: {
    border: "1px solid #ccc",
    padding: "12px",
    backgroundColor: "#f2f2f2",
    textAlign: "left",
    whiteSpace: "nowrap",
  },

  tableCell: {
    border: "1px solid #ccc",
    padding: "12px",
    whiteSpace: "nowrap",
  },

  editButton: {
    padding: "7px 12px",
    marginRight: "8px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#2563eb",
    color: "white",
  },

  deleteButton: {
    padding: "7px 12px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#dc2626",
    color: "white",
  },

};

export default AdminBooks;