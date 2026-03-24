export interface ResponseEntry {
  text: string;
  suggestions: string[];
}

export const RESPONSES: { pattern: RegExp; response: ResponseEntry }[] = [
  {
    pattern: /^(hi|hello|hey|sup|yo|howdy)\b/,
    response: {
      text: "Hey! I'm Aniket's portfolio assistant. I can tell you about his skills, projects, experience, or how to get in touch. What would you like to know?",
      suggestions: ["Who is Aniket?", "What's his tech stack?", "Show me his projects"],
    },
  },
  {
    pattern: /do you know|know about aniket/,
    response: {
      text: "Yes! Aniket Rai is a Senior Software Engineer with 5+ years at SysCloud Technologies. He builds config-driven frameworks, AI agents, and natural language interfaces for cloud data. Real systems. Real scale. Real impact.\n\nWhat would you like to know more about?",
      suggestions: ["Tell me more about him", "What projects has he built?", "His tech stack"],
    },
  },
  {
    pattern: /what is your name|your name|who are you|introduce yourself/,
    response: {
      text: "I'm Aniket's portfolio assistant — here to tell you everything about Aniket Rai, Senior Software Engineer at SysCloud Technologies.\n\nAsk me about his skills, projects, experience, or how to reach him!",
      suggestions: ["Who is Aniket?", "What's his tech stack?", "His projects"],
    },
  },
  {
    pattern: /about aniket|who is aniket|what does aniket|tell me about (him|aniket|yourself)/,
    response: {
      text: "Aniket Rai is a Senior Software Engineer with 5+ years at SysCloud Technologies, Hyderabad.\n\nHe builds config-driven frameworks handling 12+ cloud integrations with zero code changes, AI agents that detect and resolve production issues before customers notice, and a natural language interface where customers talk to their data instead of navigating dashboards.\n\nReal systems. Real scale. Real impact.",
      suggestions: ["What's his tech stack?", "AI work he's done", "How to contact him?"],
    },
  },
  {
    pattern: /tech|stack|skill|language|tool|expertise|know|technologies/,
    response: {
      text: "Aniket's core stack:\n\n🟦 Languages: TypeScript, JavaScript (Node.js), SQL, Python\n🔧 Backend: Node.js, Express, GraphQL (PostGraphile), Microservices\n🗄️ Databases: PostgreSQL, MongoDB, AWS Athena\n☁️ Cloud: AWS (S3, Lambda, Fargate, Batch, SQS, CodePipeline)\n🤖 AI: LLM Integration, Claude, MCP, AI Agents, Prophet ML\n🛠️ Tools: Git, Docker, Grafana, ELK Stack, SonarQube",
      suggestions: ["Tell me about his AWS experience", "PostgreSQL expertise?", "AI work he's done"],
    },
  },
  {
    pattern: /project|built|build|what has he made|show.*project/,
    response: {
      text: "Here are Aniket's key projects at SysCloud. Which one would you like to know in detail?\n\n🤖 Sky 2.0 — AI-powered NL interface\n🛡️ DAL AI-Agents — Operational monitoring agents\n⚡ MDL 2.0 — Config-driven cloud framework\n📊 Anomaly Detection — Prophet ML + Rule Engine\n🔄 Restore & Export — High-speed data recovery\n📈 Customer Dashboard — Multi-cloud insights\n👥 Partner Portal — MSP management dashboard\n🔧 MDLOPS Microservice — Async addon orchestration\n🗄️ Batch Jobs Framework — 100K+ job orchestration",
      suggestions: ["Sky 2.0", "DAL AI-Agents", "MDL 2.0", "Restore & Export"],
    },
  },
  {
    pattern: /^sky 2\.?0$|^sky$|sky 2\.0|sky2|syscloud ai|natural language interface/,
    response: {
      text: "🤖 Sky 2.0 — SysCloud AI\n\nDescription: An AI-powered natural language interface where customers ask questions and the AI dynamically builds queries, redirects to the relevant page with pre-applied filters, and initiates Restore & Export actions — eliminating manual navigation entirely.\n\nTech Stack: Node.js · TypeScript · Claude · MCP · PostgreSQL · GraphQL\n\nKey Metrics:\n✓ NL-to-query in real time\n✓ Full product coverage\n✓ Zero manual navigation needed",
      suggestions: ["DAL AI-Agents", "Anomaly Detection", "Tell me about all projects"],
    },
  },
  {
    pattern: /^dal$|^ai.?agents?$|dal ai|database health agent|operational monitoring/,
    response: {
      text: "🛡️ DAL AI-Agents\n\nDescription: 4 AI agents for automated operational monitoring — Database Health, Restore/Export, StartBackup, and PostGraphile Slow-Queries. Each agent detects and resolves issues automatically before they impact customers. Zero manual intervention required.\n\nTech Stack: Node.js · TypeScript · LLM · PostgreSQL · AI Agent framework\n\nKey Metrics:\n✓ 4 production agents\n✓ Auto-remediation\n✓ Zero customer impact",
      suggestions: ["Sky 2.0", "Anomaly Detection", "Tell me about all projects"],
    },
  },
  {
    pattern: /anomaly|prophet|data change insight/,
    response: {
      text: "📊 Anomaly Detection\n\nDescription: AI-powered data integrity engine inside SysCloud's Backup & Compare module. Two mechanisms: (1) Rule Engine — deep JSON comparison between backup snapshots classifying changes into High/Medium/Low criticality; (2) Trend-Level — Facebook's Prophet ML via NestJS/Python with 99%, 95%, 80% confidence intervals.\n\nCovers Google Workspace, Microsoft 365, and QuickBooks.\n\nTech Stack: Node.js · TypeScript · Prophet ML · NestJS · Python · PostgreSQL · MDLOps\n\nKey Metrics:\n✓ 3 cloud platforms\n✓ 3 confidence intervals\n✓ Rule + ML dual detection",
      suggestions: ["Sky 2.0", "DAL AI-Agents", "Tell me about all projects"],
    },
  },
  {
    pattern: /^mdl$|mdl 2\.?0|config.driven framework/,
    response: {
      text: "⚡ MDL 2.0 Framework\n\nDescription: Replaced complex mutation logic with simple JSON-driven configuration. Each action executes as a micro-task inside PostGraphile. Migrated 12+ cloud integrations — adding a new cloud now requires zero code changes, only config. Owns Restore, Sync, OnDemand Backup, and Access Management.\n\nTech Stack: TypeScript · PostGraphile · PostgreSQL · JSON Config · Node.js\n\nKey Metrics:\n✓ 12+ cloud integrations\n✓ Zero code per new cloud\n✓ Owns restore, sync, backup",
      suggestions: ["Restore & Export", "MDLOPS Microservice", "Tell me about all projects"],
    },
  },
  {
    pattern: /restore.*export|export.*restore|athena.*archive|archive/,
    response: {
      text: "🔄 Restore & Export Action\n\nDescription: Built from scratch for Gen3, evolved through Gen4. Supports 3 modes: (1) User/Account/Company level full restore, (2) Folder level with deep recursive traversal preserving hierarchy, (3) Item level pinpoint restore. For archives 2+ years old — fetches metadata on-demand via AWS Athena.\n\nTech Stack: Node.js · TypeScript · AWS Athena · S3 · PostgreSQL · Recursive CTEs · Config-Driven\n\nKey Metrics:\n✓ Millions of items/sec\n✓ Query time 10s+ → under 2s\n✓ Zero code per new cloud",
      suggestions: ["Customer Dashboard", "MDL 2.0", "Tell me about all projects"],
    },
  },
  {
    pattern: /customer dashboard|dashboard/,
    response: {
      text: "📈 Customer Dashboard\n\nDescription: Per-tenant operational intelligence interface with 13+ widgets — License Management, Backup/Restore/Export Status, Ransomware Detection, AI Anomaly Detection, eDiscovery, Archiver. All widgets follow a Unified Materialized View pattern with zero transactional impact.\n\nTech Stack: Node.js · TypeScript · PostgreSQL · Materialized Views · GraphQL · PostGraphile\n\nKey Metrics:\n✓ 13+ widgets\n✓ 12+ cloud integrations\n✓ Zero transactional impact",
      suggestions: ["Partner Portal", "Restore & Export", "Tell me about all projects"],
    },
  },
  {
    pattern: /partner portal|msp|multi.tenant/,
    response: {
      text: "👥 Partner Portal Dashboard\n\nDescription: Multi-tenant MSP admin dashboard with 4-layer hierarchical aggregation: per-cloud per-customer → all-cloud per-customer → all-customer MSP level → per-cloud performance analysis. Data synced via AWS Lambda with zero PII exposure.\n\nTech Stack: Node.js · TypeScript · AWS Lambda · PostgreSQL · Multi-tenant · Aggregation\n\nKey Metrics:\n✓ 4-layer aggregation\n✓ Zero PII exposure\n✓ Full MSP visibility",
      suggestions: ["Customer Dashboard", "Batch Jobs Framework", "Tell me about all projects"],
    },
  },
  {
    pattern: /mdlops|pm2|addon.*module/,
    response: {
      text: "🔧 MDLOPS Microservice\n\nDescription: TypeScript microservice built from scratch using cm-runner-plus + JSON-driven config to handle 5 heavy async add-on modules (eDiscovery, Hold, BDI, Archiver, Data Change Insights) with parallel execution via PM2 and anomaly detection using the Prophet algorithm.\n\nTech Stack: TypeScript · Node.js · PM2 · Prophet Algorithm · AWS\n\nKey Metrics:\n✓ 5 add-on modules\n✓ Parallel execution\n✓ Anomaly detection built-in",
      suggestions: ["MDL 2.0", "Anomaly Detection", "Tell me about all projects"],
    },
  },
  {
    pattern: /batch job|job framework|100k|orchestrat/,
    response: {
      text: "🗄️ PostgreSQL Batch Jobs Framework\n\nDescription: Centralized job orchestration engine (v3.0) on Node.js + AWS Batch. Fetches job definitions from Master DB, distributes across 5 DB types (Trans, Cache, Master, Grafana, CacheTrans). Priority job system + intelligent skip logic. Handles 100K+ jobs with full Grafana observability.\n\nTech Stack: Node.js · TypeScript · AWS Batch · DynamoDB · PostgreSQL · Grafana · Secrets Manager\n\nKey Metrics:\n✓ 100K+ jobs handled\n✓ 5 DB types orchestrated\n✓ Priority + skip logic",
      suggestions: ["MDLOPS Microservice", "Restore & Export", "Tell me about all projects"],
    },
  },
  {
    pattern: /experience|syscloud|work history|career|role|job/,
    response: {
      text: "Aniket has been at SysCloud Technologies for 5+ years:\n\n🔵 Senior Software Engineer (Jun 2023 – Present) · Hyderabad\nAI agents, Sky 2.0, MDL 2.0, Partner Portal, Dashboard overhaul\n\n🟢 Software Engineer (May 2021 – Jun 2023) · Chennai\nConfig-driven Restore/Export, S3 data integrity pipeline, ELK Stack\n\n⚪ Software Engineer Intern (Nov 2020 – Apr 2021) · Chennai\nGraphQL queries, monolith → microservices POCs",
      suggestions: ["What has he built as SSE?", "His tech stack", "How to contact him?"],
    },
  },
  {
    pattern: /aws|cloud|lambda|s3|fargate|batch|sqs|athena/,
    response: {
      text: "Aniket has deep AWS production experience:\n\n• S3 — storage, event notifications, data integrity pipelines\n• Lambda — serverless triggers, data sync\n• Fargate — containerized batch workloads\n• Batch — distributed job orchestration (100K+ jobs)\n• SQS — async microservice messaging\n• Athena — on-demand querying of S3 archived data\n• CodeBuild/CodePipeline — CI/CD pipelines\n• Secrets Manager, DynamoDB, EventBridge",
      suggestions: ["Tell me about his projects", "PostgreSQL expertise?", "His tech stack"],
    },
  },
  {
    pattern: /postgres|sql|database|db|cte|materialized|query/,
    response: {
      text: "PostgreSQL is one of Aniket's strongest areas:\n\n• Advanced CTEs and Recursive CTEs for hierarchical data\n• Materialized Views for pre-computed dashboard widgets\n• Query optimization and execution plan tuning\n• Config-driven schema design across 12+ cloud integrations\n• Parallel host-level execution achieving 4x faster throughput\n• Foreign key syncing between transactional and cache DBs",
      suggestions: ["His AWS experience", "Tell me about the Dashboard", "Tech stack"],
    },
  },
  {
    pattern: /education|degree|university|college|study|lpu|b\.?tech/,
    response: {
      text: "Aniket holds a Bachelor of Technology in Computer Science & Engineering (B.Tech CSE) from Lovely Professional University, graduated in 2021.\n\nCertifications:\n• Node.js Certificate Training — Simplilearn\n• Full Stack Development — upGrad\n• ChatGPT & AI Tools Workshop — Be10x",
      suggestions: ["His work experience", "His tech stack", "How to contact him?"],
    },
  },
  {
    pattern: /contact|email|reach|connect|linkedin/,
    response: {
      text: "You can reach Aniket at:\n\n📧 rai078945@gmail.com\n💼 linkedin.com/in/aniket-kumar-rai\n📍 Hyderabad, India (IST, UTC+5:30)\n\nHe's open to Senior Backend, Full-Stack, and Backend-heavy roles. Typically responds within 24 hours!",
      suggestions: ["What roles is he open to?", "His notice period?", "Tell me about him"],
    },
  },
  {
    pattern: /notice|joining|open to work|looking|opportunity|hire|available|when can|start date/,
    response: {
      text: "Aniket is open to Senior Backend, Full-Stack, and Backend-heavy roles.\n\n• Notice period: 90 days (negotiable)\n• Location: Hybrid, Remote, or Work from Office (Hyderabad-based)\n• For exact joining timeline, reach out directly to confirm — rai078945@gmail.com",
      suggestions: ["How to contact him?", "His experience", "What's his tech stack?"],
    },
  },
  {
    pattern: /salary|compensation|ctc|pay|package|lpa|lakh/,
    response: {
      text: "For salary and compensation details, please reach out directly to Aniket at rai078945@gmail.com. He's open to discussing based on the role and company.",
      suggestions: ["His notice period?", "How to contact him?", "What roles is he open to?"],
    },
  },
  {
    pattern: /remote|hybrid|onsite|on.site|work from home|wfh|relocat/,
    response: {
      text: "Aniket is based in Hyderabad, India and is open to:\n\n• Hybrid roles (preferred)\n• Remote roles\n• Onsite in Hyderabad\n\nRelocation is open to discussion depending on the opportunity.",
      suggestions: ["His notice period?", "How to contact him?", "His experience"],
    },
  },
  {
    pattern: /portfolio|website|this site|built this|next\.?js/,
    response: {
      text: "This portfolio was built by Aniket using:\n\n• Next.js 14 + TypeScript\n• Framer Motion for animations\n• Lucide React for icons\n• Deployed on GitHub Pages\n\nThis chatbot is also built by him — runs fully client-side with no backend!",
      suggestions: ["His other projects", "Tech stack", "How to contact him?"],
    },
  },
  {
    pattern: /impact|achiev|accomplish|metric|result|improv|faster|reduc/,
    response: {
      text: "Aniket's measurable impact:\n\n⚡ 4x faster batch job execution\n🚀 10s+ → under 2s archive query time\n☁️ 12+ cloud integrations with zero code per new cloud\n🛡️ 0 critical security violations (down from 100%)\n📉 90% reduction in total code quality issues\n🤖 4 AI agents auto-resolving production issues\n💼 MDLOPS runs 5 async modules in parallel",
      suggestions: ["Tell me about his projects", "Why hire him?", "His experience"],
    },
  },
  {
    pattern: /current|currently|present|right now|working now/,
    response: {
      text: "Aniket is currently a Senior Software Engineer at SysCloud Technologies, Hyderabad (Jun 2023 – Present).\n\nCurrent focus: AI agents, Sky 2.0, MDL 2.0 framework, and scaling cloud integrations across 12+ providers.",
      suggestions: ["His projects", "Tell me about SysCloud", "His tech stack"],
    },
  },
  {
    pattern: /what is syscloud|syscloud product|syscloud company|what does syscloud/,
    response: {
      text: "SysCloud Technologies is a B2B SaaS company specializing in cloud data backup and protection. Their platform covers 12+ cloud providers — Google Workspace, Microsoft 365, QuickBooks, Slack, and more.\n\nAniket has been there 5+ years, growing from Intern to Senior Software Engineer.",
      suggestions: ["His experience at SysCloud", "His projects", "How to contact him?"],
    },
  },
  {
    pattern: /slack|ediscovery|e.discovery/,
    response: {
      text: "Aniket integrated Slack eDiscovery Search into SysCloud — enabling customers to search and retrieve Slack files, messages, and chats. Built the backend Node.js APIs, GraphQL mutations, and collaborated on the frontend UI components.",
      suggestions: ["Tell me about all projects", "His tech stack", "His experience"],
    },
  },
  {
    pattern: /gen3|gen4|gen5|generation|cloud page/,
    response: {
      text: "Aniket worked across multiple SysCloud product generations:\n\n• Gen3 — Unified config-driven Restore/Export, zero per-cloud code\n• Gen4 — Cloud pages (Reports, Restore, Export, Dashboard) with config templates\n• Gen5 — Extended with Unified Errors, Limitations, Homepage widgets\n\nEach new cloud added with zero code changes.",
      suggestions: ["MDL 2.0 framework", "Restore & Export", "His experience"],
    },
  },
  {
    pattern: /strength|good at|best at|specializ|expert|strong/,
    response: {
      text: "Aniket's core strengths:\n\n🔹 Backend Systems — scalable Node.js/TypeScript APIs and microservices\n🔹 PostgreSQL — CTEs, materialized views, query optimization\n🔹 Config-Driven Architecture — frameworks that scale without code changes\n🔹 AWS — end-to-end production experience across 8+ services\n🔹 AI Integration — LLM agents, MCP, Prophet ML anomaly detection\n🔹 System Ownership — designs, builds, and ships end-to-end",
      suggestions: ["Tell me about his projects", "What's his tech stack?", "His experience"],
    },
  },
  {
    pattern: /weakness|weak|not good|improve|learning/,
    response: {
      text: "Aniket is primarily a backend engineer — his frontend skills (React, CSS) are functional but not his primary strength. He's continuously learning and has integrated React into full-stack deliveries at SysCloud.",
      suggestions: ["What is he strong at?", "His tech stack", "His projects"],
    },
  },
  {
    pattern: /how many year|years of exp|how long|since when|how much exp/,
    response: {
      text: "Aniket has 5+ years of professional experience, all at SysCloud Technologies:\n\n• Nov 2020 – Apr 2021: Intern\n• May 2021 – Jun 2023: Software Engineer\n• Jun 2023 – Present: Senior Software Engineer",
      suggestions: ["What did he build as SSE?", "His tech stack", "How to contact him?"],
    },
  },
  {
    pattern: /why hire|why aniket|why should|what makes him|unique|stand out|different/,
    response: {
      text: "Why hire Aniket?\n\n🔹 Builds systems that scale — 12+ cloud integrations, zero code per new cloud\n🔹 Ships end-to-end — owns features from design to production\n🔹 AI-first mindset — built LLM agents before it was mainstream\n🔹 Quality-driven — SonarQube critical issues to 0, total cut by 90%\n🔹 Performance obsessed — 4x batch speed, 10s+ → <2s query times\n🔹 5+ years deep production experience in a high-growth SaaS product",
      suggestions: ["Tell me about his projects", "How to contact him?", "His experience"],
    },
  },
  {
    pattern: /microservice|micro.service|distributed|architecture/,
    response: {
      text: "Aniket's microservices experience:\n\n• MDLOPS — TypeScript microservice with 5 async modules, parallel PM2 execution\n• Helped shift SysCloud from monolith (Gen1) to microservices (Gen2) as intern\n• MDL 2.0 — micro-task execution engine inside PostGraphile\n• AWS SQS — async inter-service communication in Addon Actions",
      suggestions: ["Tell me about MDLOPS", "MDL 2.0 framework", "His AWS experience"],
    },
  },
  {
    pattern: /graphql|postgraphile|gql|mutation|query language/,
    response: {
      text: "GraphQL is a core part of Aniket's stack:\n\n• PostGraphile as the primary GraphQL server\n• Authored GraphQL queries for UI modules from his intern days\n• Built mutation layers for Add-On Actions (Dismiss, Hold, Archive, Deletion)\n• MDL 2.0 executes all cloud actions as micro-tasks inside PostGraphile",
      suggestions: ["Tell me about MDL 2.0", "His tech stack", "His projects"],
    },
  },
  {
    pattern: /ci.?cd|devops|pipeline|deployment|deploy|sonarqube|code quality/,
    response: {
      text: "Aniket's CI/CD and DevOps experience:\n\n• AWS CodeBuild + CodePipeline — primary CI/CD at SysCloud\n• SonarQube — eliminated all critical violations (to 0), cut total issues by 90%\n• Docker — containerized services and batch workloads\n• AWS Batch — container-based job execution at scale\n• Grafana — observability dashboards for batch jobs and timeseries",
      suggestions: ["His AWS experience", "Tell me about his projects", "His tech stack"],
    },
  },
  {
    pattern: /mentor|lead|leadership|team|junior|manage|senior/,
    response: {
      text: "As a Senior Software Engineer, Aniket:\n\n• Mentors junior developers and conducts regular code reviews\n• Owns features end-to-end — from design to production\n• Led migration of 12+ cloud integrations to MDL 2.0\n• Drove SonarQube quality initiatives across the entire codebase\n• Designed architecture for MDLOPS, MDL 2.0, and Sky 2.0 from scratch",
      suggestions: ["His experience", "Why hire him?", "How to contact him?"],
    },
  },
  {
    pattern: /certif|course|training|upgrad|simplilearn/,
    response: {
      text: "Aniket's certifications:\n\n• Node.js Certificate Training — Simplilearn\n• Full Stack Development — upGrad\n• ChatGPT & AI Tools Workshop — Be10x",
      suggestions: ["His education", "His tech stack", "His experience"],
    },
  },
  {
    pattern: /location|where|city|hyderabad|india/,
    response: {
      text: "Aniket is based in Hyderabad, Telangana, India (IST, UTC+5:30). Open to hybrid and remote roles.",
      suggestions: ["Remote or onsite?", "His notice period?", "How to contact him?"],
    },
  },
  {
    pattern: /thank|thanks|great|perfect|awesome|cool|nice|helpful/,
    response: {
      text: "Happy to help! Feel free to ask anything else, or reach out to Aniket directly at rai078945@gmail.com.",
      suggestions: ["Tell me about his projects", "How to contact him?", "His tech stack"],
    },
  },
];

export const DEFAULT_RESPONSE: ResponseEntry = {
  text: "I'm not trained on that yet! I've noted your question and Aniket will make sure I can answer it next time. 📝\n\nMeanwhile, try asking something below:",
  suggestions: ["Who is Aniket?", "What's his tech stack?", "Tell me about his projects", "How to contact him?"],
};

export const INITIAL_SUGGESTIONS = ["Who is Aniket?", "What's his tech stack?", "Tell me about his projects", "How to contact him?"];
