// promptSelector.js
import promptTemplates from './promptTemplates';

// Helper to detect likely problem type from problem description and conversation
export const detectProblemType = (problemDescription, conversation = "") => {
  const text = (problemDescription + " " + conversation).toLowerCase();
  
  // Data structure detection
  const dataStructures = {
    arrays: ["array", "subarray", "elements", "nums", "integer array", "sorting", "sorted array"],
    linkedLists: ["linked list", "node", "next pointer", "head", "tail", "cycle", "reverse linked"],
    trees: ["tree", "binary tree", "bst", "binary search tree", "root", "leaf", "node", "subtree", "traversal"],
    graphs: ["graph", "vertex", "vertices", "edge", "edges", "adjacent", "neighbor", "bfs", "dfs", "shortest path"],
    dynamicProgramming: ["minimum cost", "maximum profit", "ways to", "combinations", "subsequence", "subarray sum", "optimization"]
  };
  
  // Algorithm techniques detection
  const techniques = {
    binarySearch: ["binary search", "sorted array", "find in sorted", "rotated sorted", "search in"],
    greedy: ["greedy", "interval", "maximum number", "minimum number", "earliest", "latest", "optimize"],
    backtracking: ["permutation", "combination", "subset", "all possible", "generate all", "valid arrangements"],
    twoPointers: ["two pointers", "two elements", "pair of", "palindrome", "reverse"],
    slidingWindow: ["sliding window", "subarray", "substring", "consecutive", "contiguous", "at most k"]
  };
  
  // Find best matches
  const detectMatches = (categories) => {
    let bestCategory = null;
    let maxMatches = 0;
    
    for (const [category, keywords] of Object.entries(categories)) {
      const matches = keywords.filter(keyword => text.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestCategory = category;
      }
    }
    
    return bestCategory;
  };
  
  // Detect primary and secondary characteristics
  const dataStructure = detectMatches(dataStructures);
  const technique = detectMatches(techniques);
  
  return {
    primaryType: dataStructure || technique || "general",
    secondaryType: (dataStructure && technique) ? technique : "general"
  };
};

// Get appropriate prompts based on problem type, conversation stage, and hint level
export const getPrompts = (problemType, stage, hintLevel = "moderate") => {
  const { primaryType, secondaryType } = problemType;
  
  // Select templates based on primary and secondary types
  const primaryTemplate = promptTemplates[primaryType] || promptTemplates.general;
  const secondaryTemplate = primaryType !== secondaryType ? 
    promptTemplates[secondaryType] : null;
  
  switch(stage) {
    case "introduction":
      return primaryTemplate.introduction;
    
    case "hint":
      if (primaryTemplate.hints && primaryTemplate.hints.length > 0) {
        // Select a random hint
        const randomIndex = Math.floor(Math.random() * primaryTemplate.hints.length);
        return primaryTemplate.hints[randomIndex];
      }
      return promptTemplates.general.hintLevels[hintLevel];
    
    case "walkthrough":
      return primaryTemplate.walkthrough;
    
    case "mistake":
      if (primaryTemplate.common_mistakes && primaryTemplate.common_mistakes.length > 0) {
        const randomIndex = Math.floor(Math.random() * primaryTemplate.common_mistakes.length);
        return primaryTemplate.common_mistakes[randomIndex];
      }
      return null;
    
    case "stuck":
      const stuckPrompts = promptTemplates.general.stuckPrompts;
      const randomIndex = Math.floor(Math.random() * stuckPrompts.length);
      return stuckPrompts[randomIndex];
    
    case "concept":
      return promptTemplates.general.conceptualExplanation;
      
    case "timeComplexity":
      return promptTemplates.general.timeComplexityExplanation;
    
    default:
      return promptTemplates.general.conceptualExplanation;
  }
};

// Create a structured prompt for the AI based on conversation context
export const createStructuredPrompt = (problemDescription, userQuestion, conversationHistory) => {
  // Detect likely problem type
  const problemType = detectProblemType(problemDescription, conversationHistory);
  
  // Determine conversation stage and hint level
  let stage = "introduction";
  let hintLevel = "gentle";
  
  // Analyze question to determine stage and hint level
  const question = userQuestion.toLowerCase();
  
  if (conversationHistory.length > 0) {
    // Not first message, determine appropriate stage
    if (question.includes("stuck") || question.includes("hint") || question.includes("help")) {
      stage = "hint";
      
      // Determine hint level based on conversation
      if (conversationHistory.length > 4 || question.includes("really stuck") || 
          question.includes("more hint") || question.includes("another hint")) {
        hintLevel = "moderate";
      }
      
      if (conversationHistory.length > 6 || question.includes("just tell me") || 
          question.includes("solution") || question.includes("answer")) {
        hintLevel = "direct";
      }
    } else if (question.includes("approach") || question.includes("strategy") || 
               question.includes("how to solve")) {
      stage = "walkthrough";
    } else if (question.includes("time complexity") || question.includes("space complexity") ||
              question.includes("big o")) {
      stage = "timeComplexity";
    } else if (question.includes("concept") || question.includes("explain") ||
              question.includes("understand")) {
      stage = "concept";
    } else if (conversationHistory.includes("error") || question.includes("wrong") ||
              question.includes("issue") || question.includes("bug")) {
      stage = "mistake";
    } else if (conversationHistory.length > 3) {
      // Later in conversation, mix in some common mistakes to watch for
      if (Math.random() > 0.7) {
        stage = "mistake";
      }
    }
  }
  
  // Get appropriate prompt template
  const promptTemplate = getPrompts(problemType, stage, hintLevel);
  
  // Build the structured prompt for the AI
  return {
    problemType,
    stage,
    hintLevel,
    promptTemplate
  };
};

export default {
  detectProblemType,
  getPrompts,
  createStructuredPrompt
};