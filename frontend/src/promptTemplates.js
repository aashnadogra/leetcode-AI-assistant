// promptTemplates.js

const promptTemplates = {
    // Core data structures
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
      ]
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
      ]
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
      ]
    },
    
    graphs: {
      introduction: `Let's work through this together.`,
      hints: [
        "How would you represent this graph?",
        "Consider whether BFS or DFS is more appropriate.",
        "Remember to track visited nodes.",
        "Think about how to handle disconnected components."
      ],
      walkthrough: `Let's sketch our approach first.`,
      common_mistakes: [
        "Make sure to mark nodes as visited.",
        "Check for cycles if they're possible.",
        "Consider the directionality of edges."
      ]
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
      ]
    },
    
    // Algorithmic paradigms
    binarySearch: {
      introduction: `I'll help you develop your approach.`,
      hints: [
        "What would you be searching for?",
        "How would you define your search boundaries?",
        "Be careful with the mid calculation.",
        "Think about your stopping condition."
      ],
      walkthrough: `Let's define our search parameters clearly.`,
      common_mistakes: [
        "Check your mid calculation for overflow.",
        "Be careful with inclusive/exclusive boundaries.",
        "Make sure you're updating pointers correctly."
      ]
    },
    
    greedy: {
      introduction: `Let's solve this step by step.`,
      hints: [
        "What's the most optimal choice at each step?",
        "Does sorting help make decisions easier?",
        "Test your strategy with a small example.",
        "Consider if this is truly a greedy problem."
      ],
      walkthrough: `Let's find the right strategy here.`,
      common_mistakes: [
        "Test your greedy approach on edge cases.",
        "Make sure local optimality leads to global optimality.",
        "Consider if you need preprocessing first."
      ]
    },
    
    backtracking: {
      introduction: `I'll guide you through solving this.`,
      hints: [
        "What choices do you have at each step?",
        "When would you want to backtrack?",
        "How will you know when you've found a valid solution?",
        "Can you eliminate any paths early?"
      ],
      walkthrough: `Let's design our recursive approach.`,
      common_mistakes: [
        "Remember to undo your choices when backtracking.",
        "Check that you're handling all constraints.",
        "Make sure you're not modifying shared state incorrectly."
      ]
    },
    
    // Specific problem types
    twoPointers: {
      introduction: `Let me help you with this.`,
      hints: [
        "Consider using two pointers to traverse the data.",
        "How would you initialize your pointers?",
        "What conditions would make you move each pointer?",
        "Think about when to stop."
      ],
      walkthrough: `Let's define how we'll use our pointers.`,
      common_mistakes: [
        "Make sure pointers don't go out of bounds.",
        "Be clear about when to move which pointer.",
        "Check edge cases carefully."
      ]
    },
    
    slidingWindow: {
      introduction: `I'll help guide you to the solution.`,
      hints: [
        "Consider using a sliding window approach.",
        "When would you expand your window?",
        "When would you contract it?",
        "What do you need to track within the window?"
      ],
      walkthrough: `Let's define our window strategy.`,
      common_mistakes: [
        "Update all tracking variables when the window changes.",
        "Be careful with window boundary calculations.",
        "Handle edge cases where window size is minimal/maximal."
      ]
    },
    
    // General problem-solving guidance
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
      
      timeComplexityExplanation: `Let's analyze our solution quickly.`
    }
  };
  
  export default promptTemplates;