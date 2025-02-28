import promptSelector from './promptSelector.js';

// Test cases
const testCases = [
    {
        description: "Simple array problem",
        problem: "Find the largest element in an array",
        userQuestion: "How do I solve this?",
        conversation: [],
    },
    {
        description: "Graph problem with hint request",
        problem: "Find the shortest path in a graph",
        userQuestion: "Can I get a hint?",
        conversation: ["How do I solve this?"],
    },
    {
        description: "User asks for time complexity",
        problem: "Find the minimum cost path in a matrix",
        userQuestion: "What’s the time complexity?",
        conversation: ["How do I solve this?", "Can I get a hint?"],
    },
    {
        description: "User stuck and asks for help",
        problem: "Find subsets of an array",
        userQuestion: "I'm stuck, need more help",
        conversation: ["How do I find subsets?"],
    }
];

testCases.forEach(({ description, problem, userQuestion, conversation }) => {
    console.log(`\n🔹 Test: ${description}`);
    const result = promptSelector.createStructuredPrompt(problem, userQuestion, conversation);
    console.log(result);
});
