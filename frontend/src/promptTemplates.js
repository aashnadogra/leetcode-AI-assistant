// promptTemplates.js

const promptTemplates = {

  // introductions, walkthrough examples, hints to frame prompts

  arrays: {
    introduction: `Let me help you work through this step by step.`,
    hints: [
      "Have you considered sorting the array first?",
      "Two pointers might be useful here.",
      "A hash map could help track elements efficiently.",
      "Think about solving this in-place.",
      "Edge cases like empty arrays are important to handle."
    ],
    walkthrough: `Let's break this down into smaller steps.`,
    common_mistakes: [
      "Watch out for off-by-one errors with array indices.",
      "Don't forget to handle edge cases like empty arrays.",
      "Be careful with how you're handling duplicates."
    ],

    getPrompt: function (promptType, options = {}, problemType) {
      const { expertiseLevel = 'intermediate' } = options;
      switch (promptType) {
        case 'initialAnalysis':
          return `You are a skilled programming tutor specializing in array problems. 

${this.introduction}
1. Extract and summarize the key requirements of the problem
2. Identify why this is an array problem and what array techniques might apply
3. Clarify any constraints or edge cases I should consider
4. Suggest a high-level approach using ${this.hints[Math.floor(Math.random() * this.hints.length)]}
5. Ask me about my initial thoughts or where I'm stuck

${adaptExpertiseLevel(expertiseLevel)}
Problem Type: ${JSON.stringify(problemType)}`;
        case 'stuckUsers':
          return `I'm completely stuck on the array problem. 

${this.walkthrough}
Without giving me the solution, please:
1. Simplify the problem to its core array operations
2. Provide a concrete example with step-by-step manual solving
3. Suggest ${this.hints[Math.floor(Math.random() * this.hints.length)]}
4. Watch out for ${this.common_mistakes[Math.floor(Math.random() * this.common_mistakes.length)]}

${adaptExpertiseLevel(expertiseLevel)}
Problem Type: ${JSON.stringify(problemType)}`;
        case 'hintBasedGuidance':
          return `For the array problem, I need guidance.
Here's a hint that might help: ${this.hints[Math.floor(Math.random() * this.hints.length)]}
Common mistake to avoid: ${this.common_mistakes[Math.floor(Math.random() * this.common_mistakes.length)]}

${adaptExpertiseLevel(expertiseLevel)}
Problem Type: ${JSON.stringify(problemType)}`;
        default:
          return `For the array problem, I'll help you work through this.

${this.introduction}
${adaptExpertiseLevel(expertiseLevel)}
Problem Type: ${JSON.stringify(problemType)}`;
      }
    }
  },

  linkedLists: {
    introduction: `I'll help you solve this one step at a time.`,
    hints: [
      "A dummy head node might simplify this.",
      "Would slow and fast pointers help?",
      "Try drawing out what happens at each step.",
      "Be careful with null pointers as you traverse."
    ],

    walkthrough: `Let's think about the key operations we need.`,

    common_mistakes: [
      "Remember to handle null pointers.",
      "Check what happens at the edges (first/last nodes).",
      "Make sure all pointers are updated correctly."
    ],

    getPrompt: function (promptType, options = {}, problemType) {
      const { expertiseLevel = 'intermediate' } = options;
      switch (promptType) {
        case 'initialAnalysis':
          return `You are a skilled programming tutor specializing in linked list problems.

${this.introduction}
1. Extract and summarize the key requirements of the problem
2. Identify why this is a linked list problem and what linked list techniques might apply
3. Clarify any constraints or edge cases I should consider
4. Suggest a high-level approach using ${this.hints[Math.floor(Math.random() * this.hints.length)]}
5. Ask me about my initial thoughts or where I'm stuck

${adaptExpertiseLevel(expertiseLevel)}
Problem Type: ${JSON.stringify(problemType)}`;
        case 'stuckUsers':
          return `I'm completely stuck on the linked list problem.

${this.walkthrough}
Without giving me the solution, please:
1. Simplify the problem to its core linked list operations
2. Provide a concrete example with step-by-step manual traversal
3. Suggest ${this.hints[Math.floor(Math.random() * this.hints.length)]}
4. Watch out for ${this.common_mistakes[Math.floor(Math.random() * this.common_mistakes.length)]}

${adaptExpertiseLevel(expertiseLevel)}
Problem Type: ${JSON.stringify(problemType)}`;
        default:
          return `For the linked list problem, I'll help you work through this.

${this.introduction}
${adaptExpertiseLevel(expertiseLevel)}
Problem Type: ${JSON.stringify(problemType)}`;
      }
    }
  },


  trees: {

    introduction: `I'll guide you through this problem.`,

    hints: [
      "Consider which traversal would work best here.",
      "Can you solve this recursively?",
      "Think about what information you need at each node.",
      "What happens at the leaf nodes?"
    ],

    walkthrough: `Let's think about our approach options.`,

    common_mistakes: [
      "Don't forget your base case for recursion.",
      "Make sure you're handling null nodes.",
      "Be clear about node depth vs. tree height."
    ],

    getPrompt: function (promptType, options = {}, problemType) {
      const { expertiseLevel = 'intermediate' } = options;
      switch (promptType) {
        case 'initialAnalysis':
          return `You are a skilled programming tutor specializing in tree problems.

${this.introduction}
1. Extract and summarize the key requirements of the problem
2. Identify which tree traversal technique might be most appropriate
3. Clarify any constraints or edge cases I should consider
4. Suggest a high-level approach using ${this.hints[Math.floor(Math.random() * this.hints.length)]}
5. Ask me about my initial thoughts or where I'm stuck
${adaptExpertiseLevel(expertiseLevel)}

Problem Type: ${JSON.stringify(problemType)}`;
        default:
          return `For the tree problem, I'll help you work through this.

${this.introduction}
${adaptExpertiseLevel(expertiseLevel)}
Problem Type: ${JSON.stringify(problemType)}`;
      }
    }
  },


  dynamicProgramming: {
    introduction: `Let's tackle this methodically.`,
    hints: [
      "Can you identify the subproblems?",
      "What's the simplest base case?",
      "How does the current state depend on previous states?",
      "Consider a small example to trace through."
    ],

    walkthrough: `Let's build our solution incrementally.`,
    common_mistakes: [
      "Double-check your base cases.",
      "Watch for off-by-one errors in your DP table.",
      "Make sure your recurrence relation is correct."
    ],

    getPrompt: function (promptType, options = {}, problemType) {
      const { expertiseLevel = 'intermediate' } = options;
      switch (promptType) {
        case 'initialAnalysis':
          return `You are a skilled programming tutor specializing in dynamic programming problems.

${this.introduction}
1. Extract and summarize the key requirements of the problem
2. Help me identify the subproblems and overlapping structure
3. Guide me to create a recurrence relation
4. Suggest a high-level approach (either top-down or bottom-up)
5. Remind me about ${this.common_mistakes[Math.floor(Math.random() * this.common_mistakes.length)]}

${adaptExpertiseLevel(expertiseLevel)}
Problem Type: ${JSON.stringify(problemType)}`;
        case 'multipleApproaches':
          return `For the dynamic programming problem, I'd like to explore different solution approaches.

${this.walkthrough}
Please outline:
1. A top-down memoization approach
2. A bottom-up tabulation approach
3. Compare the approaches in terms of time/space complexity trade-offs
4. Remind me about ${this.common_mistakes[Math.floor(Math.random() * this.common_mistakes.length)]}

${adaptExpertiseLevel(expertiseLevel)}
Problem Type: ${JSON.stringify(problemType)}`;
        default:
          return `For the dynamic programming problem, I'll help you work through this.

${this.introduction}
${adaptExpertiseLevel(expertiseLevel)}
Problem Type: ${JSON.stringify(problemType)}`;
      }
    }
  },


  general: {
    stuckPrompts: [
      "Let's try a simpler example first.",
      "What's the core challenge here?",
      "Can we break this into smaller parts?",
      "Try working backward from the solution.",
      "What edge cases should we consider?"
    ],

    hintLevels: {
      gentle: "What data structure seems most appropriate here?",
      moderate: "Consider using a hash map to track elements as you go.",
      direct: "Here's the approach: use a hash map to count occurrences as you iterate through the array."
    },

    conceptualExplanation: `Let's think about what we're really solving for.`,
    timeComplexityExplanation: `Let's analyze our solution quickly.`,
    getPrompt: function (promptType, options = {}, problemType) {
      const { expertiseLevel = 'intermediate', hintLevel = 'gentle', userCode, userApproach } = options;
      switch (promptType) {
        case 'initialAnalysis':
          return `You are a skilled programming tutor specializing in algorithmic problem-solving.

${this.conceptualExplanation}
1. Extract and summarize the key requirements of the problem
2. Identify the category of algorithm or data structure this problem relates to
3. Clarify any constraints or edge cases I should consider
4. Suggest a high-level approach without providing code implementation
5. Ask me about my initial thoughts or where I'm stuck

${adaptExpertiseLevel(expertiseLevel)}
Problem Type: ${JSON.stringify(problemType)}`;
        case 'codeReview':
          return `I've attempted to solve the problem and would like your feedback on my approach. Here's my code:
\`\`\`
${userCode || "// Insert user code here"}
\`\`\`
Please review my solution by:
1. Identifying any logical errors or edge cases I missed
2. Suggesting optimizations for time/space complexity
3. Pointing out any non-idiomatic code or style issues
4. Analyzing the runtime and space complexity of my solution
5. Providing targeted questions to help me improve my solution myself

${this.timeComplexityExplanation}
${adaptExpertiseLevel(expertiseLevel)}

Problem Type: ${JSON.stringify(problemType)}`;
        case 'timeComplexityOptimization':
          return `I have a working solution, but it's not efficient enough. My current approach is:
${userApproach || "// Insert user approach here"}

${this.timeComplexityExplanation}
Please help me optimize by:
1. Identifying the performance bottleneck in my current approach
2. Suggesting a more efficient data structure or algorithm
3. Providing a hint about the optimal time complexity that can be achieved
4. Asking targeted questions that lead me to discover optimizations myself
5. If appropriate, suggesting a completely different approach to consider

${adaptExpertiseLevel(expertiseLevel)}
Problem Type: ${JSON.stringify(problemType)}`;
        case 'progressiveHint':
          let hintText;
          switch (hintLevel) {
            case 'gentle':
            case 'subtle':
              hintText = this.hintLevels.gentle;
              break;
            case 'moderate':
              hintText = this.hintLevels.moderate;
              break;
            case 'direct':
            case 'detailed':
              hintText = this.hintLevels.direct;
              break;
            default:
              hintText = this.hintLevels.gentle;
          }
          return `Here's a ${hintLevel} hint to help you progress:


${hintText}
${this.stuckPrompts[Math.floor(Math.random() * this.stuckPrompts.length)]}

${adaptExpertiseLevel(expertiseLevel)}
Problem Type: ${JSON.stringify(problemType)}`;
        default:
          return `I'll help you work through this.

${this.conceptualExplanation}
${this.stuckPrompts[Math.floor(Math.random() * this.stuckPrompts.length)]}

${adaptExpertiseLevel(expertiseLevel)}
Problem Type: ${JSON.stringify(problemType)}`;
      }
    }
  }
};



// Helper function to adapt prompt to expertise level
function adaptExpertiseLevel(expertiseLevel) {
  switch (expertiseLevel) {
    case 'beginner':
      return `As you're a beginner programmer, I'll explain concepts in simple terms, use plenty of examples, and not assume prior knowledge of advanced data structures or algorithms.`;
    case 'intermediate':
      return `As you're at an intermediate level, I'll assume you know basic data structures and algorithms, but might need refreshers on more advanced concepts.`;
    case 'advanced':
      return `As you're an advanced programmer, I'll be concise and use technical terminology without extensive explanation. I'll focus on optimization and elegant solutions.`;
    default:
      return '';
  }
}


// Main function to get a prompt based on problem type and context
function getPrompt(problemType, promptType, options = {}) {
  const template = promptTemplates[problemType] || promptTemplates.general;
  if (typeof template.getPrompt === 'function') {
    return template.getPrompt(promptType, options, problemType);
  }
  return promptTemplates.general.getPrompt(promptType, options, problemType);
}

promptTemplates.getPrompt = getPrompt;

export default promptTemplates;