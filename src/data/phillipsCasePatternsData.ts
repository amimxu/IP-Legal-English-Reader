import { SentencePattern } from "../types";

export const phillipsCasePatternsData: SentencePattern[] = [
  {
    id: "ph-pattern-01",
    pattern: "X invented Y that can be used to...",
    chPattern: "X 发明了可用于……的 Y",
    example: "Edward H. Phillips invented modular, steel-shell panels that can be welded together to form vandalism-resistant walls.",
    trans: "Edward H. Phillips 发明了一种模块化钢壳板，该钢壳板可以焊接在一起，形成具有抗破坏能力的墙体。",
    usage: "用于判决事实部分介绍技术背景。that 从句可译成中文后置说明，也可拆成两个分句。",
    category: "1. 技术事实叙述"
  },
  {
    id: "ph-pattern-02",
    pattern: "The product is especially useful in..., because..., while also...",
    chPattern: "该产品尤其适用于……，因为其……，同时还……",
    example: "The panels are especially useful in building prisons because they are load-bearing and impact-resistant, while also insulating against fire and noise.",
    trans: "该类板材尤其适用于监狱建筑，因为其既能承重、抗冲击，又能隔绝火灾和噪音。",
    usage: "用于说明发明优点。while also 能把附加技术效果自然接上。",
    category: "1. 技术事实叙述"
  },
  {
    id: "ph-pattern-03",
    pattern: "X obtained a patent on the invention.",
    chPattern: "X 就该发明取得专利",
    example: "Mr. Phillips obtained a patent on the invention, U.S. Patent No. 4,677,798.",
    trans: "Phillips 先生就该发明取得了美国专利第 4,677,798 号。",
    usage: "on the invention 不直译为“在发明上”，法律中文应译为“就该发明”。",
    category: "1. 技术事实叙述"
  },
  {
    id: "ph-pattern-04",
    pattern: "X entered into an arrangement with Y to...",
    chPattern: "X 与 Y 达成安排，以……",
    example: "He subsequently entered into an arrangement with AWH to market and sell the panels.",
    trans: "随后，他与 AWH 达成安排，由其推广并销售该类板材。",
    usage: "enter into 后接 agreement / contract / license / arrangement，常译“订立/达成”。",
    category: "1. 技术事实叙述"
  },
  {
    id: "ph-pattern-05",
    pattern: "Document A suggested to X that Y was continuing to...",
    chPattern: "文件 A 使 X 认为 Y 仍在继续……",
    example: "A sales brochure from AWH suggested to him that AWH was continuing to use his trade secrets and patented technology without his consent.",
    trans: "AWH 的一份销售手册使其认为，AWH 仍在未经其同意的情况下继续使用其商业秘密和专利技术。",
    usage: "suggest 在判决事实叙述中常为“显示/使其认为”，不是“建议”。",
    category: "1. 技术事实叙述"
  },
  {
    id: "ph-pattern-06",
    pattern: "X accused Y of A and B.",
    chPattern: "X 指控 Y 实施 A 和 B",
    example: "Mr. Phillips accused AWH of patent infringement and trade secret misappropriation.",
    trans: "Phillips 先生指控 AWH 侵犯专利权并侵占商业秘密。",
    usage: "accuse + 人/公司 + of + 行为，是诉讼事实叙述高频结构。",
    category: "2. 争议与指控"
  },
  {
    id: "ph-pattern-07",
    pattern: "Correspondence between the parties regarding the matter ceased after that time.",
    chPattern: "此后，双方就该事项的通信即告停止",
    example: "Correspondence between the parties regarding the matter ceased after that time.",
    trans: "此后，双方就该事项的通信即告停止。",
    usage: "这句适合整句背诵。correspondence = 通信；the parties = 双方/各方；regarding the matter = 就该事项；ceased = 即告停止。",
    category: "2. 争议与指控"
  },
  {
    id: "ph-pattern-08",
    pattern: "X brought suit in [court] charging Y with...",
    chPattern: "X 向某法院提起诉讼，指控 Y……",
    example: "Mr. Phillips brought suit in the United States District Court for the District of Colorado charging AWH with misappropriation of trade secrets and infringement of claims 1, 21, 22, 24, 25, and 26.",
    trans: "Phillips 先生向美国科罗拉多地区联邦地区法院提起诉讼，指控 AWH 侵占商业秘密，并侵犯第 1、21、22、24、25 和 26 项权利要求。",
    usage: "bring suit = 提起诉讼；charging... with... 后接被指控事项。",
    category: "3. 起诉与一审"
  },
  {
    id: "ph-pattern-09",
    pattern: "The court dismissed the claim as barred by...",
    chPattern: "法院认为该请求被……阻却，故驳回该请求",
    example: "The district court dismissed the trade secret misappropriation claim as barred by Colorado's three-year statute of limitations.",
    trans: "地区法院认为商业秘密侵占请求已被科罗拉多州三年诉讼时效阻却，故驳回该请求。",
    usage: "dismissed A as barred by B 是压缩法律结构，中文应补出因果关系。",
    category: "3. 起诉与一审"
  },
  {
    id: "ph-pattern-10",
    pattern: "With regard to [issue], the court focused on...",
    chPattern: "关于某问题，法院重点审查……",
    example: "With regard to the patent infringement issue, the district court focused on the language of claim 1.",
    trans: "关于专利侵权问题，地区法院重点审查了权利要求 1 的文字。",
    usage: "with regard to 是正式议题切换表达，适合判决和 memo。",
    category: "3. 起诉与一审"
  },
  {
    id: "ph-pattern-11",
    pattern: "Claim 1 recites...",
    chPattern: "权利要求 1 记载……",
    example: "Claim 1 of the '798 patent is representative of the asserted claims with respect to the use of the term baffles. It recites...",
    trans: "'798 专利权利要求 1 在“挡板”一词的使用方面，可代表被主张的各项权利要求。其记载如下……",
    usage: "recite 是专利权利要求分析核心动词，译“记载/载明”。",
    category: "4. 权利要求文字"
  },
  {
    id: "ph-pattern-12",
    pattern: "The claim refers to means disposed inside the shell for...",
    chPattern: "该权利要求提到设置在壳体内部、用于……的装置",
    example: "The claim refers to means disposed inside the shell for increasing its load bearing capacity.",
    trans: "该权利要求提到设置在壳体内部、用于提高其承载能力的装置。",
    usage: "disposed 在专利文献中通常译“设置/布置”，不要译成“处理”。",
    category: "4. 权利要求文字"
  },
  {
    id: "ph-pattern-13",
    pattern: "Such a claim shall be construed to cover...",
    chPattern: "此类权利要求应解释为覆盖……",
    example: "Such a claim shall be construed to cover the corresponding structure, material, or acts described in the specification and equivalents thereof.",
    trans: "此类权利要求应解释为覆盖说明书中记载的相应结构、材料或行为及其等同物。",
    usage: "shall be construed to cover 是法律解释公式，适合法条和判决翻译。",
    category: "4. 权利要求文字"
  },
  {
    id: "ph-pattern-14",
    pattern: "Looking to the specification, the court noted that...",
    chPattern: "查阅说明书后，法院指出……",
    example: "Looking to the specification of the '798 patent, the court noted that every textual reference and its diagrams show baffle deployment at an angle other than 90.",
    trans: "查阅 '798 专利说明书后，法院指出，说明书中的每一处文字记载及其附图均显示挡板以非 90 度角布置。",
    usage: "look to 在法律英语中常译“查阅/参照/依据”。",
    category: "5. 说明书与证据"
  },
  {
    id: "ph-pattern-15",
    pattern: "The court therefore ruled that...",
    chPattern: "因此，法院裁定……",
    example: "The district court therefore ruled that a baffle must extend inward from the steel shell walls at an oblique or acute angle.",
    trans: "因此，地区法院裁定，挡板必须以斜角或锐角从钢壳壁向内延伸。",
    usage: "therefore ruled that 用于引出法院结论。",
    category: "5. 说明书与证据"
  },
  {
    id: "ph-pattern-16",
    pattern: "Because X could not prove infringement under that claim construction, the court granted summary judgment.",
    chPattern: "由于 X 无法在该权利要求解释下证明侵权，法院作出简易判决",
    example: "Because Mr. Phillips could not prove infringement under that claim construction, the district court granted summary judgment of noninfringement.",
    trans: "由于 Phillips 先生无法在该权利要求解释下证明侵权，地区法院遂作出不侵权的简易判决。",
    usage: "under that claim construction 是专利诉讼中的关键状语。",
    category: "6. 简易判决"
  },
  {
    id: "ph-pattern-17",
    pattern: "X appealed with respect to both A and B.",
    chPattern: "X 就 A 和 B 均提起上诉",
    example: "Mr. Phillips appealed with respect to both the trade secret and patent infringement claims.",
    trans: "Phillips 先生就商业秘密请求和专利侵权请求均提起上诉。",
    usage: "with respect to 比 about 更正式，常用于判决和法律备忘录。",
    category: "7. 上诉审"
  },
  {
    id: "ph-pattern-18",
    pattern: "A panel of this court affirmed on both issues.",
    chPattern: "本院一个合议庭就两个问题均维持原判",
    example: "A panel of this court affirmed on both issues.",
    trans: "本院一个合议庭就两个问题均维持原判。",
    usage: "this court 在判决中常译“本院”。",
    category: "7. 上诉审"
  },
  {
    id: "ph-pattern-19",
    pattern: "The panel unanimously upheld the ruling that...",
    chPattern: "合议庭一致维持……的裁定",
    example: "The panel unanimously upheld the district court's ruling that the claim was barred by the applicable statute of limitations.",
    trans: "合议庭一致维持地区法院的裁定，即该请求被适用的诉讼时效所阻却。",
    usage: "unanimously upheld = 一致维持；applicable = 适用的。",
    category: "7. 上诉审"
  },
  {
    id: "ph-pattern-20",
    pattern: "The majority sustained the judgment, although on different grounds.",
    chPattern: "多数意见维持该判决，但理由不同",
    example: "The majority sustained the district court's summary judgment of noninfringement, although on different grounds.",
    trans: "多数意见维持地区法院关于不侵权的简易判决，但理由不同。",
    usage: "grounds = 法律理由/依据，不是“地面”。",
    category: "7. 上诉审"
  },
  {
    id: "ph-pattern-21",
    pattern: "The dissenting judge would have reversed...",
    chPattern: "持异议法官则会撤销……",
    example: "The dissenting judge would have reversed the summary judgment of noninfringement.",
    trans: "持异议法官则会撤销不侵权的简易判决。",
    usage: "would have reversed 表示异议意见中的“本会撤销”。",
    category: "7. 上诉审"
  },
  {
    id: "ph-pattern-22",
    pattern: "The district court erred by construing the term X to invoke Y.",
    chPattern: "地区法院将术语 X 解释为调用 Y，是错误的",
    example: "The district court erred by construing the term baffles to invoke the means-plus-function claim format.",
    trans: "地区法院将“挡板”一词解释为调用装置加功能权利要求形式，是错误的。",
    usage: "erred by doing = 因做某事而犯错；construe = 解释。",
    category: "8. 权利要求解释"
  },
  {
    id: "ph-pattern-23",
    pattern: "Nonetheless, the panel concluded that...",
    chPattern: "尽管如此，合议庭仍认为……",
    example: "Nonetheless, the panel concluded that the patent uses the term baffles in a restrictive manner.",
    trans: "尽管如此，合议庭仍认为，该专利以限制性方式使用“挡板”一词。",
    usage: "nonetheless 是法律论证中常用的书面转折词。",
    category: "8. 权利要求解释"
  },
  {
    id: "ph-pattern-24",
    pattern: "Based on the written description, the court held that...",
    chPattern: "基于书面说明，法院认定……",
    example: "Based on the patent's written description, the panel held that the claim term baffles excludes structures that extend at a 90 degree angle.",
    trans: "基于该专利的书面说明，合议庭认定，权利要求术语“挡板”不包括以 90 度角延伸的结构。",
    usage: "held that 在判决中常译“认定/裁定”。",
    category: "8. 权利要求解释"
  },
  {
    id: "ph-pattern-25",
    pattern: "The specification repeatedly refers to the ability of X to...",
    chPattern: "说明书反复提到 X 具有……的能力",
    example: "The specification repeatedly refers to the ability of the claimed baffles to deflect projectiles.",
    trans: "说明书反复提到所主张挡板具有偏转抛射物的能力。",
    usage: "refer to 在判决分析中常译“提到/涉及”。",
    category: "8. 权利要求解释"
  },
  {
    id: "ph-pattern-26",
    pattern: "Nowhere in the patent is there any disclosure of...",
    chPattern: "该专利中没有任何地方披露……",
    example: "Nowhere in the patent is there any disclosure of a baffle projecting from the wall at a right angle.",
    trans: "该专利中没有任何地方披露以直角从墙体突出的挡板。",
    usage: "这是倒装强否定结构，适合整句背。",
    category: "8. 权利要求解释"
  },
  {
    id: "ph-pattern-27",
    pattern: "The specification is intended to support and inform the claims.",
    chPattern: "说明书旨在支持并解释权利要求",
    example: "The patent specification is intended to support and inform the claims.",
    trans: "专利说明书旨在支持并解释权利要求。",
    usage: "inform 这里不是“通知”，而是“为……提供解释背景”。",
    category: "8. 权利要求解释"
  },
  {
    id: "ph-pattern-28",
    pattern: "The court improperly limited the claims to the embodiment.",
    chPattern: "法院不当地将权利要求限定于实施例",
    example: "The dissenting judge argued that the panel had improperly limited the claims to the particular embodiment disclosed in the specification.",
    trans: "持异议法官认为，合议庭不当地将权利要求限定于说明书中披露的特定实施例。",
    usage: "limit claims to embodiments 是 Phillips 判决的核心争议之一。",
    category: "9. 异议意见"
  },
  {
    id: "ph-pattern-29",
    pattern: "The parties stipulated that X means...",
    chPattern: "双方约定 X 的含义为……",
    example: "The parties had stipulated that baffles are a means for obstructing, impeding, or checking the flow of something.",
    trans: "双方曾约定，挡板是用于阻挡、阻碍或抑制某物流动的装置。",
    usage: "stipulate 在诉讼中表示正式约定或承认。",
    category: "9. 异议意见"
  },
  {
    id: "ph-pattern-30",
    pattern: "Nothing in the specification redefined the term or constituted a disclaimer.",
    chPattern: "说明书中没有任何内容重新定义该术语或构成放弃",
    example: "Nothing in the specification redefined the term baffles or constituted a disclaimer specifically limiting the term.",
    trans: "说明书中没有任何内容重新定义“挡板”一词，也没有构成明确限制该术语的放弃。",
    usage: "disclaimer 是权利要求限缩分析中的高频词。",
    category: "9. 异议意见"
  },
  {
    id: "ph-pattern-31",
    pattern: "There is no reason to supplement the plain meaning with a limitation from the preferred embodiment.",
    chPattern: "没有理由用优选实施例中的限制补充通常含义",
    example: "There is no reason to supplement the plain meaning of the claim language with a limitation from the preferred embodiment.",
    trans: "没有理由用优选实施例中的限制来补充权利要求语言的通常含义。",
    usage: "这是反对把实施例限制读入 claim 的经典句式。",
    category: "9. 异议意见"
  },
  {
    id: "ph-pattern-32",
    pattern: "The court agreed to rehear the appeal en banc and vacated the judgment.",
    chPattern: "法院同意全院复审该上诉，并撤销判决",
    example: "This court agreed to rehear the appeal en banc and vacated the judgment of the panel.",
    trans: "本院同意全院复审本上诉，并撤销合议庭判决。",
    usage: "en banc = 全院复审；vacate = 撤销/使失效。",
    category: "10. 全院复审与结论"
  },
  {
    id: "ph-pattern-33",
    pattern: "We affirm the portion..., however, we reverse the portion...",
    chPattern: "本院维持……部分，但撤销……部分",
    example: "We now affirm the portion of the district court's judgment addressed to the trade secret misappropriation claims. However, we reverse the portion addressed to the issue of infringement.",
    trans: "本院现维持地区法院判决中关于商业秘密侵占请求的部分；但是，撤销其中关于侵权问题的部分。",
    usage: "addressed to 可译“关于/针对”。这是上诉判决结论常见结构。",
    category: "10. 全院复审与结论"
  },
  {
    id: "ph-pattern-34",
    pattern: "As a preliminary matter, we agree that...",
    chPattern: "作为初步事项，本院同意……",
    example: "As a preliminary matter, we agree with the panel that the term baffles is not means-plus-function language.",
    trans: "作为初步事项，本院同意合议庭意见，即“挡板”一词并非装置加功能语言。",
    usage: "法院处理门槛问题时常用 as a preliminary matter。",
    category: "11. means-plus-function"
  },
  {
    id: "ph-pattern-35",
    pattern: "To be sure, the claim refers to..., however...",
    chPattern: "诚然，该权利要求提到……；然而……",
    example: "To be sure, the claim refers to means disposed inside the shell for increasing its load bearing capacity. However, the claim specifically identifies internal steel baffles as structure.",
    trans: "诚然，该权利要求提到设置在壳体内部、用于提高承载能力的装置。然而，该权利要求明确将内部钢挡板确定为结构。",
    usage: "To be sure 用于让步，后面通常接 However 转折。",
    category: "11. means-plus-function"
  },
  {
    id: "ph-pattern-36",
    pattern: "The absence of that term creates a rebuttable presumption that...",
    chPattern: "未使用该术语会产生一项可反驳推定，即……",
    example: "The absence of that term creates a rebuttable presumption that section 112, paragraph 6, does not apply.",
    trans: "未使用该术语会产生一项可反驳的推定，即 §112 第 6 款不适用。",
    usage: "rebuttable presumption 是高价值法律词块，建议整句背诵。",
    category: "11. means-plus-function"
  },
  {
    id: "ph-pattern-37",
    pattern: "Means-plus-function claiming applies only to...",
    chPattern: "装置加功能权利要求仅适用于……",
    example: "Means-plus-function claiming applies only to purely functional limitations that do not provide the structure that performs the recited function.",
    trans: "装置加功能权利要求仅适用于纯粹功能性限定，即该限定未提供履行所记载功能的结构。",
    usage: "这句是理解 Phillips 前半部分的钥匙。",
    category: "11. means-plus-function"
  },
  {
    id: "ph-pattern-38",
    pattern: "The term is not a purely functional placeholder in which structure is filled in by the specification.",
    chPattern: "该术语不是由说明书填入结构的纯功能性占位符",
    example: "The term baffles is not a purely functional placeholder in which structure is filled in by the specification.",
    trans: "“挡板”一词不是一个由说明书填入结构的纯粹功能性占位符。",
    usage: "placeholder 可译“占位符”；filled in by the specification = 由说明书补足。",
    category: "11. means-plus-function"
  }
];
