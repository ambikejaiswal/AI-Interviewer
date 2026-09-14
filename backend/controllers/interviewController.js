const Interview = require("../models/Interview");

const {
    generateInterviewQuestions,
    evaluateInterviewAnswer,
} = require("../services/geminiService");


// CREATE INTERVIEW
const createInterview = async (req, res) => {
    try {
        const {
            role,
            experience,
            difficulty,
            interviewType,
            numberOfQuestions,
        } = req.body;

        if (
            !role ||
            !experience ||
            !difficulty ||
            !interviewType ||
            !numberOfQuestions
        ) {
            return res.status(400).json({
                message: "All interview fields are required",
            });
        }

        const generatedQuestions =
            await generateInterviewQuestions({
                role,
                experience,
                difficulty,
                interviewType,
                numberOfQuestions,
            });

        const interview = await Interview.create({
            user: req.user.userId,
            role,
            experience,
            difficulty,
            interviewType,
            numberOfQuestions,
            questions: generatedQuestions,
        });

        res.status(201).json({
            message: "Interview created successfully",
            interview,
        });
    } catch (error) {
        console.error("Create interview error:", error);

        res.status(500).json({
            message: "Failed to create interview",
            error: error.message,
        });
    }
};

const getUserInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({
            user: req.user.userId,
        })
            .sort({ createdAt: -1 })
            .select(
                "role experience difficulty interviewType numberOfQuestions overallScore status createdAt updatedAt"
            );

        res.status(200).json({
            interviews,
        });
    } catch (error) {
        console.error("Get user interviews error:", error);

        res.status(500).json({
            message: "Failed to fetch interview history",
            error: error.message,
        });
    }
};

// GET INTERVIEW BY ID
const getInterviewById = async (req, res) => {
    try {
        const interview = await Interview.findOne({
            _id: req.params.id,
            user: req.user.userId,
        });

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found",
            });
        }

        res.status(200).json({
            interview,
        });
    } catch (error) {
        console.error("Get interview error:", error);

        res.status(500).json({
            message: "Failed to fetch interview",
            error: error.message,
        });
    }
};


// REVIEW INTERVIEW ANSWER
const reviewInterviewAnswer = async (req, res) => {
    try {
        const { id, questionIndex } = req.params;
        const { answer } = req.body;

        if (!answer || !answer.trim()) {
            return res.status(400).json({
                message: "Answer is required",
            });
        }

        const index = Number(questionIndex);

        if (Number.isNaN(index) || index < 0) {
            return res.status(400).json({
                message: "Invalid question index",
            });
        }

        const interview = await Interview.findOne({
            _id: id,
            user: req.user.userId,
        });

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found",
            });
        }

        if (
            !interview.questions ||
            index >= interview.questions.length
        ) {
            return res.status(400).json({
                message: "Invalid question index",
            });
        }

        const currentQuestion =
            interview.questions[index];

        const review = await evaluateInterviewAnswer({
            role: interview.role,
            experience: interview.experience,
            difficulty: interview.difficulty,
            interviewType: interview.interviewType,
            question: currentQuestion.question,
            answer: answer.trim(),
        });

        // Save answer and AI review
        currentQuestion.answer = answer.trim();
        currentQuestion.feedback = review.feedback;
        currentQuestion.score = review.score;
        currentQuestion.strengths = review.strengths;
        currentQuestion.improvements = review.improvements;

        // Calculate overall score from answered questions
        const answeredQuestions =
            interview.questions.filter(
                (item) =>
                    item.answer &&
                    item.answer.trim()
            );

        const totalScore = answeredQuestions.reduce(
            (sum, item) =>
                sum + Number(item.score || 0),
            0
        );

        interview.overallScore =
            answeredQuestions.length > 0
                ? Number(
                      (
                          totalScore /
                          answeredQuestions.length
                      ).toFixed(1)
                  )
                : 0;

        // Mark interview status
        if (
            interview.questions.every(
                (item) =>
                    item.answer &&
                    item.answer.trim()
            )
        ) {
            interview.status = "completed";
        } else {
            interview.status = "in-progress";
        }

        await interview.save();

        res.status(200).json({
            message: "Answer reviewed successfully",
            review: {
                score: review.score,
                feedback: review.feedback,
                strengths: review.strengths,
                improvements: review.improvements,
            },
            overallScore: interview.overallScore,
            status: interview.status,
        });
    } catch (error) {
        console.error("Review answer error:", error);

        res.status(500).json({
            message: "Failed to review answer",
            error: error.message,
        });
    }
};


module.exports = {
    createInterview,
    getUserInterviews,
    getInterviewById,
    reviewInterviewAnswer,
};