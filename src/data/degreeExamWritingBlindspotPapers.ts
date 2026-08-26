import type {
  DegreeExamPaper,
  DegreeExamQuestion,
  DegreeExamQuestionDetailKey,
  DegreeExamSection,
} from "./degreeExamFullPapers";

type WritingBlindspotSeed = {
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

const writerNames = [
  "Jia Lin",
  "Rui Fang",
  "Ming Tao",
  "Yue Ning",
  "He Qian",
  "Bo Wen",
  "Lan Xi",
  "Qiao Min",
];

const writingBlindspotSeeds: WritingBlindspotSeed[] = [
  {
    id: "01",
    badgeNo: "01",
    focus: "Invitation Letter",
    focusZh: "邀请信",
    description: "聚焦邀请信格式、邀请目的、活动信息与礼貌表达。",
    weakPoints: [
      "state the invitation purpose clearly at the beginning",
      "include time, place, and main activity information",
      "use polite invitation language instead of direct orders",
      "keep the tone warm and natural for the reader",
      "end with a clear hope for a reply",
    ],
    weakPointsZh: [
      "在开头清楚写出邀请目的",
      "写清时间、地点和主要活动信息",
      "用礼貌邀请表达而不是命令式口气",
      "保持温和自然的语气",
      "在结尾明确表达期待回复",
    ],
    writingTitle: "Write an Invitation Letter to a Friend",
    writingGuideZh:
      "可写你想邀请朋友参加什么活动，时间地点是什么，以及你为什么希望对方来。",
  },
  {
    id: "02",
    badgeNo: "02",
    focus: "Thank-you Letter",
    focusZh: "感谢信",
    description: "聚焦感谢信结构、感谢原因、具体帮助与真诚表达。",
    weakPoints: [
      "say what help or kindness you are thanking for",
      "mention specific details instead of empty praise",
      "show sincere feeling in simple language",
      "keep the structure short but complete",
      "close with appreciation and good wishes",
    ],
    weakPointsZh: [
      "写清你感谢的是哪一种帮助或善意",
      "用具体细节而不是空泛夸奖",
      "用简单语言表达真诚感受",
      "结构简短但完整",
      "结尾表达感谢并送上祝愿",
    ],
    writingTitle: "Write a Thank-you Letter to Your Teacher",
    writingGuideZh: "可写老师曾怎样帮助你，你学到了什么，以及你想表达的感谢。",
  },
  {
    id: "03",
    badgeNo: "03",
    focus: "Application Email",
    focusZh: "申请邮件",
    description: "聚焦申请邮件的目的、个人信息、理由与礼貌收尾。",
    weakPoints: [
      "state the application purpose directly in the first part",
      "introduce your basic background briefly",
      "explain why you are suitable for the chance",
      "use a clear and formal email tone",
      "ask politely for further information or reply",
    ],
    weakPointsZh: [
      "在开头直接写出申请目的",
      "简要介绍自己的基本情况",
      "说明自己为什么适合这次机会",
      "使用清楚而正式的邮件语气",
      "礼貌请求进一步回复或信息",
    ],
    writingTitle: "Write an Email to Apply for a Volunteer Job",
    writingGuideZh: "可写你申请什么岗位、你的优势是什么、你为什么想参加。",
  },
  {
    id: "04",
    badgeNo: "04",
    focus: "Notice",
    focusZh: "通知",
    description: "聚焦通知写法、关键信息完整性和清晰醒目表达。",
    weakPoints: [
      "make the purpose of the notice easy to see",
      "include key information in a logical order",
      "keep the language short and direct",
      "avoid missing time, place, or target readers",
      "use a simple ending with organizer information",
    ],
    weakPointsZh: [
      "让通知目的一眼就能看出",
      "按清晰顺序写完整关键信息",
      "语言简洁直接",
      "避免漏写时间、地点或对象",
      "用简短结尾写出组织者信息",
    ],
    writingTitle: "Write a Notice about an English Speech Contest",
    writingGuideZh: "可写比赛时间、地点、参加对象、报名方式和活动目的。",
  },
  {
    id: "05",
    badgeNo: "05",
    focus: "Opinion Essay",
    focusZh: "观点议论文",
    description: "聚焦观点表达、理由展开、例子支撑和结尾总结。",
    weakPoints: [
      "state your opinion clearly in the opening",
      "support the opinion with two or three clear reasons",
      "use simple examples to make the view stronger",
      "keep each paragraph focused on one main point",
      "end with a short and firm conclusion",
    ],
    weakPointsZh: [
      "在开头明确写出自己的观点",
      "用两到三个清楚理由支持观点",
      "用简单例子增强说服力",
      "每段只围绕一个重点展开",
      "用简短有力的结尾收束全文",
    ],
    writingTitle: "Should College Students Learn Online?",
    writingGuideZh: "可先明确表态，再写原因，最后做总结。",
  },
  {
    id: "06",
    badgeNo: "06",
    focus: "Chart Composition",
    focusZh: "图表作文",
    description: "聚焦图表描述、数据变化、趋势总结和原因分析。",
    weakPoints: [
      "describe the main trend before giving details",
      "compare data instead of listing numbers only",
      "use change words such as increase and decrease correctly",
      "mention possible reasons in a simple way",
      "finish with a short trend summary",
    ],
    weakPointsZh: [
      "先写总体趋势，再写细节数据",
      "比较数据而不是只罗列数字",
      "正确使用 increase、decrease 等变化词",
      "用简单方式补充可能原因",
      "最后用一句话总结趋势",
    ],
    writingTitle: "Describe a Chart about Students' Reading Time",
    writingGuideZh: "可先概括总体变化，再比较几个关键数据，最后简单分析原因。",
  },
  {
    id: "07",
    badgeNo: "07",
    focus: "Advantages and Disadvantages Essay",
    focusZh: "利弊分析作文",
    description: "聚焦两面分析、结构平衡、连接词和个人结论。",
    weakPoints: [
      "present both advantages and disadvantages fairly",
      "use linking words to separate different sides",
      "give clear examples for each side",
      "keep the essay balanced instead of one-sided",
      "end with your own reasonable conclusion",
    ],
    weakPointsZh: [
      "比较公平地写出优点和缺点",
      "用连接词区分不同方面",
      "给每一面都配上清楚例子",
      "保持结构平衡，不要完全偏一边",
      "最后写出自己合理的结论",
    ],
    writingTitle: "The Advantages and Disadvantages of Mobile Learning",
    writingGuideZh: "可分优点、缺点、个人看法三部分写。",
  },
  {
    id: "08",
    badgeNo: "08",
    focus: "Complaint and Suggestion Letter",
    focusZh: "投诉建议信",
    description: "聚焦投诉原因、问题细节、建议方案和礼貌语气。",
    weakPoints: [
      "explain the problem clearly without sounding rude",
      "give one or two specific examples of the problem",
      "offer practical suggestions instead of pure complaint",
      "keep the tone polite but firm",
      "end with a reasonable expectation for improvement",
    ],
    weakPointsZh: [
      "清楚说明问题但不过于生硬无礼",
      "给出一到两个具体问题例子",
      "提出可执行建议，而不是只抱怨",
      "保持礼貌但坚定的语气",
      "结尾写出合理改进期待",
    ],
    writingTitle: "Write a Letter to Suggest Improvements to Your Library",
    writingGuideZh: "可写图书馆目前问题、你的建议，以及你希望达到的效果。",
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

function buildJudgeSection(seed: WritingBlindspotSeed): DegreeExamSection {
  const writer = writerNames[Number(seed.id) - 1];
  return {
    id: `writing${seed.id}-judge`,
    title: "第一部分 阅读判断",
    questionRange: "1-10",
    score: 10,
    instructions:
      "Read the passage and decide whether the statements are True (A), False (B) or Not Given (C).",
    sourceBasis: [`作文补盲：${seed.focusZh}`, "考点：细节判断与主旨理解"],
    material: [
      `${writer} used to think that English writing was mainly about grammar. When preparing for English (II), however, ${writer} found that many writing tasks depended just as much on purpose, structure, and reader awareness. The most confusing type was ${seed.focus}.`,
      `A teacher then asked ${writer} to study model texts in a practical way. First, ${writer} should identify the writer's purpose. Second, key information should be marked and grouped. Third, useful opening and closing sentences should be collected for later practice.`,
      `After several weeks, ${writer} still needed more writing practice, but planning became easier. More importantly, ${writer} no longer wrote sentences one by one without direction. The writer had begun to see writing as communication with a clear goal.`,
    ],
    materialTranslation: [
      `${writer}以前以为，英语写作主要就是语法问题。但在准备英语（二）时，${writer}发现很多写作任务同样依赖写作目的、结构安排和读者意识。其中最让人困惑的一类就是${seed.focusZh}。`,
      `后来，一位老师要求${writer}用更务实的方式学习范文。第一步，要先判断写作者目的；第二步，要把关键信息标出来并分组；第三步，要收集实用的开头句和结尾句，留待之后练习。`,
      `几周后，${writer}仍然需要更多写作训练，但起草思路已经容易多了。更重要的是，${writer}不再一句一句盲写，而开始把写作看成一种有明确目标的交流。`,
    ],
    questions: [
      makeQuestion(
        `wb${seed.id}-j1`,
        1,
        `${writer} once thought writing was mainly about grammar.`,
        {
          answer: "A (True)",
          point: "第一段首句直接给出。",
          translation: `${writer}曾经认为写作主要就是语法。`,
          pitfalls: "once thought 是过去观念。",
        },
      ),
      makeQuestion(
        `wb${seed.id}-j2`,
        2,
        `The easiest writing type for ${writer} was ${seed.focus}.`,
        {
          answer: "B (False)",
          point: "文中说最困惑的是这一题材，不是最容易。",
          translation: `对${writer}来说，${seed.focusZh}是最容易的一类写作。`,
          pitfalls: "easy / confusing 反向干扰。",
        },
      ),
      makeQuestion(
        `wb${seed.id}-j3`,
        3,
        `Purpose and reader awareness also matter in writing tasks.`,
        {
          answer: "A (True)",
          point: "第一段中间直接提到。",
          translation: "写作任务中，目的和读者意识也很重要。",
          pitfalls: "also matter 是补充重点。",
        },
      ),
      makeQuestion(
        `wb${seed.id}-j4`,
        4,
        `The teacher advised ${writer} to memorize model texts word for word only.`,
        {
          answer: "B (False)",
          point: "第二段讲的是 practical way，不是死背全文。",
          translation: "老师建议${writer}逐字背诵范文就行。",
          pitfalls: "文中强调 identify, mark, collect。",
        },
      ),
      makeQuestion(
        `wb${seed.id}-j5`,
        5,
        `${writer} should first identify the writer's purpose.`,
        {
          answer: "A (True)",
          point: "第二段第一步直接对应。",
          translation: `${writer}第一步应该先判断写作者目的。`,
          pitfalls: "first 是顺序题眼。",
        },
      ),
      makeQuestion(
        `wb${seed.id}-j6`,
        6,
        `${writer} was told to collect useful opening and closing sentences.`,
        {
          answer: "A (True)",
          point: "第二段第三步直接提到。",
          translation: `${writer}被要求收集有用的开头句和结尾句。`,
          pitfalls: "opening and closing 是固定搭配。",
        },
      ),
      makeQuestion(
        `wb${seed.id}-j7`,
        7,
        `${writer} joined an expensive writing course later.`,
        {
          answer: "C (Not Given)",
          point: "文章没提到课程费用或报班信息。",
          translation: `${writer}后来参加了一门昂贵写作课。`,
          pitfalls: "未提及题不能脑补。",
        },
      ),
      makeQuestion(
        `wb${seed.id}-j8`,
        8,
        `Planning became easier after several weeks.`,
        {
          answer: "A (True)",
          point: "第三段第一句直接说明。",
          translation: "几周后，规划写作变得更容易了。",
          pitfalls: "planning became easier 是明显细节。",
        },
      ),
      makeQuestion(
        `wb${seed.id}-j9`,
        9,
        `${writer} still wrote without direction at the end.`,
        {
          answer: "B (False)",
          point: "第三段后半句明确否定。",
          translation: `${writer}最后仍然毫无方向地一句一句写。`,
          pitfalls: "no longer 是判断关键。",
        },
      ),
      makeQuestion(
        `wb${seed.id}-j10`,
        10,
        `The passage mainly shows that writing needs a clear communication goal.`,
        {
          answer: "A (True)",
          point: "结尾句概括全文主旨。",
          translation: "这篇文章主要说明写作需要明确的交流目标。",
          pitfalls: "主旨句通常在结尾。",
        },
      ),
    ],
  };
}

function buildChoiceSection(seed: WritingBlindspotSeed): DegreeExamSection {
  const writer = writerNames[Number(seed.id) - 1];
  return {
    id: `writing${seed.id}-choice`,
    title: "第二部分 阅读选择",
    questionRange: "11-15",
    score: 10,
    instructions:
      "Read the following passage and choose the best answer to each question.",
    sourceBasis: [
      `作文补盲：${seed.focusZh}`,
      "考点：细节理解、推理判断与主旨概括",
    ],
    material: [
      `When ${writer} first practiced ${seed.focus}, the biggest problem was not vocabulary size but missing purpose. The writing looked English, but the message often felt unclear to the reader. Important information was sometimes forgotten, and the ending did not always match the opening.`,
      `A teacher later introduced a simple method. Before writing, ${writer} had to answer three questions: Who will read this? Why am I writing? What information must appear clearly? Then ${writer} wrote a short outline and checked whether each sentence really served the task.`,
      `After one month, the improvement was not only in language. Organization became stronger, and wrong-topic writing became less common. The teacher said this happened because writing quality often depends first on task awareness and only then on sentence decoration.`,
    ],
    materialTranslation: [
      `当${writer}刚练习${seed.focusZh}时，最大的问题并不是词汇量，而是缺少写作目的。写出来的内容看上去像英语，但对读者来说信息往往不够清楚。重要内容有时会漏掉，结尾也不总能和开头呼应。`,
      `后来，一位老师给了一个简单方法。写作前，${writer}必须先回答三个问题：谁会读这篇文章？我为什么写？哪些信息必须写清楚？然后${writer}先列一个简短提纲，再检查每一句话是否真正服务于任务。`,
      `一个月后，进步不仅体现在语言上，文章组织也更强了，跑题情况也少了。老师说，这正是因为写作质量往往首先取决于任务意识，然后才是句子装饰。`,
    ],
    questions: [
      makeQuestion(
        `wb${seed.id}-c11`,
        11,
        `What was ${writer}'s biggest problem at first?`,
        {
          answer: "B. Missing a clear writing purpose.",
          point: "第一段第一句直接给出。",
          translation: `${writer}一开始最大的问题是什么？`,
          pitfalls: "不是 vocabulary size，而是 purpose。",
        },
        [
          "A. Not knowing enough grammar terms.",
          "B. Missing a clear writing purpose.",
          "C. Having no model texts to read.",
          "D. Refusing to write any outline.",
        ],
      ),
      makeQuestion(
        `wb${seed.id}-c12`,
        12,
        `Why did the writing sometimes feel unclear to the reader?`,
        {
          answer:
            "A. Because the message and important information were not organized clearly.",
          point: "第一段后半部分概括原因。",
          translation: "为什么读者会觉得文章不清楚？",
          pitfalls: "要抓 message unclear 和 information forgotten。",
        },
        [
          "A. Because the message and important information were not organized clearly.",
          "B. Because the writing was too short to finish.",
          "C. Because the reader disliked English.",
          "D. Because no dictionary was used.",
        ],
      ),
      makeQuestion(
        `wb${seed.id}-c13`,
        13,
        `What did the teacher ask ${writer} to do before writing?`,
        {
          answer: "D. Answer three task questions and make a short outline.",
          point: "第二段完整概括写前步骤。",
          translation: "老师要求${writer}写作前做什么？",
          pitfalls: "three questions + outline 两部分都要抓到。",
        },
        [
          "A. Translate the whole topic into Chinese first.",
          "B. Copy a model text word by word.",
          "C. Ignore the reader and focus on long sentences.",
          "D. Answer three task questions and make a short outline.",
        ],
      ),
      makeQuestion(
        `wb${seed.id}-c14`,
        14,
        `What changed after one month?`,
        {
          answer:
            "C. Organization improved and wrong-topic writing became less common.",
          point: "第三段前半部分直接说明结果。",
          translation: "一个月后，有什么变化？",
          pitfalls: "结果不只是 language，也包括 organization。",
        },
        [
          "A. The writer stopped needing outlines completely.",
          "B. The writer changed to another language.",
          "C. Organization improved and wrong-topic writing became less common.",
          "D. The writer decided to avoid writing tasks.",
        ],
      ),
      makeQuestion(
        `wb${seed.id}-c15`,
        15,
        `What is the main idea of the passage?`,
        {
          answer:
            "A. Good writing starts with task awareness before sentence decoration.",
          point: "第三段最后一句是全文总结。",
          translation: "这篇文章的主旨是什么？",
          pitfalls: "主旨题要抓 summary sentence。",
        },
        [
          "A. Good writing starts with task awareness before sentence decoration.",
          "B. Long sentences always make writing stronger.",
          "C. Vocabulary matters more than organization in every task.",
          "D. Only advanced learners can write clearly.",
        ],
      ),
    ],
  };
}

function buildHeadingSection(seed: WritingBlindspotSeed): DegreeExamSection {
  return {
    id: `writing${seed.id}-heading`,
    title: "第三部分 概括段落大意和补全句子",
    questionRange: "16-25",
    score: 10,
    instructions:
      "Read the article. Match paragraphs with headings and complete the sentences.",
    sourceBasis: [`作文补盲：${seed.focusZh}`, "考点：主旨概括与信息提取"],
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
      "F. Use difficult words without purpose",
    ],
    questions: [
      makeQuestion(`wb${seed.id}-h16`, 16, "Paragraph A ____", {
        answer: `A. ${capitalize(seed.weakPoints[0])}`,
        point: "A 段对应第一个写作薄弱点。",
        translation: "A 段的大意是____。",
        pitfalls: "按顺序匹配即可。",
      }),
      makeQuestion(`wb${seed.id}-h17`, 17, "Paragraph B ____", {
        answer: `B. ${capitalize(seed.weakPoints[1])}`,
        point: "B 段对应第二个写作薄弱点。",
        translation: "B 段的大意是____。",
        pitfalls: "注意提取中心意思。",
      }),
      makeQuestion(`wb${seed.id}-h18`, 18, "Paragraph C ____", {
        answer: `C. ${capitalize(seed.weakPoints[2])}`,
        point: "C 段对应第三个写作薄弱点。",
        translation: "C 段的大意是____。",
        pitfalls: "关注动作表达。",
      }),
      makeQuestion(`wb${seed.id}-h19`, 19, "Paragraph D ____", {
        answer: `D. ${capitalize(seed.weakPoints[3])}`,
        point: "D 段对应第四个写作薄弱点。",
        translation: "D 段的大意是____。",
        pitfalls: "抓住 tone 或 structure 关键词。",
      }),
      makeQuestion(`wb${seed.id}-h20`, 20, "Paragraph E ____", {
        answer: `E. ${capitalize(seed.weakPoints[4])}`,
        point: "E 段对应第五个写作薄弱点。",
        translation: "E 段的大意是____。",
        pitfalls: "排除无关干扰项。",
      }),
      makeQuestion(
        `wb${seed.id}-h21`,
        21,
        "Paragraph A focuses on writing ____.",
        {
          answer: "purpose",
          point: "不同题材都先强调写作目的。",
          translation: "A 段聚焦写作____。",
          pitfalls: "purpose 是高频中心词。",
        },
      ),
      makeQuestion(
        `wb${seed.id}-h22`,
        22,
        "Paragraph B reminds learners to include key ____. ",
        {
          answer: "information",
          point: "第二个薄弱点通常围绕信息完整性。",
          translation: "B 段提醒学习者写全关键信____。",
          pitfalls: "information 是最自然回填词。",
        },
      ),
      makeQuestion(
        `wb${seed.id}-h23`,
        23,
        "Paragraph C is about suitable writing ____.",
        {
          answer: "language",
          point: "礼貌表达、正式表达都归到 language use。",
          translation: "C 段和合适的写作____有关。",
          pitfalls: "tone 与 language 紧密相关。",
        },
      ),
      makeQuestion(
        `wb${seed.id}-h24`,
        24,
        "Paragraph D shows how to keep the text more ____.",
        {
          answer: "natural",
          point: "多题材都强调语气自然、表达顺畅。",
          translation: "D 段说明怎样让文章更____。",
          pitfalls: "natural 是写作评价高频词。",
        },
      ),
      makeQuestion(
        `wb${seed.id}-h25`,
        25,
        "Paragraph E usually concerns the writing ____.",
        {
          answer: "ending",
          point: "第五个薄弱点多是结尾策略。",
          translation: "E 段通常与文章____有关。",
          pitfalls: "ending 和 closing 可互相联想。",
        },
      ),
    ],
  };
}

function buildFillSection(seed: WritingBlindspotSeed): DegreeExamSection {
  return {
    id: `writing${seed.id}-fill`,
    title: "第四部分 填句补文",
    questionRange: "26-30",
    score: 10,
    instructions:
      "Read the passage and choose five sentences out of the six given below to fit into the blanks.",
    sourceBasis: [`作文补盲：${seed.focusZh}`, "考点：句间衔接与逻辑关系"],
    material: [
      `Many learners think English writing becomes better simply by adding more difficult words. [26] A clear task and a clear reader often matter more.`,
      `A practical way to improve is to read model texts with questions in mind. Why is this opening useful? What information appears in the middle? How does the ending work? [27] [28]`,
      `Writing practice should also include revision. [29] [30]`,
    ],
    materialTranslation: [
      "很多学习者以为，只要加上更多难词，英语写作就会自动变好。[26] 其实，明确任务和明确读者往往更重要。",
      "一种务实改进方法，是带着问题去读范文。为什么这个开头有用？中间写了哪些信息？结尾是怎么起作用的？[27][28]",
      "写作练习还应包括修改。[29][30]",
    ],
    assistantTitle: "备选句",
    assistantItems: [
      "A. These questions help learners see writing as a task, not a pile of sentences.",
      "B. Revision shows where the message is still weak or unclear.",
      "C. One useful habit is to check whether every sentence serves the task.",
      "D. In fact, difficult words can even hide weak organization.",
      "E. Clear writing usually grows through repeated checking and improvement.",
      "F. The best writer is always the one with the longest sentences.",
    ],
    questions: [
      makeQuestion(`wb${seed.id}-f26`, 26, "Blank 26", {
        answer: "D",
        point:
          "前句说误区，后句转入真正重点，中间最自然是指出难词也会掩盖问题。",
        translation: "第 26 空应填：事实上，难词甚至可能掩盖结构薄弱。",
        pitfalls: "D 与前后逻辑衔接最强。",
      }),
      makeQuestion(`wb${seed.id}-f27`, 27, "Blank 27", {
        answer: "A",
        point: "前面三连问后，A 正好总结这些问题的作用。",
        translation:
          "第 27 空应填：这些问题能帮助学习者把写作看成任务，而不是句子堆积。",
        pitfalls: "These questions 与前文直接照应。",
      }),
      makeQuestion(`wb${seed.id}-f28`, 28, "Blank 28", {
        answer: "C",
        point: "继续谈 model text reading 和 task awareness，C 最自然承接。",
        translation: "第 28 空应填：一个有用习惯是检查每一句是否服务于任务。",
        pitfalls: "serve the task 是写作核心表达。",
      }),
      makeQuestion(`wb${seed.id}-f29`, 29, "Blank 29", {
        answer: "B",
        point: "前句说 revision，B 正好解释 revision 的作用。",
        translation: "第 29 空应填：修改能看出信息哪里还不清楚。",
        pitfalls: "Revision 与 weak or unclear message 高度匹配。",
      }),
      makeQuestion(`wb${seed.id}-f30`, 30, "Blank 30", {
        answer: "E",
        point: "段尾适合总结合理写作习惯。",
        translation: "第 30 空应填：清晰写作通常来自反复检查和改进。",
        pitfalls: "E 作为全段总结最自然。",
      }),
    ],
  };
}

function buildWordSection(seed: WritingBlindspotSeed): DegreeExamSection {
  return {
    id: `writing${seed.id}-word`,
    title: "第五部分 填词补文",
    questionRange: "31-40",
    score: 15,
    instructions:
      "Read the passage and select ten words from the word bank. Use the proper form if necessary.",
    sourceBasis: [
      `作文补盲：${seed.focusZh}`,
      "考点：词汇搭配、结构和表达精度",
    ],
    material: [
      `Good writing does not depend only on grammar. It also needs a clear [31], useful details, and a suitable tone. When learners understand the task [32], they can make better choices in the first draft.`,
      `A short outline is often very [33]. It helps writers [34] information in a logical order and avoid missing key points. During revision, writers should [35] whether the message is clear to the reader.`,
      `Over time, this habit makes writing less [36] and more [37]. The writer also becomes more [38] about structure and tone. In the end, practice and revision turn weak drafts into stronger [39], and writing becomes a more [40] skill.`,
    ],
    materialTranslation: [
      "好的写作不只依赖语法。它还需要清晰的[31]、有用细节和合适语气。当学习者真正理解任务[32]时，他们就能在初稿阶段做出更好选择。",
      "简短提纲通常非常[33]。它能帮助写作者按逻辑顺序[34]信息，并避免漏掉重点。修改时，写作者应该[35]信息对读者是否清楚。",
      "久而久之，这个习惯会让写作不再那么[36]，而变得更[37]。写作者对结构和语气也会更[38]。最终，练习和修改能把薄弱初稿变成更强的[39]，而写作也会成为一项更[40]的能力。",
    ],
    assistantTitle: "词库",
    assistantItems: [
      "A. purpose",
      "B. better",
      "C. helpful",
      "D. organize",
      "E. check",
      "F. frightening",
      "G. effective",
      "H. confident",
      "I. drafts",
      "J. practical",
      "K. compare",
      "L. audience",
    ],
    questions: [
      makeQuestion(`wb${seed.id}-w31`, 31, "Blank 31", {
        answer: "purpose",
        point: "clear purpose 是写作高频搭配。",
        translation: "第 31 空：写作还需要清晰目的。",
        pitfalls: "purpose 与全文主题一致。",
      }),
      makeQuestion(`wb${seed.id}-w32`, 32, "Blank 32", {
        answer: "better",
        point: "understand ... better 为自然搭配。",
        translation: "第 32 空：当他们把任务理解得更好时。",
        pitfalls: "副词修饰 understand。",
      }),
      makeQuestion(`wb${seed.id}-w33`, 33, "Blank 33", {
        answer: "helpful",
        point: "be helpful 为固定搭配。",
        translation: "第 33 空：简短提纲通常很有帮助。",
        pitfalls: "此处需形容词。",
      }),
      makeQuestion(`wb${seed.id}-w34`, 34, "Blank 34", {
        answer: "organize",
        point: "help sb. do 结构。",
        translation: "第 34 空：帮助按逻辑顺序组织信息。",
        pitfalls: "help 后接动词原形。",
      }),
      makeQuestion(`wb${seed.id}-w35`, 35, "Blank 35", {
        answer: "check",
        point: "should 后接动词原形。",
        translation: "第 35 空：写作者应该检查信息是否清楚。",
        pitfalls: "check whether 是常见结构。",
      }),
      makeQuestion(`wb${seed.id}-w36`, 36, "Blank 36", {
        answer: "frightening",
        point: "less 后接形容词。",
        translation: "第 36 空：写作不再那么吓人。",
        pitfalls: "语义与 fear 对应。",
      }),
      makeQuestion(`wb${seed.id}-w37`, 37, "Blank 37", {
        answer: "effective",
        point: "less ... more ... 对照结构。",
        translation: "第 37 空：而变得更有效。",
        pitfalls: "与 frightening 形成语义反差。",
      }),
      makeQuestion(`wb${seed.id}-w38`, 38, "Blank 38", {
        answer: "confident",
        point: "become more confident about 搭配自然。",
        translation: "第 38 空：对结构和语气更有信心。",
        pitfalls: "confidence 需变形为 confident。",
      }),
      makeQuestion(`wb${seed.id}-w39`, 39, "Blank 39", {
        answer: "drafts",
        point: "weak drafts into stronger drafts 语义自然。",
        translation: "第 39 空：把薄弱草稿变成更强的草稿。",
        pitfalls: "需用复数表示泛指。",
      }),
      makeQuestion(`wb${seed.id}-w40`, 40, "Blank 40", {
        answer: "practical",
        point: "practical skill 为常见搭配。",
        translation: "第 40 空：写作成为一项更实用的技能。",
        pitfalls: "skill 前要用形容词。",
      }),
    ],
  };
}

function buildClozeSection(seed: WritingBlindspotSeed): DegreeExamSection {
  const writer = writerNames[Number(seed.id) - 1];
  return {
    id: `writing${seed.id}-cloze`,
    title: "第六部分 完形补文",
    questionRange: "41-50",
    score: 15,
    instructions:
      "Read the passage and fill in each blank with the correct form of the word given in brackets.",
    sourceBasis: [`作文补盲：${seed.focusZh}`, "考点：时态、结构与写作表达"],
    material: [
      `Last month, ${writer} [41] (begin) a new plan for writing practice. Before that, ${writer} often [42] (write) without an outline and [43] (forget) important task information.`,
      `A teacher then [44] (suggest) a simple routine: read the topic carefully, make a short plan, and [45] (check) each part before finishing. After several weeks, the writer became much [46] (clear) in organization and decided [47] (keep) this habit.`,
      `By the end of the month, fewer weak endings had [48] (appear) in the drafts. Writing no longer [49] (feel) completely confusing, and the whole task became more [50] (manage).`,
    ],
    materialTranslation: [
      `上个月，${writer}[41]开始了一项新的写作训练计划。在那之前，${writer}常常[42]不列提纲就写，并且[43]忘记重要任务信息。`,
      `后来，一位老师[44]建议了一套简单流程：认真读题、列简短计划，并在完成前[45]检查每个部分。几周之后，这位写作者在组织上变得更[46]清楚，并决定[47]保持这个习惯。`,
      `到月底时，草稿里薄弱结尾的情况已经[48]变少了。写作不再[49]那样让人困惑，而整个任务也变得更[50]易于处理。`,
    ],
    assistantTitle: "给词",
    assistantItems: [
      "41. begin",
      "42. write",
      "43. forget",
      "44. suggest",
      "45. check",
      "46. clear",
      "47. keep",
      "48. appear",
      "49. feel",
      "50. manage",
    ],
    questions: [
      makeQuestion(`wb${seed.id}-cz41`, 41, "Blank 41", {
        answer: "began",
        point: "Last month 提示一般过去时。",
        translation: "第 41 空：上个月开始了一项计划。",
        pitfalls: "注意不规则变化。",
      }),
      makeQuestion(`wb${seed.id}-cz42`, 42, "Blank 42", {
        answer: "wrote",
        point: "before that 的过去背景，使用过去式。",
        translation: "第 42 空：以前常常直接写。",
        pitfalls: "时态要一致。",
      }),
      makeQuestion(`wb${seed.id}-cz43`, 43, "Blank 43", {
        answer: "forgot",
        point: "与 wrote 并列，过去式。",
        translation: "第 43 空：并忘记关键信息。",
        pitfalls: "并列谓语时态保持一致。",
      }),
      makeQuestion(`wb${seed.id}-cz44`, 44, "Blank 44", {
        answer: "suggested",
        point: "过去叙述动作。",
        translation: "第 44 空：老师建议了一套流程。",
        pitfalls: "suggest 过去式加 -ed。",
      }),
      makeQuestion(`wb${seed.id}-cz45`, 45, "Blank 45", {
        answer: "check",
        point: "and 后与前面动词原形并列。",
        translation: "第 45 空：并检查每个部分。",
        pitfalls: "并列不定式/祈使结构中保持原形。",
      }),
      makeQuestion(`wb${seed.id}-cz46`, 46, "Blank 46", {
        answer: "clearer",
        point: "much 后接比较级。",
        translation: "第 46 空：组织更清楚了。",
        pitfalls: "比较级形式别漏。",
      }),
      makeQuestion(`wb${seed.id}-cz47`, 47, "Blank 47", {
        answer: "to keep",
        point: "decide to do 固定结构。",
        translation: "第 47 空：决定保持这个习惯。",
        pitfalls: "decide 后接不定式。",
      }),
      makeQuestion(`wb${seed.id}-cz48`, 48, "Blank 48", {
        answer: "appeared",
        point: "had 后接过去分词。",
        translation: "第 48 空：草稿中已经出现更少的弱结尾。",
        pitfalls: "完成时注意过去分词。",
      }),
      makeQuestion(`wb${seed.id}-cz49`, 49, "Blank 49", {
        answer: "felt",
        point: "过去叙述继续使用过去式。",
        translation: "第 49 空：写作不再那么令人困惑。",
        pitfalls: "时态保持统一。",
      }),
      makeQuestion(`wb${seed.id}-cz50`, 50, "Blank 50", {
        answer: "manageable",
        point: "became more 后接形容词。",
        translation: "第 50 空：任务变得更容易处理。",
        pitfalls: "manage 需变形为 manageable。",
      }),
    ],
  };
}

function buildWritingSection(seed: WritingBlindspotSeed): DegreeExamSection {
  return {
    id: `writing${seed.id}-writing`,
    title: "第七部分 短文写作",
    questionRange: "51",
    score: 30,
    instructions:
      "Write a short composition of about 100 words on the given topic.",
    sourceBasis: [`作文补盲：${seed.focusZh}`, "考点：题材专项写作"],
    assistantTitle: "写作任务",
    assistantItems: [
      `题目：${seed.writingTitle}`,
      "要求：100 词左右，内容切题、结构完整、语气合适。",
      `建议：${seed.writingGuideZh}`,
    ],
    questions: [
      makeQuestion(
        `wb${seed.id}-wr51`,
        51,
        `Write a composition titled ${seed.writingTitle}.`,
        {
          answer:
            "建议先想清楚题材功能，再写开头、主体和结尾；不要只堆句子，要让内容真正服务题目任务。",
          point:
            "作文补盲卷的重点不是单纯写长，而是写对题材、写对结构、写对语气。",
          translation: `请以《${seed.writingTitle}》为题写一篇约 100 词短文。`,
          pitfalls: "不同题材的开头、语气和信息重点不同，先审题再下笔。",
        },
      ),
    ],
  };
}

function buildPaper(seed: WritingBlindspotSeed): DegreeExamPaper {
  return {
    id: `degree-writing-paper-${seed.id}`,
    title: `英语（二）作文补盲卷 ${seed.badgeNo}`,
    badge: `作文补盲 ${seed.badgeNo}`,
    description: seed.description,
    durationMinutes: 150,
    totalScore: 100,
    textbookBasis:
      "13000《英语（专升本）英语（二）自学教程》（张敬源、张虹，外语教学与研究出版社，2012 年版）",
    examBasis:
      "围绕英语（二）当前薄弱作文题材设计，同样采用 7 大题型，强化题材识别、结构意识和写作迁移。",
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

export const degreeExamWritingBlindspotPapers: DegreeExamPaper[] =
  writingBlindspotSeeds.map(buildPaper);
