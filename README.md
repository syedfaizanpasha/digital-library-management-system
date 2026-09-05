# 📚 Digital Library Management System

A full-stack Digital Library Management System developed as an internship project. The application provides a secure and responsive platform for managing books, users, borrowing and returning operations, and library statistics.

## 🚀 Features

### 👤 User Features
- User registration and login
- JWT-based authentication
- Secure password hashing
- Browse available books
- Search books by title, author, or category
- View detailed book information
- Borrow available books
- Return borrowed books
- View borrowed books
- Read available digital books in PDF format
- Responsive interface for desktop and mobile devices

### 🛠️ Admin Features
- Secure admin authentication
- Admin dashboard
- Add new books
- Edit book details
- Delete books
- Manage users
- View borrowing records
- View library statistics
- Role-based access control

## 🔐 Security

The application implements several security practices:

- JWT authentication
- Role-based authorization
- Password hashing using bcrypt
- Server-side input validation
- Client-side validation
- Parameterized SQL queries
- Helmet security middleware
- Authentication rate limiting
- Protected API routes
- JWT expiration
- Unauthorized access protection
- Duplicate email prevention

## 💻 Technology Stack

### Frontend
- React.js
- Vite
- React Router
- JavaScript
- HTML5
- CSS3

### Backend
- Node.js
- Express.js
- REST API
- JWT
- bcryptjs
- Helmet
- Express Rate Limit

### Database
- MySQL

### Development Tools
- Visual Studio Code
- Git
- GitHub
- Postman

## 🏗️ Project Structure

```text
digital-library-management-system/
│
├── .gitignore
├── README.md
│
└── projects/
    └── digital-library-management-system/
        │
        ├── backend/
        │   ├── middleware/
        │   ├── routes/
        │   ├── db.js
        │   ├── server.js
        │   ├── package.json
        │   └── .env
        │
        └── frontend/
            ├── public/
            │   └── pdfs/
            │       └── the-art-of-war.pdf
            ├── src/
            │   ├── context/
            │   ├── pages/
            │   ├── App.jsx
            │   ├── main.jsx
            │   └── Navbar.jsx
            ├── package.json
            └── index.html

            ## 👨‍💻 Author

**Syed Faizan Pasha**

---

⭐ Developed as a Full-Stack Development Internship Project.