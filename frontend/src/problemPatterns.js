// problemPatterns.js

const problemPatterns = {
    // Arrays and Strings
    twoPointers: {
      keywords: ["two sum", "three sum", "container with most water", "trapping rain water", "palindrome", "reverse", "remove duplicates"],
      description: "Using two pointers that move toward each other or in the same direction to solve array problems."
    },
    
    slidingWindow: {
      keywords: ["maximum sum", "minimum size", "longest substring", "subarray", "consecutive", "contiguous", "window"],
      description: "Maintaining a window of elements and sliding it through an array or string."
    },
    
    prefixSum: {
      keywords: ["subarray sum", "range sum", "cumulative", "prefix sum", "running sum"],
      description: "Precomputing cumulative sums to efficiently calculate subarray sums."
    },
    
    // Searching and Sorting
    binarySearch: {
      keywords: ["sorted array", "search", "find", "first occurrence", "last occurrence", "rotated", "peak element"],
      description: "Dividing the search space in half at each step to find a target value."
    },
    
    mergeIntervals: {
      keywords: ["merge intervals", "overlapping", "meeting rooms", "schedule", "interval", "calendar"],
      description: "Sorting and merging overlapping intervals or finding non-overlapping intervals."
    },
    
    // Dynamic Programming
    dpOptimization: {
      keywords: ["maximum", "minimum", "optimal", "best", "ways to", "combination", "count all"],
      description: "Finding optimal solutions by breaking problems into smaller subproblems."
    },
    
    kadane: {
      keywords: ["maximum subarray", "largest sum", "contiguous", "subarray sum"],
      description: "Finding the maximum sum contiguous subarray."
    },
    
    // Linked Lists
    fastSlowPointers: {
      keywords: ["cycle", "middle", "palindrome", "slow fast", "tortoise hare", "loop"],
      description: "Using two pointers moving at different speeds to solve linked list problems."
    },
    
    // Trees and Graphs
    dfs: {
      keywords: ["depth", "path", "traverse", "recursive", "pre-order", "in-order", "post-order"],
      description: "Using depth-first search to explore tree or graph structures."
    },
    
    bfs: {
      keywords: ["breadth", "level", "shortest", "nearest", "minimum steps", "queue"],
      description: "Using breadth-first search for level-order traversal or finding shortest paths."
    },
    
    unionFind: {
      keywords: ["connected components", "disjoint", "union find", "redundant connection", "number of islands"],
      description: "Tracking connected components in a graph using disjoint-set data structure."
    },
    
    topologicalSort: {
      keywords: ["directed acyclic", "course schedule", "prerequisites", "dependency", "ordering"],
      description: "Finding a linear ordering of vertices in a directed acyclic graph."
    },
    
    // Advanced
    backtracking: {
      keywords: ["permutations", "combinations", "subsets", "generate all", "possible ways", "sudoku", "n-queens"],
      description: "Building solutions incrementally and abandoning them when they fail to satisfy constraints."
    },
    
    greedy: {
      keywords: ["minimum coin", "activity selection", "job scheduling", "huffman", "interval scheduling"],
      description: "Making locally optimal choices at each step to find a global optimum."
    },
    
    binaryIndexedTree: {
      keywords: ["fenwick tree", "range sum", "range update", "interval query"],
      description: "Efficiently updating elements and calculating prefix sums."
    },
    
    segmentTree: {
      keywords: ["range query", "range update", "interval minimum", "interval maximum"],
      description: "Supporting efficient range queries and updates on an array."
    },
    
    // Specific techniques
    bitManipulation: {
      keywords: ["bit", "xor", "and", "or", "binary", "single number", "hamming"],
      description: "Manipulating individual bits to optimize solutions."
    },
    
    designProblems: {
      keywords: ["implement", "design", "class", "data structure", "lru cache", "hash map"],
      description: "Designing and implementing custom data structures or classes."
    }
  };
  
  // Function to identify problem patterns from a description
  export const identifyPatterns = (description) => {
    const text = description.toLowerCase();
    const matchedPatterns = [];
    
    for (const [pattern, info] of Object.entries(problemPatterns)) {
      const matchCount = info.keywords.filter(keyword => text.includes(keyword.toLowerCase())).length;
      if (matchCount > 0) {
        matchedPatterns.push({
          pattern,
          confidence: matchCount / info.keywords.length,
          description: info.description
        });
      }
    }
    
    // Sort by confidence and return top patterns
    return matchedPatterns.sort((a, b) => b.confidence - a.confidence);
  };
  
  export default {
    patterns: problemPatterns,
    identifyPatterns
  };