const express = require("express");

const {
    createInterview,
    getUserInterviews,
    getInterviewById,
    reviewInterviewAnswer,
} = require("../controllers/interviewController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createInterview);

router.get("/", protect, getUserInterviews);

router.post(
    "/:id/questions/:questionIndex/review",
    protect,
    reviewInterviewAnswer
);

router.get("/:id", protect, getInterviewById);

module.exports = router;