const express = require("express");
const router = express.Router();

const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// =====================================================
// GET LIBRARY STATISTICS
// ADMIN ONLY
// =====================================================

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {

    const sql = `
      SELECT
        (SELECT COUNT(*) FROM books) AS total_books,

        (SELECT COALESCE(SUM(quantity), 0)
         FROM books) AS total_copies,

        (SELECT COALESCE(SUM(available), 0)
         FROM books) AS available_copies,

        (SELECT COALESCE(SUM(quantity - available), 0)
         FROM books) AS borrowed_copies,

        (SELECT COUNT(*) FROM users) AS total_users,

        (SELECT COUNT(*) FROM borrow_records)
        AS total_borrow_records,

        (SELECT COUNT(*)
         FROM borrow_records
         WHERE return_date IS NULL)
        AS active_borrowings,

        (SELECT COUNT(*)
         FROM borrow_records
         WHERE return_date IS NOT NULL)
        AS returned_books
    `;

    db.query(sql, (err, results) => {

      if (err) {
        console.error("Error fetching statistics:", err);

        return res.status(500).json({
          message: "Failed to fetch library statistics",
        });
      }

      res.json(results[0]);
    });
  }
);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;