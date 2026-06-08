const fs = require("fs");
const path = require("path");

const root = "C:/code/codex-code/legeal";
const app = path.join(root, "ip-legal-english-reader");
const oldPath = path.join(app, "src/data/phillipsCaseSamplesData.ts");

function cleanPdfPageMarkers(text) {
  return text
    .replace(/^\s*=+\s*PAGE\s+\d+\s*=+\s*$/gim, "")
    .replace(/^#{1,6}\s*第\s*\d+\s*页\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function unwrapPdfSoftLineBreaks(text) {
  return text
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length <= 1) {
        return lines.join("");
      }

      return lines.join(" ");
    })
    .join("\n\n")
    .replace(/([。！？；])\s+(?=[“”《（\u4e00-\u9fff])/g, "$1\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const english = unwrapPdfSoftLineBreaks(cleanPdfPageMarkers(
  fs
    .readFileSync(path.join(root, "phillips_v_awh_extracted.txt"), "utf8")
    .replace(/\u00a7/g, "§")
    .replace(/搂/g, "§")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
));

const chinese = unwrapPdfSoftLineBreaks(cleanPdfPageMarkers(
  fs
    .readFileSync(path.join(root, "phillips_v_awh_cn_translation.md"), "utf8")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
))
  .trim();

const old = fs.readFileSync(oldPath, "utf8");
const exportStart = old.indexOf("export const phillipsCaseSamplesData: LegalTemplate[] = [");
const bodyStart = old.indexOf("[", exportStart) + 1;
const firstOldEntry = old.indexOf("\n  {", bodyStart);
const oldEntries = old.slice(firstOldEntry, old.lastIndexOf("\n];"));
const legacyEntryMarker = 'id: "ph-sample-brief"';
const legacyEntryIndex = oldEntries.indexOf(legacyEntryMarker);
const legacyEntries =
  legacyEntryIndex >= 0
    ? oldEntries.slice(oldEntries.lastIndexOf("\n  {", legacyEntryIndex))
    : "";

const fullEntries = [
  {
    id: "ph-full-original",
    title: "Phillips v. AWH Full Opinion",
    group: "1. 英文原文全文（Full English Opinion）",
    text: `#### Phillips v. AWH Corp. 英文原文全文

##### Reading Note
This full-text opinion is extracted from the PDF you provided. It is now the main reading sample for the case. Click highlighted legal terms to jump back to the core vocabulary section.

##### Opinion Text

${english}`,
  },
  {
    id: "ph-full-cn",
    title: "Phillips v. AWH 中文译文全文",
    group: "2. 中文译文全文（Full Chinese Translation）",
    text: `#### Phillips v. AWH Corp. 中文译文全文

##### Reading Note
这是你此前已有的完整中文译文，适合与英文原文交替阅读。建议先读程序史和 holding，再回到 claim construction reasoning。

${chinese}`,
  },
  {
    id: "ph-reading-route",
    title: "Full Case Reading Route",
    group: "3. 全文阅读路线（Reading Route）",
    text: `#### Phillips 全文阅读路线

##### 1. 先读程序史

重点定位这些表达：

- brought suit
- dismissed the claim as barred by the statute of limitations
- granted summary judgment of noninfringement
- appealed with respect to both claims
- rehear the appeal en banc
- affirm / reverse / vacate / remand

##### 2. 再读核心问题

本案真正训练的是 claim construction。读到下面表达时要停下来：

- ordinary and customary meaning
- person of ordinary skill in the art
- specification
- prosecution history
- intrinsic evidence
- extrinsic evidence
- importing limitations from the specification

##### 3. 最后读结论

你可以把结论段改写成以下中文法律写作模板：

\`\`\`
本院维持地区法院关于商业秘密侵占请求的判决；撤销关于专利侵权问题的判决；驳回交叉上诉；并将侵权请求发回地区法院继续审理。
\`\`\`

##### Study Method

先通读中文译文建立案件结构，再逐段读英文原文。每次只精读 2-3 页，把不熟悉的词汇回填到核心词汇页。`,
  },
];

const prefix =
  'import { LegalTemplate } from "../types";\n\nexport const phillipsCaseSamplesData: LegalTemplate[] = [\n';
const generated =
  fullEntries
    .map((entry) => `  ${JSON.stringify(entry, null, 2).replace(/\n/g, "\n  ")}`)
    .join(",\n") +
  (legacyEntries ? ",\n" + legacyEntries : "") +
  "\n];\n";

fs.writeFileSync(oldPath, prefix + generated, "utf8");
