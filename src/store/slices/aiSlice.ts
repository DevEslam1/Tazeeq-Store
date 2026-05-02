import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AiService, ChatMessage } from '../../services/aiService';

interface AiState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

const initialState: AiState = {
  messages: [],
  loading: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  'ai/sendMessage',
  async (message: string, { getState }) => {
    const state = getState() as { ai: AiState };
    const history = state.ai.messages;
    
    // Call service
    const response = await AiService.chat(message, history);
    return response.text;
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({ role: 'user', content: action.payload });
    },
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({ role: 'assistant', content: action.payload });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get response';
      });
  },
});

export const { addUserMessage, clearChat } = aiSlice.actions;
export default aiSlice.reducer;

export const selectChatMessages = (state: { ai: AiState }) => state.ai.messages;
export const selectAiLoading = (state: { ai: AiState }) => state.ai.loading;
export const selectAiError = (state: { ai: AiState }) => state.ai.error;
