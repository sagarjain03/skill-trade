// challengeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/redux/store";

// Question type definition
export interface Question {
  id: number;
  text: string;
  code?: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
}

// Challenge type definition
export interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  xpReward: number;
  icon: string; // We'll use string names that map to Lucide icons
  color: string;
  questions: Question[];
  timeLimit: number; // Time in minutes
}

// Results breakdown category
export interface PerformanceCategory {
  name: string;
  status: "Strong" | "Good" | "Needs Work";
  icon: string;
}

// User's quiz state
interface ChallengeState {
  challenges: Challenge[];
  currentChallengeId: number | null;
  currentQuestionIndex: number;
  userAnswers: number[];
  isCompleted: boolean;
  performanceBreakdown: PerformanceCategory[];
  correctAnswers: number;
}

// Create initial challenges data
const initialChallenges: Challenge[] = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics, closures, and ES6 features.",
    difficulty: "Medium",
    xpReward: 150,
    icon: "Zap",
    color: "from-yellow-600 to-amber-600",
    timeLimit: 12,
    questions: [
      {
        id: 1,
        text: "What is the output of the following code?",
        code: `const x = { a: 1 };\nconst y = { a: 1 };\nconsole.log(x === y);`,
        options: ["true", "false", "undefined", "Error"],
        correctAnswer: 1 // "false"
      },
      {
        id: 2,
        text: "What's the value of 'result' after this code runs?",
        code: `let result = 0;\nfor (var i = 0; i < 5; i++) {\n  result += i;\n}\nconsole.log(result);`,
        options: ["5", "10", "15", "0"],
        correctAnswer: 2 // "10"
      },
      {
        id: 3,
        text: "What will this code output?",
        code: `const arr = [1, 2, 3];\nconst [a, ...rest] = arr;\nconsole.log(rest);`,
        options: ["[1, 2, 3]", "[2, 3]", "[1]", "[]"],
        correctAnswer: 1 // "[2, 3]"
      },
      {
        id: 4,
        text: "What does the following return?",
        code: `function outer() {\n  let count = 0;\n  return function() {\n    return ++count;\n  };\n}\nconst increment = outer();\nconsole.log(increment());\nconsole.log(increment());`,
        options: ["0, 1", "1, 1", "1, 2", "undefined, undefined"],
        correctAnswer: 2 // "1, 2"
      },
      {
        id: 5,
        text: "What's the output of this code?",
        code: `let greeting = "Hello";\nfunction greet() {\n  console.log(greeting);\n  let greeting = "Hi";\n}\ntry {\n  greet();\n} catch (e) {\n  console.log("Error");\n}`,
        options: ["Hello", "Hi", "undefined", "Error"],
        correctAnswer: 3 // "Error" (temporal dead zone)
      },
      {
        id: 6,
        text: "What's the output of the following?",
        code: `console.log(typeof null);`,
        options: ["null", "undefined", "object", "NaN"],
        correctAnswer: 2 // "object"
      },
      {
        id: 7,
        text: "Which statement creates a new function?",
        options: ["var func = function() {};", "function() {}", "new Function();", "Both A and C"],
        correctAnswer: 3 // "Both A and C"
      },
      {
        id: 8,
        text: "What's the output of this code?",
        code: `const promise = new Promise((resolve) => resolve(1));\npromise.then(val => val + 1)\n  .then(val => { throw new Error() })\n  .catch(() => 1)\n  .then(val => console.log(val));`,
        options: ["1", "2", "Error", "undefined"],
        correctAnswer: 0 // "1"
      },
      {
        id: 9,
        text: "What does '==' do in JavaScript?",
        options: [
          "Checks for strict equality",
          "Checks equality with type conversion",
          "Assigns values",
          "Checks object reference equality"
        ],
        correctAnswer: 1 // "Checks equality with type conversion"
      },
      {
        id: 10,
        text: "What will be logged?",
        code: `console.log([...'hello']);`,
        options: ["['hello']", "['h','e','l','l','o']", "hello", "Error"],
        correctAnswer: 1 // "['h','e','l','l','o']"
      }
    ]
  },
  {
    id: 2,
    title: "UI/UX Design Principles",
    description: "Demonstrate your understanding of design systems, accessibility, and user flows.",
    difficulty: "Hard",
    xpReward: 200,
    icon: "Shield",
    color: "from-purple-600 to-pink-600",
    timeLimit: 15,
    questions: [
      {
        id: 1,
        text: "Which design principle is being violated in this UI?",
        code: "[Image showing a form with poor contrast and no labels]",
        options: ["Proximity", "Contrast", "Alignment", "Repetition"],
        correctAnswer: 1 // "Contrast"
      },
      {
        id: 2,
        text: "What accessibility concern is addressed by providing alt text for images?",
        options: [
          "Color blindness",
          "Screen reader compatibility",
          "Keyboard navigation",
          "Text resizing"
        ],
        correctAnswer: 1 // "Screen reader compatibility"
      },
      {
        id: 3,
        text: "Which design principle emphasizes creating visual relationships between elements?",
        options: ["Contrast", "Proximity", "Alignment", "Repetition"],
        correctAnswer: 1 // "Proximity"
      },
      {
        id: 4,
        text: "WCAG 2.1 AA requires color contrast ratio of at least:",
        options: ["2:1", "3:1", "4.5:1", "7:1"],
        correctAnswer: 2 // "4.5:1"
      },
      {
        id: 5,
        text: "Which is NOT one of Jakob Nielsen's 10 Usability Heuristics?",
        options: [
          "Recognition rather than recall",
          "Help users recognize, diagnose, and recover from errors",
          "Maximize white space",
          "Aesthetic and minimalist design"
        ],
        correctAnswer: 2 // "Maximize white space"
      },
      {
        id: 6,
        text: "What does the 'F-pattern' refer to in UI design?",
        options: [
          "A design framework",
          "A user eye tracking pattern",
          "A grid system",
          "A color scheme template"
        ],
        correctAnswer: 1 // "A user eye tracking pattern"
      },
      {
        id: 7,
        text: "Which principle states that related elements should be grouped together?",
        options: ["Law of Proximity", "Law of Similarity", "Law of Continuity", "Law of Closure"],
        correctAnswer: 0 // "Law of Proximity"
      },
      {
        id: 8,
        text: "What is the recommended minimum tap target size for mobile interfaces?",
        options: ["24x24px", "32x32px", "44x44px", "60x60px"],
        correctAnswer: 2 // "44x44px"
      },
      {
        id: 9,
        text: "What is 'cognitive load' in UX design?",
        options: [
          "The number of colors used in a design",
          "The mental effort required to use an interface",
          "The load time of a webpage",
          "The number of elements on a page"
        ],
        correctAnswer: 1 // "The mental effort required to use an interface"
      },
      {
        id: 10,
        text: "What is the primary purpose of a design system?",
        options: [
          "To create beautiful designs",
          "To ensure design consistency and efficiency",
          "To impress clients",
          "To follow trends in design"
        ],
        correctAnswer: 1 // "To ensure design consistency and efficiency"
      },
      {
        id: 11,
        text: "Which is an example of a microinteraction?",
        options: [
          "A page navigation menu",
          "A product listing page",
          "A button that changes color when hovered",
          "A signup form"
        ],
        correctAnswer: 2 // "A button that changes color when hovered"
      },
      {
        id: 12,
        text: "What does the term 'affordance' mean in UI design?",
        options: [
          "The cost of implementing a design",
          "The visual cue that indicates how an element can be used",
          "The space between elements",
          "The overall aesthetic of a design"
        ],
        correctAnswer: 1 // "The visual cue that indicates how an element can be used"
      }
    ]
  },
  {
    id: 3,
    title: "Data Structures & Algorithms",
    description: "Solve coding challenges focused on efficient problem-solving techniques.",
    difficulty: "Expert",
    xpReward: 300,
    icon: "Brain",
    color: "from-blue-600 to-cyan-600",
    timeLimit: 20,
    questions: [
      {
        id: 1,
        text: "What is the time complexity of this algorithm?",
        code: `function mystery(arr) {\n  let result = 0;\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length; j++) {\n      result += arr[i] * arr[j];\n    }\n  }\n  return result;\n}`,
        options: ["O(n)", "O(n²)", "O(n log n)", "O(2ⁿ)"],
        correctAnswer: 1 // "O(n²)"
      },
      {
        id: 2,
        text: "Which data structure operates on a LIFO principle?",
        options: ["Queue", "Stack", "Linked List", "Hash Table"],
        correctAnswer: 1 // "Stack"
      },
      {
        id: 3,
        text: "What's the worst-case time complexity for quicksort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"],
        correctAnswer: 2 // "O(n²)"
      },
      {
        id: 4,
        text: "What is the time complexity of searching in a balanced binary search tree?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 1 // "O(log n)"
      },
      {
        id: 5,
        text: "Which algorithm is best for finding the shortest path in a weighted graph?",
        options: ["BFS", "DFS", "Dijkstra's", "Bubble Sort"],
        correctAnswer: 2 // "Dijkstra's"
      },
      {
        id: 6,
        text: "What is the space complexity of the following algorithm?",
        code: `function recursiveSum(n) {\n  if (n <= 0) return 0;\n  return n + recursiveSum(n-1);\n}`,
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 2 // "O(n)"
      },
      {
        id: 7,
        text: "Which of these sorting algorithms is stable?",
        options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"],
        correctAnswer: 2 // "Merge Sort" 
      },
      {
        id: 8,
        text: "What's the time complexity of insertion in a hash table?",
        options: ["O(1) average case", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 0 // "O(1) average case"
      }
    ]
  }
];

const initialState: ChallengeState = {
  challenges: initialChallenges,
  currentChallengeId: null,
  currentQuestionIndex: 0,
  userAnswers: [],
  isCompleted: false,
  performanceBreakdown: [],
  correctAnswers: 0
};

const challengeSlice = createSlice({
  name: "challenge",
  initialState,
  reducers: {
    startChallenge: (state, action: PayloadAction<number>) => {
      const challengeId = action.payload;
      state.currentChallengeId = challengeId;
      state.currentQuestionIndex = 0;
      state.userAnswers = [];
      state.isCompleted = false;
      state.performanceBreakdown = [];
      state.correctAnswers = 0;
    },
    answerQuestion: (state, action: PayloadAction<number>) => {
      const selectedOption = action.payload;
      
      if (state.currentChallengeId === null) {
        return;
      }
      
      // Record the answer
      state.userAnswers.push(selectedOption);
      
      // Check if answer is correct
      const currentChallenge = state.challenges.find(c => c.id === state.currentChallengeId);
      if (!currentChallenge) return;
      
      const currentQuestion = currentChallenge.questions[state.currentQuestionIndex];
      if (selectedOption === currentQuestion.correctAnswer) {
        state.correctAnswers++;
      }
      
      // Move to next question or complete challenge
      if (state.currentQuestionIndex < currentChallenge.questions.length - 1) {
        state.currentQuestionIndex++;
      } else {
        state.isCompleted = true;
        // Generate performance breakdown based on answered questions
        state.performanceBreakdown = generatePerformanceBreakdown(state);
      }
    },
    resetChallenge: (state) => {
      state.currentChallengeId = null;
      state.currentQuestionIndex = 0;
      state.userAnswers = [];
      state.isCompleted = false;
      state.performanceBreakdown = [];
      state.correctAnswers = 0;
    }
  }
});

// Helper function to generate performance breakdown
function generatePerformanceBreakdown(state: ChallengeState): PerformanceCategory[] {
  const challengeId = state.currentChallengeId;
  if (challengeId === null) return [];
  
  switch (challengeId) {
    case 1: // JavaScript Fundamentals
      return [
        {
          name: "JavaScript Fundamentals",
          status: state.correctAnswers >= 7 ? "Strong" : state.correctAnswers >= 5 ? "Good" : "Needs Work",
          icon: state.correctAnswers >= 7 ? "CheckCircle" : state.correctAnswers >= 5 ? "CheckCircle" : "XCircle"
        },
        {
          name: "ES6 Features",
          // Questions 2, 3, 8, 10 test ES6 features
          status: calculateCategoryStatus([2, 3, 8, 10], state.userAnswers, state.challenges[0].questions),
          icon: calculateCategoryStatus([2, 3, 8, 10], state.userAnswers, state.challenges[0].questions) === "Strong" 
            ? "CheckCircle" 
            : calculateCategoryStatus([2, 3, 8, 10], state.userAnswers, state.challenges[0].questions) === "Good" 
              ? "CheckCircle" 
              : "XCircle"
        },
        {
          name: "Closures & Scope",
          // Questions 4, 5 test closures and scope
          status: calculateCategoryStatus([4, 5], state.userAnswers, state.challenges[0].questions),
          icon: calculateCategoryStatus([4, 5], state.userAnswers, state.challenges[0].questions) === "Strong" 
            ? "CheckCircle" 
            : calculateCategoryStatus([4, 5], state.userAnswers, state.challenges[0].questions) === "Good" 
              ? "CheckCircle" 
              : "XCircle"
        }
      ];
    case 2: // UI/UX Design
      return [
        {
          name: "Accessibility",
          // Questions 1, 2, 4 test accessibility
          status: calculateCategoryStatus([1, 2, 4], state.userAnswers, state.challenges[1].questions),
          icon: calculateCategoryStatus([1, 2, 4], state.userAnswers, state.challenges[1].questions) === "Strong" 
            ? "CheckCircle" 
            : calculateCategoryStatus([1, 2, 4], state.userAnswers, state.challenges[1].questions) === "Good" 
              ? "CheckCircle" 
              : "XCircle"
        },
        {
          name: "Design Principles",
          // Questions 3, 5, 6, 7 test design principles
          status: calculateCategoryStatus([3, 5, 6, 7], state.userAnswers, state.challenges[1].questions),
          icon: calculateCategoryStatus([3, 5, 6, 7], state.userAnswers, state.challenges[1].questions) === "Strong" 
            ? "CheckCircle" 
            : calculateCategoryStatus([3, 5, 6, 7], state.userAnswers, state.challenges[1].questions) === "Good" 
              ? "CheckCircle" 
              : "XCircle"
        },
        {
          name: "Best Practices",
          // Questions 8, 9, 10, 11, 12 test best practices
          status: calculateCategoryStatus([8, 9, 10, 11, 12], state.userAnswers, state.challenges[1].questions),
          icon: calculateCategoryStatus([8, 9, 10, 11, 12], state.userAnswers, state.challenges[1].questions) === "Strong" 
            ? "CheckCircle" 
            : calculateCategoryStatus([8, 9, 10, 11, 12], state.userAnswers, state.challenges[1].questions) === "Good" 
              ? "CheckCircle" 
              : "XCircle"
        }
      ];
    case 3: // Data Structures & Algorithms
      return [
        {
          name: "Time Complexity Analysis",
          // Questions 1, 3, 4, 6, 8 test time/space complexity
          status: calculateCategoryStatus([1, 3, 4, 6, 8], state.userAnswers, state.challenges[2].questions),
          icon: calculateCategoryStatus([1, 3, 4, 6, 8], state.userAnswers, state.challenges[2].questions) === "Strong" 
            ? "CheckCircle" 
            : calculateCategoryStatus([1, 3, 4, 6, 8], state.userAnswers, state.challenges[2].questions) === "Good" 
              ? "CheckCircle" 
              : "XCircle"
        },
        {
          name: "Data Structures",
          // Questions 2, 7 test data structures
          status: calculateCategoryStatus([2, 7], state.userAnswers, state.challenges[2].questions),
          icon: calculateCategoryStatus([2, 7], state.userAnswers, state.challenges[2].questions) === "Strong" 
            ? "CheckCircle" 
            : calculateCategoryStatus([2, 7], state.userAnswers, state.challenges[2].questions) === "Good" 
              ? "CheckCircle" 
              : "XCircle"
        },
        {
          name: "Algorithms",
          // Questions 5 tests algorithms
          status: calculateCategoryStatus([5], state.userAnswers, state.challenges[2].questions),
          icon: calculateCategoryStatus([5], state.userAnswers, state.challenges[2].questions) === "Strong" 
            ? "CheckCircle" 
            : calculateCategoryStatus([5], state.userAnswers, state.challenges[2].questions) === "Good" 
              ? "CheckCircle" 
              : "XCircle"
        }
      ];
    default:
      return [];
  }
}

// Helper function to calculate category status based on answers
function calculateCategoryStatus(
  questionIndices: number[],
  userAnswers: number[],
  questions: Question[]
): "Strong" | "Good" | "Needs Work" {
  let correct = 0;
  
  questionIndices.forEach(qIndex => {
    // Questions are 1-indexed, arrays are 0-indexed
    const adjustedIndex = qIndex - 1;
    
    if (adjustedIndex < userAnswers.length && 
        userAnswers[adjustedIndex] === questions[adjustedIndex].correctAnswer) {
      correct++;
    }
  });
  
  const percentage = (correct / questionIndices.length) * 100;
  
  if (percentage >= 80) return "Strong";
  if (percentage >= 60) return "Good";
  return "Needs Work";
}

export const { startChallenge, answerQuestion, resetChallenge } = challengeSlice.actions;

export const selectChallenges = (state: RootState) => state.challenge.challenges;
export const selectCurrentChallenge = (state: RootState) => 
  state.challenge.currentChallengeId !== null 
    ? state.challenge.challenges.find(c => c.id === state.challenge.currentChallengeId) 
    : null;
export const selectCurrentQuestion = (state: RootState) => {
  if (state.challenge.currentChallengeId === null) return null;
  
  const challenge = state.challenge.challenges.find(c => c.id === state.challenge.currentChallengeId);
  if (!challenge) return null;
  
  return challenge.questions[state.challenge.currentQuestionIndex];
};
export const selectCurrentQuestionIndex = (state: RootState) => state.challenge.currentQuestionIndex;
export const selectIsCompleted = (state: RootState) => state.challenge.isCompleted;
export const selectCorrectAnswers = (state: RootState) => state.challenge.correctAnswers;
export const selectPerformanceBreakdown = (state: RootState) => state.challenge.performanceBreakdown;

export default challengeSlice.reducer;