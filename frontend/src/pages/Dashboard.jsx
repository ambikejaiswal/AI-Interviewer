import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import API from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const response = await API.get("/interviews");

                setInterviews(response.data.interviews || []);
            } catch (error) {
                console.error("Fetch interviews error:", error);

                setError(
                    error.response?.data?.message ||
                        "Failed to load interview history"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    const handleStartInterview = () => {
        navigate("/start-interview");
    };

    const handleViewResult = (id) => {
        navigate(`/result/${id}`);
    };

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatus = (status) => {
        if (status === "completed") {
            return {
                text: "Completed",
                className: "status-completed",
            };
        }

        if (status === "in-progress") {
            return {
                text: "In Progress",
                className: "status-progress",
            };
        }

        return {
            text: "Created",
            className: "status-created",
        };
    };

    const completedInterviews = interviews.filter(
        (interview) => interview.status === "completed"
    );

    const averageScore =
        completedInterviews.length > 0
            ? (
                  completedInterviews.reduce(
                      (sum, interview) =>
                          sum +
                          Number(interview.overallScore || 0),
                      0
                  ) / completedInterviews.length
              ).toFixed(1)
            : "0.0";

    return (
        <div className="dashboard-page">
            {/* Navbar */}
            <Navbar />

            <main className="dashboard-container">
                {/* Welcome Section */}
                <section className="welcome-section">
                    <div>
                        <p className="welcome-label">
                            Dashboard
                        </p>

                        <h1>
                            Welcome back,{" "}
                            <span>
                                {user?.name || "Candidate"}
                            </span>{" "}
                            👋
                        </h1>

                        <p className="welcome-description">
                            Practice interviews, get AI-powered
                            feedback, and track your performance.
                        </p>
                    </div>

                    <button
                        className="start-button"
                        onClick={handleStartInterview}
                    >
                        <span>＋</span>
                        Start New Interview
                    </button>
                </section>

                {/* Stats */}
                <section className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon purple">
                            🎯
                        </div>

                        <div>
                            <p>Total Interviews</p>
                            <h2>{interviews.length}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon green">
                            ✓
                        </div>

                        <div>
                            <p>Completed</p>
                            <h2>{completedInterviews.length}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon blue">
                            ⭐
                        </div>

                        <div>
                            <p>Average Score</p>
                            <h2>
                                {averageScore}
                                <small>/10</small>
                            </h2>
                        </div>
                    </div>
                </section>

                {/* Interview History */}
                <section className="history-section">
                    <div className="section-heading">
                        <div>
                            <h2>My Interviews</h2>

                            <p>
                                Review your previous interview
                                attempts and AI feedback.
                            </p>
                        </div>

                        {interviews.length > 0 && (
                            <span className="interview-count">
                                {interviews.length}{" "}
                                {interviews.length === 1
                                    ? "Interview"
                                    : "Interviews"}
                            </span>
                        )}
                    </div>

                    {loading && (
                        <div className="loading-card">
                            <div className="spinner"></div>

                            <p>
                                Loading your interview
                                history...
                            </p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="error-card">
                            <div className="error-icon">
                                !
                            </div>

                            <h3>
                                Unable to load interviews
                            </h3>

                            <p>{error}</p>

                            <button
                                onClick={() =>
                                    window.location.reload()
                                }
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        interviews.length === 0 && (
                            <div className="empty-card">
                                <div className="empty-icon">
                                    🎤
                                </div>

                                <h3>
                                    No interviews yet
                                </h3>

                                <p>
                                    Start your first AI-powered
                                    interview and begin tracking
                                    your performance.
                                </p>

                                <button
                                    className="start-button"
                                    onClick={
                                        handleStartInterview
                                    }
                                >
                                    Start Your First Interview
                                </button>
                            </div>
                        )}

                    {!loading &&
                        !error &&
                        interviews.length > 0 && (
                            <div className="interview-list">
                                {interviews.map(
                                    (interview) => {
                                        const status =
                                            getStatus(
                                                interview.status
                                            );

                                        return (
                                            <div
                                                className="interview-card"
                                                key={
                                                    interview._id
                                                }
                                            >
                                                <div className="interview-main">
                                                    <div className="interview-icon">
                                                        💼
                                                    </div>

                                                    <div className="interview-info">
                                                        <div className="title-row">
                                                            <h3>
                                                                {
                                                                    interview.role
                                                                }
                                                            </h3>

                                                            <span
                                                                className={`status-badge ${status.className}`}
                                                            >
                                                                {
                                                                    status.text
                                                                }
                                                            </span>
                                                        </div>

                                                        <div className="interview-meta">
                                                            <span>
                                                                {
                                                                    interview.interviewType
                                                                }
                                                            </span>

                                                            <span>
                                                                •
                                                            </span>

                                                            <span>
                                                                {
                                                                    interview.difficulty
                                                                }
                                                            </span>

                                                            <span>
                                                                •
                                                            </span>

                                                            <span>
                                                                {
                                                                    interview.experience
                                                                }
                                                            </span>
                                                        </div>

                                                        <p className="interview-date">
                                                            📅{" "}
                                                            {formatDate(
                                                                interview.createdAt
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="interview-stats">
                                                    <div>
                                                        <span>
                                                            Score
                                                        </span>

                                                        <strong className="score-value">
                                                            {Number(
                                                                interview.overallScore ||
                                                                    0
                                                            ).toFixed(
                                                                1
                                                            )}
                                                            <small>
                                                                /10
                                                            </small>
                                                        </strong>
                                                    </div>

                                                    <div>
                                                        <span>
                                                            Questions
                                                        </span>

                                                        <strong>
                                                            {
                                                                interview.numberOfQuestions
                                                            }
                                                        </strong>
                                                    </div>

                                                    <button
                                                        className="result-button"
                                                        onClick={() =>
                                                            handleViewResult(
                                                                interview._id
                                                            )
                                                        }
                                                    >
                                                        View Result
                                                        <span>
                                                            →
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        )}
                </section>
            </main>
        </div>
    );
};

export default Dashboard;