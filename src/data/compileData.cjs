const fs = require('fs');
const path = require('path');

// 1. Load Pre-existing Terms
let oldTerms = [];
try {
  const termsContent = fs.readFileSync(path.join(__dirname, 'termsData.ts'), 'utf8');
  // Strip imports and type annotations to evaluate as standard JS
  const jsContent = termsContent
    .replace(/import\s+.*?;/g, '')
    .replace(/export\s+const\s+termsData\s*:\s*Term\[\]\s*=/g, 'module.exports =')
    .replace(/export\s+const\s+termsData\s*=/g, 'module.exports =');
  
  // Save temporary JS file to load safely
  const tempFile = path.join(__dirname, 'temp_terms.cjs');
  fs.writeFileSync(tempFile, jsContent, 'utf8');
  oldTerms = require(tempFile);
  fs.unlinkSync(tempFile);
  console.log(`Loaded ${oldTerms.length} old terms successfully.`);
} catch (e) {
  console.error("Error loading original termsData.ts:", e);
}

// Map old terms by lowercase english spelling for lookup
const oldTermsMap = new Map();
for (const term of oldTerms) {
  oldTermsMap.set(term.eng.trim().toLowerCase(), term);
}

// 2. Read rawMarkdown.md
const mdPath = path.join(__dirname, 'rawMarkdown.md');
if (!fs.existsSync(mdPath)) {
  console.error("rawMarkdown.md does not exist");
  process.exit(1);
}
const mdContent = fs.readFileSync(mdPath, 'utf8');
const lines = mdContent.split(/\r?\n/);

let currentLesson = "";
let currentGroup = "";
let currentTab = ""; // "terms", "patterns", "templates"

const parsedTerms = [];
const parsedPatterns = [];
const parsedTemplates = [];

let currentTemplate = null;
let templateContentLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // Identify Lesson header for core vocab
  // e.g. ## Lesson 1: Patent（专利）核心词汇详解
  if (line.startsWith('## Lesson ')) {
    const lessonMatch = line.match(/## Lesson \d+:\s*([A-Za-z]+(?:\s+[A-Za-z]+)*)/i);
    if (lessonMatch) {
      currentLesson = lessonMatch[1].trim();
      if (currentLesson === "Patent" || currentLesson === "Trademark" || currentLesson === "Copyright" || currentLesson === "Trade Secret") {
        currentTab = "terms";
      } else if (line.includes("句型")) {
        currentLesson = "Sentence Patterns";
        currentTab = "patterns";
      } else if (line.includes("范文")) {
        currentLesson = "Legal Templates";
        currentTab = "templates";
      }
    }
    continue;
  }

  // Identify subcategory group headers
  // e.g. ### 1.1 基础术语（Basic Terms） or ### 5.1 定义句型（Definition Patterns） or ### 6.1 专利申请范文（Patent Application Sample）
  if (line.startsWith('### ')) {
    const grp = line.replace('###', '').trim();
    currentGroup = grp;

    if (currentGroup.startsWith('5.')) {
      currentTab = "patterns";
    } else if (currentGroup.startsWith('6.')) {
      // Start a new template
      if (currentTemplate) {
        currentTemplate.text = templateContentLines.join('\n');
        parsedTemplates.push(currentTemplate);
      }
      const titleMatch = currentGroup.match(/6\.\d+\s+(.*?)(?:$|（|\()/);
      const cleanTitle = titleMatch ? titleMatch[1].trim() : currentGroup;
      currentTemplate = {
        id: `tpl-${currentGroup.split(' ')[0].replace('.', '-')}`,
        title: cleanTitle + " (范文)",
        group: currentGroup,
        text: ""
      };
      templateContentLines = [];
      currentTab = "templates";
    } else if (currentGroup.startsWith('1.') || currentGroup.startsWith('2.') || currentGroup.startsWith('3.') || currentGroup.startsWith('4.')) {
      currentTab = "terms";
    }
    continue;
  }

  // Handle template body lines
  if (currentTab === "templates" && currentTemplate) {
    if (line.startsWith('#### ')) {
      // Subtitle inside a template, keep it in text
      templateContentLines.push(line);
    } else if (line.startsWith('```')) {
      // Codeblocks, keep them
      templateContentLines.push(line);
    } else {
      templateContentLines.push(lines[i]); // Keep full original spacing/line
    }
    continue;
  }

  // Handle table row lines
  if (line.startsWith('|')) {
    // Skip table header and separator lines
    if (line.includes('英文术语') || line.includes('句型结构') || line.includes('---')) {
      continue;
    }

    const cells = line.split('|').map(c => c.trim()).filter((_, index, arr) => index > 0 && index < arr.length - 1);
    if (cells.length < 3) continue;

    if (currentTab === "terms" && currentLesson && currentGroup) {
      const eng = cells[0];
      const ch = cells[1];
      const cell3 = cells[2];

      const parts = cell3.split(/<br\/?>\s*\*\*例句\*\*:\s*/i);
      const definition = parts[0] ? parts[0].trim() : "";
      const example = parts[1] ? parts[1].trim() : "";

      // Lookup if we have an old term to merge
      const key = eng.toLowerCase();
      const oldTerm = oldTermsMap.get(key);

      const term = {
        id: oldTerm ? oldTerm.id : "", // Set lower down based on sequence
        eng,
        ch: oldTerm ? oldTerm.ch : ch,
        pos: oldTerm && oldTerm.pos ? oldTerm.pos : "n.",
        phonetic: oldTerm && oldTerm.phonetic ? oldTerm.phonetic : `/${eng.toLowerCase()}/`,
        definition: oldTerm ? oldTerm.definition : definition,
        example: oldTerm ? oldTerm.example : example,
        exampleCh: oldTerm && oldTerm.exampleCh ? oldTerm.exampleCh : "",
        lesson: currentLesson,
        group: currentGroup,
        proTip: oldTerm && oldTerm.proTip ? oldTerm.proTip : ""
      };
      
      parsedTerms.push(term);
    } else if (currentTab === "patterns" && currentGroup) {
      const pattern = cells[0];
      const example = cells[1];
      const trans = cells[2];
      const usage = cells[3] || "基础法律英语句式。";

      // Reconstruct clean sentence patterns
      parsedPatterns.push({
        id: `pat-pattern-${parsedPatterns.length + 1}`,
        pattern,
        chPattern: pattern, // Placeholder or we can leave it
        example,
        trans,
        usage,
        category: currentGroup
      });
    }
  }
}

// Push last template if exists
if (currentTemplate) {
  currentTemplate.text = templateContentLines.join('\n');
  parsedTemplates.push(currentTemplate);
}

// Allocate sequential unique IDs for new terms based on their lesson index
const lessonCounters = {
  "Patent": 1,
  "Trademark": 1,
  "Copyright": 1,
  "Trade Secret": 1
};

// Also keep track of already used IDs to not duplicate
const usedIds = new Set();
for (const term of parsedTerms) {
  if (term.id) {
    usedIds.add(term.id);
  }
}

for (const term of parsedTerms) {
  if (!term.id) {
    const prefix = term.lesson === "Patent" ? "pat" :
                   term.lesson === "Trademark" ? "tm" :
                   term.lesson === "Copyright" ? "cr" : "ts";
    let nextNum = lessonCounters[term.lesson];
    let potentialId = `${prefix}-${nextNum}`;
    while (usedIds.has(potentialId)) {
      nextNum++;
      potentialId = `${prefix}-${nextNum}`;
    }
    term.id = potentialId;
    usedIds.add(potentialId);
    lessonCounters[term.lesson] = nextNum + 1;
  }
}

// 3. Write termsData.ts
const termsDest = path.join(__dirname, 'termsData.ts');
const termsHeader = `import { Term } from "../types";\n\nexport const termsData: Term[] = ${JSON.stringify(parsedTerms, null, 2)};\n`;
fs.writeFileSync(termsDest, termsHeader, 'utf8');
console.log(`Successfully compiled termsData.ts with ${parsedTerms.length} terms.`);

// 4. Write patternsData.ts
const patternsDest = path.join(__dirname, 'patternsData.ts');
const patternsHeader = `import { SentencePattern } from "../types";\n\nexport const patternsData: SentencePattern[] = ${JSON.stringify(parsedPatterns, null, 2)};\n`;
fs.writeFileSync(patternsDest, patternsHeader, 'utf8');
console.log(`Successfully compiled patternsData.ts with ${parsedPatterns.length} patterns.`);

// 5. Write samplesData.ts
const samplesDest = path.join(__dirname, 'samplesData.ts');
const samplesHeader = `import { LegalTemplate } from "../types";\n\nexport const samplesData: LegalTemplate[] = ${JSON.stringify(parsedTemplates, null, 2)};\n`;
fs.writeFileSync(samplesDest, samplesHeader, 'utf8');
console.log(`Successfully compiled samplesData.ts with ${parsedTemplates.length} templates.`);
