import React, { useState, useEffect } from "react";
import { 
  Search, 
  Award, 
  Volume2, 
  Bookmark, 
  ChevronRight, 
  RefreshCw, 
  FileText, 
  Check, 
  X, 
  HelpCircle, 
  Trophy, 
  GraduationCap, 
  ArrowRight,
  BookmarkCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { termsData as legacyTermsData } from "./data/termsData";
import { phillipsCaseTermsData } from "./data/phillipsCaseTermsData";
import { phillipsCasePatternsData as patternsData } from "./data/phillipsCasePatternsData";
import { phillipsCaseSamplesData as samplesData } from "./data/phillipsCaseSamplesData";
import { litigationEnglishData } from "./data/litigationEnglishData";
import { britishPhonetics } from "./data/britishPhonetics";
import { quizQuestions, matchItems, translationExercises, codeSampleQuiz } from "./data/exercisesData";
import { Term, SentencePattern, QuizQuestion, UserCustomTerm } from "./types";

const termsData = [...phillipsCaseTermsData, ...legacyTermsData];

const displayPhonetic = (term: { eng: string; phonetic: string }) =>
  britishPhonetics[term.eng.toLowerCase()] ?? term.phonetic;

export default function App() {
  // Navigation tabs of the main editorial bar
  const [activeTab, setActiveTab] = useState<"CONCEPT" | "LITIGATION" | "BILINGUAL" | "APPLICATION" | "QUIZ">("CONCEPT");

  // State management for CONCEPT (vocabulary details)
  const [selectedLesson, setSelectedLesson] = useState<string>("Phillips Case"); 
  const [selectedGroup, setSelectedGroup] = useState<string>(() => {
    return termsData.find(t => t.lesson === "Phillips Case")?.group || "";
  });
  const [selectedTerm, setSelectedTerm] = useState<Term>(termsData[0]);
  const [vocabSearch, setVocabSearch] = useState<string>("");
  const [starredOnly, setStarredOnly] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("ip_legal_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // State for spoken term trigger
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // State management for BILINGUAL ANALYSIS
  const [selectedPattern, setSelectedPattern] = useState<SentencePattern>(patternsData[0]);
  const [selectedPatternCategory, setSelectedPatternCategory] = useState<string>("all");
  const [userTranslationAttempt, setUserTranslationAttempt] = useState<string>("");
  const [showPatternAnswer, setShowPatternAnswer] = useState<boolean>(false);

  // State management for APPLICATION (contract click triggers)
  const [activeDocId, setActiveDocId] = useState<string>("ph-full-original");

  // State management for QUIZ
  const [activeQuizSub, setActiveQuizSub] = useState<"BLANKS" | "MATCH" | "COMPREHENSION" | "TRANSLATE">("BLANKS");
  // blanks states
  const [blankAnswers, setBlankAnswers] = useState<Record<string, string>>({});
  const [checkedBlanks, setCheckedBlanks] = useState<boolean>(false);
  const [scoreBlanks, setScoreBlanks] = useState<number>(0);
  // match states
  const [matchSelectedTerm, setMatchSelectedTerm] = useState<string | null>(null);
  const [matchSelectedMean, setMatchSelectedMean] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // Match titles
  const [matchError, setMatchError] = useState<string | null>(null);
  // translation states
  const [translateInputs, setTranslateInputs] = useState<Record<string, string>>({});
  const [showTransAnswers, setShowTransAnswers] = useState<Record<string, boolean>>({});

  // State management for "DAILY TECH BRIEF" booster modal
  const [showDailyBrief, setShowDailyBrief] = useState<boolean>(false);
  const [dailyTerms, setDailyTerms] = useState<Term[]>([]);
  const [flippedBriefIndex, setFlippedBriefIndex] = useState<number | null>(null);

  // Custom User Glossary state
  const [customGlossary, setCustomGlossary] = useState<UserCustomTerm[]>(() => {
    const saved = localStorage.getItem("ip_legal_custom_glossary");
    return saved ? JSON.parse(saved) : [];
  });
  const [newWordEng, setNewWordEng] = useState("");
  const [newWordCh, setNewWordCh] = useState("");
  const [newWordPhonetic, setNewWordPhonetic] = useState("");
  const [newWordDef, setNewWordDef] = useState("");
  const [newWordEx, setNewWordEx] = useState("");
  const [glossaryShowForm, setGlossaryShowForm] = useState(false);

  // Update favorites to localStorage
  const toggleFavorite = (termId: string) => {
    let updated;
    if (favorites.includes(termId)) {
      updated = favorites.filter(id => id !== termId);
    } else {
      updated = [...favorites, termId];
    }
    setFavorites(updated);
    localStorage.setItem("ip_legal_favorites", JSON.stringify(updated));
  };

  // Speaks utilizing SpeechSynthesis API
  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9; // soft, educational speed
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Generate 3 randomized daily booster cards
  const handleOpenDailyBrief = () => {
    const shuffled = [...termsData].sort(() => 0.5 - Math.random());
    setDailyTerms(shuffled.slice(0, 3));
    setFlippedBriefIndex(null);
    setShowDailyBrief(true);
  };

  // Filter dictionary terms
  const filteredTerms = termsData.filter(term => {
    const matchesLesson = term.lesson === selectedLesson;
    const matchesGroup = selectedGroup === "all" || term.group === selectedGroup;
    const matchesSearch = term.eng.toLowerCase().includes(vocabSearch.toLowerCase()) || 
                          term.ch.includes(vocabSearch) || 
                          term.definition.toLowerCase().includes(vocabSearch.toLowerCase());
    const matchesStarred = !starredOnly || favorites.includes(term.id);
    return matchesLesson && matchesGroup && matchesSearch && matchesStarred;
  });

  // Extract unique groups for currently selected Lesson
  const uniqueGroups = Array.from(new Set(termsData.filter(t => t.lesson === selectedLesson).map(t => t.group)));

  // Extract unique categories for sentence patterns
  const uniquePatternCategories = Array.from(new Set(patternsData.map(p => p.category)));

  // Sync selected term if lesson changes and old selection isn't in filter
  useEffect(() => {
    if (filteredTerms.length > 0 && !filteredTerms.some(t => t.id === selectedTerm.id)) {
      setSelectedTerm(filteredTerms[0]);
    }
  }, [selectedLesson, selectedGroup]);

  // Handle addition of custom words
  const handleAddCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWordEng || !newWordCh) return;
    const newTerm: UserCustomTerm = {
      id: "custom-" + Date.now(),
      eng: newWordEng,
      ch: newWordCh,
      pos: "n.",
      phonetic: newWordPhonetic || "/custom/",
      definition: newWordDef || "User defined custom legal term.",
      example: newWordEx || "No example provided."
    };
    const updated = [newTerm, ...customGlossary];
    setCustomGlossary(updated);
    localStorage.setItem("ip_legal_custom_glossary", JSON.stringify(updated));
    setNewWordEng("");
    setNewWordCh("");
    setNewWordPhonetic("");
    setNewWordDef("");
    setNewWordEx("");
    setGlossaryShowForm(false);
  };

  // Delete custom word
  const handleDeleteCustomWord = (id: string) => {
    const updated = customGlossary.filter(w => w.id !== id);
    setCustomGlossary(updated);
    localStorage.setItem("ip_legal_custom_glossary", JSON.stringify(updated));
  };

  // Handle blanks checking
  const checkBlanksAnswers = () => {
    let correctCount = 0;
    quizQuestions.forEach(q => {
      if (blankAnswers[q.id]?.trim() === q.answer) {
        correctCount++;
      }
    });
    setScoreBlanks(correctCount);
    setCheckedBlanks(true);
  };

  const resetBlanks = () => {
    setBlankAnswers({});
    setCheckedBlanks(false);
    setScoreBlanks(0);
  };

  // Handle Drag / Click matching engine
  const handleMatchSelect = (type: "TERM" | "MEAN", val: string) => {
    if (type === "TERM") {
      setMatchSelectedTerm(val);
      if (matchSelectedMean) {
        evaluatePair(val, matchSelectedMean);
      }
    } else {
      setMatchSelectedMean(val);
      if (matchSelectedTerm) {
        evaluatePair(matchSelectedTerm, val);
      }
    }
  };

  const evaluatePair = (termVal: string, meanVal: string) => {
    const itemConfig = matchItems.find(x => x.item === termVal);
    if (itemConfig && itemConfig.match === meanVal) {
      // Correct!
      setMatchedPairs(prev => [...prev, termVal]);
      setMatchSelectedTerm(null);
      setMatchSelectedMean(null);
      setMatchError(null);
    } else {
      // Incorrect match!
      setMatchError(`"${termVal}" does not associate with "${meanVal.split(" ")[1]}"`);
      setTimeout(() => {
        setMatchSelectedTerm(null);
        setMatchSelectedMean(null);
        setMatchError(null);
      }, 1800);
    }
  };

  const resetMatchQuiz = () => {
    setMatchedPairs([]);
    setMatchSelectedTerm(null);
    setMatchSelectedMean(null);
    setMatchError(null);
  };

  // Custom inline keyword checker for Translation
  const countMatchingKeywords = (userInput: string, hints: string[]) => {
    if (!userInput) return 0;
    let count = 0;
    hints.forEach(hint => {
      const parts = hint.split("/");
      const matches = parts.some(p => userInput.toLowerCase().includes(p.trim().toLowerCase()));
      if (matches) count++;
    });
    return count;
  };

  // Highlight contract text with clickable metadata definitions
  const highlightContractText = (textStr: string) => {
    // We will extract some prominent IP English phrases for clicking
    const targetPhrases = [
      "Confidential Information",
      "Trade Secrets",
      "Inventions",
      "Patent",
      "Exclusive License",
      "Running Royalty",
      "Net Sales",
      "Doctrine of Equivalents",
      "Prior Art",
      "Claim",
      "Independent Claim",
      "Prosecution",
      "Invalidity",
      "Injunctive Relief",
      "Likelihood of Confusion",
      "Trademark",
      "Reverse Engineering",
      "Reasonable Measures",
      "Work Made for Hire",
      "First Sale Doctrine",
      "Fair Use",
      "Claim Construction",
      "Summary Judgment",
      "Noninfringement",
      "Specification",
      "Baffles",
      "Means-Plus-Function",
      "Rebuttable Presumption",
      "Prosecution History",
      "Prior Art",
      "Preferred Embodiment",
      "Plain Meaning",
      "Statute of Limitations",
      "Misappropriation",
      "Patent Infringement",
      "Trade Secret Misappropriation",
      "En Banc",
      "Vacated",
      "Remand",
      "Correspondence",
      "The Parties"
    ];

    const phraseMap: Record<string, string> = {};
    targetPhrases.forEach(ph => {
      const found = termsData.find(t => {
        const eng = t.eng.toLowerCase().trim();
        const pld = ph.toLowerCase().trim();
        return eng === pld || 
               eng === pld + "s" || 
               pld === eng + "s" || 
               pld === eng + "es" ||
               pld.startsWith(eng);
      });
      if (found) {
        phraseMap[ph] = found.id;
      } else {
        // Fallbacks for known conceptual pairings
        if (ph === "Confidential Information") {
          const fallback = termsData.find(t => t.eng.toLowerCase().includes("confidential"));
          if (fallback) phraseMap[ph] = fallback.id;
        } else if (ph === "Trade Secrets") {
          const fallback = termsData.find(t => t.eng.toLowerCase().includes("trade secret"));
          if (fallback) phraseMap[ph] = fallback.id;
        } else if (ph === "Inventions") {
          const fallback = termsData.find(t => t.eng.toLowerCase().includes("invention"));
          if (fallback) phraseMap[ph] = fallback.id;
        } else if (ph === "Reasonable Measures") {
          const fallback = termsData.find(t => t.eng.toLowerCase().includes("reasonable"));
          if (fallback) phraseMap[ph] = fallback.id;
        } else {
          phraseMap[ph] = ph.toLowerCase().replace(/\s+/g, '-');
        }
      }
    });

    // Sort key phrases by string length descending to match larger phrase first
    const sortedPhrases = Object.keys(phraseMap).sort((a,b) => b.length - a.length);
    
    const codeBlocks: string[] = [];
    let htmlContent = textStr;

    // Extract code blocks with placeholders
    htmlContent = htmlContent.replace(/```([\s\S]*?)```/g, (match, code) => {
      const index = codeBlocks.length;
      codeBlocks.push(code.trim());
      return `__CODE_BLOCK_${index}__`;
    });
    
    // Replace markdown elements for simplistic view
    htmlContent = htmlContent
      .replace(/^##### (.*?)\r?$/gm, '<h5 class="text-base font-sans text-brand-cyan font-semibold tracking-wide uppercase mt-4 mb-1">$1</h5>')
      .replace(/^#### (.*?)\r?$/gm, '<h4 class="text-xl font-sans text-brand-blue/95 font-semibold mt-5 mb-2">$1</h4>')
      .replace(/^### (.*?)\r?$/gm, '<h3 class="text-2xl font-sans text-brand-blue font-semibold mt-6 mb-2">$1</h3>')
      .replace(/\*\*\"(.*?)\"\*\*/g, '<strong>"$1"</strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/---\n/g, '<hr class="border-t border-gray-200 my-4" />')
      .replace(/\n\n/g, '<p class="mb-4 leading-relaxed text-base"></p>')
      .replace(/- (.*)/g, '<li class="ml-5 list-disc text-base leading-relaxed mb-1.5">$1</li>');

    // Run dynamic matching of keywords with click events
    sortedPhrases.forEach(phrase => {
      const termId = phraseMap[phrase];
      // Regex that matches whole phrase
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
      htmlContent = htmlContent.replace(regex, (match) => `<span class="bg-blue-50/70 text-brand-cyan hover:bg-brand-cyan hover:text-white border-b-2 border-dashed border-brand-cyan transition-all duration-150 cursor-pointer px-1 py-0.5 rounded font-medium" data-term-id="${termId}">${match}</span>`);
    });

    // Restore the code blocks with custom grey styles
    codeBlocks.forEach((code, index) => {
      const placeholder = `__CODE_BLOCK_${index}__`;
      const escapedCode = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      
      const styledBlock = `<pre class="bg-slate-50 border border-slate-200/80 rounded-xl p-4 my-4 font-mono text-sm text-slate-700 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner font-normal">${escapedCode}</pre>`;
      htmlContent = htmlContent.replace(placeholder, styledBlock);
    });

    return htmlContent;
  };

  const handleContractClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const termId = target.getAttribute("data-term-id");
    if (termId) {
      const foundTerm = termsData.find(t => t.id === termId);
      if (foundTerm) {
        setSelectedTerm(foundTerm);
        setSelectedLesson(foundTerm.lesson);
        setSelectedGroup(foundTerm.group);
        setActiveTab("CONCEPT");
      }
    }
  };

  return (
    <div className="legal-reader min-h-screen bg-stone-50/50 flex flex-col antialiased">
      {/* 1. Header (Aesthetic Top Bar from Image) */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-brand-blue text-white font-serif font-bold text-lg rounded-full flex items-center justify-center tracking-tighter" id="logo-branding">
            IP
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest text-brand-blue font-sans uppercase">
              AI Study Companion
            </h1>
            <div className="flex items-center space-x-1 text-[11px] text-gray-400 font-mono">
              <Calendar className="h-3 w-3" />
              <span>2026.05.24</span>
            </div>
          </div>
        </div>

        {/* Navigation Categories resembling the image */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold tracking-wider text-gray-500 uppercase h-full">
          <button 
            onClick={() => setActiveTab("CONCEPT")}
            className={`transition duration-150 relative py-2 ${activeTab === "CONCEPT" ? "text-brand-cyan" : "hover:text-brand-blue"}`}
          >
            核心词汇 (Vocabulary)
            {activeTab === "CONCEPT" && (
              <motion.div layoutId="nav-pill" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-cyan" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("LITIGATION")}
            className={`transition duration-150 relative py-2 ${activeTab === "LITIGATION" ? "text-brand-cyan" : "hover:text-brand-blue"}`}
          >
            法律诉讼英语 (Litigation)
            {activeTab === "LITIGATION" && (
              <motion.div layoutId="nav-pill" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-cyan" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("BILINGUAL")}
            className={`transition duration-150 relative py-2 ${activeTab === "BILINGUAL" ? "text-brand-cyan" : "hover:text-brand-blue"}`}
          >
            基础句型 (Sentence Patterns)
            {activeTab === "BILINGUAL" && (
              <motion.div layoutId="nav-pill" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-cyan" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("APPLICATION")}
            className={`transition duration-150 relative py-2 ${activeTab === "APPLICATION" ? "text-brand-cyan" : "hover:text-brand-blue"}`}
          >
            配套范文 (Sample Essays)
            {activeTab === "APPLICATION" && (
              <motion.div layoutId="nav-pill" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-cyan" />
            )}
          </button>
        </nav>

        {/* Action Button: Daily Tech Brief */}
        <div>
          <button 
            onClick={handleOpenDailyBrief}
            className="bg-black hover:bg-neutral-800 text-white font-sans text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-full flex items-center space-x-2 transition cursor-pointer"
          >
            <Sparkles className="h-3 w-3 text-yellow-400" />
            <span>Daily Tech Brief</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-none mx-auto p-4 md:p-8 flex flex-col">
        
        {/* Active Tab rendering */}
        <AnimatePresence mode="wait">
          {activeTab === "CONCEPT" && (
            <motion.div 
              key="concept"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* Concept sub-navigation panel */}
              <div className="lg:col-span-12 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                {/* Row 1: Primary Category Tabs */}
                <div className="bg-gray-50/50 p-2 sm:p-3 flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-1.5" id="lesson-selectors-row">
                    {["Phillips Case", "Patent", "Trademark", "Copyright", "Trade Secret"].map((les) => (
                      <button
                        key={les}
                        onClick={() => {
                          setSelectedLesson(les);
                          const firstGrp = termsData.find(t => t.lesson === les)?.group || "";
                          setSelectedGroup(firstGrp);
                        }}
                        className={`text-xs font-bold tracking-wide px-3.5 py-2 rounded-xl transition-all duration-150 cursor-pointer ${
                          selectedLesson === les 
                            ? "bg-brand-blue text-white shadow-sm" 
                            : "text-gray-500 hover:bg-gray-100 hover:text-brand-blue"
                        }`}
                      >
                        {les === "Phillips Case" ? "Phillips 判例" :
                         les === "Patent" ? "Patent（专利）" : 
                         les === "Trademark" ? "Trademark（商标）" : 
                         les === "Copyright" ? "Copyright（著作权）" : "Trade Secret（商业秘密）"}
                      </button>
                    ))}
                  </div>
                  <div className="hidden md:block text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase select-none mr-2">
                    IP Legal Bilingual Curriculum
                  </div>
                </div>

                {/* Row 2: Sub-group filters */}
                <div className="p-2 sm:p-3 bg-white flex flex-wrap items-center gap-1.5 border-t border-gray-100" id="sub-group-selectors-row">
                  <span className="text-[10px] font-bold font-mono tracking-wider text-gray-400 uppercase select-none mr-1 pl-1">
                    Groups:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {uniqueGroups.map(grp => (
                      <button
                        key={grp}
                        onClick={() => setSelectedGroup(grp)}
                        className={`text-xs px-2.5 py-1 rounded-lg transition-all duration-150 cursor-pointer ${
                          selectedGroup === grp 
                            ? "bg-brand-blue text-white font-semibold shadow-sm" 
                            : "text-gray-500 hover:bg-gray-50 hover:text-brand-blue"
                        }`}
                      >
                        {grp.replace(/^\d+\.\d+\s+/, '')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* LEFT COLUMN: Deep detailed visual term panel */}
              <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-gray-200/60 shadow-sm relative min-h-[500px] flex flex-col justify-between">
                <div>
                  {/* Small spacing header tag */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <span className="w-1 h-4 bg-brand-cyan rounded" />
                      <span className="text-xs font-bold tracking-widest text-brand-cyan uppercase font-mono">
                        {selectedLesson.toUpperCase()} LAW • VOCABULARY PROFILE
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Favorite star */}
                      <button 
                        onClick={() => toggleFavorite(selectedTerm.id)}
                        className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-yellow-500 transition"
                        title={favorites.includes(selectedTerm.id) ? "Remove Favorite" : "Bookmark Term"}
                      >
                        <Bookmark className={`h-4.5 w-4.5 ${favorites.includes(selectedTerm.id) ? "fill-yellow-400 text-yellow-500" : ""}`} />
                      </button>

                      {/* Speaks aloud button */}
                      <button 
                        onClick={() => speakText(selectedTerm.eng)}
                        className={`p-1.5 hover:bg-gray-50 rounded-lg transition ${isSpeaking ? "text-brand-cyan" : "text-gray-400 hover:text-brand-blue"}`}
                        title="Speak Out"
                      >
                        <Volume2 className="h-4.5 w-4.5 animate-pulse-subtle" />
                      </button>
                    </div>
                  </div>

                  {/* 2. Massive Elegant Title (Playfair Display) */}
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-brand-blue tracking-tight font-bold mb-3">
                    {selectedTerm.eng}
                  </h2>

                  {/* 3. Phonetic and translation row in image */}
                  <div className="text-gray-500 font-sans text-base md:text-lg mb-6 flex items-center space-x-3 flex-wrap gap-y-2">
                    <span className="text-brand-cyan/80 font-mono text-sm font-semibold tracking-normal not-italic px-2.5 py-1 bg-brand-cyan/5 rounded">
                      {selectedTerm.pos}
                    </span>
                    <span className="text-slate-600 font-sans text-base md:text-lg tracking-normal">{displayPhonetic(selectedTerm)}</span>
                    <span className="text-neutral-300">|</span>
                    <span className="font-sans font-bold text-slate-800 text-lg md:text-xl not-italic">{selectedTerm.ch}</span>
                  </div>

                  {/* 4. English description (Definition text with Drop-cap class) */}
                  <div className="text-slate-700 text-base md:text-[18px] leading-relaxed mb-6 font-normal antialiased">
                    <p className="editorial-dropcap text-justify">
                      {selectedTerm.definition}
                    </p>
                    <div className="clear-both" />
                  </div>

                  {/* 5. Chinese translation box */}
                  <div className="mb-6 font-sans">
                    <h4 className="text-base font-bold text-[#1E3A8A] uppercase tracking-wider mb-2">
                      中文释义 / Chinese Translation
                    </h4>
                    <p className="text-base md:text-[17px] text-slate-900 font-semibold leading-relaxed p-4 bg-slate-50 border border-slate-100/80 rounded-xl">
                      <span className="font-bold text-brand-cyan">{selectedTerm.ch} </span>
                      — 该术语在知识产权领域的核心定义为：<strong>{selectedTerm.ch}</strong>。它代表着专属于其持有人的民事或诉讼法律利益，可依法定程序请求排他或执行。
                    </p>
                  </div>

                  {/* 6. Usage with bold highlight */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                        APPLICATION & EXAMPLES
                      </h4>
                      <p className="text-base sm:text-[17px] font-sans text-slate-900 leading-relaxed border-l-3 border-brand-cyan pl-3.5 mb-1.5 font-medium">
                        "{selectedTerm.example}"
                      </p>
                      {selectedTerm.exampleCh && (
                        <p className="text-sm sm:text-[15px] text-slate-600 mt-1 pl-3.5 font-sans font-medium">
                          {selectedTerm.exampleCh}
                        </p>
                      )}
                    </div>

                    {/* Pro tip matching how-to-apply from screenshot */}
                    {selectedTerm.proTip && (
                      <div className="pt-5 border-t border-gray-100">
                        <h4 className="text-base font-bold text-[#1E3A8A] mb-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent inline-block" />
                          <span>如何应用 (Pro Tip)</span>
                        </h4>
                        <p className="text-sm sm:text-[15px] text-stone-700 leading-relaxed pl-1 font-medium font-sans">
                          {selectedTerm.proTip}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-gray-300 font-mono mt-8 text-right">
                  UID: {selectedTerm.id} • STAGE 1 STUDY MATRIX
                </div>
              </div>

              {/* RIGHT COLUMN: Vocabulary Matrix list card (from Image) */}
              <div className="lg:col-span-5 flex flex-col space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col">
                  {/* Vocabulary Matrix Header */}
                  <div className="text-center mb-5 pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-serif font-semibold text-brand-blue">
                      Vocabulary Matrix
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Essential terminology for understanding the current IP cycle.
                    </p>
                  </div>

                  {/* Search and configuration filters */}
                  <div className="mb-4 flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search term or Chinese..." 
                        value={vocabSearch}
                        onChange={(e) => setVocabSearch(e.target.value)}
                        className="w-full text-sm bg-gray-55 border border-gray-200 rounded-xl pl-9.5 pr-3 py-2.5 outline-none focus:border-brand-cyan transition"
                      />
                    </div>

                    <button
                      onClick={() => setStarredOnly(!starredOnly)}
                      className={`px-4 py-2.5 text-sm rounded-xl border transition flex items-center space-x-1.5 font-bold ${
                        starredOnly 
                          ? "bg-yellow-50 text-yellow-600 border-yellow-200" 
                          : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <Bookmark className="h-4 w-4 fill-current" />
                      <span>{starredOnly ? "Starred" : "All"}</span>
                    </button>
                  </div>

                  {/* Term List mapping from Image */}
                  <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                    {filteredTerms.length === 0 ? (
                      <div className="text-center py-8 text-sm text-gray-400">
                        No vocabulary fits this filtration criteria.
                      </div>
                    ) : (
                      filteredTerms.map((term) => {
                        const isSelected = selectedTerm.id === term.id;
                        return (
                          <div
                            key={term.id}
                            onClick={() => setSelectedTerm(term)}
                            className={`p-3.5 rounded-xl border text-left cursor-pointer transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4 ${
                              isSelected
                                ? "bg-blue-50/50 border-brand-cyan shadow-sm"
                                : "bg-white border-gray-150 hover:bg-slate-50/80"
                            }`}
                          >
                            <div className="flex items-center flex-wrap gap-2 sm:gap-4 flex-1 min-w-0">
                              <span className={`font-bold font-sans text-base sm:text-[17px] ${isSelected ? "text-brand-cyan" : "text-[#1E3A8A]"}`}>
                                {term.eng}
                              </span>
                              {favorites.includes(term.id) && (
                                <Bookmark className="h-3.5 w-3.5 fill-current text-yellow-500 shrink-0 inline-block align-middle" />
                              )}
                              <span className="text-sm sm:text-[15px] text-slate-600 font-sans tracking-normal shrink-0">
                                {displayPhonetic(term)}
                              </span>
                            </div>

                            <div className="text-slate-800 text-sm sm:text-[14.5px] font-sans font-semibold shrink-0">
                              <span className="font-bold text-brand-cyan lowercase mr-1.5">
                                {term.pos.toLowerCase()}.
                              </span>
                              <span>{term.ch}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Additional Study Glossary Widget (User Custom Words) */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                    <div className="flex items-center space-x-1.5">
                      <BookmarkCheck className="h-4 w-4 text-brand-cyan" />
                      <h4 className="text-xs font-bold text-brand-blue tracking-wide uppercase">
                        My Custom Glossary ({customGlossary.length})
                      </h4>
                    </div>

                    <button 
                      onClick={() => setGlossaryShowForm(!glossaryShowForm)}
                      className="text-xs text-brand-cyan font-bold hover:underline"
                    >
                      {glossaryShowForm ? "Cancel" : "+ Add Word"}
                    </button>
                  </div>

                  {glossaryShowForm && (
                    <form onSubmit={handleAddCustomWord} className="space-y-2 mb-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          placeholder="English term" 
                          required
                          value={newWordEng} 
                          onChange={(e) => setNewWordEng(e.target.value)}
                          className="px-2 py-1 bg-white border border-gray-200 text-xs rounded outline-none"
                        />
                        <input 
                          type="text" 
                          placeholder="Chinese" 
                          required
                          value={newWordCh} 
                          onChange={(e) => setNewWordCh(e.target.value)}
                          className="px-2 py-1 bg-white border border-gray-200 text-xs rounded outline-none"
                        />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Phonetics, e.g. /pæt.nt/" 
                        value={newWordPhonetic} 
                        onChange={(e) => setNewWordPhonetic(e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-gray-200 text-xs rounded outline-none"
                      />
                      <textarea 
                        placeholder="English definition" 
                        rows={2}
                        value={newWordDef} 
                        onChange={(e) => setNewWordDef(e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-gray-200 text-xs rounded outline-none"
                      />
                      <input 
                        type="text" 
                        placeholder="Usage example sentence" 
                        value={newWordEx} 
                        onChange={(e) => setNewWordEx(e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-gray-200 text-xs rounded outline-none"
                      />
                      <button 
                        type="submit" 
                        className="w-full bg-brand-cyan text-white text-xs font-bold py-1.5 rounded transition"
                      >
                        Submit Gloss Word
                      </button>
                    </form>
                  )}

                  <div className="space-y-2 max-h-[140px] overflow-y-auto">
                    {customGlossary.length === 0 ? (
                      <p className="text-center py-4 text-xs text-gray-400">
                        No custom terms saved. Click Add Word above to record your own legal definitions.
                      </p>
                    ) : (
                      customGlossary.map((word) => (
                        <div key={word.id} className="p-2 border border-gray-150 rounded bg-gray-50/30 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-brand-blue">{word.eng}</span>
                            <span className="text-gray-500 text-sm mx-1">({displayPhonetic(word)})</span>
                            <span className="text-gray-600 block text-[10px] mb-0.5">{word.ch}</span>
                            <p className="text-[10px] text-gray-400 italic font-serif truncate max-w-[200px]" title={word.definition}>
                              {word.definition}
                            </p>
                          </div>
                          <button 
                            onClick={() => handleDeleteCustomWord(word.id)}
                            className="text-gray-300 hover:text-brand-accent transition p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* LITIGATION ENGLISH TAB: procedure-focused legal English */}
          {activeTab === "LITIGATION" && (
            <motion.div
              key="litigation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <section className="bg-white rounded-2xl border border-gray-200/70 shadow-sm p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-gray-100 pb-6 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-1 h-4 bg-brand-cyan rounded" />
                      <span className="text-xs font-bold tracking-widest text-brand-cyan uppercase font-mono">
                        Litigation English from Phillips v. AWH
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-sans font-bold text-brand-blue tracking-tight">
                      法律诉讼英语
                    </h2>
                    <p className="mt-3 text-base md:text-[17px] text-slate-700 max-w-3xl leading-relaxed">
                      这一栏专门训练判决书里的程序表达：起诉、驳回、诉讼时效、简易判决、上诉、维持、撤销、全院复审和发回。它们不是普通词汇，而是读懂美国判例程序史的骨架。
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 px-4 py-3 min-w-[220px]">
                    <p className="text-xs font-mono font-bold tracking-wider text-gray-400 uppercase mb-1">
                      Reading Route
                    </p>
                    <p className="text-base text-brand-blue font-semibold">
                      Facts → District Court → Appeal → En Banc → Disposition
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {litigationEnglishData.map(cluster => (
                    <article
                      key={cluster.id}
                      className="rounded-2xl border border-gray-200/70 bg-white shadow-sm overflow-hidden"
                    >
                      <div className="bg-slate-50 px-5 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-sans font-bold text-brand-blue">
                          {cluster.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 font-sans">
                          {cluster.subtitle}
                        </p>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {cluster.items.map(item => (
                          <div key={item.phrase} className="p-5">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h4 className="text-base font-bold text-brand-blue">
                                {item.phrase}
                              </h4>
                              <span className="shrink-0 text-sm font-semibold text-brand-cyan bg-brand-cyan/10 rounded-full px-2 py-1">
                                {item.translation}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">
                              {item.explanation}
                            </p>
                            <div className="rounded-xl bg-stone-50 border border-stone-100 p-3">
                              <p className="font-sans text-base text-slate-900 leading-relaxed">
                                "{item.example}"
                              </p>
                              <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                                {item.exampleCh}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* BILINGUAL ANALYSIS TAB: Sentence syntax patterns and translations */}
          {activeTab === "BILINGUAL" && (
            <motion.div 
              key="bilingual"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* Left focused pattern */}
              <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-2 border-b border-gray-100 pb-4 mb-6">
                  <span className="w-1 h-4 bg-brand-cyan rounded" />
                  <span className="text-xs font-bold tracking-widest text-brand-cyan uppercase font-mono">
                    SYNTAX STRUCTURE • BILINGUAL ANALYSIS
                  </span>
                </div>

                <div className="mb-6">
                  <span className="text-sm font-mono bg-brand-cyan/10 text-brand-cyan px-3 py-1.5 rounded-full font-bold">
                    {selectedPattern.category}
                  </span>
                </div>

                <h3 className="text-3xl md:text-4xl font-sans font-bold text-brand-blue mb-3 leading-tight">
                  {selectedPattern.pattern}
                </h3>
                <p className="text-lg font-sans text-stone-800 font-semibold mb-6">
                  中文结构模式: {selectedPattern.chPattern}
                </p>

                {/* Explanation rule */}
                <div className="border border-blue-100/60 bg-blue-50/20 p-5 rounded-2xl mb-6 text-base text-stone-800 leading-relaxed font-sans">
                  <span className="font-bold text-sm uppercase text-brand-cyan tracking-wide block mb-1.5">
                    用法指南 / Structural Rule
                  </span>
                  {selectedPattern.usage}
                </div>

                {/* Exact sample draft */}
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Official Drafting Sample (示范句型)
                  </h4>
                  <div className="p-5 bg-slate-50 border-l-4 border-brand-cyan rounded-2xl">
                    <p className="font-sans text-base md:text-lg text-slate-950 leading-relaxed font-medium">
                      "{selectedPattern.example}"
                    </p>
                    <p className="text-sm md:text-base text-stone-700 font-sans mt-2.5">
                      {selectedPattern.trans}
                    </p>
                  </div>
                </div>

                {/* Translation Playground */}
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-brand-blue tracking-wide uppercase flex items-center space-x-1.5 mb-2">
                    <GraduationCap className="h-5 w-5 text-brand-cyan" />
                    <span>Translation Playground</span>
                  </h4>
                  <p className="text-sm text-gray-500 mb-3">
                    Re-write or re-arrange the example or craft your own draft using the structure above:
                  </p>

                  <textarea 
                    value={userTranslationAttempt} 
                    onChange={(e) => {
                      setUserTranslationAttempt(e.target.value);
                      setShowPatternAnswer(false);
                    }}
                    rows={3}
                    placeholder="Enter your english formulation here..."
                    className="w-full p-4 text-base bg-stone-50 border border-gray-200 rounded-xl focus:border-brand-cyan focus:bg-white outline-none transition"
                  />

                  {/* Micro-checking trigger */}
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Keywords included: {selectedPattern.pattern.split(" ").slice(0, 2).join(" ")}
                    </p>

                    <button
                      onClick={() => setShowPatternAnswer(!showPatternAnswer)}
                      className="text-sm font-bold text-brand-cyan hover:underline"
                    >
                      {showPatternAnswer ? "Hide Comparison" : "Compare with Official Standard"}
                    </button>
                  </div>

                  {showPatternAnswer && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-4 bg-brand-cyan/5 rounded-xl border border-brand-cyan/10"
                    >
                      <h5 className="text-sm font-bold text-brand-blue mb-1">Standard Formulation:</h5>
                      <p className="text-base font-sans text-slate-900 leading-relaxed mb-3">
                        "{selectedPattern.example}"
                      </p>
                      
                      <div className="border-t border-brand-cyan/10 pt-2 text-sm text-stone-700 leading-relaxed">
                        <span className="font-bold text-brand-blue">Drafting tip:</span> Pay key attention to punctuation (colons, semicolons) in lists. Semicolons are preferred in IP drafting lists.
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Right lists of patterns */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm">
                <div className="text-center mb-5 pb-4 border-b border-gray-100">
                  <h3 className="text-lg font-sans font-semibold text-brand-blue">
                    Sentence Structure Index
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5 mb-3">
                    Essential grammatical formulations for rigorous writing.
                  </p>

                  <div className="text-left mt-2 border-t border-gray-50 pt-3">
                    <label className="block text-xs font-bold font-mono tracking-wider text-gray-400 uppercase mb-1">
                      Filter Category (句型二级分类):
                    </label>
                    <select
                      value={selectedPatternCategory}
                      onChange={(e) => setSelectedPatternCategory(e.target.value)}
                      className="w-full text-sm p-2 bg-stone-50 border border-gray-200 rounded-lg outline-none text-gray-700 hover:border-brand-cyan focus:border-brand-cyan transition font-sans cursor-pointer"
                    >
                      <option value="all">All Categories (全部句型)</option>
                      {uniquePatternCategories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {patternsData
                    .filter(pat => selectedPatternCategory === "all" || pat.category === selectedPatternCategory)
                    .map((pat) => {
                      const isSelected = selectedPattern.id === pat.id;
                      return (
                      <div
                        key={pat.id}
                        onClick={() => {
                          setSelectedPattern(pat);
                          setUserTranslationAttempt("");
                          setShowPatternAnswer(false);
                        }}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition ${
                          isSelected 
                            ? "bg-slate-50 border-brand-cyan/60" 
                            : "bg-white border-gray-150 hover:bg-stone-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-xs font-mono tracking-wider font-bold px-1.5 py-0.5 rounded ${
                            isSelected ? "bg-brand-cyan/10 text-brand-cyan" : "bg-gray-100 text-gray-400"
                          }`}>
                            {pat.category}
                          </span>
                          <span className="text-gray-300 text-xs font-mono">ID: {pat.id}</span>
                        </div>

                        <h4 className="text-sm font-bold text-brand-blue mb-1">
                          {pat.pattern}
                        </h4>
                        
                        <p className="text-sm text-gray-500 font-sans">
                          意义: {pat.chPattern}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* APPLICATION TAB: Interactive templates list and overlay lookups */}
          {activeTab === "APPLICATION" && (
            <motion.div 
              key="application"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* Left sidebar doc selector */}
              <div className="lg:col-span-3 space-y-2">
                <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">
                    Phillips 全文判例阅读
                  </h4>

                  <div className="space-y-1">
                    {samplesData.map(doc => (
                      <button
                        key={doc.id}
                        onClick={() => {
                          setActiveDocId(doc.id);
                        }}
                        className={`w-full text-left text-sm p-2.5 rounded-lg transition flex items-start space-x-2 ${
                          activeDocId === doc.id
                            ? "bg-brand-blue text-white font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <FileText className="h-4 w-4 shrink-0 mt-0.5 text-brand-cyan" />
                        <span className="line-clamp-3 leading-relaxed">{doc.group}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-stone-50 border border-brand-cyan/10 p-4 rounded-xl">
                  <span className="text-sm font-bold text-brand-cyan uppercase block mb-1">
                    How it works
                  </span>
                  <p className="text-sm text-stone-700 leading-relaxed">
                    Key legal English phrases are marked with <span className="border-b border-dashed border-brand-cyan font-bold">dashed highlights</span>. Click a highlighted phrase to open its entry in the core vocabulary section.
                  </p>
                </div>
              </div>

              {/* Middle core document paper viewer */}
              <div className="lg:col-span-9 bg-white p-6 md:p-10 rounded-2xl border border-gray-200 shadow-md relative min-h-[600px] font-sans">
                {/* Paper header decor spacer */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-cyan rounded-t-2xl" />

                <div className="flex justify-between items-center text-xs text-gray-400 font-mono tracking-widest uppercase mb-6">
                  <span>PHILLIPS CASE STUDY SHEETS</span>
                  <span>IP READER CORE v2.0</span>
                </div>

                {/* Live rendered text content with click-lookup hooks */}
                <div 
                  onClick={handleContractClick}
                  dangerouslySetInnerHTML={{ __html: highlightContractText(samplesData.find(d => d.id === activeDocId)?.text || "") }}
                  className="prose prose-stone max-w-none text-stone-800 text-base md:text-[17px] leading-relaxed"
                />
              </div>
            </motion.div>
          )}

          {/* QUIZ AND PRACTICE TAB: Multi-mode exercise workbook */}
          {activeTab === "QUIZ" && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Quiz Mode Selector Header */}
              <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap gap-2 justify-center md:justify-start">
                <button
                  onClick={() => setActiveQuizSub("BLANKS")}
                  className={`text-xs font-semibold px-4 py-2 rounded-xl transition ${
                    activeQuizSub === "BLANKS" 
                      ? "bg-brand-cyan text-white shadow" 
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Fill-in-the-Blanks (填空选择)
                </button>
                <button
                  onClick={() => setActiveQuizSub("MATCH")}
                  className={`text-xs font-semibold px-4 py-2 rounded-xl transition ${
                    activeQuizSub === "MATCH" 
                      ? "bg-brand-cyan text-white shadow" 
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Vocabulary Association (核心配对)
                </button>
                <button
                  onClick={() => setActiveQuizSub("TRANSLATE")}
                  className={`text-xs font-semibold px-4 py-2 rounded-xl transition ${
                    activeQuizSub === "TRANSLATE" 
                      ? "bg-brand-cyan text-white shadow" 
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Sentence Formulation (句型翻译)
                </button>
                <button
                  onClick={() => setActiveQuizSub("COMPREHENSION")}
                  className={`text-xs font-semibold px-4 py-2 rounded-xl transition ${
                    activeQuizSub === "COMPREHENSION" 
                      ? "bg-brand-cyan text-white shadow" 
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Patent Claim Comprehension (权利要求分析)
                </button>
              </div>

              {/* Sub quiz body blocks */}
              {activeQuizSub === "BLANKS" && (
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-150 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-brand-blue">
                        Legal Term Challenge
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Multiple-choice evaluation of key terms from Lesson 1-4.
                      </p>
                    </div>

                    {checkedBlanks && (
                      <div className="flex items-center space-x-2 bg-brand-cyan/10 px-3.5 py-1.5 rounded-xl font-mono text-xs text-brand-cyan font-bold shadow-inner">
                        <Trophy className="h-4 w-4" />
                        <span>Score: {scoreBlanks} / {quizQuestions.length}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 mb-6">
                    {quizQuestions.map((q, idx) => {
                      const isCorrect = blankAnswers[q.id] === q.answer;
                      return (
                        <div key={q.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/20">
                          <p className="text-sm font-semibold text-brand-blue mb-3">
                            <span className="text-brand-cyan mr-1.5">Q{idx + 1}.</span>
                            {q.question}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {q.options?.map(opt => {
                              const isUsersChoice = blankAnswers[q.id] === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  disabled={checkedBlanks}
                                  onClick={() => setBlankAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                  className={`p-3 text-left text-xs rounded-xl border transition flex items-center justify-between ${
                                    isUsersChoice 
                                      ? "bg-stone-50 border-brand-cyan text-brand-blue font-semibold" 
                                      : "bg-white border-gray-150 hover:bg-stone-50 text-stone-600"
                                  } ${
                                    checkedBlanks && opt === q.answer 
                                      ? "bg-green-50 border-green-500 text-green-700 font-semibold" 
                                      : ""
                                  } ${
                                    checkedBlanks && isUsersChoice && opt !== q.answer 
                                      ? "bg-rose-50 border-rose-400 text-rose-700" 
                                      : ""
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {isUsersChoice && <Check className="h-4 w-4 text-brand-cyan shrink-0 ml-2" />}
                                </button>
                              );
                            })}
                          </div>

                          {checkedBlanks && (
                            <div className="mt-3 bg-white p-3.5 rounded-lg border border-gray-100 text-xs text-stone-700 leading-relaxed">
                              <span className="font-bold text-brand-blue block mb-1">
                                {isCorrect ? "✓ CORRECT" : "✗ INCORRECT"} • 解析 Guide
                              </span>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex space-x-2 pt-4 border-t border-gray-100 justify-end">
                    <button
                      onClick={resetBlanks}
                      className="px-4 py-2 text-xs border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl transition font-semibold"
                    >
                      Reset Quiz
                    </button>
                    {!checkedBlanks && (
                      <button
                        onClick={checkBlanksAnswers}
                        className="bg-brand-cyan text-white text-xs font-semibold px-5 py-2 rounded-xl transition hover:bg-brand-cyan/90 shadow-sm"
                      >
                        Submit & Validate
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeQuizSub === "MATCH" && (
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-150 shadow-sm">
                  <div className="text-center mb-6 max-w-md mx-auto">
                    <h3 className="text-xl font-serif font-bold text-brand-blue">
                      Vocabulary Association Game
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Associate English Legal terminology with its correct Chinese professional mapping. Click an English term, then click its matching translation descriptor.
                    </p>
                  </div>

                  {matchError && (
                    <div className="mb-4 bg-rose-50 text-rose-600 font-semibold text-xs py-2 px-3.5 rounded-xl border border-rose-200 flex items-center justify-center space-x-2 animate-bounce">
                      <X className="h-4 w-4" />
                      <span>{matchError}</span>
                    </div>
                  )}

                  {matchedPairs.length === matchItems.length && (
                    <div className="mb-6 bg-green-50 text-green-700 font-bold text-sm py-4 px-6 rounded-2xl border border-green-200 text-center flex flex-col items-center justify-center space-y-2">
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                      <span>CONGRATULATIONS! Perfect Match Mastery.</span>
                      <button 
                        onClick={resetMatchQuiz}
                        className="text-xs text-brand-cyan underline mt-1"
                      >
                        Play Again
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6 items-start">
                    {/* English words list */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] uppercase font-bold text-gray-450 text-center tracking-wider mb-2">
                        English Terms
                      </h4>
                      {matchItems.map(m => {
                        const isMatched = matchedPairs.includes(m.item);
                        const isSelected = matchSelectedTerm === m.item;
                        return (
                          <button
                            key={m.item}
                            disabled={isMatched}
                            onClick={() => handleMatchSelect("TERM", m.item)}
                            className={`w-full p-2.5 rounded-lg border text-xs text-left transition flex justify-between items-center ${
                              isMatched 
                                ? "bg-green-50 border-green-200 text-green-400 cursor-not-allowed italic line-through" 
                                : isSelected 
                                  ? "bg-brand-blue border-brand-blue text-white font-bold" 
                                  : "bg-white border-gray-150 hover:bg-gray-50 text-stone-700"
                            }`}
                          >
                            <span>{m.item}</span>
                            {isMatched && <Check className="h-3 w-3 text-green-500" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Chinese translation list */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] uppercase font-bold text-gray-450 text-center tracking-wider mb-2">
                        Chinese Translations
                      </h4>
                      {[...matchItems].sort((a,b) => a.match.localeCompare(b.match)).map(m => {
                        const isMatched = matchedPairs.includes(m.item);
                        const isSelected = matchSelectedMean === m.match;
                        return (
                          <button
                            key={m.match}
                            disabled={isMatched}
                            onClick={() => handleMatchSelect("MEAN", m.match)}
                            className={`w-full p-2.5 rounded-lg border text-xs text-left transition ${
                              isMatched 
                                ? "bg-green-50 border-green-200 text-green-300 cursor-not-allowed italic line-through" 
                                : isSelected 
                                  ? "bg-brand-cyan border-brand-cyan text-white font-bold" 
                                  : "bg-white border-gray-150 hover:bg-gray-50 text-stone-700"
                            }`}
                          >
                            <span>{m.match}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeQuizSub === "TRANSLATE" && (
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-150 shadow-sm w-full">
                  <div className="mb-6">
                    <h3 className="text-xl font-serif font-bold text-brand-blue">
                      Sentence Translation Sandbox
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Translate Legal Chinese sentences into English. We evaluate key structural words in real time.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {translationExercises.map((ex, idx) => {
                      const userVal = translateInputs[ex.id] || "";
                      const keywordsFound = countMatchingKeywords(userVal, ex.hint);
                      const keyPct = Math.round((keywordsFound / ex.hint.length) * 100);

                      return (
                        <div key={ex.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/30">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-bold text-brand-blue">
                              Topic {idx + 1}: {ex.chinese}
                            </span>
                            
                            <span className="text-[11px] font-mono text-gray-400">
                              Form Target Score: {keywordsFound} / {ex.hint.length}
                            </span>
                          </div>

                          <textarea
                            value={userVal}
                            onChange={(e) => setTranslateInputs(prev => ({ ...prev, [ex.id]: e.target.value }))}
                            placeholder="Draft your english translation here..."
                            rows={2}
                            className="w-full p-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-brand-cyan transition"
                          />

                          {/* Hints check metrics */}
                          <div className="mt-2 flex flex-wrap gap-1 items-center">
                            <span className="text-[10px] text-gray-400 font-bold tracking-wide mr-1 uppercase">
                              Required terminology markers:
                            </span>

                            {ex.hint.map(h => {
                              const parts = h.split("/");
                              const matched = parts.some(p => userVal.toLowerCase().includes(p.trim().toLowerCase()));
                              return (
                                <span 
                                  key={h}
                                  className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                                    matched 
                                      ? "bg-green-100 text-green-700 border border-green-200 font-semibold" 
                                      : "bg-gray-100 text-gray-400"
                                  }`}
                                >
                                  {h}
                                </span>
                              );
                            })}
                          </div>

                          <div className="mt-4 flex justify-between items-center border-t border-gray-100 pt-2 text-[11px]">
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-400">Completeness:</span>
                              <span className={`font-bold font-mono ${keyPct === 100 ? "text-green-600" : "text-brand-magenta"}`}>
                                {keyPct}%
                              </span>
                            </div>

                            <button 
                              onClick={() => setShowTransAnswers(p => ({ ...p, [ex.id]: !p[ex.id] }))}
                              className="text-xs text-brand-cyan font-semibold hover:underline"
                            >
                              {showTransAnswers[ex.id] ? "Hide standard answer" : "Review standard answer"}
                            </button>
                          </div>

                          {showTransAnswers[ex.id] && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-3 p-3 bg-brand-cyan/5 rounded-lg border border-brand-cyan/10"
                            >
                              <strong className="text-brand-blue text-[11px] block">Standard Legal Draft Options:</strong>
                              <p className="font-sans text-sm text-stone-800 leading-relaxed mt-0.5">
                                "{ex.official}"
                              </p>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeQuizSub === "COMPREHENSION" && (
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-150 shadow-sm w-full">
                  <div className="mb-4">
                    <h3 className="text-xl font-serif font-bold text-brand-blue">
                      Patent Claim Evaluation Reading
                    </h3>
                    <p className="text-xs text-gray-400">
                      Solve the analytical prompts next to the actual legal patent claim draft:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Column code text */}
                    <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl font-mono text-xs leading-relaxed max-h-[400px] overflow-y-auto">
                      <pre className="whitespace-pre-wrap">{codeSampleQuiz.text}</pre>
                    </div>

                    {/* Column interactive questions */}
                    <div className="space-y-4">
                      {codeSampleQuiz.questions.map((item, idx) => (
                        <div key={idx} className="p-3 border border-gray-100 rounded-xl bg-gray-50/20 text-xs">
                          <h4 className="font-semibold text-brand-blue mb-1">
                            {item.q}
                          </h4>
                          
                          <div className="bg-green-50/60 p-3 rounded-lg border border-green-100 mt-2 text-stone-700 leading-normal">
                            <span className="font-bold text-green-800 block text-[10px] uppercase mb-0.5">
                              Model Analytical Guide
                            </span>
                            <div className="font-semibold text-neutral-900 mb-1">
                              {item.a}
                            </div>
                            <div className="text-stone-600 text-[11px] leading-relaxed">
                              {item.exp}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 text-stone-400 py-6 text-center text-xs space-y-2 mt-auto">
        <p className="font-medium text-brand-blue">
          IP Legal English Interactive Learning Engine © 2026. All rights reserved.
        </p>
        <p className="text-[11px] max-w-md mx-auto leading-relaxed">
          The content of this platform is structured to align with legal concepts mapped across Patent, Trademark, Copyright, and Confidential Trade Secrets regimes. Perfect for learning and professional reference.
        </p>
      </footer>

      {/* "DAILY TECH BRIEF" Booster Flip Cards Modal */}
      <AnimatePresence>
        {showDailyBrief && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs" 
              onClick={() => setShowDailyBrief(false)} 
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 z-10"
            >
              <button 
                onClick={() => setShowDailyBrief(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center mb-6">
                <span className="text-[10px] font-bold tracking-widest text-brand-cyan uppercase bg-brand-cyan/5 px-2.5 py-1 rounded-full font-mono">
                  Daily Flash Booster
                </span>
                <h3 className="text-2xl font-serif font-bold text-brand-blue mt-1.5">
                  Daily Vocab Booster
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Revise three randomized essential IP Legal English terms. Click on a card to flip and review.
                </p>
              </div>

              {/* Grid cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {dailyTerms.map((term, idx) => {
                  const isFlipped = flippedBriefIndex === idx;
                  return (
                    <div 
                      key={term.id}
                      onClick={() => setFlippedBriefIndex(isFlipped ? null : idx)}
                      className="cursor-pointer h-[240px] w-full [perspective:1000px]"
                    >
                      <div className={`relative h-full w-full rounded-2xl border transition-all duration-500 shadow-sm [transform-style:preserve-3d] ${
                        isFlipped ? "[transform:rotateY(180deg)] border-brand-cyan/25 bg-slate-50" : "bg-white border-gray-150"
                      }`}>
                        
                        {/* Front of card */}
                        <div className="absolute inset-0 p-5 flex flex-col justify-between [backface-visibility:hidden]">
                          <div>
                            <span className="text-[9px] font-mono font-bold uppercase text-brand-cyan tracking-wider">
                              Term {idx + 1} • {term.lesson}
                            </span>
                            <h4 className="text-lg font-serif font-bold text-brand-blue mt-2 leading-tight">
                              {term.eng}
                            </h4>
                            <p className="text-sm font-sans text-gray-500 mt-1">{displayPhonetic(term)}</p>
                          </div>
                          
                          <div className="text-center flex justify-center mt-4">
                            <span className="text-[10px] font-bold text-gray-300 tracking-wider uppercase border border-gray-100 rounded-md px-1.5 py-0.5 select-none bg-stone-55">
                              Click to Flip
                            </span>
                          </div>
                        </div>

                        {/* Back of card */}
                        <div className="absolute inset-0 p-5 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden]">
                          <div>
                            <span className="text-[9px] font-mono font-bold uppercase text-brand-cyan">
                              CHINESE DEFINITION
                            </span>
                            <h4 className="text-sm font-sans font-bold text-brand-blue mt-2">
                              {term.ch}
                            </h4>
                            <p className="text-[10px] text-stone-600 leading-normal mt-2 line-clamp-4 text-justify">
                              {term.definition}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-[9px] text-gray-400 font-mono italic">
                              {term.id}
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom modal actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 font-mono">
                  Keep refreshing to randomize study decks.
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const shuffled = [...termsData].sort(() => 0.5 - Math.random());
                      setDailyTerms(shuffled.slice(0, 3));
                      setFlippedBriefIndex(null);
                    }}
                    className="flex items-center space-x-1 border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Reshuffle</span>
                  </button>
                  <button
                    onClick={() => setShowDailyBrief(false)}
                    className="bg-brand-blue text-white text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-brand-blue/95 transition"
                  >
                    Got it!
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
