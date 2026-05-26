import { useState, useEffect, FormEvent } from "react";
import { 
  BookOpen, 
  Terminal, 
  Code2, 
  Brain, 
  Trophy, 
  Sparkles, 
  Menu, 
  X, 
  Search, 
  Share2, 
  ExternalLink, 
  CheckCircle2, 
  Circle, 
  Play, 
  Flame, 
  ChevronRight, 
  Plus, 
  Send, 
  Bell, 
  User, 
  Lock, 
  Settings, 
  LogOut, 
  ThumbsUp, 
  Compass, 
  FileText, 
  Calendar, 
  GraduationCap, 
  Github,
  Award,
  BookMarked,
  MessageSquare,
  ChevronDown,
  Info,
  Check
} from "lucide-react";
import { User as UserType, Announcement, ResourceItem, LeaderboardEntry, Problem, UpcomingContest } from "./types";
import { cpRoadmap, dsaRoadmap, webDevRoadmap, aiMlRoadmap, dsaProblems, defaultContests, dsaTeam } from "./data/societyData";
import AuthModal from "./components/AuthModal";

export default function App() {
  // Navigation active panel state: 'home' | 'cp' | 'dsa' | 'webdev' | 'aiml' | 'sheets' | 'resources' | 'team'
  const [activeTab, setActiveTab] = useState<string>("home");
  
  // Hamburger drawer state
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [showAboutGallery, setShowAboutGallery] = useState<boolean>(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Dynamic Server Data
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [contests, setContests] = useState<UpcomingContest[]>(defaultContests);

  // Search filter inside Resources & DSA Sheets
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [resourceCategory, setResourceCategory] = useState<string>("All");

  // Local student state updates 
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>([]);
  const [userPoints, setUserPoints] = useState<number>(0);

  // Chatbot state
  const [botOpen, setBotOpen] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: "Hey standard coder! 👋 I am DSU-Bot, programmed for MMMUT developers. Ask me anything about standard CP templates, Trees vs Graph traversal, how to crack Google GSOC, or Striver's A2Z sheets!" }
  ]);
  const [botLoading, setBotLoading] = useState<boolean>(false);

  // Personal Notes Pad Widget 
  const [userNotes, setUserNotes] = useState<Array<{ id: string; title: string; content: string; updatedAt: string }>>([]);
  const [noteTitleInput, setNoteTitleInput] = useState<string>("");
  const [noteContentInput, setNoteContentInput] = useState<string>("");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [notesMessage, setNotesMessage] = useState<string>("");

  // Admin announcement publish control panel
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [newAnnTitle, setNewAnnTitle] = useState("");
  const [newAnnContent, setNewAnnContent] = useState("");
  const [newAnnCategory, setNewAnnCategory] = useState<"contest" | "workshop" | "general" | "achievement">("general");

  // Resource sharing form
  const [showAddResource, setShowAddResource] = useState(false);
  const [newResTitle, setNewResTitle] = useState("");
  const [newResLink, setNewResLink] = useState("");
  const [newResCategory, setNewResCategory] = useState<"Resource" | "Playlist" | "PDF" | "Template">("Resource");
  const [newResTags, setNewResTags] = useState("");

  // Notification panel bubble state
  const [notifications, setNotifications] = useState<string[]>([
    "Welcome to the brand new DSU MMMUT Student Portal!",
    "Annual CP Contest CodeSpree v4.0 is live on Sunday on CodeChef!",
    "Striver A2Z sheets are fully integrated with +25 CP point rewards."
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // YouTube player embed overlay
  const [activeYoutubeUrl, setActiveYoutubeUrl] = useState<string | null>(null);

  // Init Data Loading
  useEffect(() => {
    // Attempt restoring session from localStorage if exists
    const storedToken = localStorage.getItem("dsu_auth_token");
    const storedUser = localStorage.getItem("dsu_user_info");
    if (storedToken && storedUser) {
      setAuthToken(storedToken);
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      setSolvedProblemIds(parsedUser.completedProblems || []);
      setUserPoints(parsedUser.points || 0);
    }

    // Fetch announcements, leaderboard, resources from Express REST Server
    fetchAnnouncements();
    fetchLeaderboard();
    fetchResources();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements");
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (e) {
      console.error("Announcements failed to load", e);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (e) {
      console.error("Leaderboard status load failed", e);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch("/api/resources");
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      }
    } catch (e) {
      console.error("Resources library fetch failed", e);
    }
  };

  // Load User Notes when user logs in/changes
  useEffect(() => {
    if (authToken) {
      fetch("/api/user/notes", {
        headers: { "Authorization": authToken }
      })
      .then(res => res.json())
      .then(data => {
        if (data.notes) {
          setUserNotes(data.notes);
        }
      })
      .catch(err => console.error("Notes recovery failed", err));
    } else {
      setUserNotes([]);
    }
  }, [authToken]);

  // Auth Success Handlers
  const handleAuthSuccess = (data: { user: UserType; token: string }) => {
    setCurrentUser(data.user);
    setAuthToken(data.token);
    setSolvedProblemIds(data.user.completedProblems || []);
    setUserPoints(data.user.points || 0);
    localStorage.setItem("dsu_auth_token", data.token);
    localStorage.setItem("dsu_user_info", JSON.stringify(data.user));
    
    // Refresh leaderboard with new member registered
    fetchLeaderboard();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    setSolvedProblemIds([]);
    setUserPoints(0);
    localStorage.removeItem("dsu_auth_token");
    localStorage.removeItem("dsu_user_info");
  };

  // Toggle Problem Solved Checked status & dynamic DB synchronized tracking (e.g. awards +25 pts)
  const toggleProblemCompleted = async (problemId: string, currentStatus: boolean) => {
    if (!authToken) {
      // Prompt signin requirement
      setShowAuthModal(true);
      return;
    }

    const newStatus = !currentStatus;
    // Optimistic local update
    if (newStatus) {
      setSolvedProblemIds([...solvedProblemIds, problemId]);
      setUserPoints(prev => prev + 25);
    } else {
      setSolvedProblemIds(solvedProblemIds.filter(id => id !== problemId));
      setUserPoints(prev => Math.max(0, prev - 25));
    }

    try {
      const res = await fetch("/api/user/solve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken
        },
        body: JSON.stringify({ problemId, status: newStatus })
      });

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();
      // Synchronize exact server state
      if (data.points !== undefined && data.completedProblems) {
        setUserPoints(data.points);
        setSolvedProblemIds(data.completedProblems);
        
        // Update stored profile cache
        if (currentUser) {
          const updated = { ...currentUser, points: data.points, completedProblems: data.completedProblems };
          setCurrentUser(updated);
          localStorage.setItem("dsu_user_info", JSON.stringify(updated));
        }

        // Re-fetch leaderboard to update ranking
        fetchLeaderboard();
      }
    } catch (err) {
      // Revert states if request failed
      if (newStatus) {
        setSolvedProblemIds(prev => prev.filter(id => id !== problemId));
        setUserPoints(prev => Math.max(0, prev - 25));
      } else {
        setSolvedProblemIds(prev => [...prev, problemId]);
        setUserPoints(prev => prev + 25);
      }
      alert("Failed to synchronize progress back to backend server. Double check auth state.");
    }
  };

  // Upvote/Like a Dynamic Resource listed in Library catalog
  const handleResourceLike = async (resId: string) => {
    // Instantly increment local count
    setResources(prev => prev.map(r => {
      if (r.id === resId) return { ...r, likes: r.likes + 1 };
      return r;
    }));

    try {
      const res = await fetch("/api/resources/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: resId })
      });
      if (!res.ok) throw new Error();
    } catch (e) {
      // silent fail recovery is fine for simple counts
    }
  };

  // Submit shared student resource links to community library
  const handleShareResourceSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!authToken) {
      alert("Please login first to credit your student profile.");
      return;
    }
    if (!newResTitle || !newResLink) {
      alert("Please enter title & valid link.");
      return;
    }

    try {
      const tagsArray = newResTags ? newResTags.split(",").map(s => s.trim()) : ["Dynamic"];
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken
        },
        body: JSON.stringify({
          title: newResTitle,
          category: newResCategory,
          link: newResLink,
          tags: tagsArray
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }

      const updatedResources = await res.json();
      setResources(updatedResources);
      
      // Reset state
      setNewResTitle("");
      setNewResLink("");
      setNewResTags("");
      setShowAddResource(false);
      
      // Alert with style
      setNotifications([`New resource "${newResTitle}" uploaded successfully by community members!`, ...notifications]);
    } catch (err: any) {
      alert(err.message || "Failed uploading resource links to MMMUT library server.");
    }
  };

  // Post dynamic announcements (Admin functionality)
  const handleAnnouncementSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    if (!newAnnTitle || !newAnnContent) {
      alert("Missing announcement parameters");
      return;
    }

    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken
        },
        body: JSON.stringify({
          title: newAnnTitle,
          content: newAnnContent,
          category: newAnnCategory
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
        setNewAnnTitle("");
        setNewAnnContent("");
        setIsAdminPanelOpen(false);
        alert("DSU technical announcement published successfully!");
      } else {
        alert("Failed. Verify admin session permissions.");
      }
    } catch (e) {
      alert("Express network announcement dispatch error.");
    }
  };

  // Write/Edit Student Notes inside Hambuge menu drawer
  const savePersonalNote = async () => {
    if (!authToken) {
      alert("Please login to save persistent learning logs.");
      return;
    }
    if (!noteTitleInput.trim() || !noteContentInput.trim()) {
      setNotesMessage("⚠️ Title and Content are mandatory!");
      return;
    }

    setNotesMessage("Uploading log to secure cloud DB...");
    try {
      const res = await fetch("/api/user/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken
        },
        body: JSON.stringify({
          title: noteTitleInput,
          content: noteContentInput,
          noteId: selectedNoteId
        })
      });

      if (res.ok) {
        const data = await res.json();
        setUserNotes(data.notes || []);
        setNotesMessage("✅ Log synchronized perfectly to server!");
        // Reset Inputs
        setNoteTitleInput("");
        setNoteContentInput("");
        setSelectedNoteId(null);
        setTimeout(() => setNotesMessage(""), 2500);
      }
    } catch (e) {
      setNotesMessage("⚠️ Back-end sync failed. Saved only in persistent buffer.");
    }
  };

  // Chat with DSU Code-assistantbot via server Gemini SDK
  const handleChatSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user' as const, content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setBotLoading(true);

    try {
      // Package up context to get a high quality smart response
      const payloadMessages = [...chatMessages, userMsg];
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages })
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        throw new Error();
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I ran into a server communication speedbump. Let me give you a quick master guidance instead: for dynamic optimization loops, always consider saving subproblems in tables to achieve $O(N)$ lookup! Let's code it together! 💻" 
      }]);
    } finally {
      setBotLoading(false);
    }
  };

  // Filtered DSA Questions for search Queries
  const filteredProblems = dsaProblems.filter(p => {
    if (searchQuery.trim() === "") return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || 
           p.category.toLowerCase().includes(q) || 
           p.difficulty.toLowerCase().includes(q) ||
           p.platform.toLowerCase().includes(q);
  });

  // Filtered Resource List 
  const filteredResources = resources.filter(r => {
    const matchesCategory = resourceCategory === "All" || r.category === resourceCategory;
    const matchesSearch = searchQuery.trim() === "" || 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Calculate Progress Percentages
  const currentTotalSolvedCount = solvedProblemIds.length;
  const dsaTotalCount = dsaProblems.length;
  const targetGoalPercent = Math.min(100, Math.round((currentTotalSolvedCount / dsaTotalCount) * 100)) || 0;

  return (
    <div id="dsu-portal-wrapper" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden antialiased select-none selection:bg-cyan-500/30 selection:text-white">
      
      {/* Decorative ambient neon background components */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[60vh] right-[5vw] w-[600px] h-[600px] bg-cyan-950/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-[700px] h-[700px] bg-blue-950/5 rounded-full blur-[180px] pointer-events-none"></div>

      {/* Top Banner indicating MMMUT Affiliation & Live state */}
      <div id="top-branding-strip" className="bg-slate-900/60 border-b border-slate-800/40 text-[11px] py-1.5 px-4 text-center text-slate-400 font-mono tracking-wide flex justify-between items-center z-40 relative">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
          <span>MADAN MOHAN MALAVIYA UNIVERSITY OF TECHNOLOGY (MMMUT), GORAKHPUR</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>PORTAL VER: 2026.5</span>
          <span className="text-cyan-400">DSU UNION CHANNELS ONLINE</span>
        </div>
      </div>

      {/* Header with glassmorphic navbar */}
      <header id="main-navigation-header" className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand Logo & MMMUT subtitle */}
          <div className="flex items-center gap-3">
            <button 
              id="brand-logo-btn"
              onClick={() => setActiveTab("home")} 
              className="flex items-center gap-2.5 text-left group transition-all"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-500 flex items-center justify-center font-mono font-bold text-white text-xl shadow-[0_0_15px_rgba(62,184,255,0.4)] group-hover:scale-105 transition-transform">
                ∪
              </div>
              <div>
                <span className="block text-base font-bold text-white font-mono uppercase tracking-tight leading-none">
                  DSU <span className="text-cyan-400">Union</span>
                </span>
                <span className="block text-[9px] text-slate-400 font-medium font-mono">MMMUT Technical Society</span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1.5 text-[13px] font-semibold text-slate-300">
            <button 
              onClick={() => { setActiveTab("home"); setSearchQuery(""); }}
              className={`px-3 py-2 rounded-lg transition-all ${activeTab === "home" ? "bg-slate-900 text-white border-l-2 border-cyan-500 font-bold" : "hover:text-white hover:bg-slate-900/60"}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab("cp")}
              className={`px-3 py-2 rounded-lg transition-all ${activeTab === "cp" ? "bg-slate-900 text-white border-l-2 border-cyan-500 font-bold" : "hover:text-white hover:bg-slate-900/60"}`}
            >
              CP Roadster
            </button>
            <button 
              onClick={() => setActiveTab("dsa")}
              className={`px-3 py-2 rounded-lg transition-all ${activeTab === "dsa" ? "bg-slate-900 text-white border-l-2 border-cyan-500 font-bold" : "hover:text-white hover:bg-slate-900/60"}`}
            >
              Striver DSA
            </button>
            <button 
              onClick={() => setActiveTab("webdev")}
              className={`px-3 py-2 rounded-lg transition-all ${activeTab === "webdev" ? "bg-slate-900 text-white border-l-2 border-cyan-500 font-bold" : "hover:text-white hover:bg-slate-900/60"}`}
            >
              Full Stack
            </button>
            <button 
              onClick={() => setActiveTab("aiml")}
              className={`px-3 py-2 rounded-lg transition-all ${activeTab === "aiml" ? "bg-slate-900 text-white border-l-2 border-cyan-500 font-bold" : "hover:text-white hover:bg-slate-900/60"}`}
            >
              AI / ML
            </button>
            <button 
              onClick={() => { setActiveTab("sheets"); setSearchQuery(""); }}
              className={`px-3 py-2 rounded-lg transition-all ${activeTab === "sheets" ? "bg-slate-900 text-white border-l-2 border-cyan-500 font-bold" : "hover:text-white hover:bg-slate-900/60"}`}
            >
              Practice Sheets
            </button>
            <button 
              onClick={() => { setActiveTab("resources"); setSearchQuery(""); }}
              className={`px-3 py-2 rounded-lg transition-all ${activeTab === "resources" ? "bg-slate-900 text-white border-l-2 border-cyan-500 font-bold" : "hover:text-white hover:bg-slate-900/60"}`}
            >
              Student Library
            </button>
            <button 
              onClick={() => setActiveTab("team")}
              className={`px-3 py-2 rounded-lg transition-all ${activeTab === "team" ? "bg-slate-900 text-white border-l-2 border-cyan-500 font-bold" : "hover:text-white hover:bg-slate-900/60"}`}
            >
              Team Leads
            </button>
          </nav>

          {/* Right Action Widgets (Status, Notifications, Register/Login) */}
          <div className="flex items-center gap-3">
            
            {/* Search Trigger hint */}
            <div className="hidden lg:flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 w-44">
              <Search className="h-3.5 w-3.5 text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Ctrl + K search..."
                value={searchQuery}
                aria-label="Search"
                onChange={e => {
                  setSearchQuery(e.target.value);
                  if (activeTab === "home") {
                    setActiveTab("sheets");
                  }
                }}
                className="bg-transparent border-none text-xs text-white focus:outline-none placeholder-slate-500 w-full"
              />
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                id="notification-bell-btn"
                onClick={() => setShowNotifications(!showNotifications)} 
                className="p-2 border border-slate-800 rounded-lg bg-slate-900 hover:text-cyan-400 transition-colors relative"
              >
                <Bell className="h-4.5 w-4.5 text-slate-300" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400"></span>
                )}
              </button>

              {/* Notification Overlay Panel */}
              {showNotifications && (
                <div id="notifications-overlay" className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-2">
                    <span className="font-mono font-bold text-cyan-400 uppercase tracking-wide">Live Feed Updates</span>
                    <button onClick={() => setNotifications([])} className="text-slate-500 hover:text-white text-[10px] uppercase font-mono">Clear</button>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">No new feed notifications at this time.</p>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {notifications.map((n, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-950/50 rounded-lg border-l-2 border-cyan-500 text-slate-300">
                          {n}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Account widget */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-bold text-white max-w-28 truncate">{currentUser.name}</span>
                  <span className="text-[10px] text-cyan-400 font-mono tracking-wider">{userPoints} pts ⭐</span>
                </div>
                
                {/* Admin publish switch if applicable */}
                {currentUser.role === 'admin' && (
                  <button 
                    onClick={() => setIsAdminPanelOpen(true)}
                    className="p-1 px-2.5 bg-indigo-950/40 border border-indigo-500/40 hover:bg-indigo-900/65 text-[10.5px] rounded-lg text-indigo-300 font-semibold font-mono uppercase tracking-wider transition-colors"
                  >
                    Admin Console
                  </button>
                )}

                <button 
                  id="header-logout-btn"
                  onClick={handleLogout} 
                  title="Logout student account" 
                  className="p-2 border border-slate-800 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-all"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <button 
                id="header-login-trigger"
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-xs font-bold text-white uppercase tracking-wider rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all font-mono shadow-[0_4px_12px_rgba(6,182,212,0.25)] flex items-center gap-1.5"
              >
                <User className="h-3.5 w-3.5" />
                <span>Portal Access</span>
              </button>
            )}

            {/* Hamburger menu trigger */}
            <button 
              id="hamburger-menu-trigger"
              onClick={() => setDrawerOpen(true)}
              className="p-2 border border-slate-800 rounded-lg bg-slate-900 text-slate-300 hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hamburger Drawer Overlay */}
      {drawerOpen && (
        <div id="drawer-background-overlay" className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm transition-opacity duration-300">
          <div id="drawer-body" className="w-full max-w-md bg-slate-950 border-l border-slate-800 p-6 shadow-2xl overflow-y-auto flex flex-col justify-between h-full relative">
            
            <div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-cyan-600 flex items-center justify-center font-mono font-bold text-white text-base">∪</div>
                  <span className="font-mono font-bold text-white uppercase text-sm tracking-widest">DSU Directory</span>
                </div>
                <button 
                  id="close-drawer-btn"
                  onClick={() => setDrawerOpen(false)} 
                  className="p-1 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Hamburger Nav Links */}
              <div className="space-y-4 mb-8">
                <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">About Disjoint Set Union</p>
                <div className="text-xs text-slate-300 space-y-2 leading-relaxed bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/55">
                  <p>
                    <strong>DSU (Disjoint Set Union)</strong> is the premium coding ecosystem of MMMUT. We are a family of algorithmic trainers, full-stack builders, and open source coders aiming to raise the coding culture index of MMMUT students in top tier developer fields.
                  </p>
                  <button 
                    onClick={() => { setShowAboutGallery(!showAboutGallery); }} 
                    className="mt-2 text-[11px] font-bold text-cyan-400 uppercase font-mono tracking-wider flex items-center gap-1 group"
                  >
                    <span>{showAboutGallery ? "Hide Campus Gallery" : "View Photo Gallery & Achievements"}</span>
                    <ChevronDown className={`h-3 w-3 transition-transform ${showAboutGallery ? "rotate-180" : ""}`} />
                  </button>

                  {showAboutGallery && (
                    <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                      <div className="rounded-lg overflow-hidden bg-slate-950 p-1.5 border border-slate-800">
                        <span className="block text-[9.5px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">CodeSpree v3</span>
                        <span className="text-[9px] text-slate-400">180+ freshers coded live in IT lecture halls</span>
                      </div>
                      <div className="rounded-lg overflow-hidden bg-slate-950 p-1.5 border border-slate-800">
                        <span className="block text-[9.5px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">Smart India Hackathon</span>
                        <span className="text-[9px] text-slate-400">Runners Up award in deep learning automation</span>
                      </div>
                      <div className="rounded-lg overflow-hidden bg-slate-950 p-1.5 border border-slate-800">
                        <span className="block text-[9.5px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">GSoC Placements</span>
                        <span className="text-[9px] text-slate-400">3 students accepted under Linux Foundations</span>
                      </div>
                      <div className="rounded-lg overflow-hidden bg-slate-950 p-1.5 border border-slate-800">
                        <span className="block text-[9.5px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">HackerRank Spree</span>
                        <span className="text-[9px] text-slate-400">Collaborations across state engineering modules</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Event Calendars & Workshops Info */}
                <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pt-2">Society Events Calendar</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2.5 bg-slate-900 border border-slate-800/80 rounded-lg">
                    <div>
                      <span className="block font-bold text-xs text-white leading-none">Coding Contests</span>
                      <span className="text-[10px] text-slate-500">Every alternate Saturday at 8 PM</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 bg-cyan-950 border border-cyan-800 rounded text-cyan-400 font-mono">LIVE ON CODECHEF</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-slate-900 border border-slate-800/80 rounded-lg">
                    <div>
                      <span className="block font-bold text-xs text-white leading-none">Weekly DSA Masterclasses</span>
                      <span className="text-[10px] text-slate-500">Sunday morning 10 AM, CS Seminars</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 bg-indigo-950 border border-indigo-800 rounded text-indigo-400 font-mono">HYBRID</span>
                  </div>
                </div>

                {/* Social community channels block */}
                <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pt-2">Join MMMUT Discussion Hubs</p>
                <div className="grid grid-cols-2 gap-2">
                  <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-indigo-950/20 hover:bg-indigo-950/40 border border-indigo-900/50 rounded-lg text-center font-semibold text-xs text-indigo-300 block">
                    💬 Discord Server
                  </a>
                  <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-sky-950/20 hover:bg-sky-950/40 border border-sky-900/50 rounded-lg text-center font-semibold text-xs text-sky-300 block">
                    ✈️ Telegram Channel
                  </a>
                  <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-900/50 rounded-lg text-center font-semibold text-xs text-emerald-300 block col-span-2">
                    💚 Active WhatsApp Freshers QA Group
                  </a>
                </div>

                {/* Notes Pad module */}
                <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pt-4">Your Smart Notes Pad (Local persists)</p>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <span className="block text-[11px] text-slate-400">Write down quick pointers from Striver lectures or CP problems. Notes persist under your profile on our servers!</span>
                  
                  {notesMessage && (
                    <span className="block text-[10px] font-semibold text-cyan-400">{notesMessage}</span>
                  )}

                  {authToken ? (
                    <>
                      <input 
                        type="text" 
                        placeholder="Log Topic (e.g., Dijkstra Min-Heap trick)" 
                        value={noteTitleInput}
                        onChange={e => setNoteTitleInput(e.target.value)}
                        className="w-full bg-slate-950 rounded border border-slate-800 px-2 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                      <textarea 
                        placeholder="Write dynamic explanations or code snippets..." 
                        rows={3}
                        value={noteContentInput}
                        onChange={e => setNoteContentInput(e.target.value)}
                        className="w-full bg-slate-950 rounded border border-slate-800 px-2 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none font-mono"
                      ></textarea>
                      <button 
                        onClick={savePersonalNote}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-3 py-1.5 rounded text-[11px] uppercase tracking-wider font-mono transition-colors"
                      >
                        Keep Log Note
                      </button>

                      {userNotes.length > 0 && (
                        <div className="pt-2 border-t border-slate-800 space-y-2">
                          <span className="block text-[9.5px] font-mono uppercase text-slate-500 font-bold">Saved Logs ({userNotes.length})</span>
                          <div className="max-h-24 overflow-y-auto space-y-1">
                            {userNotes.map((note) => (
                              <button 
                                key={note.id}
                                onClick={() => {
                                  setSelectedNoteId(note.id);
                                  setNoteTitleInput(note.title);
                                  setNoteContentInput(note.content);
                                }}
                                className="w-full text-left p-1 bg-slate-950 hover:bg-slate-850 rounded text-[10.5px] text-slate-300 border border-slate-850 block truncate"
                              >
                                📝 {note.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-3 bg-slate-950 rounded text-center border border-slate-800/80">
                      <span className="block text-[11px] text-slate-500 mb-2">Login to configure personalized society notes</span>
                      <button 
                        onClick={() => { setDrawerOpen(false); setShowAuthModal(true); }}
                        className="text-[10px] text-cyan-400 underline font-mono"
                      >
                        Portal Sync Login
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

            <div className="pt-4 border-t border-slate-900 text-center">
              <span className="block text-[9px] text-slate-500">MMMUT DSU Technical Union © 2026. Keep compiling!</span>
            </div>
            
          </div>
        </div>
      )}

      {/* Main Content Pane */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        
        {/* OVERVIEW (HOME) ACTIVE TAB */}
        {activeTab === "home" && (
          <div id="home-view" className="space-y-10 animate-fade-in">
            
            {/* HERO HERO SECTION */}
            <section id="hero-banner" className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              {/* Visual accents */}
              <div className="absolute top-0 right-0 h-full w-1/3 bg-radial-gradient from-cyan-500/10 to-transparent blur-2xl pointer-events-none"></div>
              <div className="absolute bottom-[-100px] left-[-100px] h-[300px] w-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

              <div className="max-w-3xl space-y-6 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 text-[11px] font-bold font-mono uppercase tracking-widest animate-pulse">
                  🚀 DISJOINT SET UNION • DSU
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                  Empowering MMMUT <br className="hidden sm:inline" />
                  Students in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 font-mono">Coding</span> & Innovation
                </h1>

                <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
                  Disjoint Set Union (DSU) is the elite interactive technical community of Madan Mohan Malaviya University of Technology. We provide freshers and seniors with optimized algorithmic roadmaps, curated problem-solving sheets, peer mentoring, and GSoC alignment.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-4">
                  <button 
                    onClick={() => setActiveTab("dsa")} 
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-xs font-bold font-mono text-white text-center hover:from-cyan-500 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Start Learning DSA</span>
                    <ChevronRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button 
                    onClick={() => setActiveTab("cp")} 
                    className="px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-850 text-xs font-bold font-mono text-slate-300 hover:text-white text-center border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Explore CP Roadster</span>
                  </button>
                </div>
              </div>

              {/* Subtle animated particles mockup right floating */}
              <div className="absolute right-8 bottom-8 hidden lg:flex flex-col p-4 bg-slate-950/80 border border-slate-800/60 rounded-2xl w-72 backdrop-blur shadow-2xl font-mono">
                <div className="flex items-center gap-2 pb-2 border-b border-indigo-950 text-[10.5px] font-bold text-cyan-400 uppercase tracking-widest">
                  <Terminal className="h-4 w-4" />
                  <span>DSU_UNION.CPP</span>
                </div>
                <div className="text-[10px] text-slate-400 leading-relaxed mt-2.5 space-y-1">
                  <p className="text-slate-500">// Amortized complexity O(α(N))</p>
                  <p><span className="text-indigo-400">int</span> findParent(<span className="text-indigo-400">int</span> i) &#123;</p>
                  <p className="pl-4">if (parent[i] == i)</p>
                  <p className="pl-8 text-cyan-400">return i;</p>
                  <p className="pl-4">return <span className="text-blue-400">parent[i]</span> = findParent(parent[i]);</p>
                  <p>&#125;</p>
                </div>
              </div>
            </section>

            {/* BENTO DASHBOARD WIDGETS CARDS GRID */}
            <section id="bento-dashboard-grid" className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Sparkles className="h-5.5 w-5.5 text-cyan-400" />
                    <span>Technical Specialty Ecosystem</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Select any specialized track widget below to lock onto target learnings</p>
                </div>
                
                {/* Solved stats summary banner */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-4 text-xs">
                  <div className="text-center">
                    <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider">Your Progress</span>
                    <span className="font-bold text-cyan-400 font-mono text-sm">{solvedProblemIds.length} / {dsaProblems.length} solved</span>
                  </div>
                  <div className="h-8 w-px bg-slate-800"></div>
                  <div className="text-center">
                    <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider">CP Rank</span>
                    <span className="font-bold text-indigo-400 font-mono text-sm">
                      {currentUser ? `${userPoints} PTS` : "🔒 Enroll"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. CP */}
                <button 
                  onClick={() => setActiveTab("cp")}
                  className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-500/40 text-left transition-all hover:scale-[1.02] shadow-xl group block relative overflow-hidden focus:outline-none"
                >
                  <div className="absolute top-0 right-0 h-20 w-20 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none"></div>
                  <div className="h-11 w-11 rounded-lg bg-cyan-950/70 border border-cyan-800/40 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <h3 className="text-md font-bold text-white group-hover:text-cyan-400 transition-colors">Competitive Programming</h3>
                  <p className="text-[11.5px] text-slate-400 mt-2 leading-relaxed">CF & CodeChef guides, Rating calculators, AtCoder updates, and CSES graph sheets.</p>
                  <p className="text-[11px] font-mono text-cyan-500 hover:underline mt-4 flex items-center gap-1">
                    <span>Explore Roadmaps</span>
                    <ChevronRight className="h-3 w-3" />
                  </p>
                </button>

                {/* 2. DSA */}
                <button 
                  onClick={() => setActiveTab("dsa")}
                  className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-blue-500/40 text-left transition-all hover:scale-[1.02] shadow-xl group block relative overflow-hidden focus:outline-none"
                >
                  <div className="absolute top-0 right-0 h-20 w-20 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all pointer-events-none"></div>
                  <div className="h-11 w-11 rounded-lg bg-blue-950/70 border border-blue-800/40 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-md font-bold text-white group-hover:text-blue-400 transition-colors">Data Structures (DSA)</h3>
                  <p className="text-[11.5px] text-slate-400 mt-2 leading-relaxed">Arrays to Advanced Graphs, Striver A2Z sheets, and step-by-step youtube guide solutions.</p>
                  <p className="text-[11px] font-mono text-blue-400 hover:underline mt-4 flex items-center gap-1">
                    <span>Track Striver Companion</span>
                    <ChevronRight className="h-3 w-3" />
                  </p>
                </button>

                {/* 3. Web Dev */}
                <button 
                  onClick={() => setActiveTab("webdev")}
                  className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-indigo-500/40 text-left transition-all hover:scale-[1.02] shadow-xl group block relative overflow-hidden focus:outline-none"
                >
                  <div className="absolute top-0 right-0 h-20 w-20 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none"></div>
                  <div className="h-11 w-11 rounded-lg bg-indigo-950/70 border border-indigo-800/40 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="text-md font-bold text-white group-hover:text-indigo-400 transition-colors">Web Development</h3>
                  <p className="text-[11.5px] text-slate-400 mt-2 leading-relaxed">Full MERN Stack, React 19 interactive features, state routing, and Express APIs tutorials.</p>
                  <p className="text-[11px] font-mono text-indigo-400 hover:underline mt-4 flex items-center gap-1">
                    <span>Build Portfolio Projects</span>
                    <ChevronRight className="h-3 w-3" />
                  </p>
                </button>

                {/* 4. AI/ML */}
                <button 
                  onClick={() => setActiveTab("aiml")}
                  className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/40 text-left transition-all hover:scale-[1.02] shadow-xl group block relative overflow-hidden focus:outline-none"
                >
                  <div className="absolute top-0 right-0 h-20 w-20 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none"></div>
                  <div className="h-11 w-11 rounded-lg bg-emerald-955/70 border border-emerald-800/40 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                    <Brain className="h-5 w-5" />
                  </div>
                  <h3 className="text-md font-bold text-white group-hover:text-emerald-400 transition-colors">AI & Machine Learning</h3>
                  <p className="text-[11.5px] text-slate-400 mt-2 leading-relaxed">NumPy data matrixing, Neural tuning pipelines, deep architectures, and Kaggle goals.</p>
                  <p className="text-[11px] font-mono text-emerald-400 hover:underline mt-4 flex items-center gap-1">
                    <span>Train Models</span>
                    <ChevronRight className="h-3 w-3" />
                  </p>
                </button>

              </div>
            </section>

            {/* LEADERBOARD & THE ANNOUNCEMENT COLUMNS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              
              {/* Leaderboard Section (Left 5 Columns) */}
              <section id="leaderboard-panel" className="lg:col-span-5 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-indigo-950">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500 animate-bounce" />
                    <div>
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider font-mono">DSU MMMUT Leaderboard</h3>
                      <span className="text-[10px] text-slate-400">Top coding scores based on sheet completion</span>
                    </div>
                  </div>
                  <button 
                    onClick={fetchLeaderboard} 
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    title="Refresh ranking"
                  >
                    🔄
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {leaderboard.length === 0 ? (
                    <div className="space-y-2">
                      <div className="h-10 w-full bg-slate-900/80 rounded animate-pulse"></div>
                      <div className="h-10 w-full bg-slate-900/80 rounded animate-pulse"></div>
                      <div className="h-10 w-full bg-slate-900/80 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    leaderboard.slice(0, 10).map((student, idx) => {
                      const isCurrentUser = currentUser?.email === student.id || student.id === currentUser?.id;
                      return (
                        <div 
                          key={student.id}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isCurrentUser ? "bg-cyan-950/20 border-cyan-500/50" : "bg-slate-950/50 border-slate-850 hover:bg-slate-900"}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`h-6 w-6 rounded-full font-mono font-bold text-xs flex items-center justify-center ${idx === 0 ? "bg-amber-500 text-black shadow" : idx === 1 ? "bg-slate-300 text-black shadow" : idx === 2 ? "bg-amber-700 text-white" : "bg-slate-900 font-mono text-slate-400"}`}>
                              {idx + 1}
                            </span>
                            <div>
                              <span className="block font-bold text-xs text-white">
                                {student.name} {isCurrentUser && <span className="text-[9px] text-cyan-400 font-mono italic">(You)</span>}
                              </span>
                              <span className="block text-[8.5px] text-slate-500 font-mono uppercase truncate max-w-28">{student.branch}</span>
                            </div>
                          </div>

                          <div className="text-right flex items-center gap-3">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-300 font-mono">{student.solvedCount} Solved</span>
                              <span className="text-[9px] text-slate-400 font-mono">{student.rollNumber}</span>
                            </div>
                            <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 bg-cyan-950/40 border border-cyan-800/40 rounded-lg">
                              {student.points}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Info disclaimer */}
                <div className="mt-4 pt-3.5 border-t border-slate-850 flex items-center gap-2 text-[10.5px] text-slate-400">
                  <Award className="h-4 w-4 text-cyan-500 flex-shrink-0" />
                  <span>How to rank up? Every DSA & CP problem solved awards <strong className="text-cyan-400 font-mono">+25 PTS</strong> instantly.</span>
                </div>
              </section>

              {/* Announcements Section (Right 7 Columns) */}
              <section id="announcements-panel" className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-indigo-950">
                  <div>
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider font-mono">Dynamic Live Announcements</h3>
                    <p className="text-[10px] text-slate-400">Live notifications and events dispatched by DSU admins</p>
                  </div>
                  {currentUser?.role === 'admin' && (
                    <button 
                      onClick={() => setIsAdminPanelOpen(true)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 underline font-mono flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Post Notification</span>
                    </button>
                  )}
                </div>

                {/* Announcement Stack */}
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                  {announcements.length === 0 ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-900 animate-pulse rounded-xl h-24"></div>
                      <div className="p-4 bg-slate-900 animate-pulse rounded-xl h-24"></div>
                    </div>
                  ) : (
                    announcements.map((ann) => (
                      <div key={ann.id} className="p-4.5 bg-slate-950/60 rounded-xl border border-slate-850 relative group hover:border-slate-800 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-widest ${ann.category === 'contest' ? "bg-red-950 text-red-400 border border-red-900/60" : ann.category === 'workshop' ? "bg-indigo-950 text-indigo-400 border border-indigo-900/60" : ann.category === 'achievement' ? "bg-amber-950 text-amber-400 border border-amber-900/60" : "bg-slate-900 text-slate-400 border border-slate-800"}`}>
                            {ann.category}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{ann.date}</span>
                        </div>
                        <h4 className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors leading-tight">{ann.title}</h4>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed whitespace-pre-line">{ann.content}</p>
                        
                        <div className="mt-3 pt-2.5 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                          <span>Dispatch: {ann.author}</span>
                          <span className="text-cyan-600">★ DSU Official Feed</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

            </div>

            {/* UPCOMING CODING CONTEST QUICK CHECKLIST CALENDAR */}
            <section id="contest-calendar-banner" className="bg-slate-900/30 rounded-2xl p-6 border border-slate-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-cyan-400" />
                    <span>Real-Time CodeForces & CodeChef Calendars</span>
                  </h3>
                  <p className="text-xs text-slate-400">Stay competitive by tracking live and upcoming coding rounds!</p>
                </div>
                <div className="font-mono text-[10.5px] text-slate-500 px-2.5 py-1 bg-slate-950/50 rounded-lg">
                  REFRESHES REALTIME
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {contests.map((c) => (
                  <div key={c.id} className="p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-xl space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-[9px] font-mono leading-none font-bold uppercase tracking-wider mb-2">
                        <span className={`${c.platform === "Codeforces" ? "text-red-400" : c.platform === "CodeChef" ? "text-amber-500" : c.platform === "LeetCode" ? "text-amber-600" : "text-emerald-400"}`}>
                          {c.platform}
                        </span>
                        <span className="text-slate-500 font-medium">Duration: {c.duration}</span>
                      </div>
                      <h4 className="font-bold text-xs text-white line-clamp-2 leading-tight">{c.title}</h4>
                    </div>

                    <div className="pt-2 border-t border-slate-900/60 flex items-center justify-between gap-1.5 font-mono">
                      <div className="text-[10px] text-slate-400">
                        {new Date(c.startTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <a 
                        href={c.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1 px-2.5 bg-cyan-950/40 border border-cyan-800 hover:bg-cyan-900 font-bold text-[9px] text-cyan-300 rounded block transition-all uppercase"
                      >
                        Enter Round
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* COMPETITIVE PROGRAMMING TAB */}
        {activeTab === "cp" && (
          <div id="cp-roadmap-panel" className="space-y-8 animate-fade-in text-left">
            
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6 border-b border-slate-800/80 pb-6 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/25 bg-red-950/20 text-red-400 text-[10px] font-bold font-mono uppercase mb-3">
                  🔥 {cpRoadmap.badge}
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{cpRoadmap.title}</h1>
                <p className="text-sm text-slate-400 max-w-2xl">{cpRoadmap.subtitle}</p>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
                <span className="block font-sans text-slate-400 uppercase text-[9.5px] font-bold tracking-wider mb-2">Target Rating Track</span>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="block font-bold text-red-400 font-mono text-base">&gt; 1600+</span>
                    <span className="text-[10px] text-slate-500">Expert / Candidate Master</span>
                  </div>
                  <div className="h-8 w-px bg-slate-800"></div>
                  <div>
                    <span className="block font-bold text-slate-400 text-xs uppercase leading-none">{cpRoadmap.audience}</span>
                    <span className="text-[10px] text-slate-500">{cpRoadmap.timeline}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CP Mock score/rating predictor tool */}
            <div className="p-6 bg-gradient-to-r from-red-950/20 via-slate-900 to-slate-950 border border-red-500/10 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="h-5 w-5 text-red-400" />
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">CP Level Evaluator Tool</h3>
              </div>
              <p className="text-xs text-slate-400 max-w-xl mb-4">Provide your approximate solve counts on virtual contests to predict your upcoming Div.3 performance & codeforces rating milestones.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                  <span className="block font-bold text-slate-400 mb-1">A & B solve speed:</span>
                  <span className="text-cyan-400">⚡ Highly rapid STL lookup</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                  <span className="block font-bold text-slate-400 mb-1">C & D mathematical loop:</span>
                  <span className="text-indigo-400">⚙️ Requires Segment trees</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                  <span className="block font-bold text-slate-400 mb-1">E & F Graph optimization:</span>
                  <span className="text-emerald-400">🔋 Disjoint Set Union amortized</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white uppercase font-mono tracking-wider">Step-By-Step Practice Roadster</h3>
              <div className="grid grid-cols-1 gap-6">
                {cpRoadmap.steps.map((step, idx) => (
                  <div key={idx} className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl relative">
                    <div className="absolute top-6 right-6 font-mono font-bold text-4xl text-slate-800/50">
                      0{idx + 1}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-red-950 border border-red-900 text-red-400 rounded">
                          {step.duration}
                        </span>
                        <h4 className="text-base font-bold text-white leading-none">{step.title}</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
                        <div className="md:col-span-4">
                          <span className="block font-mono font-bold text-[10.5px] text-slate-500 uppercase tracking-wider mb-1.5">Topics & Templates</span>
                          <ul className="space-y-1">
                            {step.topics.map((t, i) => (
                              <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="md:col-span-4">
                          <span className="block font-mono font-bold text-[10.5px] text-slate-500 uppercase tracking-wider mb-1.5">Lectures & Guides</span>
                          <ul className="space-y-1">
                            {step.resources.map((r, i) => (
                              <li key={i} className="text-xs text-slate-400 flex items-center gap-1">
                                📚 {r}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="md:col-span-4">
                          <span className="block font-mono font-bold text-[10.5px] text-slate-500 uppercase tracking-wider mb-1.5">Recommended Gyms</span>
                          <ul className="space-y-1">
                            {step.platforms.map((p, i) => (
                              <li key={i} className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                                💻 {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 bg-slate-950/70 p-3 rounded-lg border-l-2 border-red-500/50 italic leading-relaxed mt-2">
                        💡 <strong>Lead CP Mentors Hint:</strong> {step.tips}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-900 flex flex-wrap gap-4 justify-between items-center text-xs">
              <span className="text-slate-500 font-mono">ADDITIONAL RESOURCES IN ENGLISH MIRRORS:</span>
              <div className="flex gap-4">
                {cpRoadmap.additionalLinks.map((link, idx) => (
                  <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline font-mono">
                    {link.text} ↗
                  </a>
                ))}
              </div>
            </div>
            
          </div>
        )}

        {/* DSA STRIVER SHEET TAB */}
        {activeTab === "dsa" && (
          <div id="dsa-sheet-panel" className="space-y-8 animate-fade-in text-left">
            
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4 border-b border-slate-800/80 pb-6 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-950/20 text-blue-400 text-[10px] font-bold font-mono uppercase mb-3">
                  🔥 {dsaRoadmap.badge}
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{dsaRoadmap.title}</h1>
                <p className="text-sm text-slate-400 max-w-2xl">{dsaRoadmap.subtitle}</p>
              </div>

              {/* Progress dial indicator */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 text-xs">
                <div className="relative h-14 w-14 flex items-center justify-center bg-slate-950 rounded-full border-2 border-slate-800">
                  <span className="text-xs font-mono font-bold text-cyan-400">{targetGoalPercent}%</span>
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="28" cy="28" r="24" stroke="currentColor" className="text-slate-800" strokeWidth="2.5" fill="none" />
                    <circle cx="28" cy="28" r="24" stroke="currentColor" className="text-cyan-400" strokeWidth="2.5" fill="none" strokeDasharray="150" strokeDashoffset={150 - (150 * targetGoalPercent) / 100} />
                  </svg>
                </div>
                <div>
                  <span className="block font-bold text-white">Striver A2Z Solver</span>
                  <span className="text-[10.5px] text-slate-400">{solvedProblemIds.length} out of {dsaProblems.length} completed</span>
                  <span className="block text-[9.5px] font-mono text-cyan-400">{solvedProblemIds.length * 25} points claimed</span>
                </div>
              </div>
            </div>

            {/* Quick Filter Search for Problems */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 max-w-lg">
              <Search className="h-4 w-4 text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search arrays, stacks, trees, Graphs..."
                value={searchQuery}
                aria-label="Filter problems"
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs text-white focus:outline-none placeholder-slate-500 w-full"
              />
            </div>

            {/* Striver Companion Problems Section */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex justify-between items-center text-xs">
                <span className="font-mono font-bold uppercase text-slate-400">Target DSA Questions list</span>
                <span className="text-[10px] text-slate-500">Check boxes to sync progress with cloud dashboard</span>
              </div>

              <div className="divide-y divide-slate-850">
                {filteredProblems.map((prob) => {
                  const isSolved = solvedProblemIds.includes(prob.id);
                  return (
                    <div 
                      key={prob.id}
                      className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${isSolved ? "bg-cyan-950/10" : "hover:bg-slate-900/40"}`}
                    >
                      <div className="flex items-start gap-3.5">
                        
                        {/* Custom robust Checkbox button */}
                        <button 
                          onClick={() => toggleProblemCompleted(prob.id, isSolved)}
                          className="mt-0.5 p-1 rounded-md border text-slate-400 hover:text-white transition-all flex item-center justify-center bg-slate-950"
                          style={{ borderColor: isSolved ? "rgb(6,182,212)" : "rgb(51,65,85)" }}
                          title={isSolved ? "Uncheck to subtract scores" : "Check as solved!"}
                        >
                          {isSolved ? (
                            <Check className="h-4 w-4 text-cyan-400 block" />
                          ) : (
                            <div className="h-4 w-4 block"></div>
                          )}
                        </button>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded leading-none ${prob.difficulty === 'Easy' ? "bg-emerald-950 text-emerald-400 border border-emerald-900" : prob.difficulty === 'Medium' ? "bg-yellow-950 text-yellow-400 border border-yellow-900" : "bg-rose-950 text-rose-400 border border-rose-900"}`}>
                              {prob.difficulty}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500">{prob.category}</span>
                          </div>
                          <h4 className="font-bold text-xs sm:text-sm text-white">{prob.title}</h4>
                        </div>
                      </div>

                      {/* Video Embed Play buttons & coding platforms link */}
                      <div className="flex items-center gap-3">
                        {prob.youtubeId && (
                          <button 
                            onClick={() => setActiveYoutubeUrl(prob.youtubeId || null)}
                            className="p-1 px-3 border border-red-500/20 bg-red-950/20 hover:bg-red-950/40 text-red-400 text-[10.5px] font-bold font-mono rounded flex items-center gap-1.5 transition-colors"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            <span>YouTube</span>
                          </button>
                        )}
                        <a 
                          href={prob.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-1 px-3 border border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-300 text-[10.5px] font-bold font-mono rounded flex items-center gap-1 transform hover:scale-105 transition-all"
                        >
                          <span>Solve</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step summary instructions of dsa roadmap */}
            <div className="space-y-4 pt-10">
              <h3 className="text-lg font-bold text-white uppercase font-mono tracking-wider">Estimated completion roadmap timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dsaRoadmap.steps.map((step, idx) => (
                  <div key={idx} className="p-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-850 rounded-2xl">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">{step.duration} Track</span>
                    <h4 className="font-bold text-sm text-white mt-1 mb-2">{step.title}</h4>
                    <ul className="space-y-1 text-xs text-slate-400">
                      {step.topics.map((t, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-cyan-500">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        )}

        {/* FULL STACK WEB DEV TAB */}
        {activeTab === "webdev" && (
          <div id="web-dev-panel" className="space-y-8 animate-fade-in text-left">
            
            <div className="border-b border-slate-800/80 pb-6 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/25 bg-indigo-950/20 text-indigo-400 text-[10px] font-bold font-mono uppercase mb-3">
                🔥 {webDevRoadmap.badge}
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{webDevRoadmap.title}</h1>
              <p className="text-sm text-slate-400 max-w-2xl">{webDevRoadmap.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {webDevRoadmap.steps.map((step, idx) => (
                <div key={idx} className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-xs font-mono font-bold text-indigo-400 uppercase">{step.duration}</span>
                    <span className="text-xl font-mono text-slate-700 font-bold">0{idx + 1}</span>
                  </div>

                  <h3 className="font-bold text-base text-white">{step.title}</h3>
                  
                  <div className="space-y-2">
                    <span className="block text-[10px] font-mono font-bold uppercase text-slate-500">Core technologies</span>
                    <div className="flex flex-wrap gap-1.5">
                      {step.topics.map((t, i) => (
                        <span key={i} className="text-[10.5px] px-2 py-0.5 bg-slate-950 border border-slate-850 rounded text-slate-300 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 bg-slate-950/50 p-3 rounded border-l border-indigo-500 italic">
                    💡 <strong>Tips:</strong> {step.tips}
                  </p>
                </div>
              ))}
            </div>

            {/* Sandbox guidelines */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 mt-6">
              <h3 className="font-bold text-sm text-white uppercase font-mono tracking-wider mb-2">DSU Web Project Ideas</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">MMMUT Core leads suggest building real-time applications such as peer algorithmic ranking web applications, local proxy server clients, or dashboard widgets to impress FAANG and startup recruiters.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl leading-relaxed">
                  <span className="block font-bold text-cyan-400 mb-1">🚀 Level 1: Society Event Scheduler</span>
                  <span>Connect a responsive NextJS frontend to Express routing to stream YouTube tutorials and live-solve alerts instantly via WebSockets.</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl leading-relaxed">
                  <span className="block font-bold text-indigo-400 mb-1">🎮 Level 2: Real-Time Coding Sandbox</span>
                  <span>Integrate node sandbox runners to evaluate lightweight scripts with sandboxed execution environments, showing dynamic point charts and streaks.</span>
                </div>
              </div>
            </div>
            
          </div>
        )}

        {/* AI/ML PATHWAY TAB */}
        {activeTab === "aiml" && (
          <div id="aiml-panel" className="space-y-8 animate-fade-in text-left">
            
            <div className="border-b border-slate-800/80 pb-6 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-955/20 text-emerald-400 text-[10px] font-bold font-mono uppercase mb-3">
                🔥 {aiMlRoadmap.badge}
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{aiMlRoadmap.title}</h1>
              <p className="text-sm text-slate-400 max-w-2xl">{aiMlRoadmap.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-8 space-y-6">
                <h3 className="font-mono text-sm uppercase text-slate-400 font-bold tracking-wider">Step-by-step intelligence path</h3>
                
                {aiMlRoadmap.steps.map((step, idx) => (
                  <div key={idx} className="p-5 bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-850 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">{step.duration} Intensive masterclass</span>
                      <span className="text-xs text-slate-500 font-mono">Module 0{idx + 1}</span>
                    </div>
                    <h4 className="font-bold text-base text-white">{step.title}</h4>
                    
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {step.topics.map((t, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-950 border border-slate-850 text-slate-300 rounded font-mono">
                          {t}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded border-l-2 border-emerald-500/50 mt-3 leading-relaxed">
                      💡 <strong>Lead ML hint:</strong> {step.tips}
                    </p>
                  </div>
                ))}
              </div>

              {/* Sidebar AI tooling list */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-xs space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-white font-bold uppercase tracking-wider font-mono">
                    <Brain className="h-4.5 w-4.5 text-emerald-400" />
                    <span>AI-Powered society tools</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">We provide custom models built strictly for MMMUT researchers. Try training classical Linear Regression on previous student placement stats datasets!</p>
                  
                  <div className="space-y-2">
                    <span className="block font-bold text-[10px] font-mono uppercase text-slate-500">Kaggle resources</span>
                    <a href="https://kaggle.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 block rounded-xl font-semibold text-center text-slate-300">
                      Explore Kaggle Datasets ↗
                    </a>
                  </div>
                </div>
              </div>

            </div>
            
          </div>
        )}

        {/* PRACTICE SHEETS TAB */}
        {activeTab === "sheets" && (
          <div id="sheets-panel" className="space-y-8 animate-fade-in text-left">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6 mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Practice Sheets Dashboard</h1>
                <p className="text-sm text-slate-400 max-w-2xl">Hand-crafted problem checklists spanning basic linear matrices to advanced non-linear trees targeting high-volume placement metrics.</p>
              </div>

              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
                <Search className="h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Universal sheets search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none placeholder-slate-500 w-36 sm:w-48"
                />
              </div>
            </div>

            {/* Quick stats banner cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 font-mono font-bold">
                  E
                </div>
                <div>
                  <span className="block text-xs font-bold text-white">Beginner Sheet</span>
                  <span className="text-[10.5px] text-slate-500">Arrays, Math logic operations</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-yellow-950 border border-yellow-850 flex items-center justify-center text-yellow-500 font-mono font-bold">
                  M
                </div>
                <div>
                  <span className="block text-xs font-bold text-white">Intermediate Sheet</span>
                  <span className="text-[10.5px] text-slate-500">Stacks, BSTs recursive traversals</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-950 border border-red-900/80 flex items-center justify-center text-red-400 font-mono font-bold">
                  H
                </div>
                <div>
                  <span className="block text-xs font-bold text-white">Expert CP Sheet</span>
                  <span className="text-[10.5px] text-slate-500">Dijkstra Dijkstra, Segment indices,DP tables</span>
                </div>
              </div>
            </div>

            {/* List problems */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 bg-slate-900/60 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-400">PROBLEM SETS ({filteredProblems.length})</span>
              </div>

              <div className="divide-y divide-slate-850">
                {filteredProblems.map(prob => {
                  const isSolved = solvedProblemIds.includes(prob.id);
                  return (
                    <div key={prob.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-slate-900/30">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleProblemCompleted(prob.id, isSolved)}
                          className="p-1 rounded bg-slate-950 border text-slate-400 flex items-center justify-center hover:text-cyan-400"
                          style={{ borderColor: isSolved ? "rgb(6,182,212)" : "rgb(51,65,85)" }}
                        >
                          {isSolved ? (
                            <Check className="h-3.5 w-3.5 text-cyan-400" />
                          ) : (
                            <div className="h-3.5 w-3.5"></div>
                          )}
                        </button>

                        <div>
                          <span className="text-[9.5px] text-slate-500 font-mono block mb-0.5">{prob.category} — {prob.platform}</span>
                          <span className="font-bold text-xs sm:text-sm text-white">{prob.title}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[9.5px] font-mono px-2 py-0.5 rounded ${prob.difficulty === 'Easy' ? "bg-emerald-950 text-emerald-400 border border-emerald-900" : prob.difficulty === 'Medium' ? "bg-yellow-950 text-yellow-400 border border-yellow-900" : "bg-rose-950 text-rose-400 border border-rose-900"}`}>
                          {prob.difficulty}
                        </span>
                        <a href={prob.link} target="_blank" rel="noopener noreferrer" className="p-1 px-3 bg-slate-950 hover:bg-slate-900 text-xs font-mono border border-slate-800 rounded text-slate-300">
                          Solve ↗
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
          </div>
        )}

        {/* STUDENT LIBRARY (RESOURCES CATALOG) TAB */}
        {activeTab === "resources" && (
          <div id="library-panel" className="space-y-8 animate-fade-in text-left">
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800/80 pb-6 mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">MMMUT Student Shared Library</h1>
                <p className="text-sm text-slate-400 max-w-xl">Curated youtube playlists, standard mirror portals, and documentation libraries submitted by MMMUT peers.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search query */}
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white">
                  <Search className="h-4 w-4 text-slate-400 mr-2" />
                  <input 
                    type="text" 
                    placeholder="Search tags or titles..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none text-xs text-white focus:outline-none placeholder-slate-500 w-36 sm:w-48"
                  />
                </div>

                <button 
                  id="share-resource-btn"
                  onClick={() => setShowAddResource(!showAddResource)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 font-bold text-xs uppercase tracking-wider font-mono rounded-lg text-white transition-all flex items-center gap-1.5 shadow"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Submit Link</span>
                </button>
              </div>
            </div>

            {/* Section tabs for category filtering */}
            <div className="flex gap-2.5 overflow-x-auto pb-1 border-b border-slate-900">
              {["All", "Playlist", "Resource", "PDF", "Template"].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setResourceCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${resourceCategory === cat ? "bg-slate-900 text-cyan-400 border border-cyan-800" : "text-slate-400 hover:text-white"}`}
                >
                  {cat === "All" ? "★ All Materials" : cat}
                </button>
              ))}
            </div>

            {/* Share link panel */}
            {showAddResource && (
              <form onSubmit={handleShareResourceSubmit} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 max-w-2xl">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="font-mono font-bold text-white uppercase text-xs">Share New Learning Source</span>
                  <button type="button" onClick={() => setShowAddResource(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10.5px] font-mono uppercase text-slate-400 mb-1">Source Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., CP-algorithms Segment tree notes" 
                      value={newResTitle}
                      onChange={e => setNewResTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-mono uppercase text-slate-400 mb-1">Learning Category</label>
                    <select 
                      value={newResCategory}
                      onChange={e => setNewResCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option className="bg-slate-900" value="Resource">General Website</option>
                      <option className="bg-slate-900" value="Playlist">YouTube Playlist</option>
                      <option className="bg-slate-900" value="PDF">Offline Hand Written PDF</option>
                      <option className="bg-slate-900" value="Template">GitHub Repo / Template</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10.5px] font-mono uppercase text-slate-400 mb-1">Exact URL / Link Destination</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., https://cp-algorithms.com/" 
                      value={newResLink}
                      onChange={e => setNewResLink(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10.5px] font-mono uppercase text-slate-400 mb-1">Tags (Comma separated)</label>
                    <input 
                      type="text" 
                      placeholder="e.g., DP, Striver, SegmentTree" 
                      value={newResTags}
                      onChange={e => setNewResTags(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddResource(false)} className="px-4 py-2 bg-transparent text-slate-400 hover:text-white font-mono text-xs">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs rounded uppercase">
                    Publish to Catalog
                  </button>
                </div>
              </form>
            )}

            {/* Main catalog layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map(res => (
                <div key={res.id} className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-slate-700/80 transition-all relative group">
                  
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-mono mb-2">
                      <span className="text-cyan-400 px-1.5 py-0.5 bg-cyan-950 border border-cyan-900 rounded inline-block uppercase leading-none">{res.category}</span>
                      <span className="text-slate-500">Credited: {res.author}</span>
                    </div>

                    <h3 className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors leading-tight mb-3">
                      {res.title}
                    </h3>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {res.tags.map((tag, i) => (
                        <span key={i} className="text-[9px] px-1.5 py-0.5 bg-slate-950 text-slate-400 rounded hover:text-white transition-colors">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-900 flex justify-between items-center gap-2">
                    <button 
                      onClick={() => handleResourceLike(res.id)}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-400 transition-colors"
                      title="Like / Upvote learning materials"
                    >
                      <ThumbsUp className="h-3 w-3 fill-current text-slate-500 group-hover:text-cyan-400" />
                      <span>{res.likes} Upvotes</span>
                    </button>

                    <a 
                      href={res.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-white bg-slate-950 hover:bg-slate-900 px-3 py-1.5 border border-slate-800 rounded-lg inline-flex items-center gap-1 font-mono hover:scale-105 transition-transform"
                    >
                      <span>Explore</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                </div>
              ))}
            </div>
            
          </div>
        )}

        {/* TEAM TAB */}
        {activeTab === "team" && (
          <div id="team-view" className="space-y-8 animate-fade-in text-left">
            
            <div className="border-b border-slate-800/80 pb-6 mb-6">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-2">DSU MMMUT Core Board</span>
              <h1 className="text-3xl font-bold tracking-tight text-white">Meet the Algorithmic Guides</h1>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">The brilliant student brains administering coding camps, maintaining sheets, and hosting weekly contest streams.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dsaTeam.map((member, idx) => (
                <div key={idx} className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-850 p-6 rounded-3xl space-y-4 shadow-xl hover:border-slate-800 transition-all text-center">
                  
                  {/* Decorative modern initials avatar */}
                  <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-tr from-cyan-600 via-indigo-600 to-indigo-500 font-mono font-bold text-3xl text-white flex items-center justify-center shadow-lg uppercase">
                    {member.name.split(" ").map(w => w[0]).join("")}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white">{member.name}</h3>
                    <span className="text-xs text-cyan-400 block font-mono">{member.role}</span>
                    <span className="text-[10px] text-slate-500 block font-mono">{member.branch}</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-2.5 rounded xl border border-slate-900 font-medium">
                    🏆 {member.speciality}
                  </p>

                  <div className="pt-2 border-t border-slate-900 flex justify-center gap-3">
                    <a href={member.codeforces} target="_blank" rel="noopener noreferrer" className="p-1 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-xs text-slate-400 hover:text-white font-mono rounded-lg inline-block">
                      codeforces ↗
                    </a>
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-1 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-xs text-slate-400 hover:text-white font-mono rounded-lg inline-block">
                      github ↗
                    </a>
                  </div>

                </div>
              ))}
            </div>

            {/* Direct contact board */}
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl mt-8 max-w-4xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono mb-2">📍 Visit DSU Core Offices</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Have algorithms doubts or looking for GSoC coordination? Join us at the **IT Seminar & Coding Lounge Room 2D1**, MMMUT campus Gorakhpur, everyday between 4:00 PM and 6:00 PM. Keep practicing, keep solving!</p>
            </div>
            
          </div>
        )}

      </main>

      {/* Floating Action Button chatbot assistant */}
      <button 
        id="chatbot-trigger-fab animate-pulse"
        onClick={() => setBotOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-[0_4px_25px_rgba(6,182,212,0.45)] cursor-pointer z-40 transition-transform hover:scale-110 border border-cyan-400/20"
        title="Open DSU Codebot Assistant"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Floating chatbot drawer/panel view */}
      {botOpen && (
        <div id="codebot-panel" className="fixed bottom-24 right-6 w-full max-w-sm sm:max-w-md bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-50 flex flex-col justify-between" style={{ height: "450px" }}>
          
          {/* Header */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800/80 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-cyan-600 flex items-center justify-center font-mono font-bold text-white text-xs">bot</div>
              <div>
                <span className="block text-xs font-bold text-white leading-none">DSU Code-Assistantbot</span>
                <span className="text-[9px] text-cyan-400 font-mono">Running on Gemini 3.5-Flash</span>
              </div>
            </div>
            <button 
              id="close-bot-panel"
              onClick={() => setBotOpen(false)} 
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Conversation screen */}
          <div className="flex-grow p-4 space-y-3.5 overflow-y-auto max-h-[300px] bg-slate-950">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? "justify-end" : "justify-start"}`}>
                <div className={`p-3 max-w-[85%] rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? "bg-cyan-600 text-slate-950 font-semibold" : "bg-slate-900 border border-slate-850 text-slate-200"}`} style={{ whiteSpace: "pre-line" }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {botLoading && (
              <div className="flex justify-start">
                <div className="p-3 bg-slate-900 border border-slate-850 text-slate-400 italic font-mono text-[10px] rounded-2xl animate-pulse">
                  Gemini thinking...
                </div>
              </div>
            )}
          </div>

          {/* Chat input form */}
          <form onSubmit={handleChatSend} className="p-3 bg-slate-900 border-t border-slate-800/80 flex items-center gap-2">
            <input 
              type="text" 
              required
              placeholder="Ask me: What is path compression?" 
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              className="flex-grow bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 placeholder-slate-500"
            />
            <button 
              type="submit" 
              disabled={botLoading}
              className="p-2 rounded-xl bg-cyan-600 text-slate-950 hover:bg-cyan-500 transition-colors cursor-pointer"
            >
              <Send className="h-3.8 w-3.8" />
            </button>
          </form>

        </div>
      )}

      {/* ADMIN ANNOUNCEMENT WRITING PORTAL */}
      {isAdminPanelOpen && (
        <div id="admin-panel-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur p-4">
          <div className="w-full max-w-lg bg-slate-950 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="font-mono font-bold text-indigo-400 uppercase text-xs">DSU Admin Announcement dispatcher</span>
              <button onClick={() => setIsAdminPanelOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAnnouncementSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Notice Headline</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Annual CodeSpree v4.0 is Live!" 
                  value={newAnnTitle}
                  onChange={e => setNewAnnTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Notice Category Type</label>
                <select 
                  value={newAnnCategory} 
                  onChange={e => setNewAnnCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option className="bg-slate-900" value="general">General Notification</option>
                  <option className="bg-slate-900" value="contest">Coding Contest</option>
                  <option className="bg-slate-900" value="workshop">Interactive Workshop</option>
                  <option className="bg-slate-900" value="achievement">Alumni Placement Spotlight</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Content Text (Markdown format supported)</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Provide brief details, instructions, links to registers..." 
                  value={newAnnContent}
                  onChange={e => setNewAnnContent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500 resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsAdminPanelOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded">
                  Dispatch Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* YouTube active Overlay if applicable */}
      {activeYoutubeUrl && (
        <div id="youtube-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden border border-red-500/40 bg-slate-950">
            <button 
              onClick={() => setActiveYoutubeUrl(null)}
              className="absolute top-4 right-4 z-10 p-2 border border-slate-800 rounded-lg bg-slate-950/80 text-slate-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest leading-none shadow"
            >
              ✕ Close Video
            </button>
            <iframe 
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${activeYoutubeUrl}?autoplay=1`}
              title="DSU Algorithmic companion explanation tutorial" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Footer layout */}
      <footer id="dashboard-footer" className="bg-slate-950 border-t border-slate-900 py-10 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs font-mono">
          
          <div className="space-y-2">
            <span className="block font-bold text-sm text-cyan-400 leading-none">DSU MMMUT Union</span>
            <span className="block text-slate-500 leading-normal">Madan Mohan Malaviya University of Technology <br />Gorakhpur, Uttar Pradesh, India - 273010</span>
          </div>

          <div className="space-y-2">
            <span className="block font-bold text-slate-400 uppercase tracking-widest leading-none">Quick Links</span>
            <div className="flex flex-col gap-1.5 text-slate-500">
              <button onClick={() => setActiveTab("cp")} className="text-left hover:text-white">CP Roadmap Portal</button>
              <button onClick={() => setActiveTab("dsa")} className="text-left hover:text-white">Striver DSA sheets companion</button>
              <button onClick={() => setActiveTab("resources")} className="text-left hover:text-white">Peer Materials catalog</button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="block font-bold text-slate-400 uppercase tracking-widest leading-none">Connect</span>
            <span className="block text-slate-500 leading-relaxed">Administered by the final year IT & CSE core boards with help from junior students of DSU society.</span>
          </div>

        </div>
        
        <div className="mt-8 pt-4 border-t border-slate-900 text-center text-[10px] text-slate-600 font-mono">
          © 2026 Disjoint Set Union (DSU) Society MMMUT. All algorithmic computations compiled successfully.
        </div>
      </footer>

      {/* Dynamic Login Modal */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

    </div>
  );
}
