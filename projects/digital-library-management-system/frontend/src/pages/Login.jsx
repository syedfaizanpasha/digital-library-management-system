import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            }
        );

        const data = await response.json();

        if (response.ok) {
    login(data);

    alert("Login successful!");

    window.location.assign("/");
} else {
    alert(data.message);
}
    } catch (error) {
        alert("Unable to connect to server");
        console.error(error);
    }
}; 

    return (
        <div style={styles.page}>
            <div style={styles.card}>

                <h1 style={styles.title}>Welcome Back 👋</h1>

                <p style={styles.subtitle}>
                    Login to your Digital Library account
                </p>

                <form onSubmit={handleLogin}>

                    {/* Email */}
                    <div style={styles.field}>
                        <label style={styles.label}>Email Address</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" style={styles.loginButton}>
                        Login
                    </button>

                </form>

                <p style={styles.registerText}>
                    Don't have an account?{" "}
                    <Link to="/register" style={styles.registerLink}>
                        Create Account
                    </Link>
                </p>

                <Link to="/" style={styles.back}>
                    ← Back to Books
                </Link>

            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f8fc",
        padding: "40px 20px",
    },

    card: {
        width: "100%",
        maxWidth: "420px",
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
    },

    title: {
        margin: "0 0 10px",
        fontSize: "30px",
        color: "#111827",
        textAlign: "center",
    },

    subtitle: {
        marginBottom: "30px",
        color: "#6b7280",
        textAlign: "center",
        fontSize: "15px",
    },

    field: {
        marginBottom: "20px",
    },

    label: {
        display: "block",
        marginBottom: "8px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#374151",
    },

    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "13px 14px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "15px",
        outline: "none",
    },

    loginButton: {
        width: "100%",
        padding: "13px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#2563eb",
        color: "white",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "5px",
    },

    registerText: {
        textAlign: "center",
        marginTop: "25px",
        color: "#6b7280",
        fontSize: "14px",
    },

    registerLink: {
        color: "#2563eb",
        fontWeight: "600",
        textDecoration: "none",
    },

    back: {
        display: "block",
        textAlign: "center",
        marginTop: "20px",
        color: "#2563eb",
        textDecoration: "none",
        fontSize: "14px",
    },
};

export default Login;