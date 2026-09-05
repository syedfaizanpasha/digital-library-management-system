const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// =====================================================
// GET ALL BOOKS
// =====================================================
router.get("/", (req, res) => {
  const sql = "SELECT * FROM books ORDER BY id ASC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching books:", err);

      return res.status(500).json({
        message: "Failed to fetch books",
      });
    }

    res.json(results);
  });
});

// =====================================================
// ADD A NEW BOOK
// ADMIN ONLY
// =====================================================
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    const {
      title,
      author,
      category,
      isbn,
      quantity
    } = req.body;

    if (!title || !author || !quantity) {
      return res.status(400).json({
        message: "Title, author and quantity are required",
      });
    }

    const sql = `
      INSERT INTO books
      (title, author, category, isbn, quantity, available_quantity)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        title,
        author,
        category || null,
        isbn || null,
        quantity,
        quantity
      ],
      (err, result) => {
        if (err) {
          console.error("Error adding book:", err);

          return res.status(500).json({
            message: "Failed to add book",
          });
        }

        res.status(201).json({
          message: "Book added successfully",
          bookId: result.insertId,
        });
      }
    );
  }
);

// =====================================================
// GET MY BORROWED BOOKS
// JWT PROTECTED
// =====================================================
router.get("/borrowed", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT
      borrow_records.id,
      borrow_records.book_id,
      books.title,
      books.author,
      borrow_records.borrow_date,
      borrow_records.return_date,
      borrow_records.status
    FROM borrow_records
    JOIN books
      ON borrow_records.book_id = books.id
    WHERE borrow_records.user_id = ?
      AND borrow_records.status = 'borrowed'
    ORDER BY borrow_records.borrow_date DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching borrowed books:", err);

      return res.status(500).json({
        message: "Failed to fetch borrowed books",
      });
    }

    res.json(results);
  });
});


// =====================================================
// GET ONE BOOK BY ID
// IMPORTANT: Keep this AFTER /borrowed
// =====================================================
router.get("/:id", (req, res) => {
  const bookId = req.params.id;

  const sql = "SELECT * FROM books WHERE id = ?";

  db.query(sql, [bookId], (err, results) => {
    if (err) {
      console.error("Error fetching book:", err);

      return res.status(500).json({
        message: "Failed to fetch book",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json(results[0]);
  });
});

// =====================================================
// GET ALL BORROWING RECORDS
// ADMIN ONLY
// =====================================================

router.get(
  "/admin/borrowings",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {

    const sql = `
      SELECT
        borrow_records.id,
        users.name AS user_name,
        users.email AS user_email,
        books.title AS book_title,
        books.author AS book_author,
        borrow_records.borrow_date,
        borrow_records.return_date,
        borrow_records.status
      FROM borrow_records
      JOIN users
        ON borrow_records.user_id = users.id
      JOIN books
        ON borrow_records.book_id = books.id
      ORDER BY borrow_records.borrow_date DESC
    `;

    db.query(sql, (err, results) => {

      if (err) {
        console.error(
          "Error fetching borrowing records:",
          err
        );

        return res.status(500).json({
          message: "Failed to fetch borrowing records",
        });
      }

      res.json(results);
    });
  }
);

// =====================================================
// BORROW A BOOK
// JWT PROTECTED
// =====================================================
router.put("/:id/borrow", authMiddleware, (req, res) => {
  const bookId = req.params.id;
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  // ---------------------------------------------------
  // Check if user already has this book
  // ---------------------------------------------------
  const checkSql = `
    SELECT id
    FROM borrow_records
    WHERE user_id = ?
      AND book_id = ?
      AND status = 'borrowed'
  `;

  db.query(checkSql, [userId, bookId], (err, existingRecords) => {
    if (err) {
      console.error("Error checking borrow record:", err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    if (existingRecords.length > 0) {
      return res.status(400).json({
        message: "You have already borrowed this book",
      });
    }

    // ---------------------------------------------------
    // Decrease available quantity
    // ---------------------------------------------------
    const updateBookSql = `
      UPDATE books
      SET available_quantity = available_quantity - 1
      WHERE id = ?
        AND available_quantity > 0
    `;

    db.query(updateBookSql, [bookId], (err, bookResult) => {
      if (err) {
        console.error("Error updating book quantity:", err);

        return res.status(500).json({
          message: "Failed to borrow book",
        });
      }

      if (bookResult.affectedRows === 0) {
        return res.status(400).json({
          message: "Book is currently unavailable",
        });
      }

      // ---------------------------------------------------
      // Create borrow record
      // ---------------------------------------------------
      const insertSql = `
        INSERT INTO borrow_records
        (user_id, book_id, borrow_date, status)
        VALUES (?, ?, NOW(), 'borrowed')
      `;

      db.query(insertSql, [userId, bookId], (err) => {
        if (err) {
          console.error("Error creating borrow record:", err);

          return res.status(500).json({
            message: "Book quantity updated, but borrow record failed",
          });
        }

        res.json({
          message: "Book borrowed successfully",
        });
      });
    });
  });
});


// =====================================================
// RETURN A BOOK
// JWT PROTECTED
// =====================================================
router.put("/:id/return", authMiddleware, (req, res) => {
  const bookId = req.params.id;
  const userId = req.user.id;

  // ---------------------------------------------------
  // Find and update the active borrow record
  // ---------------------------------------------------
  const updateRecordSql = `
    UPDATE borrow_records
    SET
      status = 'returned',
      return_date = NOW()
    WHERE user_id = ?
      AND book_id = ?
      AND status = 'borrowed'
    ORDER BY borrow_date DESC
    LIMIT 1
  `;

  db.query(
    updateRecordSql,
    [userId, bookId],
    (err, recordResult) => {
      if (err) {
        console.error("Error returning borrow record:", err);

        return res.status(500).json({
          message: "Failed to return book",
        });
      }

      // ---------------------------------------------------
      // No active borrow record
      // ---------------------------------------------------
      if (recordResult.affectedRows === 0) {
        return res.status(400).json({
          message: "No active borrow record found",
        });
      }

      // ---------------------------------------------------
      // Increase available quantity
      // ---------------------------------------------------
      const updateBookSql = `
        UPDATE books
        SET available_quantity = available_quantity + 1
        WHERE id = ?
      `;

      db.query(updateBookSql, [bookId], (err, bookResult) => {
        if (err) {
          console.error("Error updating book quantity:", err);

          return res.status(500).json({
            message: "Book returned, but quantity update failed",
          });
        }

        res.json({
          message: "Book returned successfully",
        });
      });
    }
  );
});

// ========================================
// EDIT A BOOK
// ADMIN ONLY
// ========================================

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    const { id } = req.params;

    const {
      title,
      author,
      category,
      isbn,
      quantity
    } = req.body;

    if (!title || !author || !quantity) {
      return res.status(400).json({
        message: "Title, author and quantity are required",
      });
    }

    // First get the existing book
    const getBookSql = `
      SELECT quantity, available_quantity
      FROM books
      WHERE id = ?
    `;

    db.query(getBookSql, [id], (err, results) => {
      if (err) {
        console.error("Error finding book:", err);

        return res.status(500).json({
          message: "Failed to find book",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Book not found",
        });
      }

      const oldQuantity = results[0].quantity;
      const oldAvailableQuantity = results[0].available_quantity;

      // Calculate how many copies are currently borrowed
      const borrowedQuantity =
        oldQuantity - oldAvailableQuantity;

      // New quantity cannot be less than currently borrowed copies
      if (Number(quantity) < borrowedQuantity) {
        return res.status(400).json({
          message:
            "Quantity cannot be less than the number of borrowed copies",
        });
      }

      const newAvailableQuantity =
        Number(quantity) - borrowedQuantity;

      const updateSql = `
        UPDATE books
        SET
          title = ?,
          author = ?,
          category = ?,
          isbn = ?,
          quantity = ?,
          available_quantity = ?
        WHERE id = ?
      `;

      db.query(
        updateSql,
        [
          title,
          author,
          category || null,
          isbn || null,
          Number(quantity),
          newAvailableQuantity,
          id
        ],
        (err, result) => {
          if (err) {
            console.error("Error updating book:", err);

            return res.status(500).json({
              message: "Failed to update book",
            });
          }

          res.json({
            message: "Book updated successfully",
          });
        }
      );
    });
  }
);

// ========================================
// DELETE A BOOK
// ADMIN ONLY
// ========================================

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM books WHERE id = ?";

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error deleting book:", err);

        return res.status(500).json({
          message: "Failed to delete book",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Book not found",
        });
      }

      res.json({
        message: "Book deleted successfully",
      });
    });
  }
);

// =====================================================
// EXPORT ROUTER
// =====================================================
module.exports = router;