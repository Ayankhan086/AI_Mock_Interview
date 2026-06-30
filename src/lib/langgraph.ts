import { StateGraph, START, END, Annotation } from '@langchain/langgraph';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { SystemMessage, HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';

// Define the state schema
export const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  interviewType: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => 'Behavioral',
  }),
  userName: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => 'Candidate',
  }),
  jobRole: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => 'Software Engineer',
  }),
  questionCount: Annotation<number>({
    reducer: (x, y) => y ?? x,
    default: () => 0,
  }),
});

const llm = new ChatGoogleGenerativeAI({
  model: 'gemini-2.5-flash',
  maxOutputTokens: 2048,
  temperature: 0.7,
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || 'missing-key',
});

async function generateResponse(state: typeof GraphState.State) {
  const { messages, interviewType, userName, jobRole, questionCount } = state;
  
  const systemPrompt = `You are an expert AI Interviewer conducting a ${interviewType} interview for a ${jobRole} position with a candidate named ${userName}.
Your goal is to conduct a realistic, dynamic voice interview.

Guidelines:
1. Speak concisely. This is a voice conversation. DO NOT output markdown, bullet points, or long essays. Keep responses to 1-3 short sentences.
2. Listen to the candidate's answer. Do not just move to the next question.
3. If the answer is vague, ask a specific follow-up question probing for details (e.g. "Can you walk me through the specific challenge there?").
4. If the answer is strong, acknowledge it briefly and move on to the next topic.
5. If they ask a question, answer it briefly.
6. The interview should last for about 5 core questions. You have asked ${questionCount} so far.
7. If ${questionCount} >= 5 and they have finished their current thought, naturally conclude the interview. Say something like "Thank you, that's all the questions I have. Have a great day!"

Current interview context:
- Interview Type: ${interviewType}
- Target Role: ${jobRole}
- Questions Asked: ${questionCount}

Respond naturally to the last message from the candidate.`;

  const response = await llm.invoke([
    new SystemMessage(systemPrompt),
    ...messages,
  ]);

  // We roughly estimate if this is a new question vs a follow-up by checking if they just started a new topic, 
  // but for simplicity, we'll increment question count every 2 turns or just let the LLM manage the flow and we increment on each candidate message.
  
  return {
    messages: [response],
    questionCount: questionCount + 1,
  };
}

// Build the graph
const workflow = new StateGraph(GraphState)
  .addNode("interview_node", generateResponse)
  .addEdge(START, "interview_node")
  .addEdge("interview_node", END);

export const interviewGraph = workflow.compile();
