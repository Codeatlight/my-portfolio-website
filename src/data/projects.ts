export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  techStack: string[];
  features: string[];
  challenges: string[];
  results: string[];
  futureImprovements: string[];
  demoUrl?: string;
  githubUrl?: string;
  image: string;
  category: 'ai-ml' | 'fullstack' | 'desktop';
  status: 'completed' | 'in-development';
  gradient: string;
}

export const projects: Project[] = [
  {
    id: 'lawsage-ai',
    title: 'LawSage AI',
    subtitle: 'AI-Powered Legal Assistance Platform',
    description: 'A cutting-edge AI platform that streamlines legal document workflows with intelligent summarization, text simplification, and interactive legal research chat.',
    longDescription: `LawSage.AI is an AI-powered platform designed to streamline legal document workflows. Built as an academic project for an "Intelligent Model Design" course, it demonstrates how advanced NLP can simplify legal tasks. The system focuses on three core capabilities: document summarization, text simplification, and legal research assistance.

The platform can extract concise summaries of lengthy contracts, simplify legal jargon for lay readers, and answer structured legal queries via an interactive chat assistant powered by fine-tuned LLMs.`,
    techStack: ['Python', 'Flask', 'JavaScript', 'PyTorch', 'Hugging Face', 'OCR', 'Azure VM', 'Legal-Pegasus', 'LegalBERT-BART', 'LLaMA-3', 'Mistral', 'Docker'],
    features: [
      'Upload & PDF text extraction with automatic OCR fallback via Tesseract for scanned documents',
      'Intelligent legal summarization using Legal-Pegasus model',
      'Text simplification translating complex legalese into plain language via LegalBERT-BART',
      'Interactive legal Q&A chat leveraging fine-tuned LLaMA-3 / Mistral models',
      'Dynamic fast chat pipeline with configurable model selector for speed vs accuracy',
      'User authentication & persistence with Flask-Login and MySQL',
    ],
    challenges: [
      'Scanned PDF handling — solved via two-stage extraction pipeline (pdfplumber primary, pytesseract fallback)',
      'Latency vs. reasoning quality — migrated from Phi to LLaMA/Mistral, reducing response latency by ~40%',
      'Hardcoded configurations — adopted 12-factor app environment variable patterns',
    ],
    results: [
      '~40% reduction in response latency after model migration',
      'Production-grade deployment on Azure Virtual Machine',
      'Handles both digital and scanned legal documents seamlessly',
    ],
    futureImprovements: [
      'Multi-language legal document support',
      'RAG-based document retrieval for improved accuracy',
      'Fine-tuned models on Indian legal corpus',
      'Real-time collaborative document analysis',
    ],
    demoUrl: 'http://4.187.225.163:5000/',
    githubUrl: 'https://github.com/Codeatlight/LawSage.AI',
    image: '/projects/lawsage-poster.jpg',
    category: 'ai-ml',
    status: 'completed',
    gradient: 'from-violet-500/20 to-cyan-500/20',
  },
  {
    id: 'ai-research-assistant',
    title: 'AI Research Assistant',
    subtitle: 'RAG-Powered Academic Paper Analyzer',
    description: 'An AI-powered research assistant for academic paper analysis featuring RAG-based chat, intelligent summarization, methodology visualization, citation generation, and literature reviews.',
    longDescription: `AI Research Assistant is a full-stack application built with FastAPI and React that helps researchers analyze academic papers using advanced AI. It uses Retrieval-Augmented Generation (RAG) with ChromaDB vector embeddings and Groq's LLaMA models.

The platform supports uploading research papers (PDF), then enables intelligent summarization, interactive chat about paper content, methodology flow visualization via React Flow, dataset extraction, research gap identification, multi-format citation generation (IEEE, APA, MLA, Chicago, BibTeX), and cross-paper literature review generation.`,
    techStack: ['React', 'TypeScript', 'FastAPI', 'Python', 'ChromaDB', 'Groq API', 'Vite', 'Tailwind CSS', 'React Flow', 'PyPDF2', 'PDFPlumber', 'Uvicorn'],
    features: [
      'Upload and analyze academic papers (PDF) with intelligent text extraction',
      'AI-powered paper summarization using Groq LLaMA models',
      'RAG-based chat — ask questions about uploaded papers with context-aware answers',
      'Interactive methodology flow visualization using React Flow',
      'Extract datasets referenced in papers automatically',
      'Research gap identification and future work suggestions',
      'Multi-format citation generation: IEEE, APA, MLA, Chicago, BibTeX',
      'Literature review generation across multiple uploaded papers',
      'Modern responsive UI with Light/Dark mode toggle',
    ],
    challenges: [
      'Accurate context retrieval from long papers — solved with ChromaDB vector embeddings and chunked document processing',
      'Handling diverse PDF formats — dual extraction pipeline using PyPDF2 and PDFPlumber for robustness',
      'Response quality and latency — leveraged Groq API for fast inference with LLaMA models',
    ],
    results: [
      'Full-stack deployment on Render for public access',
      'Supports multi-paper analysis with cross-reference literature reviews',
      'Sub-second AI response times via Groq API acceleration',
    ],
    futureImprovements: [
      'User authentication and persistent workspaces',
      'Citation export to Word documents',
      'OCR support for scanned PDFs',
      'Streaming responses for real-time AI output',
      'Docker containerized deployment',
    ],
    demoUrl: 'https://ai-research-assistant-frontend-c296.onrender.com/',
    githubUrl: 'https://github.com/Codeatlight/ai-research-assistant',
    image: '/projects/ai-research-assistant-poster.jpg',
    category: 'ai-ml',
    status: 'completed',
    gradient: 'from-indigo-500/20 to-teal-500/20',
  },
  {
    id: 'cinemascope',
    title: 'CinemaScope',
    subtitle: 'ML-Powered Movie Recommendation System',
    description: 'A content-based movie recommendation engine using a custom KNN algorithm on IMDb 5000+ dataset, featuring dual recommendation modes and a cinematic UI.',
    longDescription: `CinemaScope is a Python-based content-based movie recommendation web application. It leverages a custom K-Nearest Neighbors (KNN) machine learning algorithm operating on the Kaggle IMDb 5000+ movie dataset (~5,043 movies) to suggest similar films.

Users can discover movies through two modes: movie-based recommendations (find similar films) and genre-based filtering with customizable IMDb rating thresholds. The application features a cinematic dark UI with movie posters, plot summaries, and ratings.`,
    techStack: ['Python', 'Streamlit', 'KNN', 'OMDB API', 'BeautifulSoup4', 'pandas', 'NumPy', 'Scikit-learn', 'Gunicorn'],
    features: [
      'Dual recommendation modes: movie-based and genre-based with customizable filters',
      'Custom KNN classifier using Euclidean distance on 26-dimension binary genre vectors',
      'Preprocessed data pipeline with Streamlit caching for instant recommendations',
      'Hybrid poster & plot fetching via OMDB API with BeautifulSoup scraping fallback',
      'Cinematic dark UI with gold rating badges and custom styling',
    ],
    challenges: [
      'Runtime computation latency — solved by pre-building one-hot encoded JSON vectors and caching in memory',
      'API quota & missing posters — built fallback web scraper using BeautifulSoup targeting IMDb URLs',
    ],
    results: [
      'Processes 5,043+ movies with instant recommendation delivery',
      'Deployed on Render for public access',
      'Seamless fallback system ensures 99%+ poster availability',
    ],
    futureImprovements: [
      'Collaborative filtering for personalized recommendations',
      'User accounts with watch history',
      'Integration with streaming platform APIs',
    ],
    demoUrl: 'https://movie-recommendation-system-shx4.onrender.com/',
    githubUrl: 'https://github.com/Codeatlight/Movie-Recommendation-System',
    image: '/projects/cinemascope-poster.jpg',
    category: 'ai-ml',
    status: 'completed',
    gradient: 'from-amber-500/20 to-rose-500/20',
  },
  {
    id: 'security-vault',
    title: 'Security Vault',
    subtitle: 'Encrypted Desktop Password Manager',
    description: 'A Java-based desktop password manager with end-to-end symmetric encryption, MVC architecture, and real-time credential search.',
    longDescription: `Security Vault is a Java-based desktop password manager built using Java Swing for the UI and SQLite for storage. It implements the Model-View-Controller (MVC) architectural pattern to securely manage credentials with end-to-end symmetric encryption via the Jasypt library.

The application features master account authentication, encrypted credential storage, interactive password table with real-time search, and non-blocking multithreading for responsive UI.`,
    techStack: ['Java', 'Swing', 'SQLite', 'JDBC', 'Jasypt', 'MVC', 'OOD'],
    features: [
      'Master account authentication with secure registration and login',
      'End-to-end credential encryption using Jasypt BasicTextEncryptor',
      'Interactive password table with real-time keyword filtering',
      'Modal dialog for safe credential entry with validation',
      'Non-blocking multithreading using SingleThreadExecutor',
      'Self-initializing local SQLite database with auto table creation',
    ],
    challenges: [
      'Data security at rest — solved via Jasypt symmetric encryption for all stored credentials',
      'SQL injection prevention — mitigated through parameterized PreparedStatement queries',
      'UI responsiveness — offloaded DB operations to background threads keeping EDT non-blocking',
    ],
    results: [
      'Zero plaintext password storage — all credentials encrypted before writing to disk',
      'Clean MVC separation enabling easy maintenance and extension',
      'Portable local utility requiring no network connectivity',
    ],
    futureImprovements: [
      'One-way hashing for master account password verification',
      'Encrypted SQLite database file',
      'Password strength analyzer',
      'Cross-platform packaging',
    ],
    githubUrl: 'https://github.com/Codeatlight/Security-Vault',
    image: '/projects/security-vault.jpg',
    category: 'desktop',
    status: 'completed',
    gradient: 'from-emerald-500/20 to-blue-500/20',
  },
  {
    id: 'mern-saas',
    title: 'MERN SaaS Platform',
    subtitle: 'Full-Stack SaaS Application',
    description: 'A modern SaaS platform built with the MERN stack featuring authentication, payments, dashboards, and a production-grade architecture.',
    longDescription: 'A comprehensive SaaS platform currently in development, leveraging the MERN stack with modern best practices including JWT authentication, Stripe payments, role-based access control, and real-time features.',
    techStack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'TypeScript', 'Stripe', 'JWT'],
    features: [
      'JWT authentication with refresh tokens',
      'Stripe payment integration',
      'Role-based access control',
      'Real-time dashboard analytics',
      'Responsive admin panel',
    ],
    challenges: [],
    results: [],
    futureImprovements: [],
    image: '',
    category: 'fullstack',
    status: 'in-development',
    gradient: 'from-blue-500/20 to-purple-500/20',
  },
  {
    id: 'ai-agent',
    title: 'AI Agent System',
    subtitle: 'Autonomous AI Agent Framework',
    description: 'An autonomous AI agent framework capable of multi-step reasoning, tool use, and task decomposition for complex problem solving.',
    longDescription: 'An advanced AI agent system in development, designed to perform autonomous multi-step reasoning with tool integration, memory management, and adaptive task decomposition.',
    techStack: ['Python', 'LangChain', 'OpenAI', 'Vector DB', 'FastAPI', 'Redis'],
    features: [
      'Multi-step autonomous reasoning',
      'Dynamic tool selection and use',
      'Long-term memory with vector storage',
      'Task decomposition and planning',
      'Self-reflection and error correction',
    ],
    challenges: [],
    results: [],
    futureImprovements: [],
    image: '',
    category: 'ai-ml',
    status: 'in-development',
    gradient: 'from-cyan-500/20 to-emerald-500/20',
  },
];
