import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);

        try {
            const response = await API.post(
                "/auth/register",
                formData
            );

            navigate("/login");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">

                {/* Left Side */}
                <div className="auth-showcase">
                    <div className="auth-brand">
                        <div className="brand-icon">AI</div>
                        <span>AI Interviewer</span>
                    </div>

                    <div className="showcase-content">
                        <span className="showcase-badge">
                            Start Your Interview Journey
                        </span>

                        <h1>
                            Build confidence.
                            <br />
                            <span>Get interview ready.</span>
                        </h1>

                        <p>
                            Create your account and start practicing
                            personalized interviews powered by AI.
                        </p>

                        <div className="showcase-features">
                            <div className="showcase-feature">
                                <div className="feature-icon">✓</div>
                                <div>
                                    <strong>Personalized Practice</strong>
                                    <span>
                                        Choose role, difficulty and interview type
                                    </span>
                                </div>
                            </div>

                            <div className="showcase-feature">
                                <div className="feature-icon">✓</div>
                                <div>
                                    <strong>Detailed Evaluation</strong>
                                    <span>
                                        Get scores, strengths and improvements
                                    </span>
                                </div>
                            </div>

                            <div className="showcase-feature">
                                <div className="feature-icon">✓</div>
                                <div>
                                    <strong>Interview History</strong>
                                    <span>
                                        Keep track of your performance
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="showcase-footer">
                        Your next interview starts here
                    </div>
                </div>

                {/* Right Side */}
                <div className="auth-form-section">
                    <div className="auth-card">

                        <div className="mobile-brand">
                            <div className="brand-icon">AI</div>
                            <span>AI Interviewer</span>
                        </div>

                        <div className="auth-heading">
                            <h2>Create your account</h2>
                            <p>
                                Join AI Interviewer and start practicing today.
                            </p>
                        </div>

                        {error && (
                            <div className="auth-error">
                                <span>!</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            <div className="form-group">
                                <label htmlFor="name">
                                    Full name
                                </label>

                                <div className="input-wrapper">
                                    <span className="input-icon">●</span>

                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        autoComplete="name"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="register-email">
                                    Email address
                                </label>

                                <div className="input-wrapper">
                                    <span className="input-icon">✉</span>

                                    <input
                                        id="register-email"
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="register-password">
                                    Password
                                </label>

                                <div className="input-wrapper">
                                    <span className="input-icon">⌑</span>

                                    <input
                                        id="register-password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>

                                <small className="input-hint">
                                    Use at least 6 characters
                                </small>
                            </div>

                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create account
                                        <span>→</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="auth-switch">
                            Already have an account?
                            <Link to="/login">
                                Login
                            </Link>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Register;