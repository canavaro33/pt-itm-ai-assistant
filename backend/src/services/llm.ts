import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

export async function sendToLLM(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  // Provider is either "gemini", "openai", or "openrouter"
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'AI_API_KEY environment variable is not set. Please set it in your .env file.'
    );
  }

  console.log(`🤖 Sending message to LLM provider: ${provider}`);

  if (provider === 'openai') {
    return sendToOpenAI(apiKey, systemPrompt, userMessage);
  } else if (provider === 'openrouter') {
    return sendToOpenRouter(apiKey, systemPrompt, userMessage);
  } else {
    // Default to Gemini
    return sendToGemini(apiKey, systemPrompt, userMessage);
  }
}

async function sendToGemini(
  apiKey: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  // We use gemini-2.5-flash as the latest standard models
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: systemPrompt,
  });

  try {
    const result = await model.generateContent(userMessage);
    const text = result.response.text();
    return text || 'Maaf, tidak ada respons dari AI.';
  } catch (error) {
    console.error('Error generating content from Gemini:', error);
    throw error;
  }
}

async function sendToOpenAI(
  apiKey: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const openai = new OpenAI({ apiKey });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    return (
      response.choices[0]?.message?.content || 'Maaf, tidak ada respons dari AI.'
    );
  } catch (error) {
    console.error('Error generating content from OpenAI:', error);
    throw error;
  }
}

async function sendToOpenRouter(
  apiKey: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const openai = new OpenAI({ 
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey 
  });

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'meta-llama/llama-3-8b-instruct:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    return (
      response.choices[0]?.message?.content || 'Maaf, tidak ada respons dari AI.'
    );
  } catch (error) {
    console.error('Error generating content from OpenRouter:', error);
    throw error;
  }
}
