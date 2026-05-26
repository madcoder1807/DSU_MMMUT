import { Problem, UpcomingContest } from "../types";

export interface RoadmapStep {
  title: string;
  duration: string;
  topics: string[];
  resources: string[];
  platforms: string[];
  tips: string;
}

export interface RoadmapData {
  title: string;
  subtitle: string;
  badge: string;
  audience: string;
  timeline: string;
  steps: RoadmapStep[];
  additionalLinks: { text: string; url: string }[];
}

// 1. CP ROADMAP
export const cpRoadmap: RoadmapData = {
  title: "Competitive Programming Roadster",
  subtitle: "From Pupil to Candidate Master / Expert rating on Codeforces & CodeChef with DSU guidance",
  badge: "CP Core",
  audience: "Freshers & Sophomores ready to master rapid problem solving",
  timeline: "8 - 10 Months of intensive daily practice",
  steps: [
    {
      title: "Phase 1: Foundation & Language Mastery",
      duration: "4 Weeks",
      topics: ["C++ STL (Vector, Set, Map, Queue, Stack, Pair)", "Asymptotic Time & Space Complexities", "Basic Math (GCD, Prime Sieve, Modular Arithmetic)"],
      resources: ["Luv CP Course YouTube Playlist", "Codeforces Standard C++ Gym"],
      platforms: ["HackerRank (For Syntax)", "CodeChef (Div 4 Contests)"],
      tips: "Focus 100% on C++ STL container speed. Avoid Python for competitive programming due to execution overhead in hard tests."
    },
    {
      title: "Phase 2: Basic Algorithms & Implementation Problems",
      duration: "6 Weeks",
      topics: ["Two Pointers & Sliding Window", "Prefix Sum & Difference Arrays", "Binary Search (Standard & On Answer Space)", "Greedy Strategies"],
      resources: ["Striver Binary Search playlist", "AtCoder Educational DP Contest (A-D)"],
      platforms: ["Codeforces (800 - 1100 rating problems)", "CodeChef (Div 3 Gigs)"],
      tips: "Participate in real-time Codeforces Div. 3 & Div. 4 contests. Up-solve at least 1 problem that you couldn't crack during the live hour."
    },
    {
      title: "Phase 3: Graphs, Trees & Standard Recursion",
      duration: "8 Weeks",
      topics: ["Recursion & Backtracking", "BFS & DFS Traversals", "Cycle Detection & Bipartite Graphs", "Disjoint Set Union (DSU) (The Heart of DSU!)", "Dijkstra & Kruskal Algorithms"],
      resources: ["DSU Core Graph Notes", "CP Algorithms English Mirror"],
      platforms: ["CSES Problem Set (Graph section)", "Codeforces (1200 - 1450 rating)"],
      tips: "Master Disjoint Set Union inside out. Understand path compression and union-by-rank. It optimizes operations to O(α(N))."
    },
    {
      title: "Phase 4: Advanced Data Structures & Dynamic Programming",
      duration: "10 Weeks",
      topics: ["Segment Trees & Fenwick Trees (Binary Indexed Trees)", "Binary Lifting & Lowest Common Ancestor (LCA)", "Standard Dynamic Programming (Knapsack, Grid, Interval DP)", "Bitmask DP & Tree DP"],
      resources: ["Errichto DP YouTube Playlist", "Priye's Segment Tree Guide"],
      platforms: ["Codeforces (1500 - 1800 rating)", "CSES DP Section", "AtCoder DP Contest (All)"],
      tips: "Segment Trees are critical for high-tier national contests (TCS CodeVita, Code-Drift). Solve AtCoder ABC C and D problems daily."
    }
  ],
  additionalLinks: [
    { text: "CSES Problem Set Catalog", url: "https://cses.fi/problemset/" },
    { text: "Codeforces Official Platform", url: "https://codeforces.com/" },
    { text: "AtCoder Main Contest Lobby", url: "https://atcoder.jp/" }
  ]
};

// 2. DSA ROADMAP & QUESTIONS (Striver Companion)
export const dsaRoadmap: RoadmapData = {
  title: "Data Structures & Algorithms Blueprint",
  subtitle: "Syllabus tracking covering core interviewing patterns, with line-by-line YouTube walkthroughs",
  badge: "Interview prep",
  audience: "Students targeting FAANG, top startups, and GSoC",
  timeline: "6 Months",
  steps: [
    {
      title: "Standard Linear Types",
      duration: "4 Weeks",
      topics: ["Arrays (Rotation, Hashmap aggregates, Subarray Sum)", "Linked Lists (Singly, Doubly, Loop checks, Reverse)", "Stacks & Queues (Parenthesis matching, Min Stack, Next Greater)"],
      resources: ["Striver Arrays playlist", "DSU Linked List Sheets"],
      platforms: ["LeetCode (Easy/Medium)", "InterviewBit"],
      tips: "Do not move to Graphs or DP before fully mastering Array bounds and simple Two-pointer techniques."
    },
    {
      title: "Recursive Operations & Trees",
      duration: "6 Weeks",
      topics: ["Binary Trees (Traversals: In, Pre, Post, Level-order)", "BST Operations (Insert, Delete, LCA, Validate)", "DFS/BFS Graph conversions"],
      resources: ["Striver Tree Complete Course", "MyCodeSchool Recursion"],
      platforms: ["LeetCode", "LeetCode (Mediums)"],
      tips: "Trees are highly recursive. Practice tracing Recursion Trees on dry erase boards to visualize execution stacks."
    },
    {
      title: "High Performance: Dynamic Programming & Graphs",
      duration: "8 Weeks",
      topics: ["1D DP (Climbing Stairs, Frog Jump)", "2D Grid DP & Matrix chains", "Subsequence partition DP", "Shortest Paths (Dijkstra, Bellman-Ford)", "Disjoint Set Union (Union-Find)"],
      resources: ["Striver DP Playlist", "Aditya Verma DP Mastery"],
      platforms: ["LeetCode (Hard)", "GeeksforGeeks"],
      tips: "Write down the recurrence relation first. Ensure you can explain the Space Optimization step from 2D array to 1D array during interviews."
    }
  ],
  additionalLinks: [
    { text: "Striver's A2Z Sheet Home", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-detailed-course-syllabus/" },
    { text: "GeeksforGeeks Practice Portal", url: "https://practice.geeksforgeeks.org/" }
  ]
};

// 3. WEB DEV ROADMAP
export const webDevRoadmap: RoadmapData = {
  title: "Modern Fullstack Engineering",
  subtitle: "Master Frontend interactive mechanics & scalable server frameworks to deploy products like Vercel",
  badge: "Builder Track",
  audience: "Hobbyists looking to build dynamic college web tools & startups",
  timeline: "4 - 5 Months",
  steps: [
    {
      title: "Phase 1: Professional Frontend Basics",
      duration: "4 Weeks",
      topics: ["HTML5 semantic structures", "Tailwind CSS Layouts (Grid, Flexbox, Aspect)", "JavaScript ES6+ Promises & Fetch", "Git & GitHub workflow"],
      resources: ["Dave Gray HTML/CSS Playlist", "Tailwind Docs"],
      platforms: ["Frontend Mentor", "GitHub Sandbox"],
      tips: "Avoid traditional raw CSS. Master Tailwind utility flags and responsive prefixes (md, lg) immediately to build aesthetic grids."
    },
    {
      title: "Phase 2: Modern React & State engines",
      duration: "5 Weeks",
      topics: ["Vite + React 19 functional rendering", "React Hooks (useState, useEffect, Memo, Ref, Context)", "Framer Motion layout transitions", "Lucide icons integrations"],
      resources: ["Academind React 19 Course", "Framer Motion tutorials"],
      platforms: ["Vercel Deployment", "Codesandbox"],
      tips: "Avoid heavy component coupling. Keep logic in custom hooks or utility JS files to keep JSX structures elegant."
    },
    {
      title: "Phase 3: Backend, Authentication & APIs",
      duration: "5 Weeks",
      topics: ["Node.js with Express server routing", "MongoDB & Mongoose modeling", "Local disk database fallback scripting", "JWT token and custom session handling", "Safe Environment keys setup (.env)"],
      resources: ["The Net Ninja NodeJS Masterclass", "Express backend templates"],
      platforms: ["Render Host", "Railway App"],
      tips: "Never expose secret keys on the client bundle. Always proxy third party API calls like OpenAI or Stripe via Express backends."
    }
  ],
  additionalLinks: [
    { text: "Roadmap.sh Developer Guides", url: "https://roadmap.sh/" },
    { text: "Vercel Frontend Documentation", url: "https://vercel.com/docs" }
  ]
};

// 4. AI/ML ROADMAP
export const aiMlRoadmap: RoadmapData = {
  title: "Machine Learning & AI Architectures",
  subtitle: "From cleaning corporate raw datasets to deploying actual Neural Networks & GPT-wrapper backends",
  badge: "AI Frontier",
  audience: "Mathematics fans eager to understand deep statistics and predictive neural paths",
  timeline: "5 Months",
  steps: [
    {
      title: "Data Manipulation & Stats",
      duration: "4 Weeks",
      topics: ["Python Scripting", "NumPy Matrix Math Operations", "Pandas DataFrames (Aggregations, CSV parsers)", "Matplotlib & Seaborn Visual mapping"],
      resources: ["Kaggle Learn Data Science courses", "Sentdex Python ML"],
      platforms: ["Kaggle Notebooks", "Google Colab"],
      tips: "Do not skip linear algebra. True understanding of eigenvalues and vector transformation makes Neural Tuning intuitive."
    },
    {
      title: "Classical Machine Learning",
      duration: "5 Weeks",
      topics: ["Supervised (Linear/Logistic Regression, Decision Trees, SVM)", "Unsupervised Clustering (K-Means, PCA dimensional reduction)", "Scikit-Learn modeling pipelines"],
      resources: ["StatQuest Machine Learning playlist", "Andrew Ng ML course on Coursera"],
      platforms: ["Kaggle Playgrounds", "UCI Notebooks"],
      tips: "Master feature engineering (standardization, categorical encoding) first. Quality data yields better results than complex models."
    },
    {
      title: "Deep Learning & AI Toolchains",
      duration: "6 Weeks",
      topics: ["Artificial Neural Networks (ANN)", "Convolutional Networks (CNN) for Computer Vision", "Transformers & LLM integration", "Prompt Engineering & Token cost tracking"],
      resources: ["3Blue1Brown Neural Networks", "Hugging Face Course docs"],
      platforms: ["Kaggle Competitions", "GitHub"],
      tips: "Use pretrained models (from HuggingFace) with Transfer Learning rather than compiling large deep networks from scratch."
    }
  ],
  additionalLinks: [
    { text: "Kaggle Home Hub", url: "https://www.kaggle.com/" },
    { text: "Hugging Face AI community", url: "https://huggingface.co/" }
  ]
};

// STRIVER'S A2Z DSA PROBLEMS
export const dsaProblems: Problem[] = [
  // Arrays
  { id: "arr_1", title: "Find the Largest element in an Array", difficulty: "Easy", category: "Arrays", platform: "LeetCode", link: "https://leetcode.com/problems/largest-local-values-in-a-matrix/", youtubeId: "37E9ckMDdTk" },
  { id: "arr_2", title: "Two Sum: Find pair matching Target Value", difficulty: "Easy", category: "Arrays", platform: "LeetCode", link: "https://leetcode.com/problems/two-sum/", youtubeId: "UXDSeD9mN-k" },
  { id: "arr_3", title: "Kadane's Algorithm - Max Subarray Sum", difficulty: "Medium", category: "Arrays", platform: "LeetCode", link: "https://leetcode.com/problems/maximum-subarray/", youtubeId: "w_KEocd__Ac" },
  { id: "arr_4", title: "Sort Colors (0s, 1s and 2s DNF Algorithm)", difficulty: "Medium", category: "Arrays", platform: "LeetCode", link: "https://leetcode.com/problems/sort-colors/", youtubeId: "tp8JIu4Blyk" },
  // Linked Lists
  { id: "ll_1", title: "Reverse Singly Linked List (Iterative & Recursive)", difficulty: "Easy", category: "Linked List", platform: "LeetCode", link: "https://leetcode.com/problems/reverse-linked-list/", youtubeId: "iRtLEoL-r-Y" },
  { id: "ll_2", title: "Detect Loop and Return Starting Node in LL", difficulty: "Medium", category: "Linked List", platform: "LeetCode", link: "https://leetcode.com/problems/linked-list-cycle-ii/", youtubeId: "2KdY9kerFQM" },
  // Stack & Queue
  { id: "stack_1", title: "Valid Parenthesis matching Stack", difficulty: "Easy", category: "Stack", platform: "LeetCode", link: "https://leetcode.com/problems/valid-parentheses/", youtubeId: "CcAZToTAt2Y" },
  { id: "stack_2", title: "Next Greater Element using Monotonic Stack", difficulty: "Medium", category: "Stack", platform: "LeetCode", link: "https://leetcode.com/problems/next-greater-element-i/", youtubeId: "rUmweS9rn8g" },
  // Trees
  { id: "tree_1", title: "Maximum Depth/Height of Binary Tree", difficulty: "Easy", category: "Trees", platform: "LeetCode", link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", youtubeId: "eD3tmO66aSE" },
  { id: "tree_2", title: "Binary Tree Level Order Traversal", difficulty: "Medium", category: "Trees", platform: "LeetCode", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/", youtubeId: "EoAsA2bDA6Q" },
  // Graphs & DSU
  { id: "graph_1", title: "DSU - Disjoint Set Union Implementation (Union by Rank)", difficulty: "Medium", category: "Graphs", platform: "LeetCode", link: "https://leetcode.com/problems/redundant-connection/", youtubeId: "aBxjDBC4M1U" },
  { id: "graph_2", title: "Dijkstra's Shortest Path Algorithm (Using Min-Heap)", difficulty: "Hard", category: "Graphs", platform: "LeetCode", link: "https://leetcode.com/problems/network-delay-time/", youtubeId: "V6H1qAeB-l4" },
  // Dynamic Programming
  { id: "dp_1", title: "Climbing Stairs (Base 1D Fibonacci DP)", difficulty: "Easy", category: "DP", platform: "LeetCode", link: "https://leetcode.com/problems/climbing-stairs/", youtubeId: "mLfjzQbJWnI" },
  { id: "dp_2", title: "0/1 Knapsack Problem with State formulation", difficulty: "Medium", category: "DP", platform: "LeetCode", link: "https://leetcode.com/problems/partition-equal-subset-sum/", youtubeId: "7win31G_DUY" }
];

// UPCOMING CONTEST CALENDAR
export const defaultContests: UpcomingContest[] = [
  {
    id: "ct_1",
    title: "Codeforces Round 1012 (Div. 2)",
    platform: "Codeforces",
    startTime: "2026-05-29T14:35:00Z",
    duration: "2 Hours",
    link: "https://codeforces.com/contests"
  },
  {
    id: "ct_2",
    title: "CodeChef Starters 194 (Div. 3 & Div. 4)",
    platform: "CodeChef",
    startTime: "2026-05-30T14:30:00Z",
    duration: "3 Hours",
    link: "https://www.codechef.com/contests"
  },
  {
    id: "ct_3",
    title: "LeetCode Weekly Contest 498",
    platform: "LeetCode",
    startTime: "2026-05-31T02:30:00Z",
    duration: "1.5 Hours",
    link: "https://leetcode.com/contest/"
  },
  {
    id: "ct_4",
    title: "AtCoder Beginner Contest 405",
    platform: "AtCoder",
    startTime: "2026-05-31T12:00:00Z",
    duration: "1 Hour 40 Min",
    link: "https://atcoder.jp/"
  }
];

// SOCIETY MEMBERS & TEAM
export interface TeamMember {
  name: string;
  role: string;
  avatarSlug: string;
  codeforces: string;
  github: string;
  branch: string;
  speciality: string;
}

export const dsaTeam: TeamMember[] = [
  {
    name: "Ayan Srivastava",
    role: "President & Lead CP Trainer",
    avatarSlug: "ayan",
    codeforces: "https://codeforces.com/profile",
    github: "https://github.com",
    branch: "CSE, Final Year",
    speciality: "Candidate Master, Graph Theory"
  },
  {
    name: "Ritika Mishra",
    role: "Vice President & Web Architect",
    avatarSlug: "ritika",
    codeforces: "https://codeforces.com/profile",
    github: "https://github.com",
    branch: "IT, Final Year",
    speciality: "GSoC Mentor, MERN Stack"
  },
  {
    name: "Preeti Singh",
    role: "Core AI Researcher",
    avatarSlug: "preeti",
    codeforces: "https://codeforces.com/profile",
    github: "https://github.com",
    branch: "CSE, 3rd Year",
    speciality: "Kaggle Grandmaster track, PyTorch"
  },
  {
    name: "Ravi K. Jaiswal",
    role: "Relations Lead & Competitive Programmer",
    avatarSlug: "ravi",
    codeforces: "https://codeforces.com/profile",
    github: "https://github.com",
    branch: "ECE, 3rd Year",
    speciality: "Master on Codeforces, Logic Gates"
  }
];
