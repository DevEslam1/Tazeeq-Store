import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type BannerType = 'success' | 'error' | 'info' | 'warning';

interface BannerPayload {
  message: string;
  type: BannerType;
  duration?: number;
}

interface UiState {
  banner: {
    isVisible: boolean;
    message: string;
    type: BannerType;
    duration: number;
    id: number;
  };
}

const initialState: UiState = {
  banner: {
    isVisible: false,
    message: '',
    type: 'info',
    duration: 3000,
    id: 0,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showBanner: (state, action: PayloadAction<BannerPayload>) => {
      state.banner.isVisible = true;
      state.banner.message = action.payload.message;
      state.banner.type = action.payload.type;
      state.banner.duration = action.payload.duration || 3000;
      state.banner.id = Date.now(); // Trigger animation restart if same type/msg
    },
    hideBanner: (state) => {
      state.banner.isVisible = false;
    },
  },
});

export const { showBanner, hideBanner } = uiSlice.actions;

export const selectBanner = (state: { ui: UiState }) => state.ui.banner;

export default uiSlice.reducer;
