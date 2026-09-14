import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
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
        setLoading(true);

        try {
            const response = await API.post(
                "/auth/login",
                formData
            );

            login(
                response.data.token,
                response.data.user
            );

            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed"
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
                            AI-Powered Interview Preparation
                        </span>

                        <h1>
                            Prepare smarter.
                            <br />
                            <span>Interview better.</span>
                        </h1>

                        <p>
                            Practice realistic interviews, get instant
                            AI feedback, and improve your technical
                            interview skills with every session.
                        </p>

                        <div className="showcase-features">
                            <div className="showcase-feature">
                                <div className="feature-icon">✓</div>
                                <div>
                                    <strong>AI Generated Questions</strong>
                                    <span>Role-specific interview practice</span>
                                </div>
                            </div>

                            <div className="showcase-feature">
                                <div className="feature-icon">✓</div>
                                <div>
                                    <strong>Instant AI Feedback</strong>
                                    <span>Understand your strengths and gaps</span>
                                </div>
                            </div>

                            <div className="showcase-feature">
                                <div className="feature-icon">✓</div>
                                <div>
                                    <strong>Track Your Progress</strong>
                                    <span>Monitor your interview performance</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="showcase-footer">
                        Built for better interview preparation
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
                            <h2>Welcome back</h2>
                            <p>
                                Sign in to continue your interview preparation.
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
                                <label htmlFor="email">
                                    Email address
                                </label>

                                <div className="input-wrapper">
                                    <span className="input-icon">✉</span>

                                    <input
                                        id="email"
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
                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="input-wrapper">
                                    <span className="input-icon">⌑</span>

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        autoComplete="current-password"
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
                            </div>

                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Logging in...
                                    </>
                                ) : (
                                    <>
                                        Login
                                        <span>→</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="auth-switch">
                            Don't have an account?
                            <Link to="/register">
                                Create account
                            </Link>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;