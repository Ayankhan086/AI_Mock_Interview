# AI Mock Interview Platform

A dynamic, fully voice-driven AI mock interview platform built with Next.js, Prisma, PostgreSQL, LangGraph, and Gemini.

## Prerequisites
- Node.js v18+
- PostgreSQL running locally (or via Docker)

## Local Setup (Under 5 Commands)

1. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure Environment Variables**
   Create a \`.env\` file in the root directory and add:
   \`\`\`env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mockinterview?schema=public"
   JWT_SECRET="your-secret-key"
   GEMINI_API_KEY="your-gemini-api-key"
   \`\`\`

3. **Initialize Database**
   \`\`\`bash
   npx prisma migrate dev --name init
   \`\`\`

4. **Start the Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

## Architecture & Choices
- **Frontend/Backend:** Next.js (App Router) for a unified full-stack architecture.
- **Database:** PostgreSQL with Prisma for type-safe database queries.
- **Voice AI:** Built-in Web Speech API (SpeechRecognition and speechSynthesis) for completely free, browser-native STT/TTS without needing third-party telephony APIs.
- **Conversation Engine:** LangGraph (using `@langchain/langgraph` & `@google/genai`) powers the conversational state to allow dynamic follow-up generation instead of a rigid question list.
- **Theme:** Midnight Obsidian & Luminous Gold styling using Tailwind CSS.

## Features
- Dynamic voice conversation with Gemini 2.5 Flash via LangGraph.
- Evaluates candidate answers and asks unscripted follow-up questions.
- Automatically generates detailed markdown feedback reports at the end of the session.
