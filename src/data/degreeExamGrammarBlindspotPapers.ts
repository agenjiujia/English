import type {
  DegreeExamPaper,
  DegreeExamQuestion,
  DegreeExamQuestionDetailKey,
  DegreeExamSection,
} from "./degreeExamFullPapers";

type GrammarBlindspotSeed = {
  id: string;
  badgeNo: string;
  focus: string;
  focusZh: string;
  description: string;
  weakPoints: [string, string, string, string, string];
  weakPointsZh: [string, string, string, string, string];
  writingTitle: string;
  writingGuideZh: string;
};

const learnerNames = [
  "Yao Lin",
  "Meng Jie",
  "Hao Rui",
  "Qin Yue",
  "Tao Min",
  "Jiang He",
  "Lu Xin",
  "Fan Qing",
];

const grammarBlindspotSeeds: GrammarBlindspotSeed[] = [
  {
    id: "01",
    badgeNo: "01",
    focus: "Passive Voice",
    focusZh: "被动语态",
    description: "聚焦被动语态、时态中的被动变化与常见误区。",
    weakPoints: [
      "know when the receiver of an action is more important than the doer",
      "match passive forms with different tenses",
      "distinguish active and passive patterns in reading",
      "avoid missing be in passive sentences",
      "use passive structures in short writing naturally",
    ],
    weakPointsZh: [
      "知道什么时候动作承受者比动作发出者更重要",
      "能把被动语态和不同时间结合起来",
      "在阅读里区分主动结构和被动结构",
      "避免在被动句中漏掉 be 动词",
      "在短文写作里自然使用被动结构",
    ],
    writingTitle: "How I Learn the Passive Voice",
    writingGuideZh:
      "可写你为什么觉得被动语态难、你打算怎样学、学会后有什么帮助。",
  },
  {
    id: "02",
    badgeNo: "02",
    focus: "Non-finite Verbs",
    focusZh: "非谓语动词",
    description: "聚焦 to do、doing、done 的判断与常见搭配。",
    weakPoints: [
      "tell the difference between to do and doing",
      "use doing and done as modifiers correctly",
      "see why context decides non-finite choices",
      "avoid mixing predicates with non-finite verbs",
      "review common verb patterns after practice",
    ],
    weakPointsZh: [
      "分清 to do 和 doing 的差别",
      "正确使用 doing 和 done 作修饰成分",
      "理解语境如何决定非谓语形式",
      "避免把谓语动词和非谓语结构混在一起",
      "练习后回头整理常见动词搭配",
    ],
    writingTitle: "A Good Way to Review Non-finite Verbs",
    writingGuideZh: "可写你怎样区分 to do、doing、done，以及你复习时用的方法。",
  },
  {
    id: "03",
    badgeNo: "03",
    focus: "Clauses",
    focusZh: "从句系统",
    description: "聚焦宾语从句、定语从句和基础名词性从句。",
    weakPoints: [
      "understand how clauses connect ideas in longer sentences",
      "identify the noun or idea a clause refers to",
      "tell that, which, who, and what apart in context",
      "avoid breaking sentence meaning when reading long clauses",
      "reuse useful clause patterns in writing",
    ],
    weakPointsZh: [
      "理解从句如何连接长句中的意思",
      "找出从句到底修饰哪个名词或表达哪个内容",
      "在语境里区分 that、which、who 和 what",
      "避免读长从句时把句意读断",
      "在写作中复用实用从句句型",
    ],
    writingTitle: "Why I Need to Learn Clauses Better",
    writingGuideZh: "可写从句为什么难、你在哪些题型里最容易错、如何改进。",
  },
  {
    id: "04",
    badgeNo: "04",
    focus: "Subject-Verb Agreement and Adverbial Clauses",
    focusZh: "主谓一致与状语从句",
    description: "聚焦主谓一致、时间条件原因让步状语从句。",
    weakPoints: [
      "find the real subject before choosing a verb form",
      "see how time and condition clauses change meaning",
      "avoid agreement errors caused by long modifiers",
      "read signal words in adverbial clauses carefully",
      "combine grammar rules with sentence meaning",
    ],
    weakPointsZh: [
      "选动词前先找到真正主语",
      "看懂时间、条件等状语从句如何改变句意",
      "避免因长修饰成分而主谓不一致",
      "认真识别状语从句中的提示词",
      "把语法规则和句子意思结合起来",
    ],
    writingTitle: "How I Avoid Subject-Verb Agreement Errors",
    writingGuideZh: "可写你为什么容易主谓一致出错、如何检查句子和减少错误。",
  },
  {
    id: "05",
    badgeNo: "05",
    focus: "Modal Verbs and Comparison",
    focusZh: "情态动词与比较结构",
    description: "聚焦 can/must/should 等情态用法与比较级结构。",
    weakPoints: [
      "understand different degrees of possibility and advice",
      "choose proper modal verbs from context",
      "use comparative structures more accurately",
      "avoid confusing should, must, and have to",
      "notice hidden comparisons in reading passages",
    ],
    weakPointsZh: [
      "理解不同程度的可能、义务和建议",
      "根据语境选择合适的情态动词",
      "更准确地使用比较结构",
      "避免混淆 should、must 和 have to",
      "注意阅读文章里隐藏的比较关系",
    ],
    writingTitle: "Useful Grammar in Daily Advice",
    writingGuideZh: "可写你在日常建议中会怎样使用 should、must 等表达。",
  },
  {
    id: "06",
    badgeNo: "06",
    focus: "Subjunctive Mood",
    focusZh: "虚拟语气",
    description: "聚焦 if 条件虚拟、建议命令类虚拟和常见考试句型。",
    weakPoints: [
      "separate real situations from imagined situations",
      "recognize unreal if-clauses in exam questions",
      "remember special patterns after suggest and advise",
      "avoid tense confusion in hypothetical sentences",
      "practice typical subjunctive sentence frames repeatedly",
    ],
    weakPointsZh: [
      "分清真实情况和假设情况",
      "在题目里识别非真实 if 条件句",
      "记住 suggest、advise 后的特殊虚拟结构",
      "避免在假设句里把时态用乱",
      "反复练典型虚拟语气句型框架",
    ],
    writingTitle: "If I Had More Time to Study English",
    writingGuideZh: "可写一个假设情境，尽量自然使用 if 虚拟表达。",
  },
  {
    id: "07",
    badgeNo: "07",
    focus: "Inversion and Emphasis",
    focusZh: "倒装与强调",
    description: "聚焦否定副词倒装、only 结构、强调句型。",
    weakPoints: [
      "notice when normal word order changes for emphasis",
      "identify common inversion triggers in reading",
      "understand the structure of it is ... that ...",
      "avoid treating emphasis as a new tense rule",
      "read marked sentence forms without fear",
    ],
    weakPointsZh: [
      "注意什么时候为了强调会改变正常语序",
      "在阅读中识别常见倒装触发词",
      "理解 it is ... that ... 的强调结构",
      "避免把强调句误当成新的时态规则",
      "读到特殊句式时不再慌张",
    ],
    writingTitle: "A Grammar Point That Once Scared Me",
    writingGuideZh: "可写一个曾经让你害怕的语法点，以及你后来怎样理解它。",
  },
  {
    id: "08",
    badgeNo: "08",
    focus: "Integrated Grammar Review",
    focusZh: "综合语法强化",
    description: "聚焦前面薄弱语法点的综合联动与考场判断。",
    weakPoints: [
      "connect several grammar rules inside one sentence",
      "decide which rule matters most in a question",
      "review grammar through real sentence meaning",
      "avoid solving grammar questions by translation alone",
      "build a stable checking habit before choosing an answer",
    ],
    weakPointsZh: [
      "在一个句子里综合判断多个语法规则",
      "面对题目时先找最关键的考点",
      "通过真实句意复习语法",
      "避免只靠汉语直译来做语法题",
      "在选答案前建立稳定检查习惯",
    ],
    writingTitle: "How I Review Grammar Before an Exam",
    writingGuideZh: "可写你考前如何复习语法、检查错误并保持稳定发挥。",
  },
];

function makeQuestion(
  id: string,
  number: number,
  prompt: string,
  analysis: Record<DegreeExamQuestionDetailKey, string>,
  options?: string[],
): DegreeExamQuestion {
  return { id, number, prompt, analysis, options };
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function buildJudgeSection(seed: GrammarBlindspotSeed): DegreeExamSection {
  const learner = learnerNames[Number(seed.id) - 1];
  return {
    id: `grammar${seed.id}-judge`,
    title: "第一部分 阅读判断",
    questionRange: "1-10",
    score: 10,
    instructions:
      "Read the passage and decide whether the statements are True (A), False (B) or Not Given (C).",
    sourceBasis: [`语法补盲：${seed.focusZh}`, "考点：细节判断与主旨理解"],
    material: [
      `${learner} once believed that grammar errors appeared only because of carelessness. When preparing for English (II), however, ${learner} discovered that some grammar questions kept returning in different forms. The most difficult area was ${seed.focus}.`,
      `A teacher then asked ${learner} not to memorize rules blindly. Instead, ${learner} should connect grammar with real sentences, compare correct and incorrect examples, and review the same pattern many times. The teacher said that grammar becomes clearer when learners know both the form and the reason behind it.`,
      `After several weeks, ${learner} still made some mistakes, but panic became smaller. More importantly, ${learner} no longer saw grammar as a collection of isolated rules. It became a system that helped reading, writing, and answer checking.`,
    ],
    materialTranslation: [
      `${learner}曾经以为，语法错误只是因为粗心。可是在准备英语（二）时，${learner}发现有些语法题会不断以不同形式出现。其中最难的一块就是${seed.focusZh}。`,
      `后来，一位老师告诉${learner}，不要盲背规则。相反，应该把语法和真实句子连起来，看对错对比，并反复回看同一种结构。老师说，当学习者既知道形式，也知道背后原因时，语法才会真正清楚。`,
      `几周之后，${learner}还是会犯一些错，但慌张感明显小了。更重要的是，${learner}不再把语法看成零散规则的堆积，而把它看成能帮助阅读、写作和检查答案的一整套系统。`,
    ],
    questions: [
      makeQuestion(
        `g${seed.id}-j1`,
        1,
        `${learner} once thought grammar mistakes came only from carelessness.`,
        {
          answer: "A (True)",
          point: "第一段首句直接说明。",
          translation: `${learner}曾经认为语法错误只来自粗心。`,
          pitfalls: "only from carelessness 是原文原意。",
        },
      ),
      makeQuestion(
        `g${seed.id}-j2`,
        2,
        `${learner}'s most difficult area was vocabulary spelling.`,
        {
          answer: "B (False)",
          point: "原文指出最难的是当前语法点，不是拼写。",
          translation: `${learner}最难的是单词拼写。`,
          pitfalls: "要抓准 focus 信息。",
        },
      ),
      makeQuestion(
        `g${seed.id}-j3`,
        3,
        `${learner} found that some grammar questions returned in different forms.`,
        {
          answer: "A (True)",
          point: "第一段中间直接提到。",
          translation: `${learner}发现有些语法题会换形式重复出现。`,
          pitfalls: "different forms 是关键词。",
        },
      ),
      makeQuestion(
        `g${seed.id}-j4`,
        4,
        `The teacher asked ${learner} to memorize rules blindly.`,
        {
          answer: "B (False)",
          point: "第二段明确说 not to memorize rules blindly。",
          translation: `老师让${learner}盲背规则。`,
          pitfalls: "注意否定词 not。",
        },
      ),
      makeQuestion(
        `g${seed.id}-j5`,
        5,
        `${learner} should compare correct and incorrect examples.`,
        {
          answer: "A (True)",
          point: "第二段直接出现 compare correct and incorrect examples。",
          translation: `${learner}应该对比正确和错误例句。`,
          pitfalls: "这是老师给出的具体方法。",
        },
      ),
      makeQuestion(
        `g${seed.id}-j6`,
        6,
        `The teacher also required ${learner} to buy a new grammar dictionary.`,
        {
          answer: "C (Not Given)",
          point: "文章没有提到买词典。",
          translation: `老师还要求${learner}买一本新语法词典。`,
          pitfalls: "没提到的内容不能自补。",
        },
      ),
      makeQuestion(
        `g${seed.id}-j7`,
        7,
        `${learner} stopped making all mistakes after several weeks.`,
        {
          answer: "B (False)",
          point: "第三段说 still made some mistakes。",
          translation: `几周之后，${learner}已经完全不犯错了。`,
          pitfalls: "all / some 是高频干扰。",
        },
      ),
      makeQuestion(
        `g${seed.id}-j8`,
        8,
        `${learner} felt less panic after more practice.`,
        {
          answer: "A (True)",
          point: "第三段前半部分直接体现变化。",
          translation: `${learner}练习后不再那么慌张了。`,
          pitfalls: "panic became smaller 对应 less panic。",
        },
      ),
      makeQuestion(
        `g${seed.id}-j9`,
        9,
        `${learner} still saw grammar as isolated rules at the end.`,
        {
          answer: "B (False)",
          point: "第三段后半部分明确否定。",
          translation: `${learner}最后仍把语法看成零散规则。`,
          pitfalls: "no longer 是判断关键。",
        },
      ),
      makeQuestion(
        `g${seed.id}-j10`,
        10,
        `The passage mainly shows how grammar can become a usable system.`,
        {
          answer: "A (True)",
          point: "最后一句总结全文主旨。",
          translation: "这篇文章主要说明语法如何变成可使用的系统。",
          pitfalls: "主旨句在结尾很明显。",
        },
      ),
    ],
  };
}

function buildChoiceSection(seed: GrammarBlindspotSeed): DegreeExamSection {
  const learner = learnerNames[Number(seed.id) - 1];
  return {
    id: `grammar${seed.id}-choice`,
    title: "第二部分 阅读选择",
    questionRange: "11-15",
    score: 10,
    instructions:
      "Read the following passage and choose the best answer to each question.",
    sourceBasis: [
      `语法补盲：${seed.focusZh}`,
      "考点：细节理解、推理判断与主旨概括",
    ],
    material: [
      `When ${learner} first reviewed ${seed.focus}, the biggest problem was not the rule itself but the feeling of confusion. Similar forms seemed to appear everywhere, and short explanations in notes were not enough. ${learner} could sometimes recognize a correct answer after seeing it, but could not explain why it was correct.`,
      `A new method changed this. ${learner} began to collect one useful example for each weak point, mark the grammar signal in the sentence, and rewrite the same idea in a slightly different form. In this way, grammar stopped being a list of abstract names. It became something that could be seen and tested inside real language.`,
      `After one month, ${learner} still needed review, but answer checking became more systematic. Instead of choosing quickly by feeling, ${learner} learned to ask which grammar point really controlled the sentence. The teacher said this habit mattered because exam questions often hide the key point inside familiar words.`,
    ],
    materialTranslation: [
      `当${learner}刚开始复习${seed.focusZh}时，最大的问题并不是规则本身，而是那种“看不清”的混乱感。相似形式好像到处都是，笔记里简短解释也不够。${learner}有时看到正确答案会觉得“好像对”，却说不出为什么对。`,
      `后来，一种新方法改变了这种情况。${learner}开始为每个薄弱点收集一个实用例句，在句中标出语法信号，并把同一个意思换一种形式重写。这样一来，语法不再只是抽象术语列表，而变成能在真实语言里看见、能拿来检验的东西。`,
      `一个月后，${learner}仍然需要继续复习，但检查答案已经更有系统了。${learner}不再只凭感觉快速选择，而是先问：这句话真正被哪个语法点控制？老师说，这种习惯很重要，因为考试题常常把关键点藏在熟悉词汇里面。`,
    ],
    questions: [
      makeQuestion(
        `g${seed.id}-c11`,
        11,
        `What was ${learner}'s biggest problem at first?`,
        {
          answer: "B. A feeling of confusion about similar forms.",
          point: "第一段第一二句直接说明。",
          translation: `${learner}一开始最大的困难是什么？`,
          pitfalls: "不是 rule itself，而是 feeling of confusion。",
        },
        [
          "A. No interest in grammar at all.",
          "B. A feeling of confusion about similar forms.",
          "C. No teacher to explain examples.",
          "D. Too much writing homework every day.",
        ],
      ),
      makeQuestion(
        `g${seed.id}-c12`,
        12,
        `Why were short notes not enough for ${learner}?`,
        {
          answer:
            "A. Because they could not fully explain why an answer was correct.",
          point: "第一段最后一句是原因说明。",
          translation: "为什么简短笔记对他来说不够？",
          pitfalls: "要抓 explain why it was correct。",
        },
        [
          "A. Because they could not fully explain why an answer was correct.",
          "B. Because they were written in Chinese.",
          "C. Because they contained too many colors.",
          "D. Because they were too long to finish.",
        ],
      ),
      makeQuestion(
        `g${seed.id}-c13`,
        13,
        `What became part of the new method?`,
        {
          answer:
            "D. Collecting useful examples and rewriting the same idea in new forms.",
          point: "第二段列出新方法的核心动作。",
          translation: "下面哪项属于新方法的一部分？",
          pitfalls: "collect + mark + rewrite 是整组动作。",
        },
        [
          "A. Memorizing a whole grammar book every week.",
          "B. Ignoring sentence meaning during practice.",
          "C. Translating all examples word by word only.",
          "D. Collecting useful examples and rewriting the same idea in new forms.",
        ],
      ),
      makeQuestion(
        `g${seed.id}-c14`,
        14,
        `What changed after one month?`,
        {
          answer: "C. Answer checking became more systematic.",
          point: "第三段首句直接给出变化。",
          translation: "一个月后，出现了什么变化？",
          pitfalls: "still needed review 说明不是完全学会。",
        },
        [
          "A. Grammar became unnecessary in reading.",
          "B. The learner stopped reviewing all grammar.",
          "C. Answer checking became more systematic.",
          "D. The learner never made mistakes again.",
        ],
      ),
      makeQuestion(
        `g${seed.id}-c15`,
        15,
        `What is the main idea of the passage?`,
        {
          answer:
            "A. Grammar improves when learners connect rules with real sentences and checking habits.",
          point: "全文围绕“把语法放进真实句子 + 形成检查习惯”展开。",
          translation: "这篇文章的主旨是什么？",
          pitfalls: "主旨题要概括三段共同中心。",
        },
        [
          "A. Grammar improves when learners connect rules with real sentences and checking habits.",
          "B. Grammar is useful only for advanced learners.",
          "C. Exams should never test sentence structure.",
          "D. Fast guessing is better than careful checking.",
        ],
      ),
    ],
  };
}

function buildHeadingSection(seed: GrammarBlindspotSeed): DegreeExamSection {
  return {
    id: `grammar${seed.id}-heading`,
    title: "第三部分 概括段落大意和补全句子",
    questionRange: "16-25",
    score: 10,
    instructions:
      "Read the article. Match paragraphs with headings and complete the sentences.",
    sourceBasis: [`语法补盲：${seed.focusZh}`, "考点：主旨概括与信息提取"],
    material: seed.weakPoints.map(
      (point, index) =>
        `Paragraph ${String.fromCharCode(65 + index)}: ${capitalize(point)}.`,
    ),
    materialTranslation: seed.weakPointsZh.map(
      (point, index) => `${String.fromCharCode(65 + index)} 段：${point}。`,
    ),
    assistantTitle: "选项",
    assistantItems: [
      `A. ${capitalize(seed.weakPoints[0])}`,
      `B. ${capitalize(seed.weakPoints[1])}`,
      `C. ${capitalize(seed.weakPoints[2])}`,
      `D. ${capitalize(seed.weakPoints[3])}`,
      `E. ${capitalize(seed.weakPoints[4])}`,
      "F. Memorize grammar names without context",
    ],
    questions: [
      makeQuestion(`g${seed.id}-h16`, 16, "Paragraph A ____", {
        answer: `A. ${capitalize(seed.weakPoints[0])}`,
        point: "A 段对应第一个薄弱点。",
        translation: "A 段的大意是____。",
        pitfalls: "标题与段落基本同义重现。",
      }),
      makeQuestion(`g${seed.id}-h17`, 17, "Paragraph B ____", {
        answer: `B. ${capitalize(seed.weakPoints[1])}`,
        point: "B 段对应第二个薄弱点。",
        translation: "B 段的大意是____。",
        pitfalls: "按段落顺序匹配即可。",
      }),
      makeQuestion(`g${seed.id}-h18`, 18, "Paragraph C ____", {
        answer: `C. ${capitalize(seed.weakPoints[2])}`,
        point: "C 段对应第三个薄弱点。",
        translation: "C 段的大意是____。",
        pitfalls: "注意读关键词。",
      }),
      makeQuestion(`g${seed.id}-h19`, 19, "Paragraph D ____", {
        answer: `D. ${capitalize(seed.weakPoints[3])}`,
        point: "D 段对应第四个薄弱点。",
        translation: "D 段的大意是____。",
        pitfalls: "抓动词和对象。",
      }),
      makeQuestion(`g${seed.id}-h20`, 20, "Paragraph E ____", {
        answer: `E. ${capitalize(seed.weakPoints[4])}`,
        point: "E 段对应第五个薄弱点。",
        translation: "E 段的大意是____。",
        pitfalls: "排除干扰项 F。",
      }),
      makeQuestion(
        `g${seed.id}-h21`,
        21,
        "Paragraph A focuses on the first grammar ____.",
        {
          answer: "point",
          point: "固定表达 grammar point。",
          translation: "A 段聚焦第一个语法____。",
          pitfalls: "名词固定搭配。",
        },
      ),
      makeQuestion(
        `g${seed.id}-h22`,
        22,
        "Paragraph B explains another weak ____.",
        {
          answer: "point",
          point: "weak point 为固定表达。",
          translation: "B 段解释另一个薄弱____。",
          pitfalls: "point 重复出现是线索。",
        },
      ),
      makeQuestion(
        `g${seed.id}-h23`,
        23,
        "Paragraph C helps learners read grammar in real ____.",
        {
          answer: "context",
          point: "语法学习强调 real context。",
          translation: "C 段帮助学习者在真实____中读语法。",
          pitfalls: "context 是语法学习高频词。",
        },
      ),
      makeQuestion(
        `g${seed.id}-h24`,
        24,
        "Paragraph D reminds learners to avoid one common ____.",
        {
          answer: "error",
          point: "avoid one common error 搭配自然。",
          translation: "D 段提醒学习者避免一个常见____。",
          pitfalls: "名词选择要符合语义。",
        },
      ),
      makeQuestion(
        `g${seed.id}-h25`,
        25,
        "Paragraph E shows how review can improve grammar ____.",
        {
          answer: "use",
          point: "grammar use 表示语法使用。",
          translation: "E 段说明复习如何提升语法____。",
          pitfalls: "use 比 ability 更贴近语境。",
        },
      ),
    ],
  };
}

function buildFillSection(seed: GrammarBlindspotSeed): DegreeExamSection {
  return {
    id: `grammar${seed.id}-fill`,
    title: "第四部分 填句补文",
    questionRange: "26-30",
    score: 10,
    instructions:
      "Read the passage and choose five sentences out of the six given below to fit into the blanks.",
    sourceBasis: [`语法补盲：${seed.focusZh}`, "考点：句间衔接与逻辑关系"],
    material: [
      `Many learners are afraid of ${seed.focus} because the rule looks difficult at first. [26] The problem is often that they have not seen enough real examples.`,
      `A good review method should therefore be active. Learners can collect one useful sentence, change one small part, and compare the new result with the original form. [27] [28]`,
      `Another important point is patience. Grammar rarely becomes clear after one reading. [29] [30]`,
    ],
    materialTranslation: [
      `许多学习者害怕${seed.focusZh}，因为它一开始看上去很难。[26] 真正的问题往往是他们看过的真实例句还不够多。`,
      `因此，一种好的复习方法应该是主动的。学习者可以收集一句实用例句，改动其中一个小部分，再把新结果和原句对比。[27][28]`,
      `另一个重要点是耐心。语法通常不会看一遍就马上清楚。[29][30]`,
    ],
    assistantTitle: "备选句",
    assistantItems: [
      "A. Repeated comparison helps the difference become visible.",
      "B. One mistake can become a useful learning point.",
      "C. Grammar grows clearer when examples return many times.",
      "D. Many of them think memorizing names is enough.",
      "E. Slow progress does not mean no progress.",
      "F. Buying more pens is the best grammar solution.",
    ],
    questions: [
      makeQuestion(`g${seed.id}-f26`, 26, "Blank 26", {
        answer: "D",
        point: "前句说害怕语法，后句解释真正问题前，先承接错误想法最自然。",
        translation: "第 26 空应填：很多人以为只记名称就够了。",
        pitfalls: "D 与后句形成转折关系。",
      }),
      makeQuestion(`g${seed.id}-f27`, 27, "Blank 27", {
        answer: "A",
        point: "前句讲 compare，对应 A 中 repeated comparison。",
        translation: "第 27 空应填：反复比较会让差别变得可见。",
        pitfalls: "compare 是关键线索。",
      }),
      makeQuestion(`g${seed.id}-f28`, 28, "Blank 28", {
        answer: "B",
        point: "前后都在讲主动复习，错题也能变资源。",
        translation: "第 28 空应填：一次错误也可以变成有用的学习点。",
        pitfalls: "B 与 active review 逻辑一致。",
      }),
      makeQuestion(`g${seed.id}-f29`, 29, "Blank 29", {
        answer: "C",
        point: "前句说 grammar 不会一次就清楚，后面应强调重复出现。",
        translation: "第 29 空应填：例句反复出现时，语法会更清楚。",
        pitfalls: "C 与 repeatedly review 呼应。",
      }),
      makeQuestion(`g${seed.id}-f30`, 30, "Blank 30", {
        answer: "E",
        point: "段尾适合用鼓励性总结句收束。",
        translation: "第 30 空应填：进步慢不代表没有进步。",
        pitfalls: "E 与 patience 主题最一致。",
      }),
    ],
  };
}

function buildWordSection(seed: GrammarBlindspotSeed): DegreeExamSection {
  return {
    id: `grammar${seed.id}-word`,
    title: "第五部分 填词补文",
    questionRange: "31-40",
    score: 15,
    instructions:
      "Read the passage and select ten words from the word bank. Use the proper form if necessary.",
    sourceBasis: [
      `语法补盲：${seed.focusZh}`,
      "考点：词性判断、搭配与词形变化",
    ],
    material: [
      `${seed.focus} can look [31] when learners see it for the first time. Yet the rule becomes easier when practice is [32] and meaningful. A learner should not only read grammar notes but also [33] examples in real sentences.`,
      `If learners keep a [34] review notebook, they can return to the same structure many times. This repeated contact makes hidden grammar [35] easier to notice. It also helps learners become more [36] during exams.`,
      `Good grammar review needs both patience and [37]. The learner should [38] progress instead of waiting for instant success. In the end, grammar becomes less [39] and more [40].`,
    ],
    materialTranslation: [
      `${seed.focusZh}第一次接触时可能看上去很[31]。但如果练习足够[32]且有意义，规则就会容易得多。学习者不仅要读语法笔记，还要在真实句子里[33]例子。`,
      `如果学习者保留一本[34]复习笔记，就能多次回看同一结构。这样的反复接触会让隐藏的语法[35]更容易被注意到，也会帮助学习者在考试中更[36]。`,
      `好的语法复习既需要耐心，也需要[37]。学习者应该学会[38]自己的进步，而不是等待立刻成功。最终，语法会变得不再那么[39]，而更[40]。`,
    ],
    assistantTitle: "词库",
    assistantItems: [
      "A. difficult",
      "B. regular",
      "C. observe",
      "D. personal",
      "E. signals",
      "F. confident",
      "G. method",
      "H. record",
      "I. frightening",
      "J. practical",
      "K. compare",
      "L. grammar",
    ],
    questions: [
      makeQuestion(`g${seed.id}-w31`, 31, "Blank 31", {
        answer: "difficult",
        point: "look 后接形容词。",
        translation: "第 31 空：第一次看上去可能很难。",
        pitfalls: "注意词性应为形容词。",
      }),
      makeQuestion(`g${seed.id}-w32`, 32, "Blank 32", {
        answer: "regular",
        point: "and meaningful 前后并列，填形容词。",
        translation: "第 32 空：如果练习足够规律且有意义。",
        pitfalls: "regular practice 是常见搭配。",
      }),
      makeQuestion(`g${seed.id}-w33`, 33, "Blank 33", {
        answer: "observe",
        point: "also 后接动词原形。",
        translation: "第 33 空：还要在真实句子里观察例子。",
        pitfalls: "动词位置要用原形。",
      }),
      makeQuestion(`g${seed.id}-w34`, 34, "Blank 34", {
        answer: "personal",
        point: "修饰 review notebook，要用形容词。",
        translation: "第 34 空：保留一本个人复习笔记。",
        pitfalls: "名词前用形容词。",
      }),
      makeQuestion(`g${seed.id}-w35`, 35, "Blank 35", {
        answer: "signals",
        point: "grammar signals 语义自然，且需复数。",
        translation: "第 35 空：语法信号更容易被注意到。",
        pitfalls: "signal 在这里要用复数。",
      }),
      makeQuestion(`g${seed.id}-w36`, 36, "Blank 36", {
        answer: "confident",
        point: "become more 后接形容词。",
        translation: "第 36 空：考试中更有信心。",
        pitfalls: "注意 confidence / confident 区分。",
      }),
      makeQuestion(`g${seed.id}-w37`, 37, "Blank 37", {
        answer: "method",
        point: "patience and method 并列自然。",
        translation: "第 37 空：既需要耐心，也需要方法。",
        pitfalls: "结合语义选名词。",
      }),
      makeQuestion(`g${seed.id}-w38`, 38, "Blank 38", {
        answer: "record",
        point: "should 后接动词原形。",
        translation: "第 38 空：应该记录自己的进步。",
        pitfalls: "should 后不能用过去式。",
      }),
      makeQuestion(`g${seed.id}-w39`, 39, "Blank 39", {
        answer: "frightening",
        point: "less 后接形容词。",
        translation: "第 39 空：语法不再那么吓人。",
        pitfalls: "语义上与前文 fear 对应。",
      }),
      makeQuestion(`g${seed.id}-w40`, 40, "Blank 40", {
        answer: "practical",
        point: "与 frightening 构成对照，形容 grammar 的状态。",
        translation: "第 40 空：语法会变得更实用。",
        pitfalls: "句尾多用总结性形容词。",
      }),
    ],
  };
}

function buildClozeSection(seed: GrammarBlindspotSeed): DegreeExamSection {
  const learner = learnerNames[Number(seed.id) - 1];
  return {
    id: `grammar${seed.id}-cloze`,
    title: "第六部分 完形补文",
    questionRange: "41-50",
    score: 15,
    instructions:
      "Read the passage and fill in each blank with the correct form of the word given in brackets.",
    sourceBasis: [`语法补盲：${seed.focusZh}`, "考点：时态、结构与词形变化"],
    material: [
      `Last month, ${learner} [41] (begin) a new grammar review plan. Before that, ${learner} often [42] (choose) answers too quickly. A teacher then [43] (show) that grammar checking should start with sentence meaning.`,
      `Soon, ${learner} [44] (keep) a notebook and [45] (write) one useful example for each weak point. After several weeks, the learner became much [46] (calm) during practice and decided [47] (continue) the new habit.`,
      `By the end of the month, visible progress had already [48] (appear). Grammar no longer [49] (feel) completely confusing, and the whole review process became more [50] (system).`,
    ],
    materialTranslation: [
      `上个月，${learner}[41]开始了一项新的语法复习计划。此前，${learner}常常[42]过快作答。后来，一位老师[43]说明，语法检查应当从句意入手。`,
      `${learner}很快[44]记起了笔记本，并[45]为每个薄弱点写下一条例句。几周后，这位学习者在练习时变得更[46]冷静，并决定[47]继续这种习惯。`,
      `到月底时，明显进步已经[48]出现。语法不再[49]让人完全困惑，而整个复习过程也变得更[50]有系统。`,
    ],
    assistantTitle: "给词",
    assistantItems: [
      "41. begin",
      "42. choose",
      "43. show",
      "44. keep",
      "45. write",
      "46. calm",
      "47. continue",
      "48. appear",
      "49. feel",
      "50. system",
    ],
    questions: [
      makeQuestion(`g${seed.id}-cz41`, 41, "Blank 41", {
        answer: "began",
        point: "Last month 提示一般过去时。",
        translation: "第 41 空：上个月开始了一项计划。",
        pitfalls: "注意不规则变化。",
      }),
      makeQuestion(`g${seed.id}-cz42`, 42, "Blank 42", {
        answer: "chose",
        point: "before that 说明过去习惯，保持过去时。",
        translation: "第 42 空：以前他常常选得太快。",
        pitfalls: "choose 过去式是不规则变化。",
      }),
      makeQuestion(`g${seed.id}-cz43`, 43, "Blank 43", {
        answer: "showed",
        point: "过去叙述时态一致。",
        translation: "第 43 空：老师后来说明了这一点。",
        pitfalls: "show 的过去式加 -ed。",
      }),
      makeQuestion(`g${seed.id}-cz44`, 44, "Blank 44", {
        answer: "kept",
        point: "与后面的 wrote 并列，用过去式。",
        translation: "第 44 空：他开始保留一本笔记本。",
        pitfalls: "并列动作时态要一致。",
      }),
      makeQuestion(`g${seed.id}-cz45`, 45, "Blank 45", {
        answer: "wrote",
        point: "并列过去动作。",
        translation: "第 45 空：并写下例句。",
        pitfalls: "write 的过去式是不规则变化。",
      }),
      makeQuestion(`g${seed.id}-cz46`, 46, "Blank 46", {
        answer: "calmer",
        point: "much 后接比较级。",
        translation: "第 46 空：变得更冷静。",
        pitfalls: "比较级别漏 -er。",
      }),
      makeQuestion(`g${seed.id}-cz47`, 47, "Blank 47", {
        answer: "to continue",
        point: "decide to do 固定结构。",
        translation: "第 47 空：决定继续这种习惯。",
        pitfalls: "decide 后接不定式。",
      }),
      makeQuestion(`g${seed.id}-cz48`, 48, "Blank 48", {
        answer: "appeared",
        point: "had already 后接过去分词。",
        translation: "第 48 空：进步已经出现。",
        pitfalls: "完成时要用过去分词。",
      }),
      makeQuestion(`g${seed.id}-cz49`, 49, "Blank 49", {
        answer: "felt",
        point: "no longer 后仍为一般过去时叙述。",
        translation: "第 49 空：语法不再那样让人困惑。",
        pitfalls: "整段叙述时态别跳。",
      }),
      makeQuestion(`g${seed.id}-cz50`, 50, "Blank 50", {
        answer: "systematic",
        point: "became more 后接形容词。",
        translation: "第 50 空：过程变得更有系统。",
        pitfalls: "system 要变形为 systematic。",
      }),
    ],
  };
}

function buildWritingSection(seed: GrammarBlindspotSeed): DegreeExamSection {
  return {
    id: `grammar${seed.id}-writing`,
    title: "第七部分 短文写作",
    questionRange: "51",
    score: 30,
    instructions:
      "Write a short composition of about 100 words on the given topic.",
    sourceBasis: [`语法补盲：${seed.focusZh}`, "考点：学习反思类写作"],
    assistantTitle: "写作任务",
    assistantItems: [
      `题目：${seed.writingTitle}`,
      "要求：100 词左右，写出问题、方法和收获。",
      `建议：${seed.writingGuideZh}`,
    ],
    questions: [
      makeQuestion(
        `g${seed.id}-wr51`,
        51,
        `Write a composition titled ${seed.writingTitle}.`,
        {
          answer:
            "建议按“我为什么觉得难 + 我怎么复习 + 我现在有什么变化”三部分来写。",
          point: "这类作文适合结合真实学习经历，尽量使用简单但准确的句子。",
          translation: `请以《${seed.writingTitle}》为题写一篇约 100 词短文。`,
          pitfalls: "不要只列语法点，要写成完整短文，并体现自己的学习过程。",
        },
      ),
    ],
  };
}

function buildPaper(seed: GrammarBlindspotSeed): DegreeExamPaper {
  return {
    id: `degree-grammar-paper-${seed.id}`,
    title: `英语（二）语法补盲卷 ${seed.badgeNo}`,
    badge: `语法补盲 ${seed.badgeNo}`,
    description: seed.description,
    durationMinutes: 150,
    totalScore: 100,
    textbookBasis:
      "13000《英语（专升本）英语（二）自学教程》（张敬源、张虹，外语教学与研究出版社，2012 年版）",
    examBasis:
      "围绕英语（二）当前薄弱语法点设计，同样采用 7 大题型，强化语法识别、语境判断与写作迁移。",
    sections: [
      buildJudgeSection(seed),
      buildChoiceSection(seed),
      buildHeadingSection(seed),
      buildFillSection(seed),
      buildWordSection(seed),
      buildClozeSection(seed),
      buildWritingSection(seed),
    ],
  };
}

export const degreeExamGrammarBlindspotPapers: DegreeExamPaper[] =
  grammarBlindspotSeeds.map(buildPaper);
