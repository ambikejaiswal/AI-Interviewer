const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const generateInterviewQuestions = async ({
    role,
    experience,
    difficulty,
    interviewType,
    numberOfQuestions,
}) => {
    const prompt = `
You are an expert technical interviewer.

Create a professional interview for the following candidate:

Job Role: ${role}
Experience Level: ${experience}
Difficulty: ${difficulty}
Interview Type: ${interviewType}
Number of Questions: ${numberOfQuestions}

Requirements:

1. Questions must be relevant to the job role.
2. Match the candidate's experience level.
3. Follow the requested difficulty.
4. Cover practical real-world concepts.
5. For Full Stack/MERN roles, include appropriate topics such as:
   React, JavaScript, Node.js, Express.js, MongoDB, REST APIs,
   authentication, debugging, system design basics and problem solving.
6. Avoid duplicate questions.
7. Do not provide answers.
8. Return exactly ${numberOfQuestions} questions.
9. Each question should be clear and interview-ready.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        question: {
                            type: "string",
                        },
                    },
                    required: ["question"],
                },
            },
        },
    });

    return JSON.parse(response.text);
};


const evaluateInterviewAnswer = async ({
    role,
    experience,
    difficulty,
    interviewType,
    question,
    answer,
}) => {
    const prompt = `
You are a professional technical interviewer evaluating a candidate's answer.

Candidate Information:
Job Role: ${role}
Experience Level: ${experience}
Difficulty: ${difficulty}
Interview Type: ${interviewType}

Interview Question:
${question}

Candidate Answer:
${answer}

Evaluate the answer professionally.

Consider:
1. Technical correctness
2. Understanding of the concept
3. Relevance to the question
4. Clarity
5. Completeness
6. Practical knowledge
7. Communication quality

Return a score from 0 to 10.

Also provide:
- concise professional feedback
- 2 to 4 strengths
- 2 to 4 areas for improvement

Do not be overly harsh.
Do not give irrelevant feedback.
Do not rewrite the entire answer.

Return ONLY valid JSON.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    score: {
                        type: "number",
                    },
                    feedback: {
                        type: "string",
                    },
                    strengths: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },
                    improvements: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },
                },
                required: [
                    "score",
                    "feedback",
                    "strengths",
                    "improvements",
                ],
            },
        },
    });

    const result = JSON.parse(response.text);

    return {
        score: Math.max(0, Math.min(10, Number(result.score))),
        feedback: result.feedback,
        strengths: result.strengths,
        improvements: result.improvements,
    };
};


module.exports = {
    generateInterviewQuestions,
    evaluateInterviewAnswer,
};