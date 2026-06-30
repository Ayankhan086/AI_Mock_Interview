# MockAI - Professional Voice Interview Platform

A dynamic, fully voice-driven AI mock interview platform built with Next.js, Prisma, PostgreSQL, LangGraph, and Gemini.

## Local Setup (Under 5 Commands)

Assuming you have Node.js and an empty Neon/PostgreSQL database ready:

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your keys:
   ```env
   DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"
   JWT_SECRET="your-secure-secret-key"
   GEMINI_API_KEY="your-gemini-api-key"
   ```

3. **Initialize Database Schema**
   ```bash
   npx prisma migrate deploy
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

## Architecture & Choices
- **Frontend/Backend:** Next.js (App Router) for a unified full-stack architecture.
- **Database:** PostgreSQL (Neon Serverless) with Prisma for type-safe database queries.
- **Voice Engine:** Built-in Web Speech API (`SpeechRecognition` and `speechSynthesis`) for zero-latency, browser-native STT/TTS without the massive cost of third-party telephony/streaming APIs.
- **Conversation Engine:** LangGraph (using `@langchain/langgraph` & `@google/genai`) powers the conversational state to allow dynamic, context-aware follow-up generation instead of rigid question lists.
- **Design System:** Professional Light SaaS Theme with Indigo accents using Tailwind CSS.

## Features
- Dynamic voice conversation with Gemini 2.5 Flash via LangGraph.
- Evaluates candidate answers in real-time and pushes back with unscripted follow-up questions.
- Automatically generates detailed markdown feedback reports at the end of the session.
- Secure JWT cookie-based authentication with Next.js Server Middleware route protection.
