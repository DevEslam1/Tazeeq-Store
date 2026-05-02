import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const AiService = {
  /**
   * Calls the Gemini Proxy Firebase Function
   */
  async chat(message: string, history: ChatMessage[] = []) {
    try {
      const geminiChat = httpsCallable(functions, 'geminiChat');
      const result = await geminiChat({
        message,
        history,
      });
      
      const data = result.data as { text: string; model: string; timestamp: string };
      return data;
    } catch (error) {
      console.error("AiService Error:", error);
      throw error;
    }
  }
};
