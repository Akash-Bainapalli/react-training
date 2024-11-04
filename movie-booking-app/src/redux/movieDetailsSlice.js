import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const apiKey = 'c505aa0e';

export const fetchMovieDetails = createAsyncThunk(
  'movieDetails/fetchMovieDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`);
      const data = await response.json();

      if (data.Response === 'False') {
        throw new Error(data.Error || 'Error fetching movie details');
      }

      return data; 
    } catch (error) {
      console.error("Fetch error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const movieDetailsSlice = createSlice({
  name: 'movieDetails',
  initialState: {
    movieDetails: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.movieDetails = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching movie details';
      });
  },
});

export const selectMovieDetails = (state) => state.movieDetails.movieDetails;

export default movieDetailsSlice.reducer;
