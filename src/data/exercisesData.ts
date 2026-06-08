import { QuizQuestion } from "../types";

export const quizQuestions: QuizQuestion[] = [
  // Exercise 3: Fill in the Blanks
  {
    id: "q-fb-1",
    type: "choice",
    question: "The requirement that an invention must not be obvious to a person having ordinary skill in the art is called ________.",
    options: ["Novelty", "Non-obviousness", "Enablement", "Utility"],
    answer: "Non-obviousness",
    explanation: "非显而易见性（Non-obviousness，中国称为创造性）是指一项发明对于其所属技术领域的普通技术人员（PHOSITA）来说是不能凭直觉想出来的、非显而易见的。",
    category: "Exercise 3"
  },
  {
    id: "q-fb-2",
    type: "choice",
    question: "A trademark that has lost its distinctiveness through common, widespread use is said to have undergone ________.",
    options: ["Tarnishment", "Blurring", "Genericide", "Cancellation"],
    answer: "Genericide",
    explanation: "通用商标化（Genericide）是指原本具有显著性的注册商标，因为被公众广泛用作该类商品或服务的通用名称，从而失去了指示来源的能力并面临失效（如Aspirin、Escalator）。",
    category: "Exercise 3"
  },
  {
    id: "q-fb-3",
    type: "choice",
    question: "The legal doctrine that permits limited, unauthorized use of copyrighted materials for criticism, comment, or teaching is called ________.",
    options: ["First Sale Doctrine", "Fair Use", "Compulsory Licensing", "Safe Harbor"],
    answer: "Fair Use",
    explanation: "合理使用原则（Fair Use）是著作权侵权诉讼中最强大的抗辩理由，允许在评论、批评、新闻报道和教学等情况下，无需版权所有授权便使用小部分素材。",
    category: "Exercise 3"
  },
  {
    id: "q-fb-4",
    type: "choice",
    question: "Confidential information that is not generally known, derives economic value from secrecy, and is subject to security protocols is a ________.",
    options: ["Utility Patent", "Trade Secret", "Trade Dress", "Registered Slogan"],
    answer: "Trade Secret",
    explanation: "商业秘密（Trade Secret）是由三个核心要件构成的保密商业技术或经营信息：保密性、经济价值、合理保密措施。",
    category: "Exercise 3"
  },
  {
    id: "q-fb-5",
    type: "choice",
    question: "The definitive portion of a patent application that legally defines the scope or 'metes and bounds' of protection is the ________.",
    options: ["Abstract", "Specification", "Claim", "Detailed Description"],
    answer: "Claim",
    explanation: "权利要求（Claim）是专利中最核心和最重要的法律表述，类似房地产的地契，直接划分并确立了专利的合法排除（排他）权利半径。",
    category: "Exercise 3"
  },
  {
    id: "q-fb-6",
    type: "choice",
    question: "A creative work prepared by an employee within the scope of their employment, where the employer is deemed the first owner and legal author, is a ________.",
    options: ["Derivative Work", "Joint Work", "Work Made for Hire", "Collective Work"],
    answer: "Work Made for Hire",
    explanation: "职务作品/雇佣作品（Work Made for Hire）项下，雇主从版权产生的第一天起，就在法律上被直接认定为‘作者（Author）’和版权所有人。",
    category: "Exercise 3"
  },
  {
    id: "q-fb-7",
    type: "choice",
    question: "The central legal test applied by courts to determine if trademark infringement has occurred is whether there is a ________.",
    options: ["Willful Intent to Copy", "Likelihood of Confusion", "Generic usage of name", "Blurring of identity"],
    answer: "Likelihood of Confusion",
    explanation: "混淆可能性（Likelihood of Confusion）是认定商标侵权的黄金标准，判断普通大众在看到被告标志时是否极易对产品或来源厂家造成疑惑产生错误联想。",
    category: "Exercise 3"
  },
  {
    id: "q-fb-8",
    type: "choice",
    question: "Supplying a key component of a patented combination, knowing it is specially adapted for use in an unauthorized system, constitutes ________.",
    options: ["Direct Infringement", "Contributory Infringement", "Induced Infringement", "Literal Infringement"],
    answer: "Contributory Infringement",
    explanation: "帮助侵权（Contributory Infringement）是间接侵权的一种，指故意向他人提供专门用于侵权的设备部件或定制原材料（且该物不具有非侵权实质用途）。",
    category: "Exercise 3"
  },
  {
    id: "q-fb-9",
    type: "choice",
    question: "A court-ordered emergency directive prohibiting an alleged infringer from continuing their activities before a full trial is a ________.",
    options: ["Declaratory Judgment", "Markman Order", "Summary Judgment", "Preliminary Injunction"],
    answer: "Preliminary Injunction",
    explanation: "临时禁令（Preliminary Injunction）是原告在诉讼开庭前为了防范持续侵权带来“难以弥补的损害（Irreparable Harm）”而向法庭申请的加急不作为行政强制裁定。",
    category: "Exercise 3"
  },
  {
    id: "q-fb-10",
    type: "choice",
    question: "The acquired distinctiveness of a purely descriptive mark created through continuous commercial use and consumer recognition is known as ________.",
    options: ["Secondary Meaning", "Inherently Distinctive", "Fanciful origin", "Literal Meaning"],
    answer: "Secondary Meaning",
    explanation: "第二含义（Secondary Meaning，即获得显著性）让原本没有商标注册资格的单纯‘事物物理特征描述词’，由于在消费者心中与某个单一品牌牌子锁定，从而重获商标权资格。",
    category: "Exercise 3"
  }
];

export const matchItems = [
  { item: "Prior Art", match: "B. 现有技术", desc: "申请日前向公众公开的所有技术信息" },
  { item: "Likelihood of Confusion", match: "A. 混淆可能性", desc: "判定商标侵权的核心黄金标准" },
  { item: "Fair Use", match: "D. 合理使用", desc: "免经版权人授权而合法使用的侵权豁免抗辩" },
  { item: "Misappropriation", match: "E. 侵占/盗用", desc: "不当夺取、披露或滥用商业秘密的行为" },
  { item: "Non-obviousness", match: "C. 非显而易见性", desc: "专利法上的创造性要求，衡量普通技术人员是否觉得能想到" },
  { item: "Enablement", match: "F. 充分公开", desc: "说明书必须写得让同行无需过度实验即可实施" },
  { item: "Trade Dress", match: "G. 商业外观", desc: "商品外观或独特外包装装潢的整体视觉特色" },
  { item: "Work Made for Hire", match: "H. 雇佣作品", desc: "员工在雇佣职责内创作版权物，雇主被直接赋予版权" },
  { item: "Inevitable Disclosure", match: "I. 必然披露", desc: "员工跳槽到竞争对手处必然导致商业秘密泄密这一假说学说" },
  { item: "Reasonable Royalty", match: "J. 合理许可费", desc: "一种基准性损害赔偿计算方式，通过虚拟谈判模拟计算费率" },
  { item: "Preliminary Injunction", match: "K. 临时禁令", desc: "法院在判决前命令禁止被告持续特定行动的应急裁决" },
  { item: "Secondary Meaning", match: "L. 第二含义", desc: "描述性商标经过高频商用让客群建立特定原厂联想而获得显著性" },
  { item: "Genericide", match: "M. 通用名称化", desc: "名牌词汇在口语中普及泛滥变成大众通用词而使商标被废止" },
  { item: "Contributory Infringement", match: "N. 帮助侵权", desc: "向直接侵权人暗中输送具有特定侵权指向组装原件的责任" },
  { item: "Doctrine of Equivalents", match: "O. 等同原则", desc: "扩张排除宽度，对跟字面仅有非实质微小差异的物品判定侵权" }
];

export const translationExercises = [
  {
    id: "t-1",
    chinese: "专利权人有权禁止他人未经许可制造、使用或销售其发明。",
    hint: ["patentee / patent holder", "exclusive right / right to exclude", "without authorization / permission", "making, using, or selling"],
    official: "The patentee (patent holder) has the right to exclude others from making, using, or selling the invention without permission. / The patent holder has the exclusive right to exclude others from manufacturing, utilizing, or marketing..."
  },
  {
    id: "t-2",
    chinese: "商业秘密是指不为公众所知、具有经济价值并采取合理措施保护的保密信息。",
    hint: ["trade secret", "not generally known", "economic value", "reasonable efforts / measures to protect / maintain secrecy"],
    official: "A trade secret refers to confidential information that is not generally known, has economic value, and is subject to reasonable efforts to maintain its secrecy."
  },
  {
    id: "t-3",
    chinese: "雇佣作品的著作权归雇主所有。",
    hint: ["work made for hire", "copyright", "employer owns / belongs to employer"],
    official: "The copyright in a work made for hire belongs to the employer. / The employer owns the copyright to a work made for hire."
  }
];

export const codeSampleQuiz = {
  text: `1. A method for processing data, comprising:
   receiving a data request from a client device;
   identifying a plurality of processing nodes;
   distributing the data request among the processing nodes;
   collecting processed data from the processing nodes; and
   transmitting the processed data to the client device.

2. The method of claim 1, wherein the processing nodes are identified based on processing capacity.

3. The method of claim 1, further comprising monitoring the performance of each processing node.

4. A system for processing data, comprising:
   a load balancer configured to distribute data requests;
   a plurality of processing nodes; and
   a data aggregator configured to collect processed data.`,
  questions: [
    {
      q: "1. 哪个/哪些是独立权利要求（Independent Claims）？",
      a: "权利要求 1 和权利要求 4",
      exp: "权利要求 1（方法）和权利要求 4（系统）是独立权利要求，因为它们不引用任何在先权利要求，能够独霸一个独立的技术主题描述。"
    },
    {
      q: "2. 哪个/哪些是从属权利要求（Dependent Claims）？",
      a: "权利要求 2 和权利要求 3",
      exp: "权利要求 2 和 3 都引用了权利要求 1（... The method of claim 1 ...），表示它们必须建立在权利要求 1 成立的前提下，加入了额外的特征限定。"
    },
    {
      q: "3. 权利要求 4 申请的是什么‘发明客体分类’（Statutory Subject Matter）？",
      a: "系统（System / Apparatus / Machine）",
      exp: "权利要求 4 是指 A system for ..., 包含了 load balancer, processing nodes, aggregator 等实体电路/设备结构，因此属于机器/系统客体，并非单纯的数字流程方法本身。"
    }
  ]
};
