import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/app';

interface SearchState {
  query: string;
  recentSearches: string[];
  results: Product[];
}

const initialState: SearchState = {
  query: '',
  recentSearches: [],
  results: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      if (!state.recentSearches.includes(action.payload)) {
        state.recentSearches.unshift(action.payload);
        if (state.recentSearches.length > 10) {
          state.recentSearches.pop();
        }
      }
    },
    setSearchResults: (state, action: PayloadAction<Product[]>) => {
      state.results = action.payload;
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
    },
  },
});

export const { setQuery, addRecentSearch, setSearchResults, clearRecentSearches, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;

export const selectSearchQuery = (state: { search: SearchState }) => state.search.query;
export const selectRecentSearches = (state: { search: SearchState }) => state.search.recentSearches;
export const selectSearchResults = (state: { search: SearchState }) => state.search.results;