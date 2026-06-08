export interface LitigationCluster {
  id: string;
  title: string;
  subtitle: string;
  items: {
    phrase: string;
    translation: string;
    explanation: string;
    example: string;
    exampleCh: string;
  }[];
}

export const litigationEnglishData: LitigationCluster[] = [
  {
    id: "lit-commencement",
    title: "起诉与指控",
    subtitle: "How a lawsuit begins",
    items: [
      {
        phrase: "bring suit in [court]",
        translation: "向某法院提起诉讼",
        explanation: "比 sue 更正式，常用于判决事实和程序史。",
        example: "Mr. Phillips brought suit in the United States District Court for the District of Colorado.",
        exampleCh: "Phillips 先生向美国科罗拉多地区联邦地区法院提起诉讼。"
      },
      {
        phrase: "charge A with B",
        translation: "指控 A 存在 B",
        explanation: "可用于民事诉讼事实叙述，也可用于刑事语境；本案是民事知识产权争议。",
        example: "Phillips brought suit charging AWH with misappropriation of trade secrets.",
        exampleCh: "Phillips 提起诉讼，指控 AWH 侵占商业秘密。"
      },
      {
        phrase: "accuse A of B",
        translation: "指控 A 实施 B",
        explanation: "比 charge 稍通用，后面接侵权、违约、侵占等行为。",
        example: "Phillips accused AWH of patent infringement and trade secret misappropriation.",
        exampleCh: "Phillips 指控 AWH 侵犯专利权并侵占商业秘密。"
      }
    ]
  },
  {
    id: "lit-dismissal",
    title: "驳回与诉讼时效",
    subtitle: "Dismissal and time bars",
    items: [
      {
        phrase: "dismiss the claim",
        translation: "驳回该请求",
        explanation: "claim 在诉讼语境中通常译“请求/诉因”，不是专利权利要求。",
        example: "The district court dismissed the trade secret misappropriation claim.",
        exampleCh: "地区法院驳回商业秘密侵占请求。"
      },
      {
        phrase: "be barred by the statute of limitations",
        translation: "被诉讼时效阻却",
        explanation: "barred by 表示因法律障碍而不能继续主张。",
        example: "The claim was barred by Colorado's three-year statute of limitations.",
        exampleCh: "该请求被科罗拉多州三年诉讼时效阻却。"
      },
      {
        phrase: "applicable statute of limitations",
        translation: "适用的诉讼时效",
        explanation: "applicable 表示“适用的”，常修饰 law, rule, statute, standard。",
        example: "The panel upheld the ruling that the claim was barred by the applicable statute of limitations.",
        exampleCh: "合议庭维持该请求被适用诉讼时效阻却的裁定。"
      }
    ]
  },
  {
    id: "lit-summary-judgment",
    title: "简易判决",
    subtitle: "Summary judgment in patent litigation",
    items: [
      {
        phrase: "grant summary judgment",
        translation: "作出/准予简易判决",
        explanation: "法院认为无需完整审判即可依法判决时使用。",
        example: "The district court granted summary judgment of noninfringement.",
        exampleCh: "地区法院作出不侵权的简易判决。"
      },
      {
        phrase: "summary judgment of noninfringement",
        translation: "不侵权的简易判决",
        explanation: "专利诉讼高频结果，往往取决于 claim construction。",
        example: "Phillips could not prove infringement under that claim construction.",
        exampleCh: "在该权利要求解释下，Phillips 无法证明侵权。"
      },
      {
        phrase: "under that claim construction",
        translation: "在该权利要求解释下",
        explanation: "专利侵权判断常以某一 claim construction 为前提。",
        example: "Because Phillips could not prove infringement under that claim construction, the court granted summary judgment.",
        exampleCh: "由于 Phillips 无法在该权利要求解释下证明侵权，法院作出简易判决。"
      }
    ]
  },
  {
    id: "lit-appeal",
    title: "上诉审动作",
    subtitle: "Appeal verbs you must know",
    items: [
      {
        phrase: "appeal with respect to...",
        translation: "就……提起上诉",
        explanation: "with respect to 用于正式限定上诉事项。",
        example: "Phillips appealed with respect to both the trade secret and patent infringement claims.",
        exampleCh: "Phillips 就商业秘密请求和专利侵权请求均提起上诉。"
      },
      {
        phrase: "affirm",
        translation: "维持原判",
        explanation: "上诉法院认为下级法院结论应维持。",
        example: "A panel of this court affirmed on both issues.",
        exampleCh: "本院一个合议庭就两个问题均维持原判。"
      },
      {
        phrase: "reverse",
        translation: "撤销",
        explanation: "上诉法院推翻下级法院结论。",
        example: "The dissenting judge would have reversed the summary judgment.",
        exampleCh: "持异议法官则会撤销该简易判决。"
      },
      {
        phrase: "vacate",
        translation: "撤销；使失效",
        explanation: "强调原判决或命令不再有效。",
        example: "The court vacated the judgment of the panel.",
        exampleCh: "法院撤销了合议庭判决。"
      },
      {
        phrase: "remand",
        translation: "发回重审/继续审理",
        explanation: "上诉法院将案件送回下级法院继续处理。",
        example: "The court remanded the infringement claims for further proceedings.",
        exampleCh: "法院将侵权请求发回继续审理。"
      }
    ]
  },
  {
    id: "lit-opinions",
    title: "多数意见与异议意见",
    subtitle: "Reading judicial opinions",
    items: [
      {
        phrase: "the majority sustained...",
        translation: "多数意见维持……",
        explanation: "majority 指多数法官形成的法院意见。",
        example: "The majority sustained the district court's summary judgment.",
        exampleCh: "多数意见维持地区法院的简易判决。"
      },
      {
        phrase: "the dissenting judge argued that...",
        translation: "持异议法官认为……",
        explanation: "dissenting judge 表示不同意多数意见的法官。",
        example: "The dissenting judge argued that the panel improperly limited the claims.",
        exampleCh: "持异议法官认为，合议庭不当地限缩了权利要求。"
      },
      {
        phrase: "on different grounds",
        translation: "基于不同理由",
        explanation: "grounds 是法律理由或依据。",
        example: "The majority affirmed, although on different grounds.",
        exampleCh: "多数意见维持原判，但理由不同。"
      }
    ]
  },
  {
    id: "lit-en-banc",
    title: "全院复审",
    subtitle: "En banc rehearing",
    items: [
      {
        phrase: "rehear the appeal en banc",
        translation: "全院复审该上诉",
        explanation: "en banc 指由全院而非普通合议庭审理。",
        example: "This court agreed to rehear the appeal en banc.",
        exampleCh: "本院同意全院复审本上诉。"
      },
      {
        phrase: "affirm in part, reverse in part",
        translation: "部分维持、部分撤销",
        explanation: "上诉判决结论中常见的组合表达。",
        example: "The judgment was affirmed in part and reversed in part.",
        exampleCh: "该判决被部分维持、部分撤销。"
      },
      {
        phrase: "for further proceedings",
        translation: "为继续审理；继续程序",
        explanation: "常与 remand 连用。",
        example: "The infringement claims were remanded for further proceedings.",
        exampleCh: "侵权请求被发回继续审理。"
      }
    ]
  }
];
