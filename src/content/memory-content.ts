export type Accent = "blue" | "green" | "purple" | "amber" | "cyan" | "rose";

export interface MechanismItem {
  title: string;
  tag: string;
  summary: string;
  strengths: string;
  risks: string;
  fit: string;
}

export interface MechanismDetail {
  key: string;
  title: string;
  aliases?: string[];
  oneLiner: string;
  explanation: string;
  howItWorks: string[];
  goodFor: string[];
  watchOut: string[];
}

export interface ProjectComparison {
  project: string;
  category: string;
  tier?: "primary" | "secondary";
  corePaths: string[];
  route: string;
  writePath: string;
  readPath: string;
  storage: string;
  bestFit: string;
  risk: string;
}

export interface ImplementationRoute {
  title: string;
  label: string;
  projects: string[];
  whatItSolves: string;
  howToRead: string;
  typicalStack: string;
  caveat: string;
}

export interface PlainMechanismGuide {
  title: string;
  analogy: string;
  plainIdea: string;
  howItWorks: string;
  easyMisread: string;
}

export interface DetailSection {
  title: string;
  body: string;
  bullets: string[];
}

export interface PipelineStep {
  title: string;
  description: string;
}

export interface ExampleCase {
  title: string;
  scenario: string;
  takeaway: string;
}

export interface Dimension {
  id: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  accent: Accent;
  thesis: string;
  definition: string;
  designQuestions: string[];
  plainExplanation: string;
  whenToUse: string[];
  mainstreamMechanisms: string[];
  pipeline: PipelineStep[];
  mechanisms: MechanismItem[];
  examples: ExampleCase[];
  misconceptions: string[];
  deepDive: DetailSection[];
  architectureNotes: string[];
  metrics: string[];
  failureModes: string[];
  summaryLabel: string;
  projectComparisons?: ProjectComparison[];
  implementationRoutes?: ImplementationRoute[];
  plainMechanismGuides?: PlainMechanismGuide[];
}

export const mechanismDetails: MechanismDetail[] = [
  {
    key: "conversation-buffer-memory",
    title: "Conversation Buffer Memory",
    aliases: ["Buffer", "Conversation Buffer", "Conversation Buffer Memory"],
    oneLiner: "最原始的短期记忆做法，就是把最近对话和过程原样留着。",
    explanation:
      "它的思路非常直接：用户说了什么、agent 回了什么、工具输出了什么，都尽量按原文保留下来，再在下一轮一起送进上下文。好处是细节不会轻易丢；坏处是上下文会越堆越长。",
    howItWorks: [
      "每一轮把用户输入、回复、工具结果追加进缓冲区。",
      "下一轮推理时，把整段历史或其中大部分拼进 prompt。",
      "随着轮次增加，token 占用会持续上涨。",
    ],
    goodFor: [
      "对细节保真要求高的短对话。",
      "调试 agent 行为时，需要完整回看最近历史。",
      "任务跨度不长、上下文预算还比较宽松的场景。",
    ],
    watchOut: [
      "会很快吃满上下文窗口。",
      "工具日志一多，真正重要的信息可能被埋住。",
      "会直接增加成本和延迟。",
    ],
  },
  {
    key: "conversation-window-memory",
    title: "Conversation Window Memory",
    aliases: ["Window", "Sliding Window", "Conversation Window Memory"],
    oneLiner: "只保留最近几轮，靠滑动窗口把上下文大小卡住。",
    explanation:
      "它不试图记住全部历史，而是只保留最近 k 轮对话，或者最近一段 token 范围。这样预算更稳，但窗口外的信息会被直接丢掉。",
    howItWorks: [
      "为短期记忆设置固定窗口大小，比如最近 3 轮或最近 2,000 tokens。",
      "新内容进来时，最旧内容被挤出去。",
      "上下文长度因此保持在可控范围内。",
    ],
    goodFor: [
      "任务主要依赖最近几轮上下文。",
      "你很在意推理成本稳定性。",
      "需要一个简单且容易上线的短期记忆方案。",
    ],
    watchOut: [
      "窗口外的重要信息会被直接忘掉。",
      "长任务里容易出现“前面明明说过，后面却像没见过”的情况。",
      "窗口大小设得不合适时，表现会很摇摆。",
    ],
  },
  {
    key: "conversation-summary-buffer",
    title: "Conversation Summary Buffer",
    aliases: ["Summary", "Summary Buffer", "Conversation Summary Buffer"],
    oneLiner: "把较早历史压成摘要，给最近原文腾地方。",
    explanation:
      "它通常保留最近几轮原文，同时把更早的对话交给 LLM 做总结。这样能在有限上下文里留住更长历史，但代价是要多做一次摘要，而且摘要可能失真。",
    howItWorks: [
      "最近几轮保持原文，以保证当前细节。",
      "更早的历史定期被压缩成 summary。",
      "后续推理时，同时使用“近期原文 + 较早摘要”。",
    ],
    goodFor: [
      "长对话、多步骤任务、跨很多轮的协作场景。",
      "需要保住历史连续性，但完整原文已经放不下。",
      "希望在保真和预算之间找折中方案。",
    ],
    watchOut: [
      "摘要质量不稳时，会把关键约束压没。",
      "额外摘要调用会增加成本和延迟。",
      "如果没有原文回退，出错后不好排查。",
    ],
  },
  {
    key: "recent-raw-rolling-summary",
    title: "Recent Raw + Rolling Summary",
    aliases: ["Recent Raw + Rolling Summary（常见混合形态）", "Recent Raw + Rolling Summary"],
    oneLiner: "最近内容留原文，较早内容滚动压缩，是很多真实系统更常见的折中做法。",
    explanation:
      "它不是纯 buffer、纯 window 或纯 summary，而是把最近最关键的内容保留成原文，把更早内容逐步总结成一段滚动摘要。这样既能保住当前细节，也能留下一些历史连续性。",
    howItWorks: [
      "最近几轮保留原文。",
      "更早的历史被持续整合进一个滚动 summary。",
      "每一轮都用“最近原文 + 滚动摘要”一起进 prompt。",
    ],
    goodFor: [
      "长流程对话和多步骤任务。",
      "既怕丢细节，又怕上下文塞爆的场景。",
      "想在保真、成本、连续性之间取中间值的系统。",
    ],
    watchOut: [
      "滚动摘要如果写偏，错误会持续累积。",
      "需要想清楚什么时候重写摘要、什么时候保留原文。",
      "调试复杂度会比单一方案更高。",
    ],
  },
  {
    key: "chunking-strategy",
    title: "Chunking Strategy",
    aliases: ["Chunking Strategy", "Chunking"],
    oneLiner: "长期记忆不是直接整篇存，而是先切块；切得好不好，会直接影响检索效果。",
    explanation:
      "chunking 讲的是把长文档、对话或经验切成多大的片段。切太碎，信息会散；切太大，不相关内容又会一起被带回来。所以很多检索问题，本质上先是切块问题。",
    howItWorks: [
      "按长度、段落、语义边界或递归规则切块。",
      "给每个块单独做 embedding 和索引。",
      "检索时返回的是块，而不是整篇原文。",
    ],
    goodFor: [
      "所有基于向量检索的长期记忆。",
      "文档问答、知识库、经验回放。",
      "需要控制召回粒度的系统。",
    ],
    watchOut: [
      "切太碎会丢上下文，切太大又会带噪声。",
      "不同内容类型往往要用不同切法。",
      "chunking 往往比换库更影响最终效果。",
    ],
  },
  {
    key: "embedding-representation",
    title: "Embedding Representation",
    aliases: ["Embedding Representation", "Embedding", "Embeddings"],
    oneLiner: "把文本变成向量，方便系统按“意思接近”来找记忆。",
    explanation:
      "embedding 是一种数值表示法。系统会把一段文本映射成高维向量，让语义相近的内容在向量空间里更靠近。长期记忆里的很多语义搜索都建立在这一步上。",
    howItWorks: [
      "输入文本给 embedding 模型。",
      "得到一串数值向量作为语义表示。",
      "后续检索时比较向量之间的距离或相似度。",
    ],
    goodFor: [
      "语义搜索和相似案例召回。",
      "长期知识和历史经验检索。",
      "关键词不稳定、表达方式很多变的内容。",
    ],
    watchOut: [
      "embedding 质量会直接影响召回质量。",
      "建库和查询最好用同一套 embedding 空间。",
      "它适合语义回忆，不等于精确字段管理。",
    ],
  },
  {
    key: "vector-index-ann-search",
    title: "Vector Index / ANN Search",
    aliases: ["Vector Index / ANN Search", "ANN Search", "ANN", "Vector Index"],
    oneLiner: "在海量向量里快速找近邻，用的是近似搜索，而不是逐条硬扫。",
    explanation:
      "ANN 的意思是 approximate nearest neighbor。它的目标不是百分百找最精确的最近邻，而是在速度和准确率之间找一个工程上更划算的平衡。",
    howItWorks: [
      "把向量写入特定索引结构，比如 HNSW 或 IVF。",
      "查询时走近似最近邻搜索，而不是全量扫描。",
      "快速取回 top-k 候选给后续环节使用。",
    ],
    goodFor: [
      "大规模向量检索。",
      "对延迟敏感的在线 agent。",
      "需要让长期记忆可扩展的系统。",
    ],
    watchOut: [
      "更快通常意味着会牺牲一点精确度。",
      "索引参数调不好，效果会明显飘。",
      "ANN 只是召回层，不负责最终可用性。",
    ],
  },
  {
    key: "metadata-filtering",
    title: "Metadata Filtering",
    aliases: ["Metadata Filtering", "Metadata Filter", "Filtering"],
    oneLiner: "先按用户、时间、项目等条件过滤，再谈语义相似度。",
    explanation:
      "很多时候系统不是“没查到”，而是“查到了不该查的范围”。metadata filtering 的价值，就是先把作用域、时间、来源这些边界卡住，再在这个范围里做相似度检索。",
    howItWorks: [
      "为记忆附带 user、project、time、source 等 metadata。",
      "查询时先做条件过滤。",
      "在过滤后的候选集合里再做向量检索或重排。",
    ],
    goodFor: [
      "多用户、多项目、多来源系统。",
      "对边界和可信度比较敏感的检索场景。",
      "长期记忆规模已经比较大时。",
    ],
    watchOut: [
      "metadata 不全，过滤就会失效。",
      "过滤太严可能把真正相关内容也挡掉。",
      "需要和作用域治理一起设计。",
    ],
  },
  {
    key: "reranking-hybrid-retrieval",
    title: "Reranking / Hybrid Retrieval",
    aliases: ["Reranking / Hybrid Retrieval", "Reranking", "Hybrid Retrieval"],
    oneLiner: "先粗召回，再细排序，尽量把真正有用的内容顶到前面。",
    explanation:
      "很多系统不会直接拿第一次召回的结果就喂给模型，而是先取一批候选，再用更细的打分逻辑或另一种检索方式重排。Hybrid retrieval 则常把关键词检索和向量检索一起用。",
    howItWorks: [
      "第一轮先召回一批候选。",
      "第二轮按相关性、来源、时间或交叉编码器分数重排。",
      "必要时结合关键词检索、向量检索等多路结果。",
    ],
    goodFor: [
      "知识问答和资料型 agent。",
      "第一次召回还不够稳的系统。",
      "需要平衡语义召回和精确命中的场景。",
    ],
    watchOut: [
      "会增加延迟和系统复杂度。",
      "排序信号太多时不容易调。",
      "如果第一轮候选就错了，重排也救不回来。",
    ],
  },
  {
    key: "vector-store",
    title: "Vector Store",
    aliases: ["Vector Store", "Vector Database", "Vector DB"],
    oneLiner: "把文本变成向量后按“意思接近”来找，而不是只按关键词找。",
    explanation:
      "向量存储是长期记忆最常见的底座之一。系统先把文本块做成 embedding，再在查询时找语义上最接近的那些块。它很适合知识片段和历史经验，但不擅长强结构字段。",
    howItWorks: [
      "先把文档或记忆切块。",
      "每个块生成 embedding 并写入向量索引。",
      "查询时把问题也做成 embedding，找最近邻的 top-k 结果。",
    ],
    goodFor: [
      "知识问答、研究助手、文档检索。",
      "模糊语义回忆，而不是精确字段查询。",
      "需要在大量文本中快速找相近内容。",
    ],
    watchOut: [
      "chunking 和 embedding 选不好，检索质量会明显变差。",
      "不等于完整 memory system，还需要 metadata、排序和注入策略。",
      "不适合直接承担所有结构化状态。",
    ],
  },
  {
    key: "graph-memory",
    title: "Graph Memory",
    aliases: ["Graph Memory", "Knowledge Graph", "Graph"],
    oneLiner: "把实体和关系显式连起来，适合看“谁和谁有关”。",
    explanation:
      "图谱式记忆更像一张关系网。它不是简单存文本块，而是把人物、概念、事件、依赖关系显式建出来，适合多跳关系查询和结构推理。",
    howItWorks: [
      "先抽出实体、属性和关系。",
      "把它们写进图结构中，形成节点和边。",
      "查询时按关系链去走，而不只是做相似度搜索。",
    ],
    goodFor: [
      "组织结构、人物关系、依赖链、知识网络。",
      "需要多跳推理的场景。",
      "多 agent 共享结构化环境知识。",
    ],
    watchOut: [
      "抽取和维护都比向量库复杂。",
      "关系更新不及时会导致整张图失真。",
      "如果问题本质只是文本召回，图谱可能会过重。",
    ],
  },
  {
    key: "hybrid-storage",
    title: "Hybrid Storage",
    aliases: ["Hybrid Storage", "Hybrid Retrieval", "Hybrid"],
    oneLiner: "不同信息放不同地方，向量、关系库、图谱一起上。",
    explanation:
      "很多真实系统不会把所有记忆都塞进同一个库。语义片段进向量库，稳定字段进关系库，关系网络进图谱层。这样更贴近生产，但同步和一致性难度会更高。",
    howItWorks: [
      "先按信息类型分层：文本、状态、关系、经验各自归位。",
      "查询时根据问题走不同检索路径，必要时再合并结果。",
      "通过统一工作记忆层把多路结果拼回当前上下文。",
    ],
    goodFor: [
      "复杂平台型 agent。",
      "同时要处理语义知识、结构状态和关系网络。",
      "长期在线、能力边界较广的系统。",
    ],
    watchOut: [
      "系统复杂度和维护成本会明显上升。",
      "如果每层谁说了算没定清楚，会出现数据打架。",
      "检索编排会比单一存储复杂很多。",
    ],
  },
  {
    key: "top-k-retrieval",
    title: "Top-k Retrieval",
    aliases: ["Top-k Retrieval", "Top-k"],
    oneLiner: "先取回最相关的前 k 条，再决定哪些真正喂给模型。",
    explanation:
      "这是最常见的检索入口。系统会先按相似度或综合分数取前 k 条候选，再把它们交给后续排序或上下文编排层。k 太小容易漏，k 太大容易噪。",
    howItWorks: [
      "生成查询。",
      "从长期记忆里取回 top-k 结果。",
      "根据排序和预算决定最后真正保留哪些。",
    ],
    goodFor: [
      "第一版检索系统。",
      "需要简单、直接、好调试的记忆召回方式。",
      "中等复杂度的知识或经验型 agent。",
    ],
    watchOut: [
      "k 没有标准答案，要跟任务一起调。",
      "取回不等于用上，还要看后续工作记忆组装。",
      "如果只按相似度排，容易漏掉时间和重要性因素。",
    ],
  },
  {
    key: "query-formation",
    title: "Query Formation",
    aliases: ["Query Formation", "Query"],
    oneLiner: "先把当前任务翻译成一个好查的问题，检索才容易找对。",
    explanation:
      "检索质量不只取决于库里有什么，也取决于你到底拿什么去查。query formation 就是在当前用户请求、任务状态和上下文基础上，生成更适合检索的查询表达。",
    howItWorks: [
      "从当前任务提取检索意图。",
      "保留关键词、约束条件和上下文线索。",
      "必要时把自然语言请求改写成更适合查库的查询。",
    ],
    goodFor: [
      "复杂任务和长流程 agent。",
      "用户提问很口语、很模糊的场景。",
      "多来源长期记忆检索。",
    ],
    watchOut: [
      "改写过度可能把用户原意带偏。",
      "状态没带进去时，会查回不相关资料。",
      "很多“检索差”其实是 query 差。",
    ],
  },
  {
    key: "hybrid-ranking",
    title: "Hybrid Ranking",
    aliases: ["Hybrid Ranking", "Ranking"],
    oneLiner: "不是只看相似度，还会一起看时间、重要性、来源和优先级。",
    explanation:
      "真实系统里，最值得放进当前上下文的内容，不一定只是语义最像的那条。hybrid ranking 会把相关性、时间新旧、来源可信度、重要性等信号合起来排序。",
    howItWorks: [
      "先拿到一批候选内容。",
      "给每条候选综合打分，而不是只看单一相似度。",
      "按综合得分决定最终顺序。",
    ],
    goodFor: [
      "项目协作型和个性化系统。",
      "需要同时兼顾近期状态和长期偏好的场景。",
      "第一次检索结果噪声比较多的系统。",
    ],
    watchOut: [
      "信号一多，权重就难调。",
      "解释性会变弱，需要更强可观测性。",
      "如果排序信号互相打架，结果会不稳定。",
    ],
  },
  {
    key: "prompt-slotting",
    title: "Prompt Slotting",
    aliases: ["Prompt Slotting", "Slotting", "Context Slotting"],
    oneLiner: "不是把信息乱拼一段，而是分槽位摆进 prompt。",
    explanation:
      "Prompt slotting 的核心思想是把 profile、任务状态、约束、检索结果、最近上下文分开放。这样模型更容易知道什么是长期偏好、什么是当前约束、什么只是背景资料。",
    howItWorks: [
      "先定义固定槽位，比如 profile、task state、retrieved memory。",
      "不同来源的内容只进对应槽位。",
      "每个槽位单独分配 token 预算和优先级。",
    ],
    goodFor: [
      "多来源上下文同时存在的系统。",
      "流程清晰、约束较多的任务型 agent。",
      "想降低不同记忆互相污染的场景。",
    ],
    watchOut: [
      "槽位设计不清，会造成重复和浪费。",
      "如果预算分配失衡，重要槽位也可能被挤压。",
      "需要更强的可观测性才能调优。",
    ],
  },
  {
    key: "context-injection",
    title: "Context Injection",
    aliases: ["Context Injection", "Inject"],
    oneLiner: "检索到了不算完，真正要紧的是怎么把它送进模型眼前。",
    explanation:
      "很多系统的问题不是查不到，而是查到了也没真正进入模型当前上下文。context injection 讲的就是把记忆、状态、约束和资料用正确方式放进 prompt。",
    howItWorks: [
      "确定哪些内容最终要进 prompt。",
      "决定它们进哪个槽位、按什么顺序出现。",
      "在 token 预算限制下做取舍和截断。",
    ],
    goodFor: [
      "多来源上下文的复杂 agent。",
      "长任务和工具链较长的系统。",
      "“查到了但没用上”的排障场景。",
    ],
    watchOut: [
      "注入顺序错了，重要内容会被埋住。",
      "只做召回不做注入设计，效果常常不稳定。",
      "需要和 slotting、budget 分配一起看。",
    ],
  },
  {
    key: "always-write",
    title: "Always Write",
    aliases: ["Always Write", "Append everything"],
    oneLiner: "每一轮都写进去，最省设计时间，但也最容易把长期记忆写乱。",
    explanation:
      "这种做法最直接：不怎么判断，先全记下来。它的好处是快，也不太容易漏；问题是长期层很快会堆满噪声、临时要求和错误信息。",
    howItWorks: [
      "每一轮都直接持久化。",
      "很少做筛选、压缩和分类。",
      "后续再靠检索和治理层收拾。",
    ],
    goodFor: [
      "早期实验原型。",
      "想先保留原始数据做研究分析的场景。",
      "还没来得及设计写入门槛的时候。",
    ],
    watchOut: [
      "长期层会很快膨胀。",
      "污染和重复问题会来得很早。",
      "后期治理成本通常更高。",
    ],
  },
  {
    key: "event-triggered-write",
    title: "Event-triggered Write",
    aliases: ["Event-triggered Write", "Rule-triggered Write", "Rule-based gate"],
    oneLiner: "只在关键事件发生时才写，像“有条件地记”。",
    explanation:
      "它不是每轮都写，而是在任务完成、偏好更新、状态改变等关键节点上再落库。这样更可控，也更容易和业务逻辑对齐。",
    howItWorks: [
      "先定义关键事件类型。",
      "只有命中事件时才触发写入。",
      "配合规则决定写什么、写到哪一层。",
    ],
    goodFor: [
      "流程明确的生产系统。",
      "偏业务状态和偏好管理的记忆层。",
      "希望降低噪声写入的系统。",
    ],
    watchOut: [
      "规则太硬会漏掉意外但有价值的信息。",
      "事件定义模糊时，行为会前后不一。",
      "需要长期维护规则集合。",
    ],
  },
  {
    key: "importance-based-write",
    title: "Importance-based Write",
    aliases: ["Importance-based Write", "Importance Gate", "Scored persistence"],
    oneLiner: "先判断重不重要，再决定要不要写进长期记忆。",
    explanation:
      "它不会把每一轮都写进去，而是先做一次筛选。这样能减少噪声和临时信息混入长期层，但分数和阈值设计得不好时，也可能漏掉有价值内容。",
    howItWorks: [
      "抽出候选记忆。",
      "按重要性、持久性、可复用性等维度打分。",
      "只有达到阈值的内容才持久化。",
    ],
    goodFor: [
      "长期运行的个性化助手。",
      "希望控制长期层质量的系统。",
      "写入成本和污染风险都比较敏感的场景。",
    ],
    watchOut: [
      "阈值过高会漏记，过低会积噪。",
      "打分逻辑如果黑箱太重，不好解释和调试。",
      "要小心把“当下重要”误当成“长期重要”。",
    ],
  },
  {
    key: "consolidated-write",
    title: "Consolidated Write",
    aliases: ["Consolidated Write", "Consolidation", "Extract then persist"],
    oneLiner: "不是把原始过程全存进去，而是先整理成更稳定的事实或经验再写。",
    explanation:
      "这种方式更像“整理归档”。系统会先把多轮经历抽成事实、关系、经验或步骤，再写入长期层。好处是更干净、更可复用；问题是整理错了，错就会被正式固化下来。",
    howItWorks: [
      "保留原始经历或临时记录。",
      "在任务阶段结束后抽取稳定结论。",
      "把抽取结果写入长期记忆，并附上来源和时间信息。",
    ],
    goodFor: [
      "跨会话连续性。",
      "经验沉淀和 skill evolution。",
      "希望长期记忆更整洁、更易复用的系统。",
    ],
    watchOut: [
      "抽取质量比“直接存原文”更关键。",
      "最好保留原始来源，方便回看和纠错。",
      "别把 every-turn summary 当成默认最优解。",
    ],
  },
  {
    key: "deduplication",
    title: "Deduplication",
    aliases: ["Deduplication", "Dedup", "去重"],
    oneLiner: "防止同一件事被反复写进去，越写越吵。",
    explanation:
      "长期记忆一旦有大量重复内容，某些信息就会在检索里被不成比例地放大。去重的作用，就是让系统别因为“记了很多遍”而误以为它更重要。",
    howItWorks: [
      "在写入前或写入后识别近似重复内容。",
      "合并、覆盖或标记为同一组记忆。",
      "检索时避免重复条目挤满 top-k。",
    ],
    goodFor: [
      "任何长期在线的记忆系统。",
      "频繁重复提到用户偏好或任务状态的场景。",
      "长期层增长很快的系统。",
    ],
    watchOut: [
      "语义相近不代表完全重复，别误删有效差异。",
      "不同作用域下的相似信息，未必能合并。",
      "去重规则太粗，会伤到真正有用的细节。",
    ],
  },
  {
    key: "conflict-resolution",
    title: "Conflict Resolution",
    aliases: ["Conflict Resolution", "冲突处理"],
    oneLiner: "当新旧记忆打架时，系统要知道该信谁、怎么留痕。",
    explanation:
      "用户偏好会变，事实状态会更新，项目结论也会改。冲突处理就是在新旧记忆不一致时，决定覆盖、并存、版本化还是先人工确认。",
    howItWorks: [
      "检测两条记忆是否在同一作用域下冲突。",
      "结合来源、时间和可信度决定处理方式。",
      "保留版本或回溯线索，避免直接抹平证据。",
    ],
    goodFor: [
      "用户 profile、状态信息、项目事实。",
      "会频繁更新的长期记忆层。",
      "需要审计和可追溯的系统。",
    ],
    watchOut: [
      "没有来源和时间戳时，处理会很盲。",
      "简单覆盖虽然快，但容易丢证据。",
      "如果冲突策略不稳定，系统会显得前后不一。",
    ],
  },
  {
    key: "scope-isolation",
    title: "Scope Isolation",
    aliases: ["Scope Isolation", "作用域隔离"],
    oneLiner: "先分清是谁的、哪件事的、哪个项目的，再谈要不要共用。",
    explanation:
      "作用域隔离是防止 memory 串味的关键。用户 A 的偏好、项目 X 的状态、任务 Y 的上下文，不应该随便跑到别的边界里去。",
    howItWorks: [
      "为记忆打上 user、session、task、project 等作用域标签。",
      "写入时按边界落库，检索时按边界过滤。",
      "只在明确允许时，才跨作用域共享内容。",
    ],
    goodFor: [
      "多用户、多项目、多 agent 系统。",
      "需要长期在线协作的产品。",
      "对隐私和边界特别敏感的场景。",
    ],
    watchOut: [
      "边界划太粗会串味，划太细会降低复用。",
      "如果标签丢了，后面很难补救。",
      "跨作用域共享要有明确规则，不能默认放开。",
    ],
  },
  {
    key: "ttl-expiration",
    title: "TTL / Expiration",
    aliases: ["TTL / Expiration", "TTL", "Expiration"],
    oneLiner: "有些记忆不是永远有效，到了时间就该降权甚至失效。",
    explanation:
      "TTL 像一个到期时间。它告诉系统：这条记忆不是永久真理，而是可能过一段时间就不该再优先使用，甚至应该直接失效。",
    howItWorks: [
      "写入时附带过期时间或有效期。",
      "查询时忽略已过期内容，或显著降低其优先级。",
      "后台定期清理或归档失效记忆。",
    ],
    goodFor: [
      "临时状态、短期项目上下文。",
      "会快速变化的偏好和环境信息。",
      "长期在线系统的污染控制。",
    ],
    watchOut: [
      "有效期设太短会误删有用信息。",
      "设太长又失去治理意义。",
      "最好和来源、访问频次一起综合判断。",
    ],
  },
  {
    key: "decay-soft-forgetting",
    title: "Decay / Soft Forgetting",
    aliases: ["Decay / Soft Forgetting", "Decay", "Soft Forgetting"],
    oneLiner: "不是一下子删掉，而是让旧记忆随着时间慢慢没那么靠前。",
    explanation:
      "它更像一种“软遗忘”。系统不会立刻抹掉旧记忆，而是随着时间推移、使用频率变化，让它在排序里逐渐往后退。",
    howItWorks: [
      "为记忆设定随时间变化的权重。",
      "结合访问频次、更新时间和重要性调整排序分数。",
      "让陈旧内容逐渐失去影响力，而不是瞬间消失。",
    ],
    goodFor: [
      "长期运行的陪伴型和项目型系统。",
      "偏好会缓慢变化的场景。",
      "希望治理更柔和的系统。",
    ],
    watchOut: [
      "衰减太快会忘掉仍然重要的东西。",
      "衰减太慢则几乎没效果。",
      "需要和冲突处理、版本更新配合。",
    ],
  },
  {
    key: "provenance-versioning",
    title: "Provenance / Versioning",
    aliases: ["Provenance / Versioning", "Provenance", "Versioning"],
    oneLiner: "记忆不只要有内容，还要知道它从哪来、什么时候来的、改过几次。",
    explanation:
      "provenance 和 versioning 让系统能回头查一条记忆的来源、时间和变更历史。没有这些线索，很多冲突和误记根本无从排查。",
    howItWorks: [
      "写入时记录来源、时间戳、版本号等信息。",
      "更新时保留变更轨迹，而不是直接覆盖。",
      "检索和冲突处理时把这些线索一起考虑进去。",
    ],
    goodFor: [
      "需要可追溯和可审计的系统。",
      "长期项目和企业级 memory layer。",
      "高频更新的 profile、状态和经验层。",
    ],
    watchOut: [
      "元数据不完整时，后续很多判断都站不住。",
      "版本太多又不清理，会增加维护负担。",
      "要和冲突处理、TTL 一起设计。",
    ],
  },
  {
    key: "personalization",
    title: "Personalization",
    aliases: ["Personalization"],
    oneLiner: "让 agent 更像“记得这个用户的人”，而不是每次都从零开始。",
    explanation:
      "个性化目标强调的是长期偏好、语气、身份和用户习惯的持续命中。它关心的不是单次回答对不对，而是系统是不是越来越懂这个人。",
    howItWorks: [
      "持续积累用户相关信息。",
      "更新和纠正长期 profile。",
      "在当前回合把相关偏好稳定注入工作记忆。",
    ],
    goodFor: [
      "陪伴助手、客服、个人 Copilot。",
      "需要长期连续体验的产品。",
      "对语气和习惯比较敏感的交互场景。",
    ],
    watchOut: [
      "容易误记和过拟合用户。",
      "隐私和权限边界要格外小心。",
      "临时要求别轻易写成长期偏好。",
    ],
  },
  {
    key: "cross-session-continuity",
    title: "Cross-session Continuity",
    aliases: ["Cross-session Continuity", "Continuity"],
    oneLiner: "用户下次回来时，系统还能自然接着上次继续。",
    explanation:
      "连续性的重点是少让用户重复解释。系统需要记住上次做到哪、结论是什么、下一步该接哪里，而不是每次都像新会话一样重新开始。",
    howItWorks: [
      "保存项目阶段结论和任务状态。",
      "在新会话开始时召回相关上下文。",
      "用摘要或状态快照把进度接回来。",
    ],
    goodFor: [
      "项目助手、研究助手、长期事务代理。",
      "用户会反复回来继续同一件事的系统。",
      "需要跨天、跨周延续任务的场景。",
    ],
    watchOut: [
      "状态摘要写错时，错误会一起延续。",
      "需要更强的作用域隔离和版本管理。",
      "不是所有产品都值得为连续性付很高复杂度。",
    ],
  },
  {
    key: "task-state-support",
    title: "Task-state Support",
    aliases: ["Task-state Support", "Task State"],
    oneLiner: "让 agent 记住当前计划、约束和执行状态，别在长流程里断线。",
    explanation:
      "任务状态支持强调的是“事情做到哪了”。它比一般对话记忆更偏执行层，关心的是计划步骤、当前子任务、工具结果、恢复点和限制条件。",
    howItWorks: [
      "维护任务状态和当前子目标。",
      "把关键工具输出和约束保留在高优先级位置。",
      "在每一轮更新并重新注入当前执行状态。",
    ],
    goodFor: [
      "coding agent、workflow agent、自动化执行系统。",
      "工具链很长、步骤很多的任务。",
      "中断后需要恢复的场景。",
    ],
    watchOut: [
      "状态和日志很容易混在一起。",
      "如果没有清晰槽位，重要约束会被挤掉。",
      "长期写入时要谨防把临时过程噪声沉淀下去。",
    ],
  },
  {
    key: "skill-experience-evolution",
    title: "Skill / Experience Evolution",
    aliases: ["Skill / Experience Evolution", "Skill Evolution", "Experience Evolution"],
    oneLiner: "不只是记住发生过什么，还想把经验变成以后能复用的本事。",
    explanation:
      "这类目标更进一步。系统希望从成功和失败中提炼出可迁移的方法、步骤和策略，让 agent 不是只会回忆旧记录，而是真的能在下一次做得更好。",
    howItWorks: [
      "保留任务轨迹和结果反馈。",
      "抽取可复用经验或策略模板。",
      "在后续相似任务里优先召回并应用这些经验。",
    ],
    goodFor: [
      "研究型 agent、自我改进系统。",
      "任务分布相似、经验有复用价值的场景。",
      "希望长期跑出能力积累的系统。",
    ],
    watchOut: [
      "最难评估，也最容易“看起来学了，其实没学会”。",
      "经验抽取不稳时，会把坏方法正式写进去。",
      "需要验证、回滚和复盘机制。",
    ],
  },
  {
    key: "dedicated-memory-service",
    title: "Dedicated Memory Service",
    aliases: ["Dedicated Memory Service", "Memory Service"],
    oneLiner: "把 memory 做成一个独立服务，专门负责抽取、存储、检索和更新。",
    explanation:
      "这类路线不是在 agent 里顺手塞几条历史，而是把 memory 当成独立系统来做。agent 把对话、事件或观察交给 memory service，service 决定怎么抽取事实、怎么去重、怎么更新、怎么在下次召回。",
    howItWorks: [
      "接收对话或事件输入，先抽取候选事实或偏好。",
      "把候选内容写入向量库、关系库或混合存储。",
      "查询时按用户、作用域、相似度和时间等信号召回。",
    ],
    goodFor: [
      "需要跨应用复用记忆的个人助手或平台。",
      "希望 memory 能独立迭代、独立观测的系统。",
      "长期个性化、偏好记忆、用户事实管理。",
    ],
    watchOut: [
      "服务边界一旦设计不好，agent 和 memory 会互相甩锅。",
      "写入策略不稳时，会很快积累错误事实。",
      "多用户和多项目场景必须处理好权限和作用域。",
    ],
  },
  {
    key: "layered-agent-memory",
    title: "Layered Agent Memory",
    aliases: ["Layered Agent Memory", "Layered Memory"],
    oneLiner: "把记忆分成核心、召回、档案、消息等层，每层负责不同距离的信息。",
    explanation:
      "分层路线的重点是别让所有记忆挤在一个桶里。经常要用的身份、偏好、任务目标可以放在核心层；大量历史消息或知识片段放在外部层；上下文超限时再做摘要或归档。",
    howItWorks: [
      "核心记忆直接进入 prompt，保证稳定可见。",
      "档案或 archival memory 通过检索按需召回。",
      "消息历史、摘要和外部知识各有自己的存储与预算。",
    ],
    goodFor: [
      "长期陪伴、项目协作、复杂 agent 平台。",
      "需要同时管理 profile、历史、知识和任务状态的系统。",
      "希望 memory 边界清楚、可解释的产品。",
    ],
    watchOut: [
      "层太多会增加维护成本。",
      "同一条信息如果在多层重复，会出现冲突和更新困难。",
      "需要明确哪一层是 source of truth。",
    ],
  },
  {
    key: "temporal-knowledge-graph-memory",
    title: "Temporal Knowledge Graph Memory",
    aliases: ["Graph Memory", "Temporal Knowledge Graph Memory", "Knowledge Graph Memory"],
    oneLiner: "把记忆存成带时间的实体和关系，而不只是相似文本块。",
    explanation:
      "图谱记忆关心的是人、项目、事件和它们之间的关系。加上时间维度后，系统不仅能回答“有什么关系”，还可以区分旧关系、新关系、关系什么时候发生变化。",
    howItWorks: [
      "从事件或文本里抽取实体、关系和时间信息。",
      "把节点、边、事实有效期写入图存储。",
      "检索时结合关键词、向量、图遍历和时间过滤。",
    ],
    goodFor: [
      "关系密集、时间变化明显的知识场景。",
      "需要解释“为什么召回这条记忆”的系统。",
      "客户关系、项目事件、组织知识网络。",
    ],
    watchOut: [
      "抽取和实体消歧比普通向量检索更难。",
      "图谱维护成本高，脏边和重复节点会影响很大。",
      "不适合所有内容都强行图谱化。",
    ],
  },
  {
    key: "checkpoint-store-memory",
    title: "Checkpoint / Store Memory",
    aliases: ["Checkpoint / Store", "Checkpoint / Store Memory", "Checkpoint Memory", "Store Memory"],
    oneLiner: "checkpoint 负责恢复当前线程状态，store 负责跨线程保存可复用信息。",
    explanation:
      "这类路线更像 agent 的状态底座。checkpoint 让一次多步执行可以从中间继续，store 则让用户偏好、项目资料或语义记忆跨会话存在。它不一定自己做抽取，但给 memory 提供稳定存取接口。",
    howItWorks: [
      "每个执行线程按步骤保存状态快照。",
      "跨线程信息写入 key-value 或语义 store。",
      "下一轮执行时先恢复状态，再按需要读取 store。",
    ],
    goodFor: [
      "长流程 agent、图式 workflow、可恢复任务。",
      "需要区分 thread state 和 user memory 的框架。",
      "多 agent 或多节点执行系统。",
    ],
    watchOut: [
      "checkpoint 不是自动长期记忆，它主要解决状态恢复。",
      "store 只是底座，写入什么仍然要由上层策略决定。",
      "状态版本和 schema 变化需要治理。",
    ],
  },
  {
    key: "session-compaction",
    title: "Session Compaction",
    aliases: ["Session Compaction", "Context Compaction", "Conversation Compaction"],
    oneLiner: "当上下文快满时，把旧会话压成结构化摘要，让 coding agent 继续跑。",
    explanation:
      "coding agent 经常产生大量工具调用、日志和代码 diff。session compaction 的目标不是构建用户画像，而是把当前任务的关键历史压缩下来，避免上下文爆掉后任务断线。",
    howItWorks: [
      "持续记录消息、工具输出和执行事件。",
      "上下文接近上限时触发压缩。",
      "用摘要替换较早历史，同时保留最近关键事件。",
    ],
    goodFor: [
      "coding agent、终端 agent、长工具链任务。",
      "需要中途继续执行而不是重新解释的会话。",
      "上下文成本和延迟敏感的开发工具。",
    ],
    watchOut: [
      "压缩摘要如果漏掉约束，后续修复方向会偏。",
      "它主要服务当前会话连续性，不等于通用长期记忆。",
      "工具日志和关键状态必须分清楚。",
    ],
  },
  {
    key: "framework-memory-interface",
    title: "Framework Memory Interface",
    aliases: ["Framework Memory Interface", "Memory Interface", "Pluggable Memory Interface"],
    oneLiner: "框架定义 memory 怎么接入，把具体存储和策略留给插件或实现。",
    explanation:
      "这类路线常见于 agent framework。它不一定自己规定你必须用向量库或图谱，而是定义一套接口：memory 如何更新上下文、如何查询、如何清空、如何序列化。好处是灵活，代价是很多关键策略要使用者自己补。",
    howItWorks: [
      "定义抽象 Memory 类或协议。",
      "不同实现接入列表、Chroma、Redis、Mem0 等后端。",
      "agent 在每轮推理前调用 memory，把结果注入 model context。",
    ],
    goodFor: [
      "通用 agent 框架和多后端生态。",
      "团队希望先统一接口，再替换具体 memory 后端。",
      "实验不同 memory 策略的开发阶段。",
    ],
    watchOut: [
      "接口灵活不等于方案完整。",
      "如果没有默认治理策略，容易把脏数据原样接进 prompt。",
      "使用者需要自己评估写入、检索和预算分配。",
    ],
  },
  {
    key: "local-first-memory-os",
    title: "Local-first Memory OS",
    aliases: ["Local-first Memory OS", "Memory OS", "Markdown-first Memory"],
    oneLiner: "把 memory 做成本地优先的运行时：文件可读、索引可检索、系统可持续整理。",
    explanation:
      "这类路线不只提供一个向量库，而是把记忆写入、文件化沉淀、索引、检索、提示槽位和后台整理放在同一套本地运行时里。它适合强调可控、可审计、可迁移的 agent memory。",
    howItWorks: [
      "先把对话、事实、经验或技能抽取成结构化 memory cell。",
      "用 Markdown 或可读文件作为主要沉淀形态，同时用 SQLite、LanceDB 等索引层支撑检索。",
      "通过 cascade、prompt slots 或后台任务持续组织、更新和召回记忆。",
    ],
    goodFor: [
      "本地优先、隐私敏感或小团队协作场景。",
      "希望 memory 既能被 agent 用，也能被人审阅和版本管理。",
      "需要同时管理用户画像、事实、经验、技能和任务线索的系统。",
    ],
    watchOut: [
      "文件、索引和运行时状态必须保持一致。",
      "本地优先降低云依赖，但会增加安装、同步和迁移复杂度。",
      "如果抽取策略过宽，Markdown-first 也会沉淀大量噪声。",
    ],
  },
];

const mechanismAliasMap = new Map<string, MechanismDetail>();

for (const detail of mechanismDetails) {
  mechanismAliasMap.set(detail.key.toLowerCase(), detail);
  mechanismAliasMap.set(detail.title.toLowerCase(), detail);

  for (const alias of detail.aliases ?? []) {
    mechanismAliasMap.set(alias.toLowerCase(), detail);
  }
}

export function getMechanismDetail(label: string) {
  return mechanismAliasMap.get(label.toLowerCase());
}

export const heroStats = [
  { label: "比较维度", value: "6+2+1", note: "6 个设计维度，2 个总结章节，1 个开源实现页" },
  { label: "基础骨架", value: "3", note: "Short-term / Long-term / Working Memory" },
  { label: "详情页面", value: "9", note: "机制、总结和开源源码路线都单独成页" },
];

export const dimensions: Dimension[] = [
  {
    id: "short-term",
    navLabel: "短期记忆",
    eyebrow: "1. Short-term Memory",
    title: "短期记忆怎么管",
    accent: "blue",
    thesis: "短期记忆决定 agent 这一刻手边还留着哪些信息。它不只是聊天记录，而是在有限上下文窗口 L_context 里，帮系统留住下一步最可能用得上的内容。",
    definition: "当代理要连续聊很多轮，或者要分很多步完成任务时，如果没有短期记忆，它很快就会忘记刚刚做到哪、看到了什么、接下来要接什么。从工程实现看，短期记忆最好理解成 3 个基础机制加 1 个关键混合机制：Conversation Buffer、Conversation Window、Conversation Summary，以及 Conversation Summary Buffer。它们本质上都在“保留细节”和“别把上下文塞爆”之间找平衡。",
    summaryLabel: "看当前上下文怎么保留与压缩",
    plainExplanation:
      "可以把短期记忆想成代理桌面上摊开的那几张纸。纸太少，它会忘记刚刚做到哪；纸太多，桌面又会被堆满，看不出重点。所以短期记忆做的事，就是决定哪些最近信息要继续摊在桌上，哪些该收起来，哪些该压缩成便签。",
    whenToUse: [
      "当任务只看最近几轮对话时，优先考虑更简单的窗口式方案。",
      "当任务需要连续推进很多步时，必须考虑摘要或混合式短期记忆。",
      "当工具输出很多时，要特别注意短期记忆会不会被日志淹没。",
    ],
    mainstreamMechanisms: [
      "Conversation Buffer Memory",
      "Conversation Window Memory",
      "Conversation Summary Memory",
      "Conversation Summary Buffer",
      "Recent Raw + Rolling Summary（常见混合形态）",
    ],
    pipeline: [
      { title: "Capture", description: "捕获最近互动、工具输出与即时状态。" },
      { title: "Retain", description: "决定原文保留、窗口截断还是滚动摘要。" },
      { title: "Compress", description: "必要时对旧内容做 summary 或 token-based trimming。" },
      { title: "Inject", description: "把当前仍然重要的短期内容送入本轮 prompt。" },
    ],
    designQuestions: [
      "最近几轮是保留原文，还是压缩成摘要？",
      "token 预算逼近上限时，谁先被截断：闲聊、工具日志还是任务状态？",
      "短期记忆是被动缓存，还是允许 agent 主动整理、删减、重写？",
    ],
    mechanisms: [
      {
        title: "Conversation Buffer Memory",
        tag: "High fidelity",
        summary: "直接保留会话中的完整近期历史，包括用户输入、代理回应、工具输出，必要时还包括中间思考或状态描述。",
        strengths: "保真度最高，实现最简单，能完整保留最近互动的细节与语义连续性。",
        risks: "随着交互增长会迅速吃掉 L_context，同时带来更高的成本与延迟；只适合很短的会话。",
        fit: "短流程、高精度、需要完整回看原始上下文的任务与调试场景。",
      },
      {
        title: "Conversation Window Memory",
        tag: "Bounded context",
        summary: "只保留最近 k 轮互动或最近固定 token 范围内的内容，通过滑动窗口控制短期记忆大小。",
        strengths: "上下文占用有明确上界，预算稳定，工程实现仍然相对简单。",
        risks: "超出窗口的较早信息会被永久丢弃，即便它对后续任务仍然相关。",
        fit: "主要依赖最新上下文、对预算敏感、任务跨度相对较短的代理。",
      },
      {
        title: "Conversation Summary Buffer",
        tag: "Compressed continuity",
        summary: "用 LLM 定期总结较早互动，把旧内容压缩成摘要，同时保留最近几轮原始内容。",
        strengths: "能在可控上下文长度下保留更长历史的连续性，适合长对话与多步骤任务。",
        risks: "需要额外摘要调用，增加成本与延迟；摘要还可能丢细节或引入扭曲。",
        fit: "需要较远上下文、跨多轮推进、但完整历史已无法容纳于上下文窗口的任务。",
      },
      {
        title: "Recent Raw + Rolling Summary",
        tag: "Hybrid balance",
        summary: "把近期内容保留为原文，把更早内容滚动压缩成摘要，是很多框架和真实系统里最常见的混合短期记忆形态。",
        strengths: "兼顾近处细节和远处连续性，通常比纯 Buffer、纯 Window、纯 Summary 更平衡。",
        risks: "策略更复杂，要调阈值、调摘要时机，还要防止摘要累积失真。",
        fit: "长流程对话、复杂任务型 agent，以及需要在效果和成本之间取中间值的系统。",
      },
    ],
    examples: [
      {
        title: "客服助手的最近上下文",
        scenario: "用户刚刚问完退货政策，紧接着又问“那运费呢？”。如果短期记忆还保留着上一轮上下文，系统就知道“那”指的是退货流程，而不是随便一个运费问题。",
        takeaway: "短期记忆的价值不在于记得很多，而在于记得刚刚最关键的那一点。",
      },
      {
        title: "Coding agent 的多步修复",
        scenario: "代理刚运行完测试、看到报错、准备改下一处代码。如果前面的测试输出和当前子任务被窗口裁掉，它就会像“没看过日志”一样重新摸索。",
        takeaway: "工具型 agent 越多步骤，越依赖高质量的短期记忆。",
      },
      {
        title: "四种短期记忆像四种记事方式",
        scenario: "Conversation Buffer 像写全量日记，什么都记；Window 像桌上的便利贴，只留最近几件事；Summary Memory 像每周写周报，只留总结不留原文；Summary Buffer 则像智能笔记本，近期保留原文，旧内容快满时自动压成摘要。",
        takeaway: "这四种方式的差别，不在于谁更高级，而在于你更怕丢细节、怕超预算，还是怕长任务断线。",
      },
    ],
    misconceptions: [
      "误解一：上下文窗口越来越大，短期记忆就不重要了。",
      "误解二：只要把最近所有内容都塞进去，模型自然会自己抓重点。",
      "误解三：摘要一定比原文高级，实际上摘要很可能丢掉最关键的细节。",
    ],
    deepDive: [
      {
        title: "为什么短期记忆本质上是上下文管理问题",
        body: "短期记忆重要，不是因为系统想无上限地记更多，而是因为 LLM 的上下文窗口 L_context 有硬上限。最近发生的事如果没管好，代理做着做着就会忘记自己刚刚干了什么。",
        bullets: [
          "如果最近窗口过短，agent 会表现出“听不懂自己刚做过什么”。",
          "如果最近窗口过长，旧状态、闲聊和工具日志会淹没当前目标。",
          "因此短期记忆的关键不是越长越好，而是让最可能影响下一步推理或动作的信息保持可见。",
        ],
      },
      {
        title: "3 个基础机制 + 1 个关键混合机制，分别在做什么",
        body: "短期记忆如果从工程实现看，最清楚的理解方式不是只停在三个抽象词，而是拆成 3 个基础机制加 1 个关键混合机制。它们都在处理同一个现实问题：最近历史很有用，但上下文装不下那么多。",
        bullets: [
          "Conversation Buffer 像全量日记，什么都留着，细节最全，但也最占地方。",
          "Conversation Window 像便利贴，只保留最近几条，预算稳定，但早期内容会被撕掉。",
          "Conversation Summary Memory 像周报，不留原文，只留总结，最省空间，但信息损耗最大。",
          "Conversation Summary Buffer 像智能笔记本，近期保留原文，远期自动压缩，通常是最实用的折中。",
        ],
      },
      {
        title: "如何选择合适的短期记忆机制",
        body: "没有一种短期记忆适合所有代理。真正该看的，不是框架里这个类叫什么，而是你的任务到底有多依赖最近几轮的细节，以及要连续跑多久。",
        bullets: [
          "简短、近乎无状态的查询：Conversation Buffer 往往已经足够。",
          "只依赖最新几轮上下文的任务：Sliding Window 更高效。",
          "如果你只想保核心结论、并能接受不回看原文：Conversation Summary Memory 会更轻。",
          "需要较远上下文的长对话或多步骤任务：Summary Buffer 或 recent raw + rolling summary 往往更必要，但必须接受额外成本和摘要误差。",
        ],
      },
      {
        title: "从系统设计角度看短期记忆的真实权衡",
        body: "短期记忆设计绕不开三组现实取舍：保留原文越多，上下文越紧；压缩得越狠，越可能失真；上下文越长，成本和延迟通常越高。",
        bullets: [
          "保真度越高，越接近原始历史，但越容易顶满上下文窗口。",
          "压缩程度越强，越能节约 token，但越可能丢掉细节和约束。",
          "纯 Summary 路线最省空间，但也最容易把原始证据压没。",
          "因此很多系统最后会采用“最近原文 + 更早摘要”的折中结构，而不是完全依赖某一种机制。",
        ],
      },
    ],
    architectureNotes: [
      "短期记忆离推理回路最近，几乎每一轮都会直接参与 prompt 组装。",
      "工程上，它往往要和对话状态、工具输出、临时任务状态一起争抢 L_context 预算。",
      "如果用了 summary pipeline，就要先想清楚：什么时候开始总结、总结哪一段、原文还要不要保底留一份。",
      "如果采用的是 LangChain 一类现成抽象，还要特别注意窗口参数 `k`、以及摘要触发阈值这类关键参数怎么调。",
    ],
    metrics: [
      "最近 3-5 轮里，关键信息有没有被完整保住",
      "短期记忆吃掉了多少 prompt token",
      "做完摘要后，关键事实和限制条件还在不在",
      "长对话里，系统是不是越来越常要求用户重复说明",
      "窗口大小或摘要阈值一调，效果会不会大幅抖动",
    ],
    failureModes: [
      "只用会话缓冲区，导致上下文长度、成本和延迟快速失控",
      "只保留窗口，导致跨十几轮任务时频繁忘前文",
      "只保留摘要，导致原始证据消失、精确细节和数字逐步漂移",
      "工具输出不分层，导致短期记忆被 observation 日志噪声淹没",
      "混合策略阈值没调好，结果摘要过早触发，近期细节被不必要地压缩",
    ],
  },
  {
    id: "long-term",
    navLabel: "长期记忆",
    eyebrow: "2. Long-term Memory",
    title: "长期记忆怎么存",
    accent: "green",
    thesis: "长期记忆负责把放不进上下文窗口的大量知识和旧经验存起来，并在需要的时候把真正相关的那部分找回来。重点不只是“存住”，更是“之后还能找对”。",
    definition: "长期记忆首先是一层能力，不等于某一种数据库。现在很多系统会把 embedding、vector database 和 ANN retrieval 用作语义检索层，但这不是唯一答案。语义片段常放在 Vector，稳定字段常放在 Relational，关系网络常放在 Graph，而真实系统里很常见的是几种方式一起用。",
    summaryLabel: "看记忆底层表示如何承接不同信息类型",
    plainExplanation:
      "可以把长期记忆想成代理的资料库。短期记忆像桌面，长期记忆像档案室。桌面放不下的内容，就要存到档案室里；等需要时，再快速找回来。这个档案室不一定只有一种柜子: 有些信息更适合放进向量检索层，有些更适合放进关系库或状态表。向量数据库和嵌入最擅长处理的是“按意思找资料”，但它们不是长期记忆的全部。",
    whenToUse: [
      "当知识量远超上下文窗口时，需要长期记忆而不是只扩上下文。",
      "当用户会跨多次会话回来，或者任务需要回看过去经验时，长期记忆很关键。",
      "当检索的不只是固定字段，而是语义相似的历史经验时，向量检索通常会成为主线。",
      "当你要保存的是明确状态、用户资料或稳定字段时，关系型或 KV 结构往往比单纯向量化更合适。",
    ],
    mainstreamMechanisms: [
      "Chunking Strategy",
      "Embedding Representation",
      "Vector Index / ANN Search",
      "Metadata Filtering",
      "Reranking / Hybrid Retrieval",
    ],
    pipeline: [
      { title: "Chunk", description: "将长文档或经验切成可检索的语义块。" },
      { title: "Embed", description: "用 embedding 模型将块映射为高维向量。" },
      { title: "Index", description: "将向量、原文与元数据写入向量索引或混合存储层。" },
      { title: "Search", description: "对查询向量执行 ANN 搜索并取 top-k 邻近块。" },
      { title: "Filter & Rerank", description: "按元数据、上下文与相关性进一步筛选和重排。" },
      { title: "Return", description: "将最终文本块和元数据送回工作记忆层。" },
    ],
    designQuestions: [
      "要记的是语义片段、实体关系，还是稳定业务状态？",
      "查询更重近似召回，还是精确命中？",
      "同一条记忆是否需要多种表示同时存在？",
    ],
    mechanisms: [
      {
        title: "Vector Store",
        tag: "Semantic recall",
        summary: "把文本块编码为高维 embedding，利用语义相似度做长期召回，是 LLM agent 最常见的长期记忆底座。",
        strengths: "天然适合语义搜索，适合海量文本知识与历史经验的近似匹配检索。",
        risks: "精确字段更新、冲突消解、强结构关系查询较弱；检索质量高度依赖 chunking、embedding 模型与索引策略。",
        fit: "偏好、案例、文档、知识片段、历史经验等语义型长期记忆。",
      },
      {
        title: "Graph Memory",
        tag: "Entity / relation",
        summary: "以实体和关系为核心，将记忆显式组织成网络结构。",
        strengths: "适合处理关系推理、多跳查询和结构依赖。",
        risks: "抽取、更新与一致性维护更复杂。",
        fit: "组织知识、依赖链、人物关系、多 agent 协作状态。",
      },
      {
        title: "Relational / KV",
        tag: "Precise state",
        summary: "把记忆作为稳定字段和结构化状态管理。",
        strengths: "查询精确、更新明确、治理边界清晰。",
        risks: "对模糊语义回忆不灵活，需要 schema 设计。",
        fit: "用户资料、配置、权限、环境状态、账户事实。",
      },
      {
        title: "Hybrid Storage",
        tag: "Layered memory",
        summary: "多种存储并存，让语义、关系和精确状态各回各位，向量数据库通常只承担其中一层。",
        strengths: "更贴近真实生产系统，能兼顾 semantic recall、precision 与 reasoning。",
        risks: "系统复杂度、同步成本和 source of truth 设计难度显著上升。",
        fit: "复杂 agent 平台、长期协作系统、企业级 memory layer。",
      },
    ],
    examples: [
      {
        title: "研究助手回看旧资料",
        scenario: "用户今天问一个框架的架构设计，下周回来再问“上次提到的检索模块有什么风险？”。如果长期记忆能做语义检索，系统能把上次讨论中真正相关的资料重新召回。",
        takeaway: "长期记忆的目标不是把所有旧内容塞回 prompt，而是把真正相关的旧资料找回来。",
      },
      {
        title: "企业文档问答中的 chunking 问题",
        scenario: "如果一份设计文档被切得过碎，检索时只能拿到零散句子；切得过大，又会把不相关内容一起带回来。",
        takeaway: "长期记忆效果经常不是输在模型，而是输在 chunking 和检索流程。",
      },
    ],
    misconceptions: [
      "误解一：有向量数据库就等于已经有长期记忆系统。",
      "误解二：embedding 只要换成更大的模型，检索质量自然会更好。",
      "误解三：检索错了主要怪数据库，实际上 chunking、metadata 和 reranking 同样关键。",
    ],
    deepDive: [
      {
        title: "语义搜索为什么是长期记忆的基础",
        body: "长期记忆里有一大类非常常见的内容，是自然语言知识、案例和历史经验。对这类内容来说，语义搜索比关键词匹配更实用，因为它能找“意思相近”的内容。这就是 embedding 最有用的地方。但这说的是长期记忆里的一个大类问题，不是说所有长期记忆都必须走这条路。",
        bullets: [
          "embedding 会把文本映射为高维稠密向量，语义相近的内容在向量空间中更接近。",
          "查询时，系统不是逐词匹配，而是比较查询向量与文档向量之间的相似度。",
          "因此 agent 能检索到“表达不同但意思相近”的经验与知识块。",
          "但如果你要存的是明确字段和稳定状态，未必需要先把它们向量化。",
        ],
      },
      {
        title: "向量数据库解决的是长期记忆里的“语义检索层”，不是全部长期记忆",
        body: "向量数据库的价值，不是替代所有长期记忆，而是把“按意思找资料”这件事做得可扩展。它负责的是长期记忆中的语义检索层: 当你有很多文本块、案例和历史经验，需要在海量向量里快速找出和当前问题最接近的那几条内容时，它就很有用。",
        bullets: [
          "真实系统不会线性扫描所有向量，而是依赖 HNSW、IVF 等 ANN 索引。",
          "ANN 用可接受的近似精度换取大幅速度提升，这对实时 agent 很关键。",
          "数据库通常还要同时保存原始文本块与元数据，而不仅仅是向量本身。",
          "但 user profile、权限、任务状态这些内容，往往仍然会放在关系型或 KV 层里。",
        ],
      },
      {
        title: "长期记忆的索引与查询流程比“选哪家库”更重要",
        body: "很多团队会纠结该选 Pinecone、Milvus 还是 Chroma，但真正更影响效果的，通常是 chunk 怎么切、embedding 怎么做、检索链路怎么走。",
        bullets: [
          "长文档先要切成合适的块，chunk 太大或太小都会影响召回质量。",
          "查询时必须使用与建库时一致的 embedding 模型，否则语义空间会错位。",
          "最终返回给 agent 的不是向量，而是对应的原始文本块和元数据。",
        ],
      },
      {
        title: "如何理解长期记忆的真实权衡",
        body: "长期记忆最难的地方，不是看能存多少，也不是默认选某一种存储，而是看系统能不能用合适的表示，把远处但真正有用的记忆带回当前推理。",
        bullets: [
          "语义召回能力越强，越依赖 embedding 质量与索引策略。",
          "精确状态管理越重要，越需要结构化存储和明确更新逻辑。",
          "索引越追求速度，越可能牺牲部分精确度，这是 ANN 的基本取舍。",
          "长期记忆越大，越要依赖 metadata、filtering 与后续 reranking 来维持质量。",
        ],
      },
    ],
    architectureNotes: [
      "长期记忆通常不只是一个数据库，而是一整条链路；而且这条链路里也未必只有一种存储。",
      "向量数据库最有价值的地方，是能对高维向量做高效 ANN 搜索，不只是“帮你把 embedding 存起来”。",
      "如果系统里同时存在知识片段、profile、任务状态和关系结构，就应该接受它们落在不同层，而不是强行全塞进向量库。",
      "如果用了 Hybrid storage，要先说清楚每类信息到底以哪一层为准，不然写着写着就会前后打架。",
      "存储方式必须和后面的检索方式对得上，否则就会出现“明明存进去了，但就是不好找、找回来也不好用”的问题。",
    ],
    metrics: [
      "真正相关的旧内容，top-k 里能不能经常找回来",
      "embedding + ANN 检索平均要花多久",
      "chunk 切大一点或小一点，结果会不会明显变差",
      "结构化字段更新后，旧值和新值能不能处理干净",
      "多用户、多项目时，记忆会不会互相串",
    ],
    failureModes: [
      "把向量数据库当成完整长期记忆系统，忽略长期记忆里还有状态层、关系层和治理问题",
      "chunk 切分不合理，导致语义片段过碎或过大，检索质量下降",
      "用单一向量库承接所有信息，导致 profile、状态、知识混杂",
      "没有时间戳和来源，无法判断哪条长期记忆更新更可信",
      "ANN 速度很快，但没有后续过滤或 reranking，导致结果近似却不够可用",
    ],
  },
  {
    id: "working-memory",
    navLabel: "工作记忆",
    eyebrow: "3. Working Memory",
    title: "工作记忆怎么组装",
    accent: "purple",
    thesis: "工作记忆负责把这一轮真正该看的材料摆到模型眼前。它不负责长期存档，但它直接决定模型这一刻到底看见了什么。",
    definition: "很多系统的问题不是没有记忆，而是记忆没有被正确送进当前推理。比较工作记忆时，不能只看“有没有检索”，还要看 top-k 取多少、怎么排序、放进 prompt 的哪个位置，以及 token 预算怎么分。",
    summaryLabel: "看真正喂给模型的上下文如何编排",
    plainExplanation:
      "如果说长期记忆像档案室，那工作记忆就像代理此刻真正摆在眼前、准备拿来思考的材料。材料找到了不代表就有用，关键是它有没有被按顺序摆好、有没有挤掉更重要的信息。",
    whenToUse: [
      "当系统已经有检索能力，但回答质量仍然不稳定时，通常要回头看工作记忆编排。",
      "当上下文来源很多，比如用户画像、任务状态、检索块、工具输出同时存在时，工作记忆是关键层。",
      "当你发现“明明查到了，却没用上”时，问题往往就在这一层。",
    ],
    mainstreamMechanisms: [
      "Query Formation",
      "Top-k Retrieval",
      "Hybrid Ranking",
      "Prompt Slotting",
      "Token Budget Allocation",
      "Context Injection",
    ],
    pipeline: [
      { title: "Query", description: "根据当前任务形成搜索或状态查询。" },
      { title: "Retrieve", description: "取回长期记忆、profile、状态和外部上下文。" },
      { title: "Rank", description: "按 relevance / recency / importance 做排序。" },
      { title: "Slot", description: "将不同来源的内容放入固定 prompt 槽位。" },
      { title: "Budget", description: "按优先级分配 token，决定谁被保留或截断。" },
      { title: "Inject", description: "把最终工作记忆注入当前推理回合。" },
    ],
    designQuestions: [
      "top-k 是固定值，还是按任务动态调整？",
      "排序看 relevance、recency、importance，还是 source priority？",
      "用户 profile、任务状态、最近窗口、工具输出各占多少 token？",
    ],
    mechanisms: [
      {
        title: "Top-k Retrieval",
        tag: "Selection",
        summary: "从长期记忆中取若干最相关条目送入当前回合。",
        strengths: "逻辑直接，容易测试与部署。",
        risks: "k 太小会漏，k 太大会带噪声。",
        fit: "第一版记忆系统与中等复杂度知识 agent。",
      },
      {
        title: "Hybrid Ranking",
        tag: "Relevance + recency + importance",
        summary: "用多因素排序，而不只依赖单一语义相似度。",
        strengths: "更接近真实回忆逻辑，能兼顾任务相关与长期偏好。",
        risks: "权重设计复杂，调不好会误召回。",
        fit: "中长周期 agent、个性化助手、项目式协作场景。",
      },
      {
        title: "Prompt Slotting",
        tag: "Context assembly",
        summary: "把不同来源的记忆放入明确槽位，例如 user profile、constraints、task state。",
        strengths: "能显著降低不同记忆类型互相污染的概率。",
        risks: "槽位定义不清时，会造成信息重复或预算浪费。",
        fit: "多来源记忆并存、流程明确的 agent 系统。",
      },
    ],
    examples: [
      {
        title: "查到了，但没用上",
        scenario: "系统从长期记忆里成功召回了用户的团队规范，但 prompt 最终被工具日志和最近闲聊挤满，规范没有真正进到模型当前上下文里。",
        takeaway: "工作记忆的问题常常不是“没查到”，而是“没摆好”。",
      },
      {
        title: "多来源上下文冲突",
        scenario: "同一轮里同时有用户画像、任务约束、检索结果和 shell 输出，如果没有明确槽位，它们会争夺 token 预算，最后谁进上下文往往变得随机。",
        takeaway: "工作记忆是编排问题，不只是检索问题。",
      },
    ],
    misconceptions: [
      "误解一：检索完成之后，工作记忆的工作就结束了。",
      "误解二：只要 top-k 调大，系统就会更稳。",
      "误解三：工作记忆只是一个 prompt 拼接层，不需要单独设计和观测。",
    ],
    deepDive: [
      {
        title: "为什么工作记忆经常被低估",
        body: "很多人以为“查到了记忆”就万事大吉，但模型最后是按 prompt 工作的，不是按数据库工作的。真正影响输出的，是这些材料有没有被正确摆到模型眼前。",
        bullets: [
          "错误的槽位编排会让高价值记忆被埋在低价值上下文里。",
          "排序逻辑单一时，最新但不关键的信息可能压过长期重要事实。",
          "token budget 不清晰时，系统行为会随输入长度剧烈抖动。",
        ],
      },
      {
        title: "工作记忆常见设计模式",
        body: "成熟系统通常会把 prompt 像工作台一样分区，而不是把所有检索结果、最近对话和约束条件胡乱拼成一大段。",
        bullets: [
          "System / policy instructions 固定预算。",
          "Recent interaction 与 task state 保持高优先级。",
          "Retrieved memory、profile、constraints 按槽位注入。",
        ],
      },
      {
        title: "为什么很多研究开始做层级化 working memory",
        body: "长任务里，真正有用的不是把所有 action-observation 全塞进上下文，而是把和当前子目标最相关的那一小部分内容留在眼前，其余内容要么先总结，要么先放到一边。",
        bullets: [
          "一种常见思路是按 subgoal 切块，而不是按原始时间顺序平铺历史。",
          "这样做能减少重复日志和低价值观察对当前推理的干扰。",
          "通俗地说，就是别把整本施工日志摊满桌，而是先只拿和当前步骤有关的那几页。",
        ],
      },
      {
        title: "如何评估工作记忆是否足够好",
        body: "工作记忆好不好，看的是“模型这轮有没有真的用上该用的信息”。这不只是检索质量问题，更是编排质量问题。",
        bullets: [
          "相同任务在不同输入长度下是否仍然稳定表现。",
          "长工具链执行后，关键约束是否仍能被模型看到。",
          "个性化信息是否能进入当前回合，而不是只存在数据库里。",
        ],
      },
      {
        title: "用更通俗的话说，工作记忆像什么",
        body: "如果长期记忆像档案室，那工作记忆就像你此刻摊在桌面上的材料。档案室里资料再多，如果桌面上摆错了顺序、遗漏了关键页，实际做决定时还是会出错。",
        bullets: [
          "检索像是把资料从档案室拿出来。",
          "排序和槽位像是决定哪些资料放在桌面正中，哪些放在一边。",
          "token budget 则像桌面大小，桌面有限，就必须有取舍。",
        ],
      },
    ],
    architectureNotes: [
      "工作记忆通常是 retrieval pipeline、prompt builder 和 budget allocator 一起决定出来的。",
      "在系统层，最好把 profile、constraints、task state、retrieved memory 分开放，而不是最后一把全混进 prompt。",
      "这一层一定要可观测，至少要知道哪些记忆被召回了、哪些被裁掉了、哪些最终真的进了模型上下文。",
    ],
    metrics: [
      "top-k 改大改小后，结果会不会明显飘",
      "不同槽位各吃了多少 token，值不值",
      "高价值记忆到底有没有稳定进入 prompt",
      "任务一长，当前上下文是不是开始乱跳",
    ],
    failureModes: [
      "相关记忆召回到了，但没有正确进入 prompt 结构",
      "工具输出挤占 token，导致约束与 profile 消失",
      "排序只看语义相似度，忽略 recency 与 importance",
    ],
  },
  {
    id: "write-policy",
    navLabel: "写入策略",
    eyebrow: "4. Write Policy",
    title: "何时写入长期记忆",
    accent: "amber",
    thesis: "长期记忆第一关不是怎么查，而是什么时候该写进去。什么值得记、什么时候记、记成什么样，基本决定了后面检索质量的上限。",
    definition: "靠谱的 memory 系统通常不会每轮都写，而是会用规则、重要性评分、事件触发或 consolidation 来筛一遍，只有真正值得长期保留的内容才进库。",
    summaryLabel: "看什么信息被允许沉淀为长期记忆",
    plainExplanation:
      "写入策略就像代理的“记事规则”。不是每句话都值得长期记住，也不是所有重要信息都该立刻入库。写入策略做的事，就是决定什么该记、什么时候记、用什么形式记。",
    whenToUse: [
      "当长期记忆越来越大、但召回质量越来越差时，通常要先检查写入策略。",
      "当系统容易把一次性的临时要求当成长期偏好时，说明写入门槛太低。",
      "当你开始关心 memory quality，而不只是 memory quantity 时，就必须设计写入策略。",
    ],
    mainstreamMechanisms: [
      "Always Write",
      "Rule-triggered Write",
      "Importance-gated Write",
      "Extract-then-Write",
      "Consolidated Write",
    ],
    pipeline: [
      { title: "Observe", description: "识别当前回合或任务中可能值得长期保存的信息。" },
      { title: "Score", description: "依据规则、事件或重要性评估是否值得持久化。" },
      { title: "Normalize", description: "决定以原文、摘要、事实、关系还是经验形式写入。" },
      { title: "Persist", description: "将筛选后的记忆写入长期层并附上 metadata。" },
      { title: "Consolidate", description: "在后处理阶段进一步整合成更稳定的长期表示。" },
    ],
    designQuestions: [
      "每轮都写，还是只在关键事件和任务收束时写？",
      "是存原文、存摘要、存事实，还是存关系与经验？",
      "写入决策由规则控制、LLM 决定，还是混合策略？",
    ],
    mechanisms: [
      {
        title: "Always Write",
        tag: "Append everything",
        summary: "每轮交互都写入长期层，最简单但风险最高。",
        strengths: "实现快，不容易漏掉可能重要的信息。",
        risks: "噪声、瞬时需求和错误信息会一起沉淀。",
        fit: "仅适合实验阶段或小规模研究环境。",
      },
      {
        title: "Event-triggered Write",
        tag: "Rule-based gate",
        summary: "在用户偏好、任务完成、状态变化等关键事件发生时再写入。",
        strengths: "可控性强，容易与业务规则对齐。",
        risks: "规则过于僵硬时，会漏掉非预期但高价值的记忆。",
        fit: "流程清晰、业务边界明确的生产系统。",
      },
      {
        title: "Importance-based Write",
        tag: "Scored persistence",
        summary: "先评估记忆的重要性，再决定是否持久化。",
        strengths: "能显著降低冗余和记忆污染。",
        risks: "分数阈值不稳时会出现漏记或误记。",
        fit: "中长期运行的个性化助手和项目型 agent。",
      },
      {
        title: "Consolidated Write",
        tag: "Extract then persist",
        summary: "先把多轮交互整理为事实、关系或经验，再写入长期层。",
        strengths: "长期记忆更抽象、更干净、更可复用。",
        risks: "整合错误会把噪声“合法化”成长期事实。",
        fit: "跨会话连续性、经验沉淀、skill evolution 场景。",
      },
    ],
    examples: [
      {
        title: "临时需求被误记成长期偏好",
        scenario: "用户今天说“这次请用正式语气写”，系统如果直接把这句话写成长期偏好，下次所有回复都变得过度正式。",
        takeaway: "写入策略要能区分“这一轮有效”与“长期有效”。",
      },
      {
        title: "任务完成后的经验沉淀",
        scenario: "代理多次完成同类排障任务后，把原始过程整理成一条稳定经验，再写入长期层，后续就不必每次都从头探索。",
        takeaway: "好的写入策略不仅决定记不记，还决定记成什么形态更有价值。",
      },
    ],
    misconceptions: [
      "误解一：写得越多，长期记忆就越聪明。",
      "误解二：只要有打分模型，写入策略就自动合理。",
      "误解三：consolidation 一定会提升质量，实际上也可能把原始经验改坏。",
    ],
    deepDive: [
      {
        title: "写入策略为什么是 memory 质量的第一关",
        body: "长期记忆一旦写进去，后面每次检索、排序和推理都有可能再次用到它。所以写入阶段出错，不是只错一次，而是可能被反复放大。",
        bullets: [
          "存得太多，长期层会被碎片和幻觉淹没。",
          "存得太少，系统又无法真正形成跨会话连续性。",
          "所以写入策略的核心不是多写，而是有选择地写。",
        ],
      },
      {
        title: "写入粒度决定后续检索方式",
        body: "你今天决定怎么写进去，明天系统就只能按这种形态把它找回来。存原文、存摘要、存事实、存关系，其实是在提前决定未来怎么检索、怎么用。",
        bullets: [
          "原文适合保真，但会增加冗余和检索噪声。",
          "事实与关系便于整理，但需要抽取和版本化。",
          "经验和技能更有迁移价值，但提炼难度最高。",
        ],
      },
      {
        title: "一个实用的写入设计顺序",
        body: "很多团队一开始就急着讨论要不要上向量库，反而忘了先回答“哪些东西值得记”。更稳的做法，是先想目标，再倒推写入策略。",
        bullets: [
          "如果服务个性化，就优先定义哪些偏好值得长期保存。",
          "如果服务任务执行，就优先定义哪些状态需要跨回合延续。",
          "如果服务 skill 演化，就优先定义哪些成功/失败轨迹值得提炼。",
        ],
      },
      {
        title: "为什么“先保留原始经历，再谨慎 consolidation”越来越重要",
        body: "近来的研究开始提醒一个问题：把经历总结成长期结论，不一定总是赚的。有时候 consolidation 会把原本有用的经验改写坏。换句话说，摘要不是天然更高级，它也可能丢掉关键证据。",
        bullets: [
          "Raw episodes 像原始案卷，保真但杂乱。",
          "Consolidated memory 像整理后的经验手册，更易复用，但可能改写失真。",
          "更稳的设计往往不是“每轮都总结”，而是先保留原始经历，再对 consolidation 做显式门控。",
        ],
      },
      {
        title: "用更通俗的话说，写入策略像什么",
        body: "写入策略就像给代理立规矩：不是每句话都进档案室，也不是每个细节都值得存十年。它决定的是“什么算重要、什么只是路过”。",
        bullets: [
          "每轮都写，像是把所有草稿都塞进档案柜。",
          "重要性筛选，像是先打标签，再决定是否归档。",
          "Consolidation，像是把多页会议纪要整理成一页正式结论再入库。",
        ],
      },
    ],
    architectureNotes: [
      "写入策略最好单独做成一条 memory ingestion pipeline，而不是散落在业务代码里临时拼出来。",
      "更稳的系统会把 extraction、scoring、normalization、persist 分成几个能看见、能排查的步骤。",
      "如果后面还要做 consolidation，写入时就得顺手把足够的 metadata 留好，方便回溯和重整。",
    ],
    metrics: [
      "写进去的新内容里，有多少其实是重复或噪声",
      "真正重要的信息，有没有被漏掉",
      "新写入的长期记忆，后面到底有没有被再次用到",
      "不同写入策略会额外增加多少 token 和延迟成本",
    ],
    failureModes: [
      "每轮都写，导致长期层快速积累噪声",
      "规则过死，导致高价值非标准信息被漏记",
      "先抽取再写入，但抽取质量不稳，反而把错误固化",
    ],
  },
  {
    id: "hygiene",
    navLabel: "污染治理",
    eyebrow: "5. Memory Hygiene",
    title: "如何避免记忆污染",
    accent: "cyan",
    thesis: "memory 不是只会越记越聪明的模块。没有清理和约束，系统会慢慢积累重复、冲突、过期信息，最后变成“记得很多，但越来越不准”。",
    definition: "去重、冲突处理、scope isolation、TTL、decay、provenance 和删除机制，决定了一个 memory 系统跑久之后还能不能信，而不是越跑越乱。",
    summaryLabel: "看长期运行后记忆是否还能保持可信",
    plainExplanation:
      "污染治理可以理解成代理记忆系统的“清洁和秩序”。如果长期没人整理，记忆里会越来越多重复内容、旧信息、相互矛盾的事实，最后代理虽然记得很多，却越来越不靠谱。",
    whenToUse: [
      "当系统会长期在线运行，或者记忆会持续累积时，这一层迟早会成为核心问题。",
      "当同一用户会跨任务、多轮、多天使用代理时，污染和过期问题会更快暴露。",
      "当系统开始支持多用户、多项目或多 agent 协作时，作用域治理几乎是必需项。",
    ],
    mainstreamMechanisms: [
      "Deduplication",
      "Conflict Resolution",
      "Scope Isolation",
      "TTL / Expiration",
      "Decay / Soft Forgetting",
      "Provenance / Versioning",
    ],
    pipeline: [
      { title: "Detect", description: "识别重复、冲突、过期与跨作用域污染信号。" },
      { title: "Isolate", description: "在 user / session / task / project 等边界内隔离记忆。" },
      { title: "Resolve", description: "对重复和冲突内容执行去重、覆盖或版本化。" },
      { title: "Age", description: "通过 TTL 和 decay 降低陈旧记忆的影响力。" },
      { title: "Audit", description: "保留来源、时间戳和版本信息，支持回溯与纠错。" },
    ],
    designQuestions: [
      "系统如何处理重复、冲突、过期与错误记忆？",
      "不同用户、任务、项目、agent 之间是否有清晰 scope 边界？",
      "系统是否知道每条记忆来自哪里、何时产生、何时应该失效？",
    ],
    mechanisms: [
      {
        title: "Deduplication",
        tag: "Remove repeats",
        summary: "识别语义重复或结构化重复，避免同一信息被多次写入。",
        strengths: "降低长期层噪声，提高检索效率。",
        risks: "过度去重会误删有差异但相似的有效信息。",
        fit: "任何持续运行的长期记忆系统。",
      },
      {
        title: "Conflict Resolution",
        tag: "Resolve contradictions",
        summary: "当新旧记忆冲突时，决定覆盖、版本化、并存还是人工确认。",
        strengths: "防止过期事实长期误导系统。",
        risks: "若缺少来源与时间信息，冲突处理会变成拍脑袋。",
        fit: "用户 profile、状态类数据、事实型长期记忆。",
      },
      {
        title: "Decay / TTL",
        tag: "Soft forgetting",
        summary: "通过时间衰减、访问频次、TTL 等方式降低陈旧记忆影响力。",
        strengths: "能让长期层更接近真实记忆的“软遗忘”。",
        risks: "衰减策略不当会让仍然重要的记忆消失。",
        fit: "高更新频率、长生命周期的在线系统。",
      },
      {
        title: "Scope Isolation",
        tag: "Boundary control",
        summary: "按 user / session / task / project / org 分层隔离记忆边界。",
        strengths: "能显著降低跨任务和跨用户污染。",
        risks: "边界过细会影响共享效率，边界过粗会导致串味。",
        fit: "多租户、多任务、多 agent 协作系统。",
      },
    ],
    examples: [
      {
        title: "旧偏好长期霸榜",
        scenario: "用户半年前喜欢某种写作风格，但现在已经明确改口。如果系统没有 decay 或版本更新，旧偏好仍然可能在检索里排第一。",
        takeaway: "污染治理不是只处理错误，也要处理“曾经正确、现在过期”的记忆。",
      },
      {
        title: "跨项目串味",
        scenario: "用户上午在 A 项目里讨论数据库迁移，下午在 B 项目里问接口问题。如果作用域没隔离，系统可能把 A 项目的迁移状态错带进 B 项目。",
        takeaway: "很多看似“模型答非所问”的问题，实际上是治理层的边界没守住。",
      },
    ],
    misconceptions: [
      "误解一：污染治理只是做一下去重。",
      "误解二：只要检索相关性高，旧信息就不会造成伤害。",
      "误解三：治理属于后期运维问题，不需要在架构阶段考虑。",
    ],
    deepDive: [
      {
        title: "什么叫 memory pollution",
        body: "污染不是某一个单独的 bug，而是一堆小问题慢慢积累出来的偏差。刚开始看不明显，时间一长就会越来越难收拾。",
        bullets: [
          "重复写入会让某些信息在检索中被不合理放大。",
          "旧事实未失效，会让系统误以为世界状态仍未变化。",
          "跨项目串味，则会把别的任务的状态带进当前决策。",
        ],
      },
      {
        title: "治理为什么不能被当成附加项",
        body: "没有治理的 memory，前期看起来往往很聪明，因为它确实“记住了很多”。但时间一长，系统会因为记得太杂、太旧、太乱而越来越不可信。",
        bullets: [
          "系统越运行越久，污染累积效应越明显。",
          "治理机制通常不会直接提升单轮效果，但能决定半年后系统是否还能用。",
          "因此 memory hygiene 应该与 write policy 同级设计，而不是事后补救。",
        ],
      },
      {
        title: "一个实用治理组合",
        body: "真实系统很少只靠一种治理机制。更常见的做法，是在写入、存储、检索三个环节都加一点保护。",
        bullets: [
          "写入前做基础去重和作用域判断。",
          "写入后保留来源、时间戳和版本信息。",
          "检索时再叠加 decay、scope filtering 和 source preference。",
        ],
      },
      {
        title: "为什么治理现在越来越强调“时间维度”",
        body: "很多 memory 问题不是一轮就爆炸，而是积累几十轮、几百轮之后才慢慢显形。也正因为这样，治理不能只看单次检索，还要看系统会不会随着时间越跑越偏。",
        bullets: [
          "有些风险不是 prompt injection 当场触发，而是被长期写入后慢慢影响后续任务。",
          "因此 evaluation 不应只看单回合安全，还要看记忆积累后的行为变化。",
          "通俗地说，不只是看今天档案室乱不乱，还要看它会不会一个月后彻底失控。",
        ],
      },
      {
        title: "用更通俗的话说，污染治理像什么",
        body: "如果写入策略是决定“什么进档案室”，那污染治理就是决定“档案室如何一直保持有序”。否则文件会越来越多，但真正想找的东西反而越来越难找。",
        bullets: [
          "Dedup 像清理重复复印件。",
          "Conflict resolution 像给新旧版本做取舍或留档。",
          "TTL 和 decay 像告诉系统：有些东西不是永远都该排在前面。",
        ],
      },
    ],
    architectureNotes: [
      "污染治理要贯穿 write-time、store-time、retrieve-time 三个阶段，不能等到查询时报错了再补洞。",
      "至少要保留 provenance、timestamp、scope、version 这些元数据，不然很多冲突根本没法判断。",
      "如果系统会长期在线，decay 和 TTL 应该进日常调度逻辑，而不是靠人手动清理。",
    ],
    metrics: [
      "长期记忆里有多少内容其实是重复的",
      "新旧冲突出现时，系统能不能稳定处理",
      "明明已经过期的记忆，还会不会经常被命中",
      "跨用户、跨任务串味的情况多不多",
    ],
    failureModes: [
      "没有来源字段，导致冲突处理完全失去依据",
      "没有作用域隔离，多个任务或用户的状态互相串味",
      "没有衰减机制，陈旧但曾频繁出现的信息长期霸占召回",
    ],
  },
  {
    id: "objectives",
    navLabel: "服务目标",
    eyebrow: "6. Memory Objectives",
    title: "记忆服务于什么",
    accent: "rose",
    thesis: "同样都叫 memory，不同 agent 想解决的问题可能完全不同。目标不先说清楚，前面所有设计都容易做散。",
    definition: "Personalization、Continuity、Task Execution、Skill Evolution 是最常见的四类目标。这一页不是再讲一种新技术，而是把前面几章重新拉回到一个更实际的问题上：你到底想让这套记忆帮你变强在哪。",
    summaryLabel: "看整套记忆最终为哪类能力服务",
    plainExplanation:
      "这一页不是在讲“怎么记”，而是在讲“为什么记”。有的系统记忆是为了记住用户偏好，有的是为了跨会话接上进度，有的是为了更稳地完成任务，还有的是为了积累做事经验。",
    whenToUse: [
      "当你觉得什么都想做、却不知道 memory 应该优先优化哪一块时，先回到这一页。",
      "当不同团队对 memory 的期待不一致时，需要先统一服务目标。",
      "当技术方案已经很多，但不知道该用什么指标评估时，目标页能帮助你重新聚焦。",
    ],
    mainstreamMechanisms: [
      "Personalization",
      "Cross-session Continuity",
      "Task-state Support",
      "Skill / Experience Evolution",
    ],
    pipeline: [
      { title: "Choose Objective", description: "先明确系统主目标，而不是默认“都要”。" },
      { title: "Map Layers", description: "将目标映射到短期、长期、工作和经验记忆层。" },
      { title: "Prioritize", description: "决定预算、写入和检索策略优先服务谁。" },
      { title: "Evaluate", description: "按目标定义专属指标，而非只看统一 recall。" },
    ],
    designQuestions: [
      "系统是为了记住用户、记住任务，还是记住做事经验？",
      "更重视稳定 profile、上下文连续，还是工具执行反馈？",
      "memory 是服务单个用户，还是多 agent / 团队级协作？",
    ],
    mechanisms: [
      {
        title: "Personalization",
        tag: "User profile",
        summary: "围绕偏好、身份、语气和长期约束建立稳定用户画像。",
        strengths: "提升连续感与定制化体验。",
        risks: "最容易涉及隐私、过期偏好和误归因。",
        fit: "陪伴型助手、客服、办公 copilot。",
      },
      {
        title: "Continuity",
        tag: "Cross-session",
        summary: "保证多次会话之间能接上文，记住上次做到哪里、结论是什么。",
        strengths: "减少重复解释成本，适合长期协作。",
        risks: "如果摘要或状态错了，错误会持续传递。",
        fit: "项目助手、研究助手、长期任务代理。",
      },
      {
        title: "Task Execution",
        tag: "State + constraints",
        summary: "把计划、环境状态、工具输出和约束组织成执行型记忆。",
        strengths: "直接提升复杂工作流完成度与稳定性。",
        risks: "容易和短期上下文、日志、过程噪声混杂。",
        fit: "coding agent、workflow agent、自动化执行系统。",
      },
      {
        title: "Skill Evolution",
        tag: "Experience -> procedure",
        summary: "从成功/失败轨迹中提炼可复用方法、策略与技能模块。",
        strengths: "让 agent 累积“本事”，而不只是记住人和事。",
        risks: "最难设计，迁移性与评估都更复杂。",
        fit: "自改进 agent、研究型 agent、长期学习系统。",
      },
    ],
    examples: [
      {
        title: "陪伴型助手 vs 任务型 agent",
        scenario: "陪伴型助手最需要记住的是用户偏好和长期语气；任务型 agent 更需要记住当前计划、状态和错误恢复点。",
        takeaway: "同样都叫 memory，不同目标下的最优设计差别很大。",
      },
      {
        title: "经验型系统的目标错位",
        scenario: "团队口头上说想做会自我改进的 agent，但实际指标只看问答命中率。结果 memory 系统永远在优化检索，而不是经验沉淀。",
        takeaway: "目标不落到指标上，前面所有设计最后都会跑偏。",
      },
    ],
    misconceptions: [
      "误解一：先把技术方案做全，再慢慢决定 memory 是为谁服务。",
      "误解二：所有 memory 系统都可以用一套统一指标来评价。",
      "误解三：目标页只是总结性章节，对前面架构设计影响不大。",
    ],
    deepDive: [
      {
        title: "目标为什么是第一性问题",
        body: "如果先聊技术、后聊目标，最后很容易得到一套“什么都沾一点，但没有一项做深”的系统。目标页的作用，就是把前面所有设计拉回到“到底为什么而做”。",
        bullets: [
          "个性化需要稳定 profile 和记忆更新准确性。",
          "连续性需要跨会话摘要和任务延续能力。",
          "执行型任务更依赖 working memory 和状态组织。",
        ],
      },
      {
        title: "不同目标会反向塑造前五个维度",
        body: "目标不是最后附在结尾的一段总结，它会反过来决定短期、长期、写入和治理这些层到底该怎么搭。",
        bullets: [
          "Personalization 会偏向结构化 profile 和记忆修正机制。",
          "Task Execution 会偏向强 working memory 和约束槽位。",
          "Skill Evolution 会偏向 consolidation 与经验提炼。",
        ],
      },
      {
        title: "如何判断目标是否明确",
        body: "一个最直接的判断方法是问自己：如果 memory 做好了，你最希望哪项能力明显提升？如果答不出来，说明目标还没有想清楚。",
        bullets: [
          "如果答案总是“都要”，说明系统目标还不够聚焦。",
          "如果你无法定义成功指标，说明目标还没落到设计层。",
          "一个清晰目标应该能映射到清晰的写入、检索与治理策略。",
        ],
      },
      {
        title: "目标页为什么还要关心评估",
        body: "目标如果落不到指标上，就还只是口号。不同目标需要不同评价方式，不能拿一个统一 recall 分数去评价所有 memory 系统。",
        bullets: [
          "Personalization 更看长期偏好命中与纠错能力。",
          "Continuity 更看跨会话接续是否自然、是否少重复澄清。",
          "Task Execution 更看任务完成率、状态恢复率和错误恢复能力。",
          "Skill Evolution 更看经验是否被复用，以及复用后是否真的提升了表现。",
        ],
      },
      {
        title: "用更通俗的话说，目标页像什么",
        body: "前面几章讲的是“怎么搭引擎、变速箱、刹车和仪表盘”，目标页讲的是“这辆车到底要拿来跑什么路”。不同用途，会反过来决定整车怎么调。",
        bullets: [
          "如果是陪伴型助手，更关注个性化和连续感。",
          "如果是任务型 agent，更关注状态延续和执行稳定性。",
          "如果是自改进 agent，更关注经验沉淀和技能复用。",
        ],
      },
    ],
    architectureNotes: [
      "服务目标应该能映射到具体 memory architecture：比如 personalization 更偏 profile layer，task execution 更偏 state layer，skill evolution 更偏 experience layer。",
      "成熟系统通常不止一种目标，但最好有清楚的主目标和次目标，不然预算和精力很容易分散。",
      "评估时也要按目标拆指标，别拿一个统一 recall 去评价完全不同类型的记忆系统。",
    ],
    metrics: [
      "个性化信息命中得准不准，profile 改得对不对",
      "跨会话时，能不能自然接上上次进度",
      "任务完成率高不高，状态断了之后能不能接回来",
      "沉淀下来的经验，后面有没有真的被复用起来",
    ],
    failureModes: [
      "系统试图同时优化所有目标，结果没有一个目标做深",
      "目标偏个性化，却把大量预算花在任务日志和过程噪声上",
      "目标偏 skill evolution，却没有经验抽取与复用闭环",
    ],
  },
  {
    id: "global-map",
    navLabel: "全局总图",
    eyebrow: "7. Agent Memory Global Map",
    title: "从全局角度看，memory 机制是怎么分工的",
    accent: "green",
    thesis: "如果把 agent memory 当成一个整体来看，它不是一个单点能力，而是一条从“眼前保留什么”到“长期存什么”、再到“当前怎么用”和“跑久了怎么不变脏”的完整链路。很多讨论之所以混乱，就是因为把这些层混在一起谈了。",
    definition: "这一章不按某一类 agent 来讲，也不只讲单个技术点，而是从全局角度把 memory 机制整理成一张地图：短期记忆管最近上下文，长期记忆管远处知识与经验，工作记忆管当前回合怎么组装，写入策略决定什么能留下，污染治理决定系统跑久之后还可信不可信，目标层则决定前面这一切到底为谁服务。",
    summaryLabel: "看 memory 机制作为整体时如何分层、分工与组合",
    plainExplanation:
      "前面几章像是在拆车，看发动机、油箱、刹车、仪表盘分别怎么工作；这一章像是把整车重新装回去，回答一个更大的问题：memory 到底是由哪几层拼起来的，这几层分别负责什么，哪些组合比较轻，哪些组合比较重。",
    whenToUse: [
      "当你已经看完各章，但脑子里还没有一张整体地图时，这一章最有用。",
      "当团队老是在混着讨论“检索”“状态”“写入”“治理”时，这一章可以帮大家把层次分清。",
      "当你想从机制本身理解 memory，而不是从某个 agent 或某个产品切入时，这一章最适合作为总览。",
      "当你要做选型判断，却不确定自己是在补短期、长期、工作记忆还是治理能力时，也应该先回来看这章。",
    ],
    mainstreamMechanisms: [
      "Short-term Memory Layer",
      "Long-term Memory Layer",
      "Working Memory Layer",
      "Write Policy Layer",
      "Memory Hygiene Layer",
      "Memory Objective Layer",
    ],
    pipeline: [
      { title: "See", description: "先决定当前回合眼前要保留哪些最近信息，这一层对应短期记忆。" },
      { title: "Store", description: "把值得长期留下的知识、状态或经验存到合适的长期层里。" },
      { title: "Recall", description: "当需要远处信息时，用检索或状态读取把它们调回来。" },
      { title: "Assemble", description: "把最近上下文、长期召回、约束和状态一起组装成当前工作记忆。" },
      { title: "Write Back", description: "判断这一轮里哪些内容值得沉淀，哪些只是临时经过。" },
      { title: "Clean", description: "通过去重、冲突处理、衰减和作用域隔离，避免系统越跑越乱。" },
      { title: "Optimize", description: "最后根据系统目标，决定前面哪一层该优先做重，哪一层暂时可以轻一点。" },
    ],
    designQuestions: [
      "你现在讨论的是“怎么存”、还是“怎么取”、还是“怎么在当前回合用起来”？",
      "系统最缺的是短期上下文管理、长期召回、工作记忆编排，还是写入和治理？",
      "如果只能优先补一层，补哪一层最能立刻改善当前效果？",
      "你的问题真的是 memory 问题，还是 prompt、workflow、工具接口或状态机问题？",
      "这套 memory 是要先做轻量闭环，还是已经到了值得做多层混合治理的阶段？",
    ],
    mechanisms: [
      {
        title: "轻量型 / Lightweight Memory",
        tag: "Minimal stack",
        summary: "以短期记忆和少量任务状态为主，不急着做复杂长期层，先把当前回合做稳。",
        strengths: "实现成本低、调试简单、很适合早期系统快速验证。",
        risks: "跨会话价值弱，任务跨度一长就容易露出遗忘问题。",
        fit: "早期助手、短流程对话、低连续性需求场景。",
      },
      {
        title: "检索型 / Retrieval-centered Memory",
        tag: "Knowledge-heavy",
        summary: "以长期知识召回为主，核心是 chunking、embedding、ANN、metadata 和 reranking。",
        strengths: "适合承接大量外部资料，是知识问答和研究助手最常见的路线。",
        risks: "很容易把问题都误判成“换个向量库就好”，忽略检索链路其他环节。",
        fit: "企业知识问答、研究资料助手、文档检索型 agent。",
      },
      {
        title: "执行型 / Execution-centered Memory",
        tag: "State + working memory",
        summary: "以工作记忆、任务状态和恢复点为中心，重点不是记住很多，而是当前做事别断线。",
        strengths: "多步任务稳定性更高，对工具链长的 agent 特别重要。",
        risks: "日志、状态、约束容易混杂；如果写入门槛不够，过程噪声会被沉淀。",
        fit: "Coding agent、workflow agent、自动化执行系统。",
      },
      {
        title: "连续协作型 / Continuity-centered Memory",
        tag: "Cross-session continuity",
        summary: "重点解决跨会话接续问题，让用户回来时系统能接上进度，而不是每次从头开始。",
        strengths: "减少重复澄清，适合项目助手和长期协作场景。",
        risks: "如果状态摘要错了，错误会持续被带着往后跑。",
        fit: "项目助手、研究协作、长期事务处理代理。",
      },
      {
        title: "学习型 / Learning-centered Memory",
        tag: "Experience memory",
        summary: "把成功和失败经历整理成经验、策略或技能模块，希望系统下次做得更好。",
        strengths: "长期上限最高，一旦做对，agent 会更像在积累能力而不是积累记录。",
        risks: "最难评估，也最容易把坏经验抽成正式知识。",
        fit: "研究型 agent、自我改进系统、长期学习代理。",
      },
      {
        title: "平台混合型 / Hybrid Platform Memory",
        tag: "Layered architecture",
        summary: "多层 memory 各司其职：短期、长期、工作、写入和治理一起构成完整平台。",
        strengths: "更贴近真实生产系统，能兼顾个性化、检索、执行和连续性。",
        risks: "复杂度最高，若没有清晰分层与 source of truth，系统会很快缠在一起。",
        fit: "企业级 agent 平台、多能力产品、团队协作系统。",
      },
    ],
    examples: [
      {
        title: "为什么很多团队以为在讨论 memory，其实讨论的是三个不同问题",
        scenario: "有人说“我们 memory 不行”，但细看后会发现，一部分是在抱怨长期检索召不回资料，一部分是在抱怨当前回合没把状态摆对，还有一部分是在抱怨系统越跑越乱。它们都叫 memory 问题，但其实落在完全不同的层。",
        takeaway: "先把问题落到具体层次上，很多看起来很大的 memory 问题会一下子变清楚。",
      },
      {
        title: "为什么轻量型系统也能比复杂系统更好用",
        scenario: "一个早期 coding agent 如果先把最近上下文、任务状态和错误恢复点做好，往往就已经能明显提升完成率；反而一上来做复杂经验沉淀和混合存储，可能只会增加调试难度。",
        takeaway: "memory 不是越重越好，而是越贴近当前阶段的真实瓶颈越好。",
      },
      {
        title: "为什么成熟平台最后大多会走向多层组合",
        scenario: "当系统既要做知识问答、又要做项目接续、还要记住用户偏好并执行任务时，单一 memory 机制通常不够用了，最后自然会长成多层 memory 各自分工的样子。",
        takeaway: "混合型不是因为“先进”，而是因为真实需求开始变多，必须分层处理。",
      },
    ],
    misconceptions: [
      "误解一：memory 就等于长期记忆或向量数据库。",
      "误解二：只要检索做强，memory 系统就算完整了。",
      "误解三：写入和治理是后期优化，不需要一开始分层考虑。",
      "误解四：memory 越重越高级，做得越多系统就一定越聪明。",
    ],
    deepDive: [
      {
        title: "memory 为什么应该被看成一条链路，而不是一个功能点",
        body: "如果只把 memory 理解成“存东西”，很多关键问题会直接消失在视野里。真实系统里，memory 至少包含：最近信息怎么保、远处信息怎么存、需要时怎么召回、当前回合怎么组装、哪些内容该写回，以及系统跑久了怎么不变脏。",
        bullets: [
          "短期记忆回答的是“眼前留什么”。",
          "长期记忆回答的是“远处存什么、怎么找回来”。",
          "工作记忆回答的是“这一轮真正喂给模型什么”。",
          "写入和治理回答的是“系统跑久后还能不能信”。",
        ],
      },
      {
        title: "不同机制其实在解决不同层的问题",
        body: "很多术语经常被混在一起提，但它们管的并不是同一件事。Buffer、Window、Summary 管的是最近历史；Vector、Graph、Relational 管的是长期表示；Ranking、Slotting、Budget 管的是当前回合怎么用；Write Policy 和 Consolidation 管的是哪些东西值得留下；Dedup、Conflict、TTL、Decay 管的是系统会不会越跑越脏。",
        bullets: [
          "别拿长期存储机制去解决当前回合编排问题。",
          "别拿写入策略去替代污染治理。",
          "别把检索做得很好，就误以为整套 memory 已经闭环。",
        ],
      },
      {
        title: "从全局看，最常见的不是单机制，而是机制组合",
        body: "真实系统里很少只靠一种机制。更常见的形态是：短期记忆保住当前连续性，长期记忆承接远处知识，工作记忆负责当前回合编排，写入策略控制沉淀门槛，治理机制负责长期可信度。",
        bullets: [
          "轻量型组合通常只做短期 + 少量状态。",
          "检索型组合通常强调长期知识库 + reranking + working memory。",
          "执行型组合通常强调工作记忆 + 任务状态 + 写入门控。",
          "平台型组合则会把多层 memory 分工彻底拉开。",
        ],
      },
      {
        title: "什么时候该轻，什么时候才值得做重",
        body: "不是所有产品都需要一开始就做重 memory。很多时候，系统当前最缺的只是近期上下文管理、任务状态恢复或检索链路调优，而不是上多层混合治理。只有当跨会话价值、长期知识规模、任务连续性和经验复用都开始变重要时，重 memory 才真正划算。",
        bullets: [
          "如果单轮任务还不稳，先别急着做复杂长期层。",
          "如果用户不会频繁回来，continuity 的优先级可能没那么高。",
          "如果任务很依赖多步执行，working memory 往往比大而全的长期层更优先。",
          "如果系统已经长期在线并持续写入，治理层就不能再拖了。",
        ],
      },
      {
        title: "一个更有用的全局判断顺序",
        body: "判断一套 memory 该怎么做，最实用的方法不是先选技术栈，而是先按问题顺序往下问：我最怕忘掉什么？这些内容是近期的、远期的、结构化的、语义型的，还是经验型的？它们要怎么进当前回合？哪些该留下？留下之后怎么别变脏？",
        bullets: [
          "先判断问题在哪一层，再选那一层的机制。",
          "先做能立刻带来收益的层，再补更重的层。",
          "最后才是选 Vector、Graph、Relational 还是 Hybrid 这类实现问题。",
        ],
      },
      {
        title: "这章和下一章的边界在哪里",
        body: "这一章讲的是 memory 机制本身的全景图，也就是“有哪些层、各自做什么、常见怎么组合”。下一章讲的是“不同 agent 类型为什么会偏不同组合”。一个是站在机制视角看整体，一个是站在 agent 视角看偏好差异。",
        bullets: [
          "如果你在问“memory 机制整体怎么分层”，看这一章。",
          "如果你在问“为什么聊天助手和 coding agent 用得不一样”，看下一章。",
          "两章连起来读，才会既有全局图，也有类型差异。",
        ],
      },
    ],
    architectureNotes: [
      "全局视角下，memory 更像一条分层链路，而不是某个单独数据库或中间件。",
      "最容易出问题的地方，不是某个机制本身，而是不同层之间边界不清：谁负责存、谁负责调、谁负责写回、谁负责清理。",
      "如果系统开始走向混合型架构，必须先明确 source of truth 和作用域边界，否则不同层会很快打架。",
      "这一章的价值不在于替代前面六章，而在于帮读者知道每一章在整张地图里的位置。",
    ],
    metrics: [
      "系统当前的问题能不能被清楚归因到某一层 memory",
      "最近上下文、长期检索、当前编排、写入门控、治理能力是否各有可观测性",
      "memory 层的复杂度增加后，收益是否真的大于维护成本",
      "新增一层 memory 之后，是解决了真实问题，还是只是让系统更重了",
    ],
    failureModes: [
      "把所有 memory 问题都理解成长期检索问题，结果工作记忆和状态管理长期被忽视",
      "只做存储和召回，不做写入与治理，系统短期好用、长期变脏",
      "一上来就做很重的混合 memory，结果还没找到当前阶段真正的瓶颈",
      "不同层边界不清，导致同一条信息在多层重复写入、互相打架",
    ],
  },
  {
    id: "agent-patterns",
    navLabel: "类型总结",
    eyebrow: "8. Agent Memory Patterns",
    title: "按 agent 类型看，memory 组合为什么会不一样",
    accent: "amber",
    thesis: "同样都在做 memory，不同 agent 真正在解决的问题其实很不一样，所以最后长出来的 memory 组合也不会一样。真正值得比较的，不只是“用了什么库”，而是它到底想记住什么、最怕忘掉什么、以及愿意为此付出多少复杂度和成本。",
    definition: "这一章承接上一章的全局机制地图，不再从“机制层怎么分工”出发，而是从“不同 agent 为什么会偏不同组合”出发。常见差异可以先从 5 类典型形态看出来：聊天陪伴型、知识问答型、任务执行型、项目协作型、自我改进型。它们关注的记忆对象、常用机制、主要优势、典型代价和失败方式都不一样。",
    summaryLabel: "看不同 agent 为什么会长出不同 memory 组合",
    plainExplanation:
      "可以把这一章理解成“选型地图”。前面 6 章讲的是零件，这一章讲的是不同类型的车为什么会装不同的零件。不是所有 agent 都需要很重的长期记忆，也不是所有 agent 都值得上复杂的经验沉淀。很多时候，真正该问的不是“什么最先进”，而是“我的 agent 到底最怕忘掉什么”。",
    whenToUse: [
      "当你已经知道各种 memory 机制，但还不知道该怎么给自己的 agent 选型时，这一章最有用。",
      "当团队在讨论“为什么别人要上图谱、我们却不一定要上”时，可以用这一章统一预期。",
      "当你想比较不同 agent 的 memory 优缺点，而不是只比较某一个技术组件时，可以从这里收束。",
      "当你发现自己什么都想加一点时，这一章也能帮你判断哪些能力真的是当前阶段必须的。",
    ],
    mainstreamMechanisms: [
      "Companion / Personal Assistant Pattern",
      "Knowledge Retrieval Pattern",
      "Workflow / Tool-use Pattern",
      "Project / Continuity Pattern",
      "Learning / Skill Evolution Pattern",
      "Hybrid Platform Pattern",
    ],
    pipeline: [
      { title: "Identify Agent Type", description: "先判断这个 agent 最主要在服务什么场景，而不是先选数据库。" },
      { title: "Map Memory Priorities", description: "看它更依赖短期记忆、长期记忆、工作记忆，还是经验沉淀。" },
      { title: "Choose Mechanism Mix", description: "根据场景选择 Buffer、Vector、State Store、Graph、Consolidation 等组合。" },
      { title: "Accept Tradeoffs", description: "每种组合都有代价：成本、复杂度、污染风险、延迟或维护负担。" },
      { title: "Check Failure Mode", description: "提前看清它最容易翻车的地方，是误记、漏记、串味、丢状态还是学歪。" },
      { title: "Evaluate by Goal", description: "最后用这个 agent 真正在乎的指标来判断记忆方案好不好。" },
    ],
    designQuestions: [
      "这个 agent 最怕忘掉的是用户偏好、知识资料、任务状态，还是做事经验？",
      "它更需要“记得像同一个人”，还是“做事更稳、更能续上进度”？",
      "它的 memory 问题更像检索问题、状态管理问题，还是经验抽取问题？",
      "如果只允许你先做好一层 memory，最应该先补的是哪一层？",
      "这个 agent 当前阶段真的需要复杂 memory，还是先把 prompt 和 workflow 做稳更重要？",
    ],
    mechanisms: [
      {
        title: "聊天陪伴型 / Personal Assistant",
        tag: "Profile-heavy",
        summary: "这类 agent 最看重用户画像、长期偏好、语气习惯和连续陪伴感，通常会把结构化 profile 和记忆更新放在前面。",
        strengths: "个性化效果明显，用户会感到“它记得我是谁、我喜欢什么”。",
        risks: "最容易记错偏好、把临时要求当长期设定，也最容易碰到隐私和过期问题。",
        fit: "陪伴助手、客服、办公助理、个人 Copilot。",
      },
      {
        title: "知识问答型 / Retrieval Agent",
        tag: "Retrieval-heavy",
        summary: "这类 agent 主要靠长期知识检索吃饭，核心常是 chunking、embedding、vector search、reranking 和 citation。",
        strengths: "面对大量资料时扩展性强，适合把超出上下文窗口的知识带回来。",
        risks: "容易把 memory 误缩成“只有向量库”，并忽略 chunk、排序、来源质量等关键细节。",
        fit: "企业知识库问答、研究助手、文档助手。",
      },
      {
        title: "任务执行型 / Workflow Agent",
        tag: "Working-memory-heavy",
        summary: "这类 agent 更依赖工作记忆和状态编排。它最怕的不是忘了用户爱好，而是忘了当前计划、约束、工具输出和恢复点。",
        strengths: "只要工作记忆和状态组织得好，复杂多步任务的稳定性会明显提升。",
        risks: "工具日志很容易淹没关键状态；如果写入和治理跟不上，也会把过程噪声误沉淀成长期记忆。",
        fit: "Coding agent、自动化 workflow、运维代理、工具调用链较长的系统。",
      },
      {
        title: "项目协作型 / Continuity Agent",
        tag: "State + continuity",
        summary: "这类 agent 要跨会话、跨天甚至跨周接着做同一件事，所以很依赖任务状态、阶段结论、决策记录和作用域隔离。",
        strengths: "能显著减少重复解释，用户回来时更容易“无缝接着做”。",
        risks: "如果摘要、任务状态或版本管理出错，错误也会被连续地带下去。",
        fit: "项目助手、研究协作助手、长期事务处理代理。",
      },
      {
        title: "自我改进型 / Learning Agent",
        tag: "Experience-heavy",
        summary: "这类 agent 不只想记住人和事，还想从成功与失败中提炼经验、策略甚至技能模块。",
        strengths: "一旦闭环跑通，agent 会越来越像“积累了本事”，而不只是“存了更多记录”。",
        risks: "设计和评估都最难；consolidation 质量不稳时，很容易把错误经验正式写进系统。",
        fit: "研究型 agent、长期学习系统、自改进任务代理。",
      },
      {
        title: "平台混合型 / Hybrid Platform",
        tag: "Layered mix",
        summary: "这类系统往往不是单一 agent，而是一个平台里同时存在问答、协作、执行和个性化能力，所以 memory 往往是分层混合搭建的。",
        strengths: "能兼顾多种能力边界，更接近真实生产环境。",
        risks: "最容易做重、做散；如果 source of truth 和作用域没定清楚，系统会很快失控。",
        fit: "企业级 agent 平台、团队协作系统、多能力集成产品。",
      },
    ],
    examples: [
      {
        title: "为什么聊天助手和 coding agent 的 memory 看起来像两套系统",
        scenario: "聊天助手最关心的是“这个用户一直喜欢什么口吻、讨厌什么表达”，而 coding agent 更关心“刚才跑了哪些命令、失败在哪一步、下一步该修哪里”。两者都叫 memory，但真正要保的内容完全不同。",
        takeaway: "比较 agent memory 时，先看它最怕忘掉什么，再看它用了什么机制。",
      },
      {
        title: "为什么有些 agent 很依赖向量库，有些却更像状态机",
        scenario: "文档问答系统面对的是海量知识块，核心问题是怎么找回相关资料；而工作流 agent 面对的是步骤、计划、约束和工具输出，核心问题常常是怎么把当前状态编排好。",
        takeaway: "不是所有 agent 的 memory 问题都等于检索问题。",
      },
      {
        title: "为什么很多真实产品最后都会变成混合型",
        scenario: "一个企业助手一开始也许只是知识问答，但做着做着，团队会希望它记住用户偏好、延续项目进度、执行流程任务，甚至复用历史经验。于是 memory 结构会从单一路径慢慢长成多层组合。",
        takeaway: "真实系统经常不是“只属于一种类型”，而是有一个主类型，再叠加一到两个次能力。",
      },
      {
        title: "为什么“最先进的 memory”不一定是最好的",
        scenario: "一个刚起步的客服助手，如果上来就做经验提炼、图谱构建、多层混合存储，可能还不如先把用户偏好、作用域隔离和最近上下文做好。",
        takeaway: "memory 方案不是越重越好，而是越贴近当前产品阶段越好。",
      },
    ],
    misconceptions: [
      "误解一：不同 agent 的 memory 差别，主要只是选了不同数据库。",
      "误解二：只要把长期记忆做强，所有 agent 都会同步变强。",
      "误解三：先进的 agent 一定要做经验沉淀和自我改进。",
      "误解四：别人用了图谱、向量库、反思机制，我们也应该一次全上。",
    ],
    deepDive: [
      {
        title: "为什么不同 agent 会长出不同记忆结构",
        body: "因为它们要解决的问题不一样。陪伴型 agent 最在意的是“记住你”，知识型 agent 最在意的是“找对资料”，任务型 agent 最在意的是“别把当前状态搞丢”，学习型 agent 最在意的是“下次能不能做得更好”。",
        bullets: [
          "目标不同，决定了写什么、怎么检索、什么该优先进入 prompt。",
          "所以 memory architecture 不是一个标准件，而更像是围绕任务长出来的结构。",
          "同样一套机制，换个场景，收益和代价都可能变掉。",
        ],
      },
      {
        title: "最常见的五种 agent memory 偏好",
        body: "如果用最直白的话来总结：陪伴型偏 profile，知识型偏 retrieval，任务型偏 working memory，项目型偏 continuity，学习型偏经验沉淀。",
        bullets: [
          "陪伴型最怕不懂你，所以更重 personalization。",
          "知识型最怕找不到资料，所以更重长期检索链路。",
          "任务型最怕步骤断线，所以更重状态和上下文编排。",
          "学习型最怕重复踩坑，所以更重经验抽取与复用。",
        ],
      },
      {
        title: "把 5 类 agent 放在同一张比较表里看，会看到什么",
        body: "如果把这几类 agent 摆在一起比较，会发现它们差别最大的地方，往往不是“存在哪”，而是“记什么、怎么取、怎么用、出错后会伤到哪”。",
        bullets: [
          "陪伴型最重 profile 和记忆修正，优点是有连续感，缺点是容易误记和过期。",
          "知识型最重检索链路，优点是能接大量外部资料，缺点是很吃 chunking、排序和来源质量。",
          "任务型最重 working memory 和状态组织，优点是执行稳定，缺点是日志和状态容易混杂。",
          "项目型最重 continuity 和作用域，优点是能少重复沟通，缺点是错误状态会被带着往后跑。",
          "学习型最重经验抽取，优点是长期上限高，缺点是最难证明自己真的学会了。",
        ],
      },
      {
        title: "它们各自的优点和代价",
        body: "没有哪种 agent 的 memory 方案是纯赚不赔的。每一种强项背后，通常都带着对应的成本和风险。",
        bullets: [
          "陪伴型更有人味，但也更容易碰上隐私、偏好过期和误记问题。",
          "知识型扩展性强，但很吃 chunking、排序和来源质量。",
          "任务型执行更稳，但系统日志和状态管理会变复杂。",
          "学习型上限高，但最难做对，也最难评估是否真的学会了。",
        ],
      },
      {
        title: "什么叫主类型，什么叫次能力",
        body: "真实产品很少只属于一种类型。更常见的情况是：它有一个最主要的定位，再叠加少量次能力。比如项目助手可能主要是 continuity agent，但会带一点 retrieval；coding agent 主要是 workflow agent，但会带一点 skill evolution。",
        bullets: [
          "先找主类型，能帮你决定 memory 的第一优先级。",
          "再看次能力，决定你要不要补第二层和第三层。",
          "这样做的好处是不会一上来就把系统做成一锅炖。",
        ],
      },
      {
        title: "怎么用这一章做选型",
        body: "最简单的方法不是先看别人用了什么，而是先回答三个问题：你最想让 agent 记住什么、最怕它忘掉什么、最能接受哪种代价。",
        bullets: [
          "如果最怕忘掉用户习惯，就优先做好 profile 和记忆修正。",
          "如果最怕找不到旧资料，就优先补强长期检索链路。",
          "如果最怕任务半路断线，就优先补 working memory 和状态恢复。",
        ],
      },
      {
        title: "什么时候不要把 memory 做得太重",
        body: "很多团队会把 memory 当成万能补药，但其实有些问题不是 memory 弱，而是 prompt、工具接口、任务拆解或系统边界本身还没做好。这个时候上很重的 memory，只会让系统更难调。",
        bullets: [
          "如果单轮任务都还不稳，先别急着做复杂长期记忆。",
          "如果用户几乎不会跨会话回来，continuity 的收益可能没有想象中高。",
          "如果任务高度结构化，先把状态管理和流程控制做好，往往比做重语义记忆更划算。",
        ],
      },
      {
        title: "一个更实用的落地顺序",
        body: "如果你是从零开始做一个 agent，通常不需要一步做到最复杂。更实用的顺序是先做最会立刻带来收益的那一层，再按问题暴露的方向逐步补齐。",
        bullets: [
          "第一步：先把短期记忆和工作记忆做好，让当前回合别乱。",
          "第二步：再补长期检索或 profile，让系统开始具备跨会话价值。",
          "第三步：等写入和污染问题真的出现，再补治理、版本和衰减。",
          "第四步：只有当你真的需要复用经验时，再上 consolidation 和 skill evolution。",
        ],
      },
      {
        title: "用更通俗的话说，这一章像什么",
        body: "前面几章像是在讲发动机、底盘、变速箱、刹车分别怎么选，这一章像是在讲：家用车、货车、越野车、赛车，为什么不会用同一套配置。",
        bullets: [
          "不是谁零件多谁就一定好。",
          "关键是这套 memory 配置和它要跑的路配不配。",
          "比较优缺点时，要把使用场景一起带上看。",
        ],
      },
    ],
    architectureNotes: [
      "比较不同 agent 的 memory，最好先按目标和工作流分组，而不是直接按产品名罗列。",
      "陪伴型 agent 往往更依赖 profile layer，任务型 agent 更依赖 state layer，知识型 agent 更依赖 retrieval layer，学习型 agent 更依赖 experience layer。",
      "真正成熟的系统常常是混合型的，只是每一类 agent 的主重心不同。",
      "平台型系统尤其要先定义主数据边界，不然 profile、state、knowledge、experience 会越做越缠。",
      "总结章真正的价值，不是告诉你哪种 agent 最先进，而是帮你判断现在这一步最该补哪种记忆能力。",
    ],
    metrics: [
      "陪伴型：偏好命中准不准、误记多不多",
      "知识型：相关资料找回率高不高、引用靠不靠谱",
      "任务型：长流程完成率和中断恢复能力怎么样",
      "项目型：跨会话续接自然不自然、重复解释多不多",
      "学习型：经验有没有复用，复用后效果有没有真的变好",
      "混合型：多层 memory 一起工作时，收益有没有真的大于复杂度",
    ],
    failureModes: [
      "把所有 agent 都当成同一种 memory 问题来设计，结果方案既重又散",
      "明明是任务型 agent，却把大部分精力花在用户偏好长期存储上",
      "明明想做学习型 agent，却没有经验提炼、验证和回滚机制",
      "只看别人用了什么组件，不看那个组件为什么适合那个 agent",
      "没有主类型判断，结果所有层都做了一点，但没有一层真正好用",
      "还没把当前回合做稳，就急着上很重的长期记忆，最后越改越乱",
    ],
  },
  {
    id: "open-source-projects",
    navLabel: "开源实现",
    eyebrow: "9. Open-source Implementations",
    title: "开源 Agent Memory 实现项目对比",
    accent: "cyan",
    thesis: "筛选标准限定为已经实现 agent memory 能力的开源项目：至少具备记忆写入、持久化存储、召回检索与上下文注入中的关键链路；仅具备会话压缩、任务状态保存或通用 agent 编排能力的项目不纳入主列表。",
    definition: "核心样本包括 memory-first 项目与明确提供 agent memory 模块的框架实现。mem0、Letta、Cognee、MemOS、EverOS、LangMem、A-MEM 和 Graphiti 属于主线样本；CrewAI、AutoGen、LlamaIndex、Agno 属于框架内 memory 实现样本；LangGraph 仅作为 long-term store 与 checkpoint 边界参考。opencode、Pi agent、Codex 类工具、Harness-1、AutoGPT、CAMEL 不作为 agent memory 项目主例，原因是其主要能力分别落在 coding session、search harness 或 agent platform，而非完整 memory 系统。",
    summaryLabel: "聚焦真正实现 agent memory 的开源项目与实现路线",
    plainExplanation:
      "开源 agent memory 项目的核心差异不在项目名，而在记忆对象和系统链路：有的管理长期事实与偏好，有的维护分层记忆运行时，有的构建时间知识图谱，有的提供框架级 memory 接口。coding session、checkpoint、search evidence board 等机制可作为边界案例，但不等同于完整 agent memory 项目。",
    whenToUse: [
      "需要筛选可参考的开源 agent memory 实现，而不是泛泛比较 agent 框架。",
      "需要区分 memory-first 项目、框架内 memory 模块和非 memory 主体的相邻机制。",
      "需要判断某个项目是否具备写入、存储、召回、注入与治理链路。",
      "需要避免把 session compaction、checkpoint、repo instructions 误归类为完整 agent memory 系统。",
    ],
    mainstreamMechanisms: [
      "Dedicated Memory Service",
      "Layered Agent Memory",
      "Local-first Memory OS",
      "Temporal Knowledge Graph Memory",
      "Checkpoint / Store Memory",
      "Framework Memory Interface",
    ],
    pipeline: [
      { title: "Identify Route", description: "先判断项目到底在做长期事实记忆、框架接口、图谱记忆、状态恢复，还是会话压缩。" },
      { title: "Trace Write Path", description: "沿着 add / remember / update_context / memory manager / consolidation 入口看信息什么时候被写入。" },
      { title: "Trace Read Path", description: "看查询时是语义搜索、图遍历、长期 store 检索、memory block 注入，还是简单列表拼接。" },
      { title: "Check Storage", description: "确认底层是 vector store、SQL、graph DB、KV store、JSONL，还是多种后端混合。" },
      { title: "Map To Agent Type", description: "最后把实现路线放回 agent 类型：陪伴、检索、workflow、coding、平台型分别需要的 memory 不一样。" },
    ],
    designQuestions: [
      "这个项目是真正做长期 memory，还是只提供上下文管理、状态恢复或 memory 接口？",
      "它的写入入口在哪里：每轮自动写、显式 remember、LLM 决策写，还是上下文超限后压缩？",
      "读取时返回的是事实、消息、图关系、状态快照，还是压缩摘要？",
      "底层存储有没有支持 scope、metadata、时间、来源和删除？",
      "如果把它接到你的 agent 里，最可能先帮你解决的是召回、连续性、执行稳定，还是个性化？",
    ],
    mechanisms: [
      {
        title: "Dedicated Memory Service",
        tag: "Service layer",
        summary: "以 mem0 为代表，把记忆抽取、向量化、检索、更新、历史记录做成独立服务或 SDK。agent 调用它来 add/search，而不是自己维护所有细节。",
        strengths: "边界清楚，容易跨应用复用，也方便单独优化写入、检索和去重。",
        risks: "如果写入策略或作用域治理没做好，错误事实会被服务化地稳定传播。",
        fit: "用户偏好、长期事实、跨会话个性化、需要独立 memory layer 的产品。",
      },
      {
        title: "Layered Agent Memory",
        tag: "Layered system",
        summary: "以 Letta 为代表，把 core memory、archival memory、recall/messages、context window 管理分开，每一层负责不同距离和不同优先级的信息。",
        strengths: "比单一向量库更接近真实 agent：常用内容直接可见，大量历史按需召回，上下文超限时还能摘要。",
        risks: "层多之后 source of truth 和同步关系会变复杂，同一信息可能在多层重复或冲突。",
        fit: "长期陪伴、项目协作、复杂平台型 agent。",
      },
      {
        title: "Temporal Knowledge Graph Memory",
        tag: "Graph route",
        summary: "以 Graphiti 为代表，把事件抽成实体、关系和时间边，再用图搜索、语义搜索和重排一起找回相关记忆。",
        strengths: "适合关系密集、时间变化明显的记忆，可以表达谁和谁有关、关系什么时候变化。",
        risks: "抽取、消歧、去重和图维护成本都更高，不适合所有信息都硬塞成图。",
        fit: "客户关系、项目事件流、组织知识、需要时间关系的长期记忆。",
      },
      {
        title: "Local-first Memory OS",
        tag: "Local runtime",
        summary: "以 EverOS 为代表，把 Markdown-first 记忆、SQLite/LanceDB 索引、memorize/search/cascade/prompt slots 放在同一套本地优先运行时里。",
        strengths: "可读、可审计、可迁移，适合把 agent 记忆沉淀成既能被人查看、也能被机器检索的长期资产。",
        risks: "文件、索引和后台整理流程需要保持一致；本地部署降低云依赖，但增加同步和迁移复杂度。",
        fit: "本地优先助手、小团队知识沉淀、需要人机共同维护 memory 的 agent。",
      },
      {
        title: "Framework Memory Interface",
        tag: "Pluggable API",
        summary: "以 AutoGen、LlamaIndex、Agno 等框架路线为代表，先定义 memory 接口和上下文注入方式，再接不同后端或策略。",
        strengths: "灵活、可替换、适合实验不同 memory 后端，也方便和已有 agent framework 集成。",
        risks: "接口不等于完整方案，写入门控、污染治理、排序预算通常还要自己设计。",
        fit: "框架用户、研究原型、多后端 memory 实验。",
      },
    ],
    implementationRoutes: [
      {
        title: "长期记忆服务 / Memory Service",
        label: "Long-term service",
        projects: ["mem0", "Cognee", "MemOS", "EverOS"],
        whatItSolves: "让 agent 跨会话记住事实、偏好、知识和经验，不必每次从零开始。",
        howToRead: "看 add/search/update/delete 是否形成完整链路，以及是否有作用域、来源和冲突治理。",
        typicalStack: "LLM fact extraction + embedding + vector / graph / SQL + metadata filtering。",
        caveat: "有长期存储不等于好记忆；写入门控和污染治理才决定长期效果。",
      },
      {
        title: "本地优先 Memory OS / Local-first Runtime",
        label: "Local-first OS",
        projects: ["EverOS"],
        whatItSolves: "把 memory 做成本地可读、可审计、可索引的长期运行时，而不是只提供远端 API 或单一向量库。",
        howToRead: "重点看 memorize/search/cascade/prompt slots 如何衔接，以及 Markdown、SQLite、LanceDB 三层如何保持一致。",
        typicalStack: "Markdown-first memory cells + SQLite metadata/state + LanceDB hybrid retrieval + cascade worker。",
        caveat: "本地优先路线的价值在可控和可迁移；代价是需要管理索引同步、文件变更和运行时维护。",
      },
      {
        title: "分层 Agent Memory Runtime",
        label: "Layered runtime",
        projects: ["Letta", "CrewAI"],
        whatItSolves: "把 core memory、archival memory、recall、summary、context budget 拆成不同层。",
        howToRead: "看哪些内容常驻 prompt，哪些内容外部检索，哪些内容由 LLM 决策写入或更新。",
        typicalStack: "Core blocks + archival passages + recall flow + context window calculator。",
        caveat: "层次越清楚越可控，但 source of truth 和跨层同步会变复杂。",
      },
      {
        title: "Framework Memory Interface / Blocks",
        label: "Framework API",
        projects: ["AutoGen", "LlamaIndex", "LangMem", "Agno"],
        whatItSolves: "在 agent framework 中提供可插拔 memory 接口、记忆块或长期记忆管理器。",
        howToRead: "重点核查接口是否覆盖写入、召回、上下文注入，以及是否支持长期记忆更新。",
        typicalStack: "Memory interface + chat store + vector/fact blocks + adapter backend。",
        caveat: "框架项目本体不等于 memory 项目；只有明确 memory 模块才纳入实现案例。",
      },
      {
        title: "Temporal Graph / Knowledge Graph Memory",
        label: "Graph route",
        projects: ["Graphiti", "Cognee"],
        whatItSolves: "把人、事件、项目、关系和时间变化存成图，而不是只存相似文本块。",
        howToRead: "看实体抽取、关系抽取、去重消歧、图遍历和时间过滤如何配合检索。",
        typicalStack: "Entity extraction + graph DB + vector/BM25 hybrid search + rerank。",
        caveat: "适合关系密集场景；如果业务只是普通问答，图谱可能太重。",
      },
      {
        title: "Experience / Skill Evolution Memory",
        label: "Learning route",
        projects: ["A-MEM", "MemOS"],
        whatItSolves: "从任务轨迹、反思和反馈中提炼可复用经验，使记忆不只保存事实，还能支持能力演化。",
        howToRead: "核查经验什么时候写入、如何组织、如何召回、是否存在验证和修正机制。",
        typicalStack: "Reflection + skill library + episodic memory + validation / retrieval。",
        caveat: "研究原型中的经验记忆需要谨慎区分：有 memory 系统实现才纳入主列表。",
      },
    ],
    plainMechanismGuides: [
      {
        title: "长期记忆服务：像一个会帮你整理的通讯录和笔记库",
        analogy: "你告诉它几件事，它不会只把原话贴进本子，而是提炼成“这个用户喜欢什么、项目是什么、以后可能会用到什么”。",
        plainIdea: "把重要事实从对话里抽出来，变成以后能搜索、能更新、能删除的长期记录。",
        howItWorks: "通常先用 LLM 抽取事实，再做 embedding，存进向量库/图谱/数据库；下次根据问题把相关记忆找回来。",
        easyMisread: "不是所有聊天记录都该写进去。临时情绪、一次性指令、错误工具输出如果乱写，就会变成记忆污染。",
      },
      {
        title: "本地优先 Memory OS：像可搜索、可整理、可搬家的个人资料库",
        analogy: "不是把记忆锁在某个黑盒数据库里，而是像把资料放进有目录、有索引、有管理员的本地档案柜。",
        plainIdea: "让 agent 记忆既能被机器检索，也能被人直接查看、备份和迁移。",
        howItWorks: "记忆先被抽取成事实、用户画像、经验或技能，再落到 Markdown/文件结构里，同时用 SQLite 和 LanceDB 建索引；后台 cascade 负责持续整理。",
        easyMisread: "本地优先不代表自动可靠。文件、索引和抽取策略如果不同步，记忆仍然会乱。",
      },
      {
        title: "分层记忆：像桌面、抽屉和档案馆分工",
        analogy: "正在用的纸放桌面，常用信息放抽屉，旧资料放档案馆。不是所有东西都摊在眼前。",
        plainIdea: "把记忆按使用频率和重要程度分层：核心记忆常驻，历史资料按需检索，旧对话必要时摘要。",
        howItWorks: "core memory 直接进 prompt；archival memory 或 passages 通过检索进入；上下文太长时由 summary 接住旧内容。",
        easyMisread: "分层不是越多越好。层多之后最怕同一条信息在多个地方版本不一致。",
      },
      {
        title: "框架接口：像给不同记忆后端准备的插座",
        analogy: "墙上有统一插座，台灯、电脑、充电器都能插，但插座本身不等于电器已经帮你选好了。",
        plainIdea: "框架先规定 memory 怎么接入 agent，再让你替换列表、向量库、Redis、Mem0 等不同后端。",
        howItWorks: "agent 推理前调用 memory.update_context 或类似接口，把检索结果塞进当前上下文。",
        easyMisread: "有接口不代表有完整 memory 系统。写入策略、去重、排序、遗忘通常还得自己设计。",
      },
      {
        title: "图谱记忆：像案件墙上的人物关系和时间线",
        analogy: "不是只记一堆便签，而是把谁认识谁、哪件事导致哪件事、什么时候发生，都用线连起来。",
        plainIdea: "当记忆重点是实体、关系和变化过程时，用图比单纯文本块更容易表达。",
        howItWorks: "从文本/事件里抽取实体和关系，写成节点和边；查询时结合图遍历、关键词、向量和重排。",
        easyMisread: "不是所有应用都需要图谱。如果只是普通文档问答，强行建图可能更重、更难维护。",
      },
      {
        title: "经验/技能记忆：像把踩坑记录变成下次可用的攻略",
        analogy: "打游戏通关后，你不只是记得发生过什么，还会写下“下次遇到这个怪该怎么打”。",
        plainIdea: "从成功/失败轨迹中提炼可复用经验、策略、代码片段或 skill，让 agent 下次做得更好。",
        howItWorks: "系统保存任务轨迹和反馈，做 reflection 或 consolidation，再把经验放进 skill library 或经验库里检索复用。",
        easyMisread: "最难的是验证。坏经验如果被正式沉淀，agent 会越来越自信地重复错误。",
      },
    ],
    projectComparisons: [
      {
        project: "mem0",
        category: "Memory service",
        tier: "primary",
        corePaths: ["mem0/memory/main.py", "mem0/memory/storage.py", "mem0/vector_stores/*"],
        route: "专门的长期语义记忆服务，围绕 add/search/history 做事实抽取、向量写入和召回。",
        writePath: "输入消息后由 LLM 抽取候选事实，embedding 后写入 vector store，并用 SQLite/历史记录追踪变化。",
        readPath: "查询时做 semantic search，结合 BM25、实体信号或 rerank，把相关事实返回给 agent。",
        storage: "Vector stores + history DB，可接 Qdrant、Chroma、Pinecone、pgvector 等。",
        bestFit: "长期用户事实、偏好记忆、跨会话个性化。",
        risk: "容易把临时话语写成长期事实，scope 和冲突处理必须认真做。",
      },
      {
        project: "Letta",
        category: "Layered memory",
        tier: "primary",
        corePaths: ["letta/schemas/memory.py", "letta/schemas/block.py", "letta/services/passage_manager.py", "letta/agents/letta_agent.py"],
        route: "分层 agent memory：core blocks 常驻上下文，archival passages 外部检索，message/recall 负责历史回看。",
        writePath: "通过 block、passage、agent service 管理核心记忆和档案记忆，上下文超限时配合摘要与窗口计算。",
        readPath: "核心 block 直接进 prompt，archival memory 按需检索，消息历史按窗口和摘要策略进入上下文。",
        storage: "SQL / passage store / archival memory，按层分工。",
        bestFit: "长期对话、项目协作、需要清晰 memory 层次的 agent。",
        risk: "层间同步和冲突较难，核心记忆写错会持续影响 agent。",
      },
      {
        project: "CrewAI",
        category: "Unified memory",
        tier: "secondary",
        corePaths: ["lib/crewai/src/crewai/memory/unified_memory.py", "encoding_flow.py", "recall_flow.py", "storage/lancedb_storage.py"],
        route: "Unified Memory 路线：用 encoding flow 管写入，用 recall flow 管浅召回/深召回。当前本地 sparse checkout 需补齐源码目录。",
        writePath: "remember/remember_many 进入编码流程：embedding、批量去重、相似记忆查找、LLM 规划 insert/update/delete/noop。",
        readPath: "recall 可走 shallow/deep：分析查询、生成子查询、选择 scope、并行搜索，再按相关性、时间、重要性排序。",
        storage: "默认 LanceDB，另有 Qdrant Edge 等后端路线。",
        bestFit: "crew/agent 协作场景中的用户事实、任务上下文和可复用记忆。",
        risk: "LLM 驱动写入很灵活，但也更依赖提示、评估和去重质量。",
      },
      {
        project: "LlamaIndex",
        category: "Composable memory",
        tier: "secondary",
        corePaths: ["llama_index/core/memory/memory.py", "memory_blocks/vector.py", "chat_memory_buffer.py", "chat_summary_memory_buffer.py"],
        route: "短期 chat store + memory blocks 的组合路线，支持 buffer、summary、vector block 等多种记忆块。",
        writePath: "消息先进入 chat store，超出预算后可 flush 到 memory blocks，或由 vector/fact/static block 承接长期信息。",
        readPath: "当前消息、短期历史和 memory block 检索结果一起组装进上下文。",
        storage: "SQL/simple chat store + vector memory block + 可组合存储。",
        bestFit: "RAG agent、文档助手、需要快速拼装不同 memory block 的应用。",
        risk: "组件很多，真正效果取决于 block 选择、flush 策略和上下文预算。",
      },
      {
        project: "AutoGen",
        category: "Memory interface",
        tier: "secondary",
        corePaths: ["autogen_core/memory/_base_memory.py", "_list_memory.py", "autogen_ext/memory/*"],
        route: "定义可插拔 Memory 接口，具体实现可以是列表、Chroma、Redis、Mem0 或实验性任务中心记忆。",
        writePath: "具体 Memory 实现负责 add/clear/close 等操作，框架层不强行规定统一写入策略。",
        readPath: "agent 调用 update_context，把 memory 检索结果注入 model context。",
        storage: "List memory、ChromaDB、Redis、Mem0 adapter 等。",
        bestFit: "多 agent 框架、需要替换 memory 后端的实验系统。",
        risk: "接口灵活但默认治理弱，容易把 memory 责任留给使用者。",
      },
      {
        project: "Agno",
        category: "User memory",
        tier: "secondary",
        corePaths: ["libs/agno/agno/memory/manager.py", "memory/strategies/summarize.py", "memory/strategies/base.py"],
        route: "偏用户事实/profile 的 memory manager，提供 add/update/delete/clear 等工具化写入能力。",
        writePath: "LLM 可调用 memory 工具新增、更新、删除用户记忆，也可用 summarize strategy 生成记忆。",
        readPath: "支持 last_n、first_n、agentic 等读取方式，把用户相关记忆带回当前会话。",
        storage: "依赖框架配置的 memory DB / storage。",
        bestFit: "个人助手、用户画像、轻量长期偏好管理。",
        risk: "偏 profile 路线，复杂任务状态和图关系需要额外设计。",
      },
      {
        project: "Graphiti",
        category: "Temporal graph",
        tier: "primary",
        corePaths: ["graphiti_core/graphiti.py", "graphiti_core/nodes.py", "graphiti_core/edges.py", "graphiti_core/search/search.py"],
        route: "时间知识图谱 memory：把 episode 抽成节点、边和时间事实，再做混合检索。",
        writePath: "add_episode 抽取实体和关系，做 dedupe/resolution 后写入 graph。",
        readPath: "搜索结合 BM25、vector、图遍历、cross-encoder rerank 等信号。",
        storage: "Neo4j / FalkorDB / Kuzu / Neptune 等 graph 后端。",
        bestFit: "关系密集、事件持续变化、需要时间感的长期记忆。",
        risk: "实体消歧和脏关系治理难度高，维护成本比向量库更重。",
      },
      {
        project: "EverOS",
        category: "Local-first memory OS",
        tier: "primary",
        corePaths: ["src/everos/service/memorize.py", "src/everos/service/search.py", "src/everos/memory/cascade/*", "src/everos/infra/persistence/{sqlite,lancedb}/*"],
        route: "本地优先、Markdown-first 的 agent memory runtime，用文件化记忆承接人类可读性，用 SQLite/LanceDB 承接状态与检索。",
        writePath: "memorize 入口把会话或事件分段后进入抽取管线，生成 user profile、atomic fact、episode、agent skill、foresight 等 memory cell。",
        readPath: "search 入口结合 recall、hierarchy、filters、shaper 与 agentic search，把相关记忆整理成可进入上下文的结果。",
        storage: "Markdown-first memory + SQLite metadata/state + LanceDB vector/FTS tables。",
        bestFit: "本地优先助手、小团队知识沉淀、需要人机共同审计和维护的长期记忆。",
        risk: "文件、索引和后台 cascade 需要保持一致；部署更可控，但维护面比单一 memory API 更宽。",
      },
    ],
    examples: [
      {
        title: "mem0：最像“独立记忆服务”的路线",
        scenario: "mem0 的核心不是把聊天记录简单拼进 prompt，而是把 add/search/history 做成一套服务化流程。写入时抽取事实并做向量化，读取时再按语义和元数据找回。",
        takeaway: "如果你要的是跨会话事实和偏好记忆，mem0 这类路线比单纯 session history 更贴近目标。",
      },
      {
        title: "Letta：更像一套分层 memory architecture",
        scenario: "Letta 把 core memory、archival passages、message recall 和 context window 计算分开。它不是只问“用不用向量库”，而是问哪些内容应该常驻，哪些内容应该按需查。",
        takeaway: "长期 agent 常常需要分层，而不是把所有东西塞进同一个检索桶。",
      },
      {
        title: "Cognee / Graphiti：知识图谱路线的两种侧重",
        scenario: "Cognee 更接近面向 agent 的长期记忆平台，强调数据摄取、知识图谱、向量检索与跨会话记忆；Graphiti 更聚焦实时 temporal context graph，用实体、关系和时间变化承接动态记忆。",
        takeaway: "图谱路线适合关系和时间变化重要的记忆场景，但需要承担实体抽取、消歧和图维护成本。",
      },
      {
        title: "LangMem / A-MEM：更明确的 agent memory 工具与研究实现",
        scenario: "LangMem 提供长期记忆抽取、管理工具和 LangGraph store 集成；A-MEM 则研究 agentic memory 如何动态组织和利用历史经验。它们比普通 agent framework 更直接围绕 memory 问题展开。",
        takeaway: "memory 工具库和研究型 memory 系统可以纳入主列表，但应与通用 agent 框架区分。",
      },
      {
        title: "EverOS：本地优先的 Markdown-first memory runtime",
        scenario: "EverOS 把 memorize、search、cascade、prompt slots 和本地持久化放在同一套运行时里。它不是只把向量检索包装成 API，而是让记忆以 Markdown-first 形态沉淀，同时用 SQLite 与 LanceDB 支撑状态、索引和召回。",
        takeaway: "当记忆需要被人审阅、迁移、备份和长期维护时，本地优先 Memory OS 是区别于纯云端 memory service 的一条重要路线。",
      },
    ],
    misconceptions: [
      "误解一：开源项目只要有 memory 文件夹，就说明它实现了完整长期记忆系统。",
      "误解二：coding agent 的 session compaction 等同于 agent memory 系统。",
      "误解三：checkpoint、search harness 或 repo instruction 可以直接归类为 agent memory 项目。",
      "误解四：有 vector store 就代表 memory 机制已经完整。",
      "误解五：framework 提供 Memory 接口，就代表写入、去重、污染治理都已经替你做好。",
      "误解六：graph memory 一定比 vector memory 更高级，实际要看关系和时间是不是核心问题。",
    ],
    deepDive: [
      {
        title: "按 memory 实现路线合并项目",
        body: "符合主列表条件的项目可以合并为长期记忆服务、分层 runtime、framework memory interface、graph memory、experience / skill evolution 等路线。该分组排除了仅提供 session compaction、checkpoint、search evidence state 或通用 agent 编排的项目。",
        bullets: [
          "长期 memory service 关心事实、偏好、经验能不能跨会话存在。",
          "本地优先 memory OS 关心记忆能不能可读、可审计、可迁移，并持续保持索引一致。",
          "分层 runtime 关心哪些记忆常驻、哪些检索、哪些摘要。",
          "framework interface 关心 memory 如何接入 agent 生命周期。",
          "graph memory 关心实体、关系、时间变化能不能被表达和检索。",
          "experience / skill evolution 关心经验能不能被验证、沉淀和复用。",
        ],
      },
      {
        title: "排除边界：相关机制不等于 memory 项目",
        body: "部分项目具备 memory-like 机制，但不满足主列表的 agent memory 项目标准。opencode、Pi agent、Codex 类工具更偏 coding session 与 workspace continuity；Harness-1 更偏搜索证据状态管理；AutoGPT、CAMEL 更偏 agent 平台或多 agent 框架。",
        bullets: [
          "session/history/compaction 属于上下文续航机制，不等于长期 agent memory。",
          "checkpoint/store 属于状态恢复底座，只有承接长期记忆写入与召回时才接近 memory system。",
          "search evidence board 属于检索任务状态，不等于通用 agent memory。",
          "通用 agent framework 只有在明确提供 memory 模块时，才作为 memory 实现案例纳入。",
        ],
      },
      {
        title: "写入路径最能暴露一个项目的 memory 观",
        body: "源码比较应优先追踪信息写入时机。mem0、CrewAI、LangMem、A-MEM 等项目会围绕事实、偏好、经验或记忆对象设计写入流程；AutoGen、LlamaIndex、Agno 则通过框架接口或 memory block 暴露写入能力。",
        bullets: [
          "显式 remember/add 更适合可控长期记忆。",
          "后台抽取和 consolidation 更适合从对话中沉淀长期事实。",
          "框架接口需要检查默认写入策略，而不是只看接口名称。",
          "LLM 决策写入灵活，但必须配去重、冲突和可回滚机制。",
        ],
      },
      {
        title: "读取路径决定记忆最终怎么影响模型",
        body: "记忆不是存进去就结束了，关键是怎么回到 prompt。向量服务通常返回 top-k 事实；分层系统会把核心记忆常驻、档案记忆按需检索；checkpoint 会恢复状态；compaction 会用摘要替代旧历史。",
        bullets: [
          "如果读取只按相似度排序，可能会漏掉时间、来源和作用域。",
          "如果核心记忆常驻，就要格外避免把错误内容写进去。",
          "如果靠摘要恢复旧历史，摘要的结构化程度会影响后续执行稳定性。",
          "如果只是 store API，仍要自己决定召回多少、怎么排、怎么塞进 token budget。",
        ],
      },
      {
        title: "存储后端不是答案，只是答案的一部分",
        body: "同样叫长期记忆，底层可能是向量库、SQL、graph DB、KV store、JSONL，也可能是混合结构。真正要比较的是存储后端和记忆对象是否匹配：事实相似度适合向量，关系变化适合图，执行恢复适合 checkpoint，结构化 profile 适合关系或文档存储。",
        bullets: [
          "Vector store 适合语义相似召回，但不擅长表达强关系和强约束。",
          "Graph store 适合关系和时间，但抽取与维护更重。",
          "SQL/KV 适合状态、profile 和审计字段。",
          "JSONL/session store 很适合开发工具历史，但不是通用 memory layer。",
        ],
      },
      {
        title: "污染治理在源码里通常比宣传里更重要",
        body: "memory 一旦长期运行，真正麻烦的不是存不进去，而是存进去的东西会不会错、旧、重复、串范围。mem0、CrewAI、Graphiti 这类会处理相似记忆、去重或实体解析；但任何项目接入后都仍要按你的业务补 scope、删除、审计和冲突策略。",
        bullets: [
          "去重不是只看文本相同，还要看语义相似、实体相同和时间是否冲突。",
          "scope isolation 对多用户、多项目 agent 是硬要求。",
          "删除和更正能力比新增记忆更容易被低估。",
          "记忆越自动，越需要观测、回滚和人工纠错入口。",
        ],
      },
      {
        title: "怎么选一个项目来参考",
        body: "最实用的选型方法是先问：你要解决的是跨会话事实、长期关系、任务恢复、上下文续航，还是框架扩展？如果目标不同，最值得参考的项目也不同。",
        bullets: [
          "做个人偏好/事实记忆，优先看 mem0、Agno、CrewAI 的写入与召回。",
          "做本地优先、可审计 memory runtime，优先看 EverOS 的 Markdown-first、SQLite/LanceDB 和 cascade 设计。",
          "做长期对话或平台 agent，优先看 Letta 的分层方式。",
          "做关系和时间记忆，优先看 Graphiti。",
          "做框架型 agent，优先看 AutoGen、LlamaIndex、Agno、LangMem 的 memory 接口和默认策略。",
          "做框架集成，优先看 AutoGen、LlamaIndex 的接口设计。",
        ],
      },
    ],
    architectureNotes: [
      "比较开源实现时，先确认项目是否以 agent memory 为核心能力，或至少是否包含明确 memory 模块。",
      "不要把 session history、checkpoint、repo instruction、search evidence state、vector memory 和 graph memory 混成同一类项目。",
      "源码里最值得追的是入口函数：add、remember、update_context、search、consolidate、delete。",
      "项目表里的 CrewAI 路径来自上游结构，当前本地 sparse checkout 还需要补齐源码目录后再做逐行核验。",
      "严格筛选时，opencode、Pi agent、Codex 类工具、Harness-1、AutoGPT、CAMEL 应作为排除或边界说明，而非主列表项目。",
    ],
    metrics: [
      "写入准确率：留下来的事实是否真的值得长期保存",
      "召回命中率：需要时能不能找到正确记忆",
      "污染率：重复、过期、错误、跨 scope 记忆有多少",
      "上下文效率：召回内容进入 prompt 后是否真的帮忙，而不是占 token",
      "恢复能力：长流程中断后能不能接回正确状态",
      "可维护性：出错后能否追踪来源、删除、更正和回滚",
    ],
    failureModes: [
      "把 framework memory interface 当成现成 memory system，结果写入和治理全缺",
      "把 coding agent 的 compaction 当成长期个性化记忆，最后跨会话体验仍然断裂",
      "只看 star 数选项目，不看它解决的是事实记忆、状态恢复还是上下文续航",
      "只接向量库，不做 metadata、scope、冲突和删除，短期看起来能用，长期变脏",
      "盲目上 graph memory，但业务里的关系并不复杂，反而增加抽取和维护负担",
      "没有验证写入路径，导致 agent 把临时指令、错误观察和工具噪声都当成长期记忆",
    ],
  },
];

export const dimensionsById = Object.fromEntries(
  dimensions.map((dimension) => [dimension.id, dimension])
) as Record<string, Dimension>;

export const foundationalModel = [
  {
    title: "短期记忆 Short-term",
    body: "保存最近几轮对话、工具输出和即时状态，常见形态是 Buffer、Window、Summary。",
  },
  {
    title: "长期记忆 Long-term",
    body: "跨会话持久化保存事实、偏好、经验和结构关系，底层可能是 Vector、Graph、Relational 或 Hybrid。",
  },
  {
    title: "工作记忆 Working Memory",
    body: "当前回合真正喂给模型的上下文，由用户输入、最近窗口、检索结果和任务状态共同组装。",
  },
];

export const checklist = [
  "短期记忆使用 Buffer、Window、Summary，还是 recent raw + rolling summary 的混合结构？",
  "长期记忆底层是 Vector、Graph、Relational 还是 Hybrid，分别承接哪类信息？",
  "工作记忆如何组装：top-k 多少、排序逻辑是什么、token budget 如何分配？",
  "长期写入策略是什么：每轮都写、规则触发、重要性筛选，还是 consolidation 之后再写？",
  "污染治理机制是否完备：去重、冲突处理、scope isolation、provenance、TTL、decay、删除？",
  "系统主要服务于哪类目标：Personalization、Continuity、Task Execution 还是 Skill Evolution？",
  "如果放到具体 agent 类型里看，这套 memory 更像陪伴型、知识型、任务型、项目型，还是学习型？它真正的优势和代价分别是什么？",
];

export const furtherReading = [
  {
    label: "Agent Wiki · Memory",
    href: "https://learnagent.wiki/agent/cards/memory",
    note: "用短期 / 长期 / 工作记忆给出最基础也最适合工程沟通的骨架。",
  },
  {
    label: "Memory for Autonomous LLM Agents (2026)",
    href: "https://arxiv.org/abs/2603.07670",
    note: "从机制、评测与前沿方向系统梳理 memory 研究版图。",
  },
  {
    label: "A Survey on the Memory Mechanism of LLM-based Agents (2024)",
    href: "https://arxiv.org/abs/2404.13501",
    note: "帮助把 buffer / retrieval / reflection / long-term memory 放入更完整 taxonomy。",
  },
  {
    label: "Remembering More, Risking More (2026)",
    href: "https://arxiv.org/abs/2605.17830",
    note: "提醒 memory 不是纯增益项，长期运行会带来时间维度上的安全与污染风险。",
  },
];
