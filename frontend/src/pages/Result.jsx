import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

const Result = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const response = await API.get(`/interviews/${id}`);

                setInterview(response.data.interview);
            } catch (error) {
                console.error("Fetch result error:", error);

                setError(
                    error.response?.data?.message ||
                        "Failed to load interview result"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInterview();
    }, [id]);

    if (loading) {
        return (
            <div style={styles.page}>
                <div style={styles.loading}>
                    Loading interview result...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.page}>
                <div style={styles.error}>
                    <h2>Unable to load result</h2>
                    <p>{error}</p>

                    <button
                        style={styles.primaryButton}
                        onClick={() => navigate("/dashboard")}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!interview) {
        return null;
    }

    const score = Number(interview.overallScore || 0);

    const scoreMessage =
        score >= 8
            ? "Excellent performance!"
            : score >= 6
            ? "Good performance. Keep improving!"
            : score >= 4
            ? "Fair performance. More practice will help."
            : "Keep practicing and improve your fundamentals.";

    const getScoreClass = (questionScore) => {
        const value = Number(questionScore || 0);

        if (value >= 8) return styles.scoreExcellent;
        if (value >= 6) return styles.scoreGood;
        if (value >= 4) return styles.scoreAverage;

        return styles.scoreLow;
    };

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <div>
                        <button
                            style={styles.backButton}
                            onClick={() => navigate("/dashboard")}
                        >
                            ← Dashboard
                        </button>

                        <h1 style={styles.title}>
                            Interview Result
                        </h1>

                        <p style={styles.subtitle}>
                            {interview.role} •{" "}
                            {interview.interviewType} •{" "}
                            {interview.difficulty}
                        </p>
                    </div>
                </div>

                {/* Score Card */}
                <div style={styles.scoreCard}>
                    <div>
                        <p style={styles.scoreLabel}>
                            Overall Score
                        </p>

                        <div style={styles.score}>
                            {score}
                            <span>/10</span>
                        </div>

                        <p style={styles.scoreMessage}>
                            {scoreMessage}
                        </p>
                    </div>

                    <div
                        style={{
                            ...styles.scoreDetails,
                            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                            width: "100%",
                            minWidth: 0,
                        }}
                    >
                        <div>
                            <span style={styles.detailLabel}>
                                Role
                            </span>
                            <strong>{interview.role}</strong>
                        </div>

                        <div>
                            <span style={styles.detailLabel}>
                                Experience
                            </span>
                            <strong>
                                {interview.experience}
                            </strong>
                        </div>

                        <div>
                            <span style={styles.detailLabel}>
                                Questions
                            </span>
                            <strong>
                                {interview.questions?.length || 0}
                            </strong>
                        </div>

                        <div>
                            <span style={styles.detailLabel}>
                                Status
                            </span>
                            <strong>
                                {interview.status ===
                                "completed"
                                    ? "Completed"
                                    : "In Progress"}
                            </strong>
                        </div>
                    </div>
                </div>

                {/* Question Results */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        Question-wise Performance
                    </h2>

                    {interview.questions?.map(
                        (question, index) => (
                            <div
                                key={index}
                                style={styles.questionCard}
                            >
                                <div style={styles.questionHeader}>
                                    <div>
                                        <span
                                            style={
                                                styles.questionNumber
                                            }
                                        >
                                            Question {index + 1}
                                        </span>

                                        <h3
                                            style={
                                                styles.question
                                            }
                                        >
                                            {question.question}
                                        </h3>
                                    </div>

                                    <div
                                        style={{
                                            ...styles.questionScore,
                                            ...getScoreClass(
                                                question.score
                                            ),
                                        }}
                                    >
                                        {question.score || 0}
                                        /10
                                    </div>
                                </div>

                                {/* Candidate Answer */}
                                <div style={styles.answerBox}>
                                    <h4>
                                        Your Answer
                                    </h4>

                                    <p>
                                        {question.answer
                                            ? question.answer
                                            : "Not answered"}
                                    </p>
                                </div>

                                {/* AI Feedback */}
                                {question.feedback && (
                                    <div
                                        style={
                                            styles.feedbackBox
                                        }
                                    >
                                        <h4>
                                            🤖 AI Feedback
                                        </h4>

                                        <p>
                                            {
                                                question.feedback
                                            }
                                        </p>
                                    </div>
                                )}

                                {/* Strengths */}
                                {question.strengths &&
                                    question.strengths.length >
                                        0 && (
                                        <div
                                            style={
                                                styles.listBox
                                            }
                                        >
                                            <h4>
                                                ✅ Strengths
                                            </h4>

                                            <ul>
                                                {question.strengths.map(
                                                    (
                                                        item,
                                                        i
                                                    ) => (
                                                        <li
                                                            key={
                                                                i
                                                            }
                                                        >
                                                            {
                                                                item
                                                            }
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                {/* Improvements */}
                                {question.improvements &&
                                    question.improvements
                                        .length > 0 && (
                                        <div
                                            style={
                                                styles.listBox
                                            }
                                        >
                                            <h4>
                                                📈 Areas for
                                                Improvement
                                            </h4>

                                            <ul>
                                                {question.improvements.map(
                                                    (
                                                        item,
                                                        i
                                                    ) => (
                                                        <li
                                                            key={
                                                                i
                                                            }
                                                        >
                                                            {
                                                                item
                                                            }
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}
                            </div>
                        )
                    )}
                </div>

                {/* Action */}
                <div style={styles.actions}>
                    <button
                        style={styles.primaryButton}
                        onClick={() =>
                            navigate("/start-interview")
                        }
                    >
                        Start New Interview
                    </button>

                    <button
                        style={styles.secondaryButton}
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: "100vh",
        background:
            "linear-gradient(135deg, #f5f0ff 0%, #ffffff 50%, #eee6ff 100%)",
        padding: "40px 20px",
        fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#1f2937",
    },

    container: {
        maxWidth: "1000px",
        margin: "0 auto",
    },

    header: {
        marginBottom: "25px",
    },

    backButton: {
        border: "none",
        background: "transparent",
        color: "#6d28d9",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        padding: "0",
        marginBottom: "15px",
    },

    title: {
        margin: "0",
        fontSize: "36px",
        fontWeight: "800",
        color: "#4c1d95",
    },

    subtitle: {
        marginTop: "8px",
        color: "#6b7280",
        fontSize: "16px",
    },

    scoreCard: {
        background: "rgba(255, 255, 255, 0.9)",
        border: "1px solid #ddd6fe",
        borderRadius: "20px",
        padding: "30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "30px",
        boxShadow: "0 10px 30px rgba(109, 40, 217, 0.08)",
        marginBottom: "35px",
    },

    scoreLabel: {
        margin: "0 0 5px",
        color: "#6b7280",
        fontSize: "15px",
        fontWeight: "600",
    },

    score: {
        fontSize: "58px",
        fontWeight: "800",
        color: "#6d28d9",
        lineHeight: "1",
    },

   scoreDetails: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
    width: "100%",
    minWidth: 0,
    },

    detailLabel: {
        display: "block",
        color: "#9ca3af",
        fontSize: "13px",
        marginBottom: "4px",
    },

    scoreMessage: {
        margin: "10px 0 0",
        color: "#6b7280",
        fontSize: "14px",
    },

    section: {
        marginBottom: "30px",
    },

    sectionTitle: {
        color: "#4c1d95",
        fontSize: "24px",
        marginBottom: "20px",
    },

    questionCard: {
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "18px",
        padding: "25px",
        marginBottom: "20px",
        boxShadow:
            "0 5px 20px rgba(0, 0, 0, 0.04)",
    },

    questionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px",
    },

    questionNumber: {
        display: "inline-block",
        background: "#ede9fe",
        color: "#6d28d9",
        borderRadius: "20px",
        padding: "6px 12px",
        fontSize: "13px",
        fontWeight: "700",
        marginBottom: "10px",
    },

    question: {
        margin: "0",
        fontSize: "18px",
        lineHeight: "1.6",
        color: "#111827",
        fontWeight: "600",
    },

    questionScore: {
        minWidth: "65px",
        textAlign: "center",
        borderRadius: "12px",
        padding: "10px 8px",
        fontWeight: "800",
        fontSize: "16px",
    },

    scoreExcellent: {
        background: "#dcfce7",
        color: "#15803d",
    },

    scoreGood: {
        background: "#dbeafe",
        color: "#1d4ed8",
    },

    scoreAverage: {
        background: "#fef3c7",
        color: "#b45309",
    },

    scoreLow: {
        background: "#fee2e2",
        color: "#dc2626",
    },

    answerBox: {
        background: "#f9fafb",
        borderRadius: "12px",
        padding: "18px",
        marginTop: "20px",
    },

    feedbackBox: {
        background: "#f5f3ff",
        border: "1px solid #ddd6fe",
        borderRadius: "12px",
        padding: "18px",
        marginTop: "15px",
    },

    listBox: {
        background: "#fafafa",
        borderRadius: "12px",
        padding: "15px 18px",
        marginTop: "15px",
    },

    actions: {
        display: "flex",
        gap: "15px",
        justifyContent: "center",
        paddingBottom: "30px",
    },

    primaryButton: {
        border: "none",
        background:
            "linear-gradient(135deg, #7c3aed, #5b21b6)",
        color: "#ffffff",
        padding: "12px 22px",
        borderRadius: "10px",
        fontWeight: "700",
        cursor: "pointer",
        fontSize: "14px",
    },

    secondaryButton: {
        border: "1px solid #c4b5fd",
        background: "#ffffff",
        color: "#6d28d9",
        padding: "12px 22px",
        borderRadius: "10px",
        fontWeight: "700",
        cursor: "pointer",
        fontSize: "14px",
    },

    loading: {
        textAlign: "center",
        paddingTop: "100px",
        fontSize: "18px",
        color: "#6d28d9",
    },

    error: {
        maxWidth: "500px",
        margin: "100px auto",
        background: "#ffffff",
        padding: "30px",
        borderRadius: "15px",
        textAlign: "center",
    },
};

export default Result;