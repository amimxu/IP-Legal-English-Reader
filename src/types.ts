export interface Term {
  id: string;
  eng: string;
  ch: string;
  pos: string; // part of speech, like n., v., adj., etc.
  phonetic: string;
  definition: string;
  example: string;
  exampleCh?: string;
  group: string; // e.g., "1.1 基础术语", "2.3 商标显著性"
  lesson: string; // "Patent" | "Trademark" | "Copyright" | "Trade Secret"
  proTip?: string; // Prative advice
}

export interface SentencePattern {
  id: string;
  pattern: string;
  chPattern: string;
  example: string;
  trans: string;
  usage: string;
  category: string; // "5.1 定义句型" ... etc
}

export interface LegalTemplate {
  id: string;
  title: string;
  group: string; // "6.1 专利申请范文", "6.4 保密协议范文"
  text: string; // Full markdown text
  sections?: { subtitle: string; content: string }[];
}

export interface QuizQuestion {
  id: string;
  type: "choice" | "text" | "match";
  question: string;
  options?: string[];
  answer: string | string[];
  explanation?: string;
  category: string; // "Exercise 1" | "Exercise 2" | "Exercise 3" | "Exercise 4" | "Exercise 5"
}

export interface UserCustomTerm {
  id: string;
  eng: string;
  ch: string;
  pos: string;
  phonetic: string;
  definition: string;
  example: string;
}
