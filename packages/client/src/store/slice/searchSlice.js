import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchSearchResults = createAsyncThunk(
    "search/fetchSearchResults",
    async ({ query }) => {
        const response = await fetch(`${API_URL}/search?q=${query}`);
        return response.json();
    }
);

export const fetchSearchResultsNav = createAsyncThunk(
    "search/fetchSearchResultsNav",
    async ({ query }) => {
        const response = await fetch(`${API_URL}/search?q=${query}&limit=true`);
        return response.json();
    }
);

const searchSlice = createSlice({
    name: "search",
    initialState: {
        results: [],
        navResults: []
    },
    reducers: {
        clearSearch: (state) => {
            state.results = [];
        },
        clearNavSearch: (state) => {
            state.navResults = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearchResults.fulfilled, (state, action) => {
                state.results = action.payload;
            })
            .addCase(fetchSearchResultsNav.fulfilled, (state, action) => {
                state.navResults = action.payload;
            });
    },
});

export const { clearSearch, clearNavSearch } = searchSlice.actions;
export default searchSlice.reducer;
