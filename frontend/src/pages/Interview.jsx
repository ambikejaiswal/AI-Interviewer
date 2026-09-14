import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const Interview = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [interview, setInterview] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [review, setReview] = useState(null);
    const [reviewed, setReviewed] = useState(false);

    const [isListening, setIsListening] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(true);
    const [interimTranscript, setInterimTranscript] = useState("");

    const recognitionRef = useRef(null);

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                setLoading(true);

                const response = await API.get(`/interviews/${id}`);

                const interviewData = response.data.interview;

                setInterview(interviewData);

                setAnswers(
                    interviewData.questions.map(
                        (question) => question.answer || ""
                    )
                );
            } catch (error) {
                console.error("Fetch interview error:", error);

                setError(
                    error.response?.data?.message ||
                        "Failed to load interview"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInterview();
    }, [id]);

    // Keep the current question index available to speech callbacks
    const currentQuestionRef = useRef(0);
    const isListeningRef = useRef(false);

    useEffect(() => {
        currentQuestionRef.current = currentQuestion;
    }, [currentQuestion]);

    // Speech Recognition setup
    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setSpeechSupported(false);
            return;
        }

        const recognition = new SpeechRecognition();

        // Simple configuration — this is intentionally close to the
        // original version that worked reliably.
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            console.log("🎤 Speech recognition started");
            isListeningRef.current = true;
            setIsListening(true);
            setInterimTranscript("");
        };

        recognition.onaudiostart = () => {
            console.log("🎧 Audio capture started");
        };

        recognition.onsoundstart = () => {
            console.log("🔊 Sound detected");
        };

        recognition.onspeechstart = () => {
            console.log("🗣️ Speech detected");
        };

        recognition.onresult = (event) => {
            let finalTranscript = "";
            let interim = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    finalTranscript += transcript + " ";
                } else {
                    interim += transcript;
                }
            }

            if (finalTranscript.trim()) {
                const questionIndex = currentQuestionRef.current;

                setAnswers((previousAnswers) => {
                    const updatedAnswers = [...previousAnswers];

                    updatedAnswers[questionIndex] =
                        `${updatedAnswers[questionIndex] || ""} ${finalTranscript}`
                            .trim();

                    return updatedAnswers;
                });
            }

            setInterimTranscript(interim);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);

            if (event.error === "not-allowed") {
                isListeningRef.current = false;
                setIsListening(false);
                setError(
                    "Microphone permission is blocked. Please allow microphone access for localhost:5173."
                );
            } else if (event.error === "audio-capture") {
                isListeningRef.current = false;
                setIsListening(false);
                setError(
                    "Microphone could not be accessed. Please check your Windows microphone."
                );
            } else if (event.error === "network") {
                isListeningRef.current = false;
                setIsListening(false);
                setError(
                    "Speech recognition network error. Please check your internet connection."
                );
            } else if (
                event.error !== "no-speech" &&
                event.error !== "aborted"
            ) {
                isListeningRef.current = false;
                setIsListening(false);
                setError("Speech recognition failed. Please try again.");
            }

            // no-speech is intentionally ignored because Chrome can
            // produce it during a pause even when the microphone works.
        };

        recognition.onend = () => {
            console.log("🛑 Speech recognition ended");

            // Chrome can stop recognition after a pause. If the user
            // still wants to record, restart automatically.
            if (isListeningRef.current) {
                setTimeout(() => {
                    if (!isListeningRef.current) return;

                    try {
                        recognition.start();
                    } catch (error) {
                        console.log("Recognition restart skipped.");
                    }
                }, 250);
            } else {
                setIsListening(false);
                setInterimTranscript("");
            }
        };

        recognitionRef.current = recognition;

        return () => {
            isListeningRef.current = false;

            try {
                recognition.abort();
            } catch (error) {
                console.log("Recognition cleanup");
            }

            recognitionRef.current = null;
        };
    }, []);

    const handleAnswerChange = (event) => {
        const updatedAnswers = [...answers];

        updatedAnswers[currentQuestion] = event.target.value;

        setAnswers(updatedAnswers);
    };

    const startListening = () => {
        const recognition = recognitionRef.current;

        if (!recognition) {
            setError(
                "Speech recognition is not available in this browser."
            );
            return;
        }

        if (isListeningRef.current) {
            return;
        }

        try {
            setError("");
            setInterimTranscript("");

            // Stop question speech before the candidate starts answering.
            window.speechSynthesis?.cancel();

            isListeningRef.current = true;
            setIsListening(true);

            recognition.start();
        } catch (error) {
            console.error("Failed to start speech recognition:", error);
            isListeningRef.current = false;
            setIsListening(false);
        }
    };

    const stopListening = () => {
        const recognition = recognitionRef.current;

        isListeningRef.current = false;
        setIsListening(false);
        setInterimTranscript("");

        if (!recognition) return;

        try {
            recognition.stop();
        } catch (error) {
            console.log("Speech recognition already stopped.");
        }
    };

    const speakQuestion = (text) => {
        if (!("speechSynthesis" in window) || !text) {
            console.warn("Speech synthesis is not available.");
            return;
        }

        const synth = window.speechSynthesis;

        // Clear anything that may still be queued.
        synth.cancel();
        synth.resume();

        const speech = new SpeechSynthesisUtterance(text);

        // Keep this simple and reliable. Chrome can choose the available
        // English voice automatically.
        speech.lang = "en-US";
        speech.rate = 0.9;
        speech.pitch = 1;
        speech.volume = 1;

        speech.onstart = () => {
            console.log("🔊 AI question voice started");
        };

        speech.onend = () => {
            console.log("🔊 AI question voice ended");
        };

        speech.onerror = (event) => {
            console.error("AI question voice error:", event.error);
        };

        synth.speak(speech);
    };

    // Automatically speak every question.
    useEffect(() => {
        if (!interview || !interview.questions?.length) {
            return;
        }

        const questionText =
            interview.questions[currentQuestion]?.question;

        if (!questionText) {
            return;
        }

        // Give React/browser a moment to render the new question first.
        const timer = setTimeout(() => {
            speakQuestion(questionText);
        }, 800);

        return () => {
            clearTimeout(timer);
            window.speechSynthesis?.cancel();
        };
    }, [interview, currentQuestion]);

    const handleSubmitAnswer = async () => {
    const answer = answers[currentQuestion];

    if (!answer || !answer.trim()) {
        alert("Please provide an answer before submitting.");
        return;
    }

    try {
        setSubmitting(true);
        setError("");

        if (isListeningRef.current) {
            stopListening();
        }

        const response = await API.post(
            `/interviews/${id}/questions/${currentQuestion}/review`,
            {
                answer: answer.trim(),
            }
        );

        setReview(response.data.review);
        setReviewed(true);

    } catch (error) {
        console.error("Submit answer error:", error);

        setError(
            error.response?.data?.message ||
                "Failed to review answer"
        );
    } finally {
        setSubmitting(false);
    }
};

    const handleNext = () => {
        if (!interview) {
            return;
        }

        if (
            currentQuestion <
            interview.questions.length - 1
        ) {
            setCurrentQuestion(currentQuestion + 1);
            setReview(null);
            setReviewed(false);
            setInterimTranscript("");
            return;
        }

        window.speechSynthesis?.cancel();

        if (isListeningRef.current) {
            stopListening();
        }

        navigate("/dashboard");
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setInterimTranscript("");
        }
    };

    if (loading) {
        return (
            <div style={styles.centerContainer}>
                <div style={styles.loadingCard}>
                    <h2>Loading AI Interview...</h2>
                    <p>Please wait while we prepare your interview.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.centerContainer}>
                <div style={styles.errorCard}>
                    <h2>Something went wrong</h2>
                    <p>{error}</p>

                    <button
                        onClick={() => navigate("/dashboard")}
                        style={styles.primaryButton}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!interview || interview.questions.length === 0) {
        return (
            <div style={styles.centerContainer}>
                <div style={styles.errorCard}>
                    <h2>No questions found</h2>

                    <button
                        onClick={() => navigate("/dashboard")}
                        style={styles.primaryButton}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const question = interview.questions[currentQuestion];

    const progress =
        ((currentQuestion + 1) /
            interview.questions.length) *
        100;

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                {/* Header */}
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>
                            AI Interview
                        </h1>

                        <p style={styles.subtitle}>
                            {interview.role} •{" "}
                            {interview.difficulty} •{" "}
                            {interview.interviewType}
                        </p>
                    </div>

                    <div style={styles.questionCounter}>
                        Question {currentQuestion + 1} of{" "}
                        {interview.questions.length}
                    </div>
                </div>

                {/* Progress */}
                <div style={styles.progressBackground}>
                    <div
                        style={{
                            ...styles.progress,
                            width: `${progress}%`,
                        }}
                    />
                </div>

                {/* Question Card */}
                <div style={styles.card}>

                    <div style={styles.questionNumber}>
                        Question {currentQuestion + 1}
                    </div>

                    <h2 style={styles.question}>
                        {question.question}
                    </h2>

                    {/* Answer */}
                    <label style={styles.label}>
                        Your Answer
                    </label>

                    <textarea
                        value={answers[currentQuestion] || ""}
                        onChange={handleAnswerChange}
                        placeholder="Type your answer here or use the microphone to speak..."
                        rows={9}
                        style={styles.textarea}
                    />

                    {/* Voice Controls */}
                    <div style={styles.voiceSection}>

                        {!speechSupported ? (
                            <div style={styles.warning}>
                                ⚠️ Speech recognition is not
                                supported in this browser.
                                Please use Google Chrome or
                                Microsoft Edge.
                            </div>
                        ) : (
                            <>
                                {!isListening ? (
                                    <button
                                        onClick={startListening}
                                        style={styles.voiceButton}
                                    >
                                        🎤 Start Speaking
                                    </button>
                                ) : (
                                    <button
                                        onClick={stopListening}
                                        style={styles.stopButton}
                                    >
                                        ⏹ Stop Recording
                                    </button>
                                )}

                                {isListening && (
                                    <div style={styles.listening}>
                                        <span style={styles.dot}>
                                            ●
                                        </span>

                                        Listening...

                                        {interimTranscript && (
                                            <span style={styles.interim}>
                                                {" "}
                                                {interimTranscript}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* 🆕 AI Review Card — YAHAN ADD KARO */}
                    {review && (
                     <div style={styles.reviewCard}>

                        <div style={styles.reviewHeader}>
                        <h3>🤖 AI Review</h3>

                        <div style={styles.score}>
                        {review.score}/10
                        </div>
                        </div>

                    <div style={styles.feedbackSection}>
                    <h4>Overall Feedback</h4>
                    <p>{review.feedback}</p>
                    </div>

                    {review.strengths?.length > 0 && (
                    <div style={styles.feedbackSection}>
                    <h4>✅ Strengths</h4>

                    <ul>
                       {review.strengths.map(
                            (strength, index) => (
                                <li key={index}>
                                    {strength}
                                </li>
                            )
                        )}
                    </ul>
                </div>
            )}

            {review.improvements?.length > 0 && (
                <div style={styles.feedbackSection}>
                    <h4>📈 Areas to Improve</h4>

                    <ul>
                    {review.improvements.map(
                        (improvement, index) => (
                            <li key={index}>
                                {improvement}
                            </li>
                        )
                    )}
                </ul>
            </div>
        )}

    </div>
)}

                       
                    {/* Navigation */}
                    <div style={styles.navigation}>

                        <button
                            onClick={handlePrevious}
                            disabled={
                                currentQuestion === 0
                            }
                            style={{
                                ...styles.secondaryButton,
                                opacity:
                                    currentQuestion === 0
                                        ? 0.5
                                        : 1,
                                cursor:
                                    currentQuestion === 0
                                        ? "not-allowed"
                                        : "pointer",
                            }}
                        >
                            ← Previous
                        </button>

                        {!reviewed ? (
                        <button
                                onClick={handleSubmitAnswer}
                                disabled={submitting}
                                style={styles.primaryButton}
                                >
                                {submitting
                                    ? "🤖 AI Reviewing..."
                                    : "✨ Submit Answer"}
                                </button>
                                ) : (
                                <button
                                onClick={handleNext}
                                style={styles.primaryButton}
                                >
                            {currentQuestion ===
                            interview.questions.length - 1
                            ? "Finish Interview"
                            : "Next Question →"}
                        </button>
                    )}

                    </div>
                </div>

                {/* Info */}
                <div style={styles.infoBox}>
                    💡 <strong>Tip:</strong> Speak clearly and
                    explain your thought process. Your answer
                    will later be reviewed by AI.
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: "100vh",
        background:
            "linear-gradient(135deg, #f5f3ff, #ede9fe)",
        padding: "40px 20px",
    },

    container: {
        maxWidth: "950px",
        margin: "0 auto",
    },

    centerContainer: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f3ff",
        padding: "20px",
    },

    loadingCard: {
        background: "white",
        padding: "40px",
        borderRadius: "20px",
        textAlign: "center",
        boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)",
    },

    errorCard: {
        background: "white",
        padding: "40px",
        borderRadius: "20px",
        textAlign: "center",
        maxWidth: "500px",
        boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        marginBottom: "20px",
    },

    title: {
        margin: 0,
        fontSize: "32px",
        color: "#4c1d95",
    },

    subtitle: {
        marginTop: "8px",
        color: "#6b7280",
    },

    questionCounter: {
        fontWeight: "600",
        color: "#5b21b6",
        whiteSpace: "nowrap",
    },

    progressBackground: {
        width: "100%",
        height: "8px",
        background: "#ddd6fe",
        borderRadius: "20px",
        overflow: "hidden",
        marginBottom: "25px",
    },

    progress: {
        height: "100%",
        background: "#7c3aed",
        borderRadius: "20px",
        transition: "width 0.3s ease",
    },

    card: {
        background: "rgba(255,255,255,0.9)",
        border: "1px solid #ddd6fe",
        borderRadius: "20px",
        padding: "35px",
        boxShadow:
            "0 15px 40px rgba(76,29,149,0.10)",
    },

    questionNumber: {
        display: "inline-block",
        background: "#ede9fe",
        color: "#6d28d9",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: "600",
        marginBottom: "15px",
    },

    question: {
        fontSize: "22px",
        lineHeight: "1.6",
        color: "#1f2937",
        marginBottom: "25px",
    },

    label: {
        display: "block",
        fontWeight: "600",
        marginBottom: "10px",
        color: "#374151",
    },

    textarea: {
        width: "100%",
        boxSizing: "border-box",
        padding: "16px",
        fontSize: "16px",
        lineHeight: "1.6",
        borderRadius: "12px",
        border: "1px solid #c4b5fd",
        outline: "none",
        resize: "vertical",
        fontFamily: "inherit",
    },

    voiceSection: {
        marginTop: "18px",
        minHeight: "45px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        flexWrap: "wrap",
    },

    voiceButton: {
        border: "none",
        background: "#7c3aed",
        color: "white",
        padding: "12px 20px",
        borderRadius: "10px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
    },

    stopButton: {
        border: "none",
        background: "#dc2626",
        color: "white",
        padding: "12px 20px",
        borderRadius: "10px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
    },

    listening: {
        color: "#dc2626",
        fontWeight: "600",
    },

    dot: {
        marginRight: "6px",
    },

    interim: {
        color: "#6b7280",
        fontWeight: "400",
        fontStyle: "italic",
    },

    warning: {
        background: "#fef3c7",
        color: "#92400e",
        padding: "12px 15px",
        borderRadius: "10px",
        fontSize: "14px",
    },

    navigation: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "30px",
        gap: "15px",
    },

    primaryButton: {
        border: "none",
        background: "#7c3aed",
        color: "white",
        padding: "12px 22px",
        borderRadius: "10px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
    },

    secondaryButton: {
        border: "1px solid #c4b5fd",
        background: "white",
        color: "#6d28d9",
        padding: "12px 22px",
        borderRadius: "10px",
        fontSize: "15px",
        fontWeight: "600",
    },

    infoBox: {
        marginTop: "20px",
        background: "#ede9fe",
        color: "#5b21b6",
        padding: "15px 18px",
        borderRadius: "12px",
        fontSize: "14px",
    },

    reviewCard: {
    marginTop: "25px",
    padding: "25px",
    borderRadius: "16px",
    background: "#f5f3ff",
    border: "1px solid #c4b5fd",
    },

    reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    },

    score: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#7c3aed",
    background: "#ede9fe",
    padding: "8px 16px",
    borderRadius: "12px",
    },

    feedbackSection: {
    marginTop: "18px",
    },

};

export default Interview;