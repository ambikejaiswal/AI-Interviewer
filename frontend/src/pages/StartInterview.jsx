import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./StartInterview.css";
import Navbar from "../components/Navbar";

const StartInterview = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        role: "Full Stack Developer",
        experience: "Fresher",
        difficulty: "Medium",
        interviewType: "Mixed",
        numberOfQuestions: 10,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await API.post(
                "/interviews",
                {
                    ...formData,
                    numberOfQuestions: Number(
                        formData.numberOfQuestions
                    ),
                }
            );

            const interviewId = response.data.interview._id;

            navigate(`/interview/${interviewId}`);
        } catch (error) {
            console.error(
                "Failed to create interview:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create interview. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="start-interview-page">
           <Navbar />
            <div className="start-interview-container">

                {/* Header */}
                <div className="start-header">
                    <div>
                        <span className="start-badge">
                            AI INTERVIEW PRACTICE
                        </span>

                        <h1>Start New Interview</h1>

                        <p>
                            Customize your AI-powered interview
                            experience and practice with realistic
                            questions tailored to your goals.
                        </p>
                    </div>

                    <div className="ai-header-icon">
                        AI
                    </div>
                </div>

                {/* Main Card */}
                <div className="interview-setup-card">

                    <div className="setup-card-header">
                        <div>
                            <h2>Interview Setup</h2>
                            <p>
                                Choose your preferences before starting.
                            </p>
                        </div>

                        <div className="setup-step">
                            <span>01</span>
                            <small>SETUP</small>
                        </div>
                    </div>

                    {error && (
                        <div className="setup-error">
                            <span>!</span>
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            {/* Job Role */}
                            <div className="setup-field">
                                <label htmlFor="role">
                                    Job Role
                                </label>

                                <div className="select-wrapper">
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option>
                                            Full Stack Developer
                                        </option>
                                        <option>
                                            Frontend Developer
                                        </option>
                                        <option>
                                            Backend Developer
                                        </option>
                                        <option>
                                            MERN Stack Developer
                                        </option>
                                        <option>
                                            Software Engineer
                                        </option>
                                    </select>

                                    <span>⌄</span>
                                </div>

                                <small>
                                    Select the role you want to practice for.
                                </small>
                            </div>

                            {/* Experience */}
                            <div className="setup-field">
                                <label htmlFor="experience">
                                    Experience Level
                                </label>

                                <div className="select-wrapper">
                                    <select
                                        id="experience"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                    >
                                        <option>Fresher</option>
                                        <option>0-1 Years</option>
                                        <option>1-3 Years</option>
                                        <option>3+ Years</option>
                                    </select>

                                    <span>⌄</span>
                                </div>

                                <small>
                                    Questions will match your experience.
                                </small>
                            </div>

                            {/* Difficulty */}
                            <div className="setup-field">
                                <label htmlFor="difficulty">
                                    Difficulty
                                </label>

                                <div className="select-wrapper">
                                    <select
                                        id="difficulty"
                                        name="difficulty"
                                        value={formData.difficulty}
                                        onChange={handleChange}
                                    >
                                        <option>Easy</option>
                                        <option>Medium</option>
                                        <option>Hard</option>
                                    </select>

                                    <span>⌄</span>
                                </div>

                                <small>
                                    Choose how challenging you want it.
                                </small>
                            </div>

                            {/* Interview Type */}
                            <div className="setup-field">
                                <label htmlFor="interviewType">
                                    Interview Type
                                </label>

                                <div className="select-wrapper">
                                    <select
                                        id="interviewType"
                                        name="interviewType"
                                        value={formData.interviewType}
                                        onChange={handleChange}
                                    >
                                        <option>Technical</option>
                                        <option>HR</option>
                                        <option>Behavioral</option>
                                        <option>Mixed</option>
                                    </select>

                                    <span>⌄</span>
                                </div>

                                <small>
                                    Practice technical and behavioral skills.
                                </small>
                            </div>

                            {/* Questions */}
                            <div className="setup-field full-width">
                                <label htmlFor="numberOfQuestions">
                                    Number of Questions
                                </label>

                                <div className="question-options">

                                    {[5, 10, 15, 20].map((number) => (
                                        <label
                                            key={number}
                                            className={
                                                Number(
                                                    formData.numberOfQuestions
                                                ) === number
                                                    ? "question-option active"
                                                    : "question-option"
                                            }
                                        >
                                            <input
                                                type="radio"
                                                name="numberOfQuestions"
                                                value={number}
                                                checked={
                                                    Number(
                                                        formData.numberOfQuestions
                                                    ) === number
                                                }
                                                onChange={handleChange}
                                            />

                                            <span className="question-number">
                                                {number}
                                            </span>

                                            <span className="question-label">
                                                Questions
                                            </span>
                                        </label>
                                    ))}

                                </div>
                            </div>

                        </div>

                        {/* Summary */}
                        <div className="interview-summary">

                            <div className="summary-icon">
                                ✦
                            </div>

                            <div>
                                <strong>
                                    Your interview is ready
                                </strong>

                                <p>
                                    {formData.role} ·{" "}
                                    {formData.experience} ·{" "}
                                    {formData.difficulty} ·{" "}
                                    {formData.interviewType} ·{" "}
                                    {formData.numberOfQuestions} questions
                                </p>
                            </div>

                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            className="start-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="start-spinner"></span>
                                    Generating Interview...
                                </>
                            ) : (
                                <>
                                    Start Interview
                                    <span>→</span>
                                </>
                            )}
                        </button>

                    </form>
                </div>

                {/* Bottom Info */}
                <div className="start-info-grid">

                    <div className="info-item">
                        <span className="info-icon">AI</span>
                        <div>
                            <strong>AI Generated</strong>
                            <p>
                                Questions tailored to your selected role.
                            </p>
                        </div>
                    </div>

                    <div className="info-item">
                        <span className="info-icon">✓</span>
                        <div>
                            <strong>Instant Evaluation</strong>
                            <p>
                                Get AI feedback after every answer.
                            </p>
                        </div>
                    </div>

                    <div className="info-item">
                        <span className="info-icon">↗</span>
                        <div>
                            <strong>Track Progress</strong>
                            <p>
                                Review your interview performance later.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default StartInterview;