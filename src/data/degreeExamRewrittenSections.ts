import type {
  DegreeExamPaper,
  DegreeExamQuestion,
  DegreeExamQuestionDetailKey,
  DegreeExamSection,
} from "./degreeExamFullPapers";

type ChoiceSeed = {
  paperNo: string;
  sourceBasis: [string, string];
  titleTheme: string;
  titleThemeZh: string;
  name: string;
  context: string;
  contextZh: string;
  oldBelief: string;
  oldBeliefZh: string;
  challenge: string;
  challengeZh: string;
  wrongIdea: string;
  wrongIdeaZh: string;
  methodSummary: string;
  methodSummaryZh: string;
  methods: [string, string, string];
  methodsZh: [string, string, string];
  result: string;
  resultZh: string;
  lesson: string;
  lessonZh: string;
};

type HeadingParagraphSeed = {
  heading: string;
  body: string;
  bodyTranslation: string;
  completionPrompt: string;
  completionAnswer: string;
};

type HeadingSeed = {
  paperNo: string;
  sourceBasis: [string, string];
  paragraphs: [
    HeadingParagraphSeed,
    HeadingParagraphSeed,
    HeadingParagraphSeed,
    HeadingParagraphSeed,
    HeadingParagraphSeed,
  ];
  distractor: string;
};

function makeQuestion(
  id: string,
  number: number,
  prompt: string,
  analysis: Record<DegreeExamQuestionDetailKey, string>,
  options?: string[],
): DegreeExamQuestion {
  return { id, number, prompt, analysis, options };
}

function buildChoiceSection(seed: ChoiceSeed): DegreeExamSection {
  const material = [
    `${seed.name} was preparing for ${seed.context}. At first, ${seed.oldBelief}. In practice, however, ${seed.challenge}. For a while, ${seed.name} believed that ${seed.wrongIdea}.`,
    `A teacher later suggested a more practical approach. ${seed.methodSummary}. ${seed.name} began to ${seed.methods[0]}, ${seed.methods[1]}, and ${seed.methods[2]}. These actions were small enough to repeat on ordinary days.`,
    `After some time, ${seed.result}. The deeper change was that ${seed.lesson}. In this way, ${seed.titleTheme.toLowerCase()} became something that could really survive daily life.`,
  ];

  const materialTranslation = [
    `${seed.name}当时正在为${seed.contextZh}做准备。起初，她觉得${seed.oldBeliefZh}。但在实际过程中，${seed.challengeZh}。有一段时间，${seed.name}一直以为${seed.wrongIdeaZh}。`,
    `后来，一位老师给了她一个更实际的方法。${seed.methodSummaryZh}。${seed.name}开始${seed.methodsZh[0]}、${seed.methodsZh[1]}，以及${seed.methodsZh[2]}。这些动作都足够小，因此能在普通日子里反复坚持。`,
    `一段时间后，${seed.resultZh}。更深层的变化在于，${seed.lessonZh}。就这样，${seed.titleThemeZh}不再只是口号，而变成了真正能适应日常生活的做法。`,
  ];

  return {
    id: `paper${seed.paperNo}-choice`,
    title: "第二部分 阅读选择",
    questionRange: "11-15",
    score: 10,
    instructions:
      "Read the following passage and choose the best answer to each question.",
    sourceBasis: [...seed.sourceBasis],
    material,
    materialTranslation,
    questions: [
      makeQuestion(
        `p${Number(seed.paperNo)}-c11`,
        11,
        `What did ${seed.name} believe at first?`,
        {
          answer: `A. ${capitalize(seed.oldBelief)}`,
          point: "第一段前半部分直接给出最初观念。",
          translation: `${seed.name}起初是怎么想的？`,
          pitfalls: "题目考 at first，不是后来改变后的方法。",
        },
        [
          `A. ${capitalize(seed.oldBelief)}`,
          "B. Perfect conditions were easy to find.",
          "C. Quick success mattered more than steady work.",
          "D. Teachers should do all the planning.",
        ],
      ),
      makeQuestion(
        `p${Number(seed.paperNo)}-c12`,
        12,
        `What problem did ${seed.name} face in practice?`,
        {
          answer: `B. ${capitalize(seed.challenge)}`,
          point: "第一段中间的实践困难就是答案。",
          translation: `${seed.name}在实际过程中遇到了什么问题？`,
          pitfalls: "注意 in practice，对应现实困难，不是主观误判。",
        },
        [
          "A. A complete loss of interest in English.",
          `B. ${capitalize(seed.challenge)}`,
          "C. No access to any learning materials.",
          "D. A rule that prevented any review.",
        ],
      ),
      makeQuestion(
        `p${Number(seed.paperNo)}-c13`,
        13,
        `Which action became part of the new method?`,
        {
          answer: `C. ${capitalize(seed.methods[1])}`,
          point: "第二段列出了三项新做法，选项对应其中之一。",
          translation: "下面哪一项成了新方法的一部分？",
          pitfalls: "定位第二段，注意与旧做法区分。",
        },
        [
          "A. Waiting for perfect free time every day.",
          "B. Ignoring small progress completely.",
          `C. ${capitalize(seed.methods[1])}`,
          "D. Studying only when pressure became extreme.",
        ],
      ),
      makeQuestion(
        `p${Number(seed.paperNo)}-c14`,
        14,
        `What change appeared after some time?`,
        {
          answer: `D. ${capitalize(seed.result)}`,
          point: "第三段前两句概括了阶段性结果。",
          translation: "一段时间后，出现了什么变化？",
          pitfalls: "这题考结果，不是方法本身。",
        },
        [
          "A. All pressure disappeared immediately.",
          "B. The learner returned to the old habit.",
          "C. Progress depended only on luck.",
          `D. ${capitalize(seed.result)}`,
        ],
      ),
      makeQuestion(
        `p${Number(seed.paperNo)}-c15`,
        15,
        "What is the main idea of the passage?",
        {
          answer: `A. ${capitalize(seed.lesson)}`,
          point: "全文都在说明更现实的方法如何带来稳定进步。",
          translation: "这篇文章的主旨是什么？",
          pitfalls: "主旨题要概括全文，不要只抓一个细节。",
        },
        [
          `A. ${capitalize(seed.lesson)}`,
          "B. Every learner should use exactly the same plan.",
          "C. Long study hours are the only sign of progress.",
          "D. Small steps are useful only for advanced learners.",
        ],
      ),
    ],
  };
}

function buildHeadingSection(seed: HeadingSeed): DegreeExamSection {
  const assistantItems = [
    `A. ${seed.paragraphs[0].heading}`,
    `B. ${seed.paragraphs[1].heading}`,
    `C. ${seed.paragraphs[2].heading}`,
    `D. ${seed.paragraphs[3].heading}`,
    `E. ${seed.paragraphs[4].heading}`,
    `F. ${seed.distractor}`,
  ];

  return {
    id: `paper${seed.paperNo}-heading`,
    title: "第三部分 概括段落大意和补全句子",
    questionRange: "16-25",
    score: 10,
    instructions:
      "Read the article. Match paragraphs with headings and complete the sentences.",
    sourceBasis: [...seed.sourceBasis],
    material: seed.paragraphs.map(
      (item, index) =>
        `Paragraph ${String.fromCharCode(65 + index)}: ${item.body}`,
    ),
    materialTranslation: seed.paragraphs.map(
      (item, index) =>
        `${String.fromCharCode(65 + index)} 段：${item.bodyTranslation}`,
    ),
    assistantTitle: "选项",
    assistantItems,
    questions: [
      ...seed.paragraphs.map((item, index) =>
        makeQuestion(
          `p${Number(seed.paperNo)}-h${16 + index}`,
          16 + index,
          `Paragraph ${String.fromCharCode(65 + index)} ____`,
          {
            answer: `${String.fromCharCode(65 + index)}. ${item.heading}`,
            point: "标题与段落首句和核心句一致。",
            translation: `${String.fromCharCode(65 + index)} 段的大意是____。`,
            pitfalls: "概括题要抓段落中心，不要只看局部细节。",
          },
        ),
      ),
      ...seed.paragraphs.map((item, index) =>
        makeQuestion(
          `p${Number(seed.paperNo)}-h${21 + index}`,
          21 + index,
          item.completionPrompt,
          {
            answer: item.completionAnswer,
            point: "可回到对应段落找原词或近义表达。",
            translation: `请根据文章完成句子：${item.completionPrompt}`,
            pitfalls: "优先回文定位关键词，注意词形。",
          },
        ),
      ),
    ],
  };
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const choiceSeeds: ChoiceSeed[] = [
  {
    paperNo: "01",
    sourceBasis: ["教材：学习方法", "考点：细节理解与主旨概括"],
    titleTheme: "steady study",
    titleThemeZh: "稳定学习",
    name: "Sun Jing",
    context: "her English degree exam",
    contextZh: "自己的英语学位考试",
    oldBelief:
      "serious study required long quiet evenings with a heavy grammar book",
    oldBeliefZh: "真正认真学习就必须在安静夜晚花很长时间啃厚重语法书",
    challenge: "she was usually too tired after work to keep that plan",
    challengeZh: "她下班后通常太累，根本坚持不了这个计划",
    wrongIdea: "the real problem was a lack of ability",
    wrongIdeaZh: "真正的问题是自己能力不够",
    methodSummary: "The advice was to change the method rather than the goal",
    methodSummaryZh: "老师建议她改变方法，而不是改变目标",
    methods: [
      "review ten old words each day",
      "read one short passage on the bus",
      "write a few useful sentences about her own life",
    ],
    methodsZh: [
      "每天复习十个旧单词",
      "在公交车上读一篇短文",
      "写几句和自己生活有关的实用句子",
    ],
    result:
      "her reading speed improved and she felt less afraid of long passages",
    resultZh: "她的阅读速度提高了，也不再那么害怕长篇文章",
    lesson:
      "adult learners make progress when their methods fit ordinary daily life",
    lessonZh: "成人学习者在方法贴近日常生活时，更容易真正进步",
  },
  {
    paperNo: "02",
    sourceBasis: ["教材：阅读习惯", "考点：细节定位与观点理解"],
    titleTheme: "regular reading",
    titleThemeZh: "规律阅读",
    name: "Guo Lin",
    context: "weekend reading practice",
    contextZh: "周末阅读训练",
    oldBelief: "good reading meant checking every unknown word at once",
    oldBeliefZh: "好的阅读就等于立刻查清每一个生词",
    challenge:
      "he stopped too often and quickly lost the main idea of each article",
    challengeZh: "他停下来查词太频繁，很快就抓不住文章主旨",
    wrongIdea: "slow reading by itself would guarantee understanding",
    wrongIdeaZh: "只要读得慢，就一定能读懂",
    methodSummary: "A club leader asked him to read for meaning before detail",
    methodSummaryZh: "阅读小组负责人让他先抓意义，再回头看细节",
    methods: [
      "choose one short text before each meeting",
      "share two useful sentences with the group",
      "return to difficult words only after finding the main idea",
    ],
    methodsZh: [
      "每次活动前先选一篇短文",
      "和小组分享两句有用表达",
      "找到主旨后再回头处理难词",
    ],
    result: "he read more steadily and no longer gave up after a few new words",
    resultZh: "他的阅读变得更稳定，也不会再因为几个生词就放弃",
    lesson:
      "shared discussion and clear reading order help learners keep going",
    lessonZh: "共同讨论和清晰阅读顺序，能帮助学习者长期坚持下去",
  },
  {
    paperNo: "03",
    sourceBasis: ["教材：网络学习", "考点：信息筛选与推理判断"],
    titleTheme: "online study",
    titleThemeZh: "线上学习",
    name: "Li Fang",
    context: "an online English course",
    contextZh: "一门线上英语课程",
    oldBelief: "saving more links would automatically make her better prepared",
    oldBeliefZh: "只要保存更多链接，自己就会准备得更充分",
    challenge: "too many materials made it hard to know what really mattered",
    challengeZh: "材料太多，反而让她分不清哪些内容真正重要",
    wrongIdea: "collecting information was the same as learning from it",
    wrongIdeaZh: "收集信息就等于真正学习了这些信息",
    methodSummary:
      "Her tutor helped her create a simple rule for choosing sources",
    methodSummaryZh: "辅导老师帮她建立了一套简单的信息筛选规则",
    methods: [
      "ask who produced each source",
      "check what exact problem the material could solve",
      "keep one main text at the center of daily study",
    ],
    methodsZh: [
      "先问清每份资料是谁做的",
      "确认这份材料到底能解决什么具体问题",
      "让一份主材料始终处于每天学习的中心",
    ],
    result: "she spent less time collecting and more time actually studying",
    resultZh: "她花在收集上的时间更少了，真正学习的时间更多了",
    lesson:
      "online learning becomes effective when learners manage information wisely",
    lessonZh: "当学习者能聪明地管理信息时，线上学习才会真正有效",
  },
  {
    paperNo: "04",
    sourceBasis: ["教材：办公与阅读", "考点：细节判断与主旨概括"],
    titleTheme: "practical efficiency",
    titleThemeZh: "务实高效",
    name: "Zhou Yan",
    context: "document review in an office",
    contextZh: "办公室里的文档审阅工作",
    oldBelief: "digital files were the best choice for every task",
    oldBeliefZh: "电子文件对所有任务来说都是最好的选择",
    challenge:
      "important details were still missed when long final documents stayed only on screen",
    challengeZh: "当重要定稿文件只在屏幕上看时，一些关键细节还是会被漏掉",
    wrongIdea:
      "using a single tool for all work was the true sign of efficiency",
    wrongIdeaZh: "所有工作只用一种工具，才是真正高效",
    methodSummary: "The office adopted a more flexible rule",
    methodSummaryZh: "办公室后来采用了更灵活的规则",
    methods: [
      "keep ordinary drafts digital",
      "print especially important final documents for checking",
      "match the review tool to the purpose of the task",
    ],
    methodsZh: [
      "让普通草稿保持电子形式",
      "把特别重要的定稿文件打印出来核查",
      "根据任务目的选择合适的审阅工具",
    ],
    result:
      "the office still printed less than before but felt more confident about final checking",
    resultZh: "办公室的打印量仍比以前少，但大家对最终审阅更有把握了",
    lesson: "real efficiency comes from choosing tools according to purpose",
    lessonZh: "真正的效率来自根据任务目的选择工具",
  },
  {
    paperNo: "05",
    sourceBasis: ["教材：职场沟通", "考点：细节理解与主旨概括"],
    titleTheme: "clear communication",
    titleThemeZh: "清晰沟通",
    name: "Han Qiang",
    context: "team work in a technology company",
    contextZh: "一家科技公司的团队协作",
    oldBelief: "professional skill alone was enough for smooth cooperation",
    oldBeliefZh: "只要专业能力强，团队协作自然就会顺畅",
    challenge: "unclear meetings and emails kept causing repeated questions",
    challengeZh: "会议和邮件表达不清，导致同样的问题一再出现",
    wrongIdea: "communication problems would disappear by themselves over time",
    wrongIdeaZh: "沟通问题会随着时间自然消失",
    methodSummary:
      "A short workshop gave the team more direct communication habits",
    methodSummaryZh: "一次简短培训让团队形成了更直接的沟通习惯",
    methods: [
      "write emails with one clear purpose",
      "end messages with the next required action",
      "ask simple checking questions during discussion",
    ],
    methodsZh: [
      "写邮件时只围绕一个明确目的",
      "在信息结尾写清下一步要做什么",
      "讨论时用简单问题确认彼此是否理解一致",
    ],
    result: "meetings became shorter and misunderstandings became fewer",
    resultZh: "会议变短了，误解也变少了",
    lesson:
      "clear communication helps professional ability produce real team results",
    lessonZh: "清晰沟通能让专业能力真正转化为团队成果",
  },
  {
    paperNo: "06",
    sourceBasis: ["教材：理财与消费", "考点：细节理解与推理概括"],
    titleTheme: "budget control",
    titleThemeZh: "预算控制",
    name: "Chen Yu",
    context: "managing monthly spending",
    contextZh: "管理每月开支",
    oldBelief:
      "a single big expense must be the only reason his budget felt tight",
    oldBeliefZh: "预算吃紧一定只是因为某一笔大额支出",
    challenge: "many small daily purchases quietly cost more than he expected",
    challengeZh: "很多日常小消费悄悄加起来，比他想象得更花钱",
    wrongIdea: "small spending was too harmless to record seriously",
    wrongIdeaZh: "小额花费太不起眼，不值得认真记录",
    methodSummary: "He chose a few modest rules instead of a dramatic ban",
    methodSummaryZh: "他没有突然全面禁止消费，而是给自己定了几条温和规则",
    methods: [
      "bring lunch from home several times a week",
      "wait twenty-four hours before unnecessary online buying",
      "write down every non-essential purchase at night",
    ],
    methodsZh: [
      "每周有几天自己带午饭",
      "非必要网购先等二十四小时再决定",
      "晚上记下每一笔非必要开支",
    ],
    result: "he felt calmer about money and bought less on impulse",
    resultZh: "他面对金钱更从容了，也更少冲动消费",
    lesson:
      "good budgeting becomes possible when decisions slow down and value becomes clearer",
    lessonZh: "当决定慢下来、价值更清楚时，预算管理才真正可能做好",
  },
  {
    paperNo: "07",
    sourceBasis: ["教材：旅行准备", "考点：细节理解与观点概括"],
    titleTheme: "travel planning",
    titleThemeZh: "旅行规划",
    name: "Liu Mei",
    context: "her first independent trip",
    contextZh: "第一次独自旅行",
    oldBelief: "a successful journey needed a full and exciting schedule",
    oldBeliefZh: "一次成功旅行必须安排得丰富而紧凑",
    challenge:
      "too many planned visits would leave little space for rest or change",
    challengeZh: "行程安排得太满，会让休息和临时变化几乎没有空间",
    wrongIdea:
      "seeing everything was more important than understanding the place",
    wrongIdeaZh: "去更多地方比真正理解一座城市更重要",
    methodSummary: "She simplified the trip before leaving",
    methodSummaryZh: "出发前，她主动把旅行计划做了简化",
    methods: [
      "choose only two main attractions",
      "keep one part of each day flexible",
      "write down important addresses on paper",
    ],
    methodsZh: [
      "只选两个主要景点",
      "每天留出一段灵活时间",
      "把重要地址抄在纸上",
    ],
    result:
      "she felt safer during the trip and did not see small surprises as failure",
    resultZh: "旅行中她更安心了，也不再把小意外看成失败",
    lesson:
      "good travel plans guide experience without controlling every detail",
    lessonZh: "好的旅行计划应该引导体验，而不是控制每个细节",
  },
  {
    paperNo: "08",
    sourceBasis: ["教材：家庭与时间管理", "考点：细节理解与主旨概括"],
    titleTheme: "family coordination",
    titleThemeZh: "家庭协调",
    name: "Wang Hui",
    context: "organizing family time",
    contextZh: "安排家庭时间",
    oldBelief:
      "people in the same home could remember one another's plans without help",
    oldBeliefZh: "住在同一个家里的人，不用额外工具也能记住彼此安排",
    challenge:
      "small misunderstandings kept appearing because plans stayed only in people's minds",
    challengeZh: "很多小误会反复出现，因为大家的安排都只放在各自脑子里",
    wrongIdea:
      "conflict came mainly from personality rather than unclear schedules",
    wrongIdeaZh: "家庭冲突主要来自性格，而不是日程不清楚",
    methodSummary: "The family made daily plans visible to everyone",
    methodSummaryZh: "这个家庭后来把每天的安排都公开展示出来",
    methods: [
      "put a large calendar in the living room",
      "mark work and school events in different colors",
      "discuss busy days before they arrived",
    ],
    methodsZh: [
      "在客厅放一张大日历",
      "用不同颜色标出工作和学校安排",
      "在忙碌日来临前提前讨论",
    ],
    result: "the family still had many tasks but fewer sudden conflicts",
    resultZh: "这个家庭依然很忙，但突发冲突少了很多",
    lesson:
      "shared schedules reduce uncertainty and make family cooperation easier",
    lessonZh: "共享日程能减少不确定感，让家庭合作更容易",
  },
  {
    paperNo: "09",
    sourceBasis: ["教材：阅读技巧", "考点：细节判断与主旨概括"],
    titleTheme: "exam reading",
    titleThemeZh: "考试阅读",
    name: "Guo Peng",
    context: "English reading practice for tests",
    contextZh: "英语考试阅读训练",
    oldBelief: "careful reading always meant reading every line equally slowly",
    oldBeliefZh: "认真阅读就一定意味着每一行都要同样慢地读",
    challenge:
      "long passages took too much time when questions asked mainly about topic or structure",
    challengeZh: "当题目主要考主旨或结构时，长文章会耗掉他太多时间",
    wrongIdea: "fast first reading must be careless reading",
    wrongIdeaZh: "先快读一遍就一定是不认真",
    methodSummary:
      "A teacher trained him to change reading speed according to purpose",
    methodSummaryZh: "老师训练他根据阅读目的来调整速度",
    methods: [
      "look first for topic sentences",
      "notice repeated key words and the writer's movement of thought",
      "return to details only after finding the passage structure",
    ],
    methodsZh: [
      "先去找主题句",
      "注意反复出现的关键词和作者思路推进",
      "先看清文章结构，再回头看细节",
    ],
    result: "he understood long passages better and felt less lost inside them",
    resultZh: "他对长文章的理解更好了，也不再那么容易读着读着就迷失",
    lesson: "effective exam reading depends on adjusting attention to purpose",
    lessonZh: "有效的考试阅读取决于能否根据目的分配注意力",
  },
  {
    paperNo: "10",
    sourceBasis: ["教材：目标设定", "考点：细节判断与主旨概括"],
    titleTheme: "weekly goals",
    titleThemeZh: "每周目标",
    name: "Ma Li",
    context: "a new term of study",
    contextZh: "新学期学习",
    oldBelief:
      "broad promises such as study harder were enough to guide action",
    oldBeliefZh: "像“更努力学习”这样的宽泛承诺，已经足够指导行动",
    challenge: "those promises gave her no clear next step on busy days",
    challengeZh: "一到忙碌的时候，这些承诺根本不能告诉她下一步具体做什么",
    wrongIdea: "motivation alone would decide whether work got done",
    wrongIdeaZh: "只要有动力，事情自然就能做成",
    methodSummary:
      "Her teacher required all promises to become visible weekly tasks",
    methodSummaryZh: "老师要求她把所有承诺都改成可见、可检查的每周任务",
    methods: [
      "set goals that could be checked within one week",
      "attach concrete numbers and time points to each task",
      "review each plan for both completion and realism",
    ],
    methodsZh: [
      "给自己设定一周内能检查的目标",
      "给每项任务附上具体数量和时间点",
      "每周复盘计划是否完成、是否现实",
    ],
    result: "she felt less guilty and more in control of her study rhythm",
    resultZh: "她的内疚感减轻了，对学习节奏的掌控感也更强了",
    lesson:
      "motivation becomes steadier when goals turn into small visible actions",
    lessonZh: "当目标变成可见的小行动时，动力会更稳定",
  },
  {
    paperNo: "11",
    sourceBasis: ["教材：健康生活", "考点：细节理解与主旨概括"],
    titleTheme: "healthy routines",
    titleThemeZh: "健康习惯",
    name: "Zhao Ming",
    context: "his new office life",
    contextZh: "新的办公室生活",
    oldBelief:
      "health improvement required a difficult plan before any change could begin",
    oldBeliefZh: "健康改善一定要先靠一套很难的计划才能开始",
    challenge:
      "screen work, poor sleep, and forgotten water made him tired every day",
    challengeZh: "久坐看屏幕、睡不好、还总忘记喝水，让他每天都很疲惫",
    wrongIdea: "small habits were too weak to matter",
    wrongIdeaZh: "小习惯的力量太弱，根本不值得做",
    methodSummary:
      "He began with habits that could survive ordinary working days",
    methodSummaryZh: "他从那些能在普通工作日坚持下来的小习惯开始",
    methods: [
      "walk for twenty minutes after dinner",
      "put his phone away before sleep",
      "stand up briefly each hour and keep water nearby",
    ],
    methodsZh: [
      "晚饭后步行二十分钟",
      "睡前把手机放到一边",
      "每小时短暂起身活动，并把水放在手边",
    ],
    result: "he felt more energetic in the morning and more focused at work",
    resultZh: "他早晨更有精神，工作时也更专注了",
    lesson: "the most effective habit is often the one that fits normal life",
    lessonZh: "最有效的习惯，往往是最贴近日常生活的习惯",
  },
  {
    paperNo: "12",
    sourceBasis: ["教材：在线学习", "考点：细节理解与主旨概括"],
    titleTheme: "online discipline",
    titleThemeZh: "线上自律",
    name: "Li Na",
    context: "a flexible online course",
    contextZh: "一门灵活的线上课程",
    oldBelief: "freedom alone would make learning easier",
    oldBeliefZh: "只要更自由，学习自然就会更轻松",
    challenge:
      "without visible structure it became too easy to delay one lesson after another",
    challengeZh: "如果没有看得见的结构，一节课拖一节课就会变得特别容易",
    wrongIdea: "she could always check hard points later",
    wrongIdeaZh: "难点完全可以以后再慢慢查",
    methodSummary: "She gave flexible learning a fixed outer structure",
    methodSummaryZh: "她给这种灵活学习加上了一个固定外部结构",
    methods: [
      "reserve three fixed evenings for study",
      "turn off unnecessary phone notifications",
      "ask questions in the course discussion area immediately",
    ],
    methodsZh: [
      "固定每周三个晚上学习",
      "关闭不必要的手机提醒",
      "有问题就马上到课程讨论区发问",
    ],
    result:
      "the course became more effective and her attention became steadier",
    resultZh: "这门课变得更有效了，她的注意力也更稳定了",
    lesson:
      "digital tools work best when they support discipline rather than replace it",
    lessonZh: "数字工具只有在支持自律而不是取代自律时，才能发挥最好作用",
  },
  {
    paperNo: "13",
    sourceBasis: ["教材：社区服务", "考点：细节理解与主旨概括"],
    titleTheme: "community learning",
    titleThemeZh: "社区学习",
    name: "Liu Qing",
    context: "volunteer work in a small library",
    contextZh: "小图书馆里的志愿服务",
    oldBelief:
      "a library's value depended mainly on the number of books it lent",
    oldBeliefZh: "图书馆的价值主要取决于借出多少本书",
    challenge:
      "many visitors needed quiet space, discussion, and support in addition to books",
    challengeZh: "很多来访者除了借书，还需要安静空间、讨论和学习支持",
    wrongIdea: "book lending alone could meet every reading need",
    wrongIdeaZh: "只要能借书，就已经满足了所有阅读需求",
    methodSummary: "Volunteers expanded the library's role step by step",
    methodSummaryZh: "志愿者们一点点扩大了图书馆的角色",
    methods: [
      "set different time periods for different reading needs",
      "create space for learners to study quietly together",
      "treat the library as a small public learning space",
    ],
    methodsZh: [
      "为不同阅读需求安排不同时间段",
      "给学习者提供安静共学的空间",
      "把图书馆当成一个小型公共学习空间来运营",
    ],
    result: "more people stayed to learn, talk, and help others",
    resultZh: "留下来学习、交流和帮助他人的人变多了",
    lesson:
      "community libraries matter because they lower the cost of beginning and support growth",
    lessonZh:
      "社区图书馆的重要之处，在于它降低了开始学习的门槛，并支持人们成长",
  },
  {
    paperNo: "14",
    sourceBasis: ["教材：职场写作", "考点：细节理解与主旨概括"],
    titleTheme: "workplace writing",
    titleThemeZh: "职场写作",
    name: "Qin Wei",
    context: "email training at work",
    contextZh: "工作中的邮件训练",
    oldBelief: "a longer and more formal email must be more professional",
    oldBeliefZh: "更长、更正式的邮件一定更专业",
    challenge:
      "long background explanations often hid the real request from the reader",
    challengeZh: "大段背景说明常常把真正请求埋起来，让读者找不到重点",
    wrongIdea: "professional writing depended mainly on sounding formal",
    wrongIdeaZh: "专业写作主要靠语气正式来体现",
    methodSummary:
      "The trainer redirected attention to usefulness for the reader",
    methodSummaryZh: "培训老师把注意力重新拉回到“是否对读者有用”这件事上",
    methods: [
      "state the exact purpose early",
      "include only necessary information for that reader",
      "end with one clear next action",
    ],
    methodsZh: [
      "尽早写出准确目的",
      "只提供这个读者真正需要的信息",
      "在结尾明确写出下一步行动",
    ],
    result: "messages became shorter, clearer, and easier for others to act on",
    resultZh: "邮件变得更短、更清楚，也更方便别人立刻采取行动",
    lesson:
      "clear workplace writing should be polite, purposeful, and useful to the reader",
    lessonZh: "清晰的职场写作应当兼顾礼貌、目的明确和对读者有用",
  },
  {
    paperNo: "15",
    sourceBasis: ["教材：备考策略", "考点：细节理解与主旨概括"],
    titleTheme: "steady review",
    titleThemeZh: "稳定复习",
    name: "Han Rui",
    context: "an important English exam",
    contextZh: "一场重要英语考试",
    oldBelief:
      "studying in sudden bursts could make up for days of little work",
    oldBeliefZh: "靠几次突击学习，就能补回平时做得少的那些天",
    challenge:
      "his uneven rhythm made him feel constantly behind and mentally tired",
    challengeZh: "不均衡的节奏让他总觉得自己落后，而且精神很累",
    wrongIdea: "pressure itself would keep his preparation under control",
    wrongIdeaZh: "只要压力够大，复习自然就会被逼着走上正轨",
    methodSummary: "A teacher helped him build a steadier review pattern",
    methodSummaryZh: "老师帮助他建立了一套更稳定的复习模式",
    methods: [
      "divide study into regular vocabulary and reading blocks",
      "add short writing revision each week",
      "check what was finished and what should come next",
    ],
    methodsZh: [
      "把学习拆成固定的词汇和阅读模块",
      "每周加入简短写作复习",
      "检查已经完成什么、接下来该做什么",
    ],
    result:
      "pressure became less chaotic and he trusted his progress more easily",
    resultZh: "压力不再那样混乱失控，他也更容易相信自己的进步",
    lesson: "steady preparation can stop pressure from controlling attention",
    lessonZh: "稳定准备能防止压力反过来控制注意力",
  },
];

const headingSeeds: HeadingSeed[] = [
  {
    paperNo: "01",
    sourceBasis: ["教材：学习策略", "考点：段落主旨概括与句子补全"],
    paragraphs: [
      {
        heading: "A clear reason gives direction",
        body: "Adult learners improve more steadily when they know clearly why they are studying. A clear reason helps later choices move in one direction.",
        bodyTranslation:
          "当成人学习者清楚自己为什么学习时，他们的进步会更稳定。明确的原因能让后面的选择始终朝着同一个方向前进。",
        completionPrompt:
          "A clear reason helps later choices move in one ____.",
        completionAnswer: "direction",
      },
      {
        heading: "Short repeated study fits real life",
        body: "Short and repeated study periods are often more realistic than rare long sessions. Small tasks fit ordinary working days better.",
        bodyTranslation:
          "短而反复的学习时间，通常比偶尔一次很长的学习更现实。小任务也更适合普通工作日。",
        completionPrompt: "Small tasks fit ordinary working ____ better.",
        completionAnswer: "days",
      },
      {
        heading: "Review turns contact into memory",
        body: "Old words and old passages should return again and again. Review turns brief contact into lasting memory.",
        bodyTranslation:
          "旧单词和旧文章都应该一再回到学习中。复习能把短暂接触变成长久记忆。",
        completionPrompt: "Review turns brief contact into lasting ____.",
        completionAnswer: "memory",
      },
      {
        heading: "Bring learning into daily life",
        body: "Learning becomes more useful when it enters daily life. A sentence connected with real work or family is easier to remember.",
        bodyTranslation:
          "当学习进入日常生活时，它就会更有用。和真实工作或家庭有关的句子更容易记住。",
        completionPrompt:
          "A sentence connected with real life is easier to ____.",
        completionAnswer: "remember",
      },
      {
        heading: "Visible progress protects confidence",
        body: "Simple records of completed tasks can protect confidence. When progress is visible, learners feel less likely to give up.",
        bodyTranslation:
          "对已完成任务做简单记录，能保护学习信心。当进步看得见时，学习者就不那么容易放弃。",
        completionPrompt: "Visible progress helps protect learners' ____.",
        completionAnswer: "confidence",
      },
    ],
    distractor: "Perfect conditions matter more than habits",
  },
  {
    paperNo: "02",
    sourceBasis: ["教材：阅读习惯", "考点：段落大意与信息提取"],
    paragraphs: [
      {
        heading: "Shared preparation starts good discussion",
        body: "Reading groups work better when members arrive with something concrete to share. Shared preparation gives discussion a real beginning.",
        bodyTranslation:
          "当成员带着具体内容来分享时，阅读小组会运转得更好。共同准备让讨论真正有了起点。",
        completionPrompt: "Shared preparation gives discussion a real ____.",
        completionAnswer: "beginning",
      },
      {
        heading: "Read for paragraph meaning first",
        body: "Good readers do not stop every time they meet a new word. They first ask what the whole paragraph is trying to say.",
        bodyTranslation:
          "好的读者不会每遇到一个生词就停下来。他们会先问整段到底想表达什么。",
        completionPrompt:
          "Good readers first ask what the whole ____ is trying to say.",
        completionAnswer: "paragraph",
      },
      {
        heading: "Context grows clearer through discussion",
        body: "Discussion helps learners discover that meaning often becomes clearer through context. Other readers can show useful links.",
        bodyTranslation:
          "讨论能让学习者发现，意思常常会在上下文中变得更清楚。其他读者也能指出有用的联系。",
        completionPrompt: "Meaning often becomes clearer through ____.",
        completionAnswer: "context",
      },
      {
        heading: "Regular meetings create responsibility",
        body: "A regular meeting creates gentle responsibility. People continue more easily when others expect their participation.",
        bodyTranslation:
          "固定聚会会带来一种温和的责任感。当别人期待你的参与时，人更容易继续坚持。",
        completionPrompt:
          "People continue more easily when others expect their ____.",
        completionAnswer: "participation",
      },
      {
        heading: "Reading can become a shared act",
        body: "Over time, reading stops feeling like a private test and becomes a shared act of understanding. This change makes practice easier.",
        bodyTranslation:
          "随着时间推移，阅读不再像一场私人测试，而会变成一种共同理解的活动。这种变化会让练习更容易坚持。",
        completionPrompt: "Over time, reading can become a shared act of ____.",
        completionAnswer: "understanding",
      },
    ],
    distractor: "Every unknown word must be translated first",
  },
  {
    paperNo: "03",
    sourceBasis: ["教材：信息筛选", "考点：段落主旨概括与信息回填"],
    paragraphs: [
      {
        heading: "Too much saved material creates confusion",
        body: "Online learning becomes confusing when learners save material without a clear standard. Quantity can hide priority.",
        bodyTranslation:
          "如果学习者没有清晰标准就不断保存资料，线上学习就会变得混乱。数量会掩盖重点。",
        completionPrompt: "Without a clear standard, quantity can hide ____.",
        completionAnswer: "priority",
      },
      {
        heading: "Clear questions improve source choice",
        body: "A simple set of questions can improve source selection. Asking who, when, and why reduces blind collecting.",
        bodyTranslation:
          "一组简单问题能提升资料筛选效果。问清是谁做的、何时发布、为什么使用，能减少盲目收藏。",
        completionPrompt: "Asking who, when, and why reduces blind ____.",
        completionAnswer: "collecting",
      },
      {
        heading: "One main text should stay central",
        body: "One main text should hold the center of daily study. Extra resources work best when they solve a specific problem.",
        bodyTranslation:
          "每天学习最好始终有一份主材料处在中心位置。补充资源只有在解决具体问题时才最有用。",
        completionPrompt:
          "Extra resources work best when they solve a specific ____.",
        completionAnswer: "problem",
      },
      {
        heading: "Good habits save attention",
        body: "Good information habits save attention as well as time. Learners use less energy deciding where to look next.",
        bodyTranslation:
          "好的信息习惯节省的不只是时间，还有注意力。学习者会少花精力去决定下一步该看什么。",
        completionPrompt:
          "Good information habits save attention as well as ____.",
        completionAnswer: "time",
      },
      {
        heading: "Control over sources builds confidence",
        body: "Confidence grows when learners can judge sources for themselves. Control creates calm.",
        bodyTranslation:
          "当学习者能自己判断信息来源时，信心就会增长。掌控感会带来平静。",
        completionPrompt:
          "Confidence grows when learners can judge sources for ____.",
        completionAnswer: "themselves",
      },
    ],
    distractor: "The newest resource is always the best",
  },
  {
    paperNo: "04",
    sourceBasis: ["教材：办公阅读", "考点：段意匹配与关键信息提取"],
    paragraphs: [
      {
        heading: "Digital tools support speed and sharing",
        body: "Digital tools are excellent for speed, search, and sharing. They support quick movement through information.",
        bodyTranslation:
          "电子工具在速度、搜索和共享方面都很出色。它们支持人们快速处理信息。",
        completionPrompt:
          "Digital tools are excellent for speed, search, and ____.",
        completionAnswer: "sharing",
      },
      {
        heading: "Paper still helps final checking",
        bodyTranslation:
          "当任务需要仔细做最终检查时，纸质材料仍然有用。在纸面上，结构和细节往往更容易被同时看见。",
        body: "Paper can still be useful when the task requires careful final checking. Structure and detail are often easier to view together on a page.",
        completionPrompt: "Paper can help when the task requires final ____.",
        completionAnswer: "checking",
      },
      {
        heading: "Different purposes need different tools",
        bodyTranslation:
          "高效办公室不会执着于寻找某一个完美工具。它们会根据不同目的选择不同工具。",
        body: "Efficient offices do not search for one perfect tool. They choose different tools for different purposes.",
        completionPrompt: "Efficient offices choose tools for different ____.",
        completionAnswer: "purposes",
      },
      {
        heading: "Flexible rules fit different tasks",
        bodyTranslation:
          "灵活规则往往比彻底禁止更有效。普通任务和重要的最终任务可能需要不同处理方式。",
        body: "A flexible rule often works better than a total ban. Ordinary tasks and important final tasks may need different treatment.",
        completionPrompt: "A flexible rule may work better than a total ____.",
        completionAnswer: "ban",
      },
      {
        heading: "Practical judgment matters most",
        bodyTranslation:
          "真正重要的是实践中的判断力。好的工作来自让方法和目标相匹配。",
        body: "The real lesson is practical judgment. Good work comes from matching methods to goals.",
        completionPrompt: "Good work comes from matching methods to ____.",
        completionAnswer: "goals",
      },
    ],
    distractor: "All documents should always be printed twice",
  },
  {
    paperNo: "05",
    sourceBasis: ["教材：职场沟通", "考点：主旨概括与句子补全"],
    paragraphs: [
      {
        heading: "A clear purpose starts communication",
        body: "A clear message begins with a clear purpose. If the writer does not know the point, the reader cannot find it easily.",
        bodyTranslation:
          "清晰的信息总是从清晰目的开始。如果写的人自己都不清楚重点，读的人就很难找得到。",
        completionPrompt: "A clear message begins with a clear ____.",
        completionAnswer: "purpose",
      },
      {
        heading: "Too much detail can hide the request",
        body: "Necessary background supports understanding, but too much detail can bury the main request.",
        bodyTranslation: "必要背景有助于理解，但过多细节会把真正请求埋起来。",
        completionPrompt: "Too much detail can bury the main ____.",
        completionAnswer: "request",
      },
      {
        heading: "Checking understanding prevents confusion",
        body: "Good listeners check understanding instead of pretending everything is already clear. Simple questions can prevent confusion.",
        bodyTranslation:
          "好的倾听者会主动确认理解，而不是假装一切都已经清楚。简单问题能防止误解发生。",
        completionPrompt: "Simple questions can prevent expensive ____.",
        completionAnswer: "confusion",
      },
      {
        heading: "Clear next actions reduce delay",
        body: "Team work becomes faster when responsibility and next action are stated directly. Uncertainty often creates delay.",
        bodyTranslation:
          "当责任和下一步行动被直接说明时，团队合作会更快。不确定性常常会制造拖延。",
        completionPrompt: "Uncertainty often creates ____.",
        completionAnswer: "delay",
      },
      {
        heading: "Useful language is professional language",
        body: "Professional communication is not decorative language. It is useful language that helps people act correctly and on time.",
        bodyTranslation:
          "职业沟通并不是装饰性语言，而是能帮助人们正确、按时行动的实用语言。",
        completionPrompt:
          "Professional communication should help people act correctly and on ____.",
        completionAnswer: "time",
      },
    ],
    distractor: "Formal words matter more than meaning",
  },
  {
    paperNo: "06",
    sourceBasis: ["教材：理财与消费", "考点：段意概括与信息补全"],
    paragraphs: [
      {
        heading: "Small expenses deserve attention",
        body: "Budgets improve when people notice the small purchases that quietly repeat. Tiny decisions can grow into large monthly costs.",
        bodyTranslation:
          "当人们注意到那些不断重复的小额消费时，预算就会改善。看似很小的决定，最后可能积累成一大笔月度支出。",
        completionPrompt: "Tiny decisions can grow into large monthly ____.",
        completionAnswer: "costs",
      },
      {
        heading: "Waiting before buying weakens impulse",
        body: "Waiting before buying gives value time to become clearer. A delayed choice is often calmer than an instant choice.",
        bodyTranslation:
          "购买前先等一等，能让价值判断变得更清楚。延迟做出的选择，通常比立刻决定更冷静。",
        completionPrompt:
          "A delayed choice is often calmer than an ____ choice.",
        completionAnswer: "instant",
      },
      {
        heading: "Written records reveal real habits",
        bodyTranslation:
          "书面记录之所以有用，是因为记忆常常会让小额花费看起来无伤大雅。记账本能把真实消费模式暴露出来。",
        body: "Written records are useful because memory often makes small spending look harmless. A notebook can reveal the real pattern.",
        completionPrompt: "Memory can make small spending look ____.",
        completionAnswer: "harmless",
      },
      {
        heading: "Calm decisions build confidence",
        bodyTranslation:
          "当决定变得更冷静时，人们面对金钱也会少一些焦虑。当选择不再只被冲动推动时，信心就会增长。",
        body: "People feel less anxious about money when decisions become calmer. Confidence grows when choices are not driven by impulse alone.",
        completionPrompt:
          "Confidence grows when choices are not driven by ____ alone.",
        completionAnswer: "impulse",
      },
      {
        bodyTranslation:
          "好的预算管理不是和每一个欲望作战，而是一种关于价值的耐心判断。",
        heading: "Good budgeting is patient judgment",
        body: "Good budgeting is not a war against every wish. It is a patient form of judgment about value.",
        completionPrompt: "Good budgeting is a patient form of ____.",
        completionAnswer: "judgment",
      },
    ],
    distractor: "Only large purchases matter",
  },
  {
    paperNo: "07",
    sourceBasis: ["教材：旅行准备", "考点：段意概括与信息提取"],
    paragraphs: [
      {
        heading: "Good plans begin with realistic limits",
        body: "Good travel plans begin when people accept realistic limits of time and energy. Too many stops often create stress rather than experience.",
        bodyTranslation:
          "好的旅行计划总是从接受时间和精力的现实限制开始。安排太多停靠点，往往带来的是压力而不是体验。",
        completionPrompt:
          "Too many stops often create ____ rather than experience.",
        completionAnswer: "stress",
      },
      {
        heading: "A simple schedule protects attention",
        bodyTranslation:
          "简单日程能让旅行者把注意力放在真正看到的东西上。一路赶行程只会削弱注意力。",
        body: "A simple schedule lets travelers focus on what they are actually seeing. Constant rushing weakens attention.",
        completionPrompt: "Constant rushing weakens ____.",
        completionAnswer: "attention",
      },
      {
        heading: "Useful preparation increases safety",
        bodyTranslation:
          "有用的准备包括地址、时间和礼貌表达等实际细节。这些小记录会提升出行安全感。",
        body: "Useful preparation includes practical details such as addresses, times, and polite expressions. These small notes increase safety.",
        completionPrompt:
          "Practical details such as addresses and times increase ____.",
        completionAnswer: "safety",
      },
      {
        bodyTranslation:
          "灵活性很重要，因为旅行中出现小变化本来就很正常。坐错一趟车，并不一定会毁掉整段旅行体验。",
        heading: "Flexibility turns surprises into part of travel",
        body: "Flexibility is important because small changes are normal in travel. A wrong bus does not have to destroy the whole experience.",
        completionPrompt:
          "A wrong bus does not have to destroy the whole ____.",
        completionAnswer: "experience",
      },
      {
        heading: "Travel plans should guide, not imprison",
        body: "Travelers need enough structure to feel secure and enough freedom to enjoy surprise. Good plans should guide experience, not imprison it.",
        bodyTranslation:
          "旅行者既需要足够结构来获得安全感，也需要足够自由去享受惊喜。好的计划应该引导体验，而不是束缚体验。",
        completionPrompt: "Good plans should guide experience, not ____ it.",
        completionAnswer: "imprison",
      },
    ],
    distractor: "The busiest trip is always the best trip",
  },
  {
    paperNo: "08",
    sourceBasis: ["教材：家庭管理", "考点：段落主旨与信息回填"],
    paragraphs: [
      {
        heading: "Family time becomes clearer when plans are shared",
        body: "Family time is easier to manage when plans are shared openly. Hidden schedules invite repeated misunderstanding.",
        bodyTranslation:
          "当安排被公开共享时，家庭时间会更容易管理。藏在各自脑子里的日程会不断制造误会。",
        completionPrompt: "Hidden schedules invite repeated ____.",
        completionAnswer: "misunderstanding",
      },
      {
        heading: "Shared calendars make daily rhythm visible",
        body: "Shared calendars make daily rhythm visible to everyone. People no longer need to guess what others are planning.",
        bodyTranslation:
          "共享日历能把家庭每天的节奏清楚展示给每个人。大家不必再猜别人接下来要做什么。",
        completionPrompt: "Shared calendars make daily rhythm ____.",
        completionAnswer: "visible",
      },
      {
        heading: "Visible plans allow early discussion",
        body: "Visible plans help families talk about busy days before pressure becomes too strong. Early discussion prevents sudden conflict.",
        bodyTranslation:
          "可见的安排能让家人们在压力变大之前，就提前讨论忙碌日。提前沟通能防止突然冲突。",
        completionPrompt: "Early discussion helps prevent sudden ____.",
        completionAnswer: "conflict",
      },
      {
        heading: "Respect grows when time is acknowledged",
        body: "Respect grows when each person's time is acknowledged. A shared plan shows that every task matters.",
        bodyTranslation:
          "当每个人的时间都被认真看见时，尊重感就会增长。共享计划会让大家知道每一项安排都重要。",
        completionPrompt: "Respect grows when each person's time is ____.",
        completionAnswer: "acknowledged",
      },
      {
        heading: "Cooperation reduces unnecessary uncertainty",
        body: "Cooperation becomes easier when unnecessary uncertainty is reduced. Families still stay busy, but they feel less confused.",
        bodyTranslation:
          "当不必要的不确定感被减少后，合作就会更容易。家庭依然会忙，但不会那样混乱。",
        completionPrompt:
          "Cooperation becomes easier when uncertainty is ____.",
        completionAnswer: "reduced",
      },
    ],
    distractor: "Family members should make plans in private",
  },
  {
    paperNo: "09",
    sourceBasis: ["教材：阅读技巧", "考点：段落大意与句子补全"],
    paragraphs: [
      {
        heading: "Effective exam reading depends on purpose",
        body: "Effective exam reading begins with purpose. Readers should know whether a question asks about topic, detail, or structure.",
        bodyTranslation:
          "有效的考试阅读总是从明确目的开始。读者要先知道题目考的是主旨、细节，还是结构。",
        completionPrompt: "Effective exam reading begins with ____.",
        completionAnswer: "purpose",
      },
      {
        heading: "Topic sentences provide an early map",
        body: "Topic sentences often provide an early map of the passage. They help readers move through ideas more confidently.",
        bodyTranslation:
          "主题句常常能为整篇文章提供一张早期地图。它能帮助读者更有把握地跟着思路往下走。",
        completionPrompt: "Topic sentences often provide an early ____.",
        completionAnswer: "map",
      },
      {
        heading: "Selective attention saves time",
        body: "Selective attention saves time because not every sentence needs equal weight at first reading. Readers can return to details later.",
        bodyTranslation:
          "选择性注意之所以省时间，是因为第一次阅读时并不是每一句都需要同样重视。细节可以之后再回来看。",
        completionPrompt:
          "Not every sentence needs equal ____ at first reading.",
        completionAnswer: "weight",
      },
      {
        heading: "Prediction helps readers stay oriented",
        bodyTranslation:
          "预测之所以有用，是因为它能让读者在长文章中保持方向感。先问清段落功能，有助于更好理解。",
        body: "Prediction is useful because it keeps readers oriented inside long texts. Asking about function supports better understanding.",
        completionPrompt:
          "Prediction helps readers stay ____ inside long texts.",
        completionAnswer: "oriented",
      },
      {
        bodyTranslation:
          "带着目的去读能减少混乱，因为读者不再盲目地从头读到尾。注意力也会用得更聪明。",
        heading: "Purposeful reading reduces confusion",
        body: "Purposeful reading reduces confusion because readers stop moving through a passage blindly. Attention becomes more intelligent.",
        completionPrompt: "Purposeful reading helps reduce ____.",
        completionAnswer: "confusion",
      },
    ],
    distractor: "Slow reading is always the only careful reading",
  },
  {
    paperNo: "10",
    sourceBasis: ["教材：目标设定", "考点：段意概括与信息回填"],
    paragraphs: [
      {
        heading: "Specific goals create clear beginnings",
        body: "Specific goals create clear beginnings. Broad promises often fail because they do not show where action should start.",
        bodyTranslation:
          "具体目标能创造清晰起点。宽泛承诺之所以常常失败，是因为它并没有告诉人们行动该从哪里开始。",
        completionPrompt:
          "Broad promises often fail because they do not show where action should ____.",
        completionAnswer: "start",
      },
      {
        heading: "Numbers and time points reduce hesitation",
        bodyTranslation:
          "当目标带上具体数量和时间点后，它就更容易执行。具体性会减少犹豫。",
        body: "A goal becomes easier to follow when numbers and time points are attached to it. Specificity reduces hesitation.",
        completionPrompt: "Specificity helps reduce ____.",
        completionAnswer: "hesitation",
      },
      {
        heading: "Weekly review checks both completion and realism",
        bodyTranslation:
          "每周复盘之所以必要，是因为学习者不仅要检查完成度，还要检查计划是否现实。做完的计划也可能并不合理。",
        body: "Weekly review is necessary because learners must check both completion and realism. A completed plan can still be unrealistic.",
        completionPrompt: "Weekly review checks both completion and ____.",
        completionAnswer: "realism",
      },
      {
        heading: "Small actions make progress visible",
        bodyTranslation:
          "小行动能用一种很实际的方式把进步展示出来。学习者不必再等某个戏剧性变化才确认自己在进步。",
        body: "Small actions make progress visible in a practical way. Learners no longer need to wait for one dramatic change.",
        completionPrompt: "Small actions make progress ____.",
        completionAnswer: "visible",
      },
      {
        heading: "Visible progress supports stable motivation",
        bodyTranslation:
          "当学习者能看见自己已经完成了什么时，动力就会更稳定。看得见的证据会支撑信心。",
        body: "Motivation becomes more stable when learners can see what has already been done. Evidence supports confidence.",
        completionPrompt: "Visible progress helps make motivation more ____.",
        completionAnswer: "stable",
      },
    ],
    distractor: "Only large goals deserve attention",
  },
  {
    paperNo: "11",
    sourceBasis: ["教材：健康生活", "考点：段落匹配与句子补全"],
    paragraphs: [
      {
        heading: "Healthy routines begin with ordinary habits",
        body: "Healthy routines often begin with ordinary habits rather than dramatic plans. Ordinary repetition is easier to keep.",
        bodyTranslation:
          "健康习惯通常不是从戏剧化的大计划开始，而是从普通小习惯开始。普通的重复更容易坚持。",
        completionPrompt: "Ordinary repetition is easier to ____.",
        completionAnswer: "keep",
      },
      {
        heading: "Small habits survive busy working days",
        body: "Small habits survive busy working days because they do not demand perfect energy. They fit real schedules.",
        bodyTranslation:
          "小习惯之所以能在忙碌工作日存活下来，是因为它们不要求完美状态。它们适合真实生活节奏。",
        completionPrompt: "Small habits fit real working ____.",
        completionAnswer: "schedules",
      },
      {
        heading: "Sleep improves when screens leave the bedroom",
        body: "Sleep often improves when people put screens away before bed. Rest becomes deeper when late messages stop.",
        bodyTranslation:
          "当人们在睡前把屏幕设备收起来时，睡眠往往会改善。深夜消息停止后，休息也会更深。",
        completionPrompt: "Sleep often improves when screens leave the ____.",
        completionAnswer: "bedroom",
      },
      {
        heading: "Repetition can create motivation",
        body: "Repetition can create motivation because action changes feeling over time. People do not always need strong desire before beginning.",
        bodyTranslation:
          "重复能够创造动力，因为行动本身会慢慢改变人的感受。人并不一定非要等到很有欲望才开始。",
        completionPrompt: "Repetition can create ____.",
        completionAnswer: "motivation",
      },
      {
        heading: "Effective habits fit normal life",
        body: "The most effective habit is often the one that fits normal life. A plan that survives pressure is more valuable than a perfect plan.",
        bodyTranslation:
          "最有效的习惯，往往是最贴近日常生活的习惯。能经得住压力的计划，比看上去完美的计划更有价值。",
        completionPrompt: "A habit is valuable when it survives daily ____.",
        completionAnswer: "pressure",
      },
    ],
    distractor: "Only gym training can improve health",
  },
  {
    paperNo: "12",
    sourceBasis: ["教材：在线学习", "考点：主旨概括与信息回填"],
    paragraphs: [
      {
        heading: "Online courses still need visible structure",
        body: "Online courses feel flexible, but learners still need visible structure. Freedom without shape becomes delay.",
        bodyTranslation:
          "线上课程看起来很灵活，但学习者仍然需要看得见的结构。没有形状的自由，最后常常会变成拖延。",
        completionPrompt: "Freedom without shape becomes ____.",
        completionAnswer: "delay",
      },
      {
        heading: "Fixed study times protect consistency",
        body: "Fixed study times protect consistency because they remove daily decision pressure. The learner knows exactly when work begins.",
        bodyTranslation:
          "固定学习时间能保护持续性，因为它减少了每天都要重新决定何时开始的压力。学习者会明确知道自己什么时候进入学习。",
        completionPrompt: "Fixed study times protect ____.",
        completionAnswer: "consistency",
      },
      {
        heading: "Questions should be handled immediately",
        body: "Questions should be handled immediately instead of being pushed into the future. Delay weakens understanding.",
        bodyTranslation: "问题应当及时处理，而不是不断往后拖。拖延会削弱理解。",
        completionPrompt: "Delay often weakens ____.",
        completionAnswer: "understanding",
      },
      {
        heading: "Attention matters more than technology alone",
        body: "Technology is useful, but attention matters more than technology alone. Structure helps attention stay available.",
        bodyTranslation:
          "技术当然有用，但比技术本身更重要的是注意力。结构能帮助注意力保持在线。",
        completionPrompt: "Attention matters more than technology ____.",
        completionAnswer: "alone",
      },
      {
        heading: "Digital tools should support discipline",
        body: "Digital tools should support discipline instead of replacing it. Good systems make self-management easier.",
        bodyTranslation:
          "数字工具应该支持自律，而不是取代自律。好的系统会让自我管理更容易。",
        completionPrompt: "Digital tools should support ____.",
        completionAnswer: "discipline",
      },
    ],
    distractor: "Flexibility removes the need for routine",
  },
  {
    paperNo: "13",
    sourceBasis: ["教材：社区服务", "考点：段落大意与信息补全"],
    paragraphs: [
      {
        heading: "Community libraries answer more than one need",
        body: "Community libraries matter because people often come with more than one need. A book room can become a learning support space.",
        bodyTranslation:
          "社区图书馆之所以重要，是因为人们来到这里时常常不只带着一种需求。一个书房也可以变成学习支持空间。",
        completionPrompt: "People often come with more than one ____.",
        completionAnswer: "need",
      },
      {
        heading: "Volunteers expand service step by step",
        body: "Volunteers often expand service step by step instead of all at once. Small changes can reshape a public place.",
        bodyTranslation:
          "志愿者通常是一点点扩大服务内容，而不是一次性全部铺开。小变化也能重塑一个公共空间。",
        completionPrompt: "Small changes can reshape a public ____.",
        completionAnswer: "place",
      },
      {
        heading: "A public space can support quiet growth",
        body: "A public space can support quiet growth by offering time, attention, and safe routine. People stay because the space feels welcoming.",
        bodyTranslation:
          "一个公共空间可以通过提供时间、关注和稳定节奏，支持安静而持续的成长。人们愿意留下来，是因为这里让人感到被欢迎。",
        completionPrompt: "People stay because the space feels ____.",
        completionAnswer: "welcoming",
      },
      {
        heading: "Belonging encourages people to return",
        body: "Belonging encourages people to return because they feel their presence matters. Growth often begins with that feeling.",
        bodyTranslation:
          "归属感会鼓励人们一次次回来，因为他们会觉得自己的到来是重要的。成长往往就是从这种感觉开始的。",
        completionPrompt: "Belonging encourages people to ____.",
        completionAnswer: "return",
      },
      {
        heading: "Lowering the cost of beginning matters",
        body: "A useful community space lowers the cost of beginning. Once people enter, they often discover wider possibilities.",
        bodyTranslation:
          "一个有用的社区空间能降低开始尝试的门槛。人们一旦走进来，往往会发现更广阔的可能性。",
        completionPrompt: "A useful community space lowers the cost of ____.",
        completionAnswer: "beginning",
      },
    ],
    distractor: "Libraries should focus only on borrowing",
  },
  {
    paperNo: "14",
    sourceBasis: ["教材：职场写作", "考点：段意概括与信息回填"],
    paragraphs: [
      {
        heading: "Purpose should appear early in a message",
        body: "Workplace writing becomes clearer when purpose appears early. Readers should not search through many lines to find the point.",
        bodyTranslation:
          "当目的在信息前面就说清楚时，职场写作会更清晰。读者不应该在很多行文字里寻找真正重点。",
        completionPrompt:
          "Readers should not search through many lines to find the ____.",
        completionAnswer: "point",
      },
      {
        heading: "Necessary information is enough information",
        body: "Necessary information is enough information for most workplace messages. Extra detail can reduce usefulness.",
        bodyTranslation:
          "对大多数职场信息来说，必要信息已经足够。额外细节反而可能降低实用性。",
        completionPrompt: "Extra detail can reduce ____.",
        completionAnswer: "usefulness",
      },
      {
        heading: "Respect for the reader means clarity",
        body: "Respect for the reader means making action easier, not making language more decorative. Clear writing saves other people's time.",
        bodyTranslation:
          "尊重读者意味着让行动更容易发生，而不是把语言写得更花。清晰写作能节省别人的时间。",
        completionPrompt: "Clear writing saves other people's ____.",
        completionAnswer: "time",
      },
      {
        heading: "Next action should be easy to see",
        body: "A good workplace message makes the next action easy to see. Unclear endings often create extra questions.",
        bodyTranslation:
          "一条好的职场信息，应该让下一步行动一眼就能看见。含糊结尾往往会制造额外问题。",
        completionPrompt: "Unclear endings often create extra ____.",
        completionAnswer: "questions",
      },
      {
        heading: "Useful writing is professional writing",
        body: "Useful writing is professional writing because it helps the reader act correctly and quickly. Formality alone is not enough.",
        bodyTranslation:
          "有用的写作才是真正专业的写作，因为它能帮助读者正确、快速地行动。只有正式语气并不够。",
        completionPrompt: "Formality alone is not ____.",
        completionAnswer: "enough",
      },
    ],
    distractor: "Longer emails are always more professional",
  },
  {
    paperNo: "15",
    sourceBasis: ["教材：备考策略", "考点：段落大意与句子补全"],
    paragraphs: [
      {
        heading: "Uneven study creates mental pressure",
        body: "Uneven study creates mental pressure because learners never feel fully caught up. Bursts of effort do not create order.",
        bodyTranslation:
          "不均衡学习会制造心理压力，因为学习者总觉得自己没有真正追上进度。突击努力并不会带来秩序感。",
        completionPrompt: "Bursts of effort do not create ____.",
        completionAnswer: "order",
      },
      {
        heading: "Steady review gives work a clear shape",
        body: "Steady review gives work a clear shape. Regular blocks show what belongs where in the week.",
        bodyTranslation:
          "稳定复习会让整个学习任务有清晰形状。固定模块能告诉你一周里每件事该放在哪个位置。",
        completionPrompt: "Regular blocks show what belongs where in the ____.",
        completionAnswer: "week",
      },
      {
        heading: "Weekly checking reduces confusion",
        body: "Weekly checking reduces confusion by showing what has been finished and what should come next. Clarity lowers pressure.",
        bodyTranslation:
          "每周检查能减少混乱，因为它会清楚展示哪些事情已经完成、哪些事情接下来要做。清晰感会降低压力。",
        completionPrompt: "Weekly checking helps reduce ____.",
        completionAnswer: "confusion",
      },
      {
        heading: "Order helps learners trust progress",
        body: "Order helps learners trust progress because their effort becomes visible. The mind no longer feels lost.",
        bodyTranslation:
          "秩序能帮助学习者相信自己的进步，因为努力终于变得看得见了，心里也不会再那样迷失。",
        completionPrompt: "Order helps learners trust their ____.",
        completionAnswer: "progress",
      },
      {
        heading: "Pressure should not control attention",
        body: "Pressure will not disappear completely, but it should not control attention. Steady preparation keeps attention available for work.",
        bodyTranslation:
          "压力不会完全消失，但它不应该反过来控制注意力。稳定准备能让注意力始终留给真正的学习。",
        completionPrompt: "Pressure should not control ____.",
        completionAnswer: "attention",
      },
    ],
    distractor: "Last-minute study is the best study",
  },
];

export const rewrittenChoiceSections: Record<string, DegreeExamSection> =
  Object.fromEntries(
    choiceSeeds.map((seed) => [seed.paperNo, buildChoiceSection(seed)]),
  );

export const rewrittenHeadingSections: Record<string, DegreeExamSection> =
  Object.fromEntries(
    headingSeeds.map((seed) => [seed.paperNo, buildHeadingSection(seed)]),
  );

export function applyRewrittenSections(
  papers: DegreeExamPaper[],
): DegreeExamPaper[] {
  return papers.map((paper) => {
    const paperNo = paper.id.slice(-2);
    const choiceSection = rewrittenChoiceSections[paperNo];
    const headingSection = rewrittenHeadingSections[paperNo];

    if (!choiceSection || !headingSection) {
      return paper;
    }

    return {
      ...paper,
      sections: paper.sections.map((section) => {
        if (section.id === `paper${paperNo}-choice`) {
          return choiceSection;
        }
        if (section.id === `paper${paperNo}-heading`) {
          return headingSection;
        }
        return section;
      }),
    };
  });
}
