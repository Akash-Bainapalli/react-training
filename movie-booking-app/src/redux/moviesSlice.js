import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const apiKey = 'c505aa0e';

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${searchTerm}&type=movie&apikey=${apiKey}&page=1`);
      const data = await response.json();
      
      if (data.Response === 'False') {
        return [];
      }
      
      return data.Search;
    } catch (error) {
      console.error("Fetch error:", error);
      return rejectWithValue('Failed to fetch movies');
    }
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchMovieDetails',
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

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    movieDetails: null,
    loading: false,
    detailsLoading: false, 
    error: null,
    detailsError: null, 
    bookings: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMovieDetails.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.movieDetails = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload || 'Error fetching movie details';
      });
  },
});

export default moviesSlice.reducer;
