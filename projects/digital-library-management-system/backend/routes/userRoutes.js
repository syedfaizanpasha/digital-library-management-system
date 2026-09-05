const express = require("express");
const router = express.Router();

const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// =====================================================
// GET ALL USERS
// ADMIN ONLY
// =====================================================

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {

    const sql = `
      SELECT id, name, email, role
      FROM users
      ORDER BY id ASC
    `;

    db.query(sql, (err, results) => {

      if (err) {
        console.error("Error fetching users:", err);

        return res.status(500).json({
          message: "Failed to fetch users",
        });
      }

      res.json(results);
    });
  }
);

// =====================================================
// DELETE USER
// ADMIN ONLY
// =====================================================

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {

    const userId = req.params.id;

    // Prevent admin from deleting their own account
    if (Number(userId) === Number(req.user.id)) {
      return res.status(400).json({
        message: "You cannot delete your own admin account",
      });
    }

    const sql = "DELETE FROM users WHERE id = ?";

    db.query(sql, [userId], (err, result) => {

      if (err) {
        console.error("Error deleting user:", err);

        return res.status(500).json({
          message:
            "Cannot delete this user. They may have borrowing records.",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        message: "User deleted successfully",
      });
    });
  }
);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;