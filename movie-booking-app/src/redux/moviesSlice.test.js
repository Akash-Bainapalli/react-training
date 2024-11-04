import moviesReducer, { fetchMovies, fetchMovieDetails } from './moviesSlice';
import {configureStore} from 'redux-mock-store';
import {thunk} from 'redux-thunk';
import { act } from 'react-dom/test-utils';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

global.fetch = jest.fn();

describe('moviesSlice', () => {
  const initialState = {
    movies: [],
    movieDetails: null,
    loading: false,
    detailsLoading: false,
    error: null,
    detailsError: null,
  };

  beforeEach(() => {
    fetch.mockClear();
  });

  test('should return the initial state', () => {
    expect(moviesReducer(undefined, {})).toEqual(initialState);
  });

  test('should set loading to true when fetching movies', () => {
    const action = { type: fetchMovies.pending.type };
    const expectedState = {
      ...initialState,
      loading: true,
      error: null,
    };
    expect(moviesReducer(initialState, action)).toEqual(expectedState);
  });

  test('should store movies on successful fetch', () => {
    const mockMovies = [
      { Title: 'Inception', Year: '2010', imdbID: 'tt1375666', Poster: 'inception.jpg' },
      { Title: 'Interstellar', Year: '2014', imdbID: 'tt0816692', Poster: 'interstellar.jpg' },
    ];

    const action = { type: fetchMovies.fulfilled.type, payload: mockMovies };
    const expectedState = {
      ...initialState,
      loading: false,
      movies: mockMovies,
    };

    expect(moviesReducer(initialState, action)).toEqual(expectedState);
  });

  test('should set error on failed fetch', () => {
    const action = { type: fetchMovies.rejected.type, payload: 'Error fetching movies' };
    const expectedState = {
      ...initialState,
      loading: false,
      error: 'Error fetching movies',
    };

    expect(moviesReducer(initialState, action)).toEqual(expectedState);
  });

  test('fetchMovies thunk works correctly with mocked API', async () => {
    const store = mockStore({ movies: initialState });
    const searchTerm = 'Inception';

    fetch.mockResponseOnce(JSON.stringify({
      Search: [
        { Title: 'Inception', Year: '2010', imdbID: 'tt1375666', Poster: 'inception.jpg' },
      ],
      Response: 'True',
    }));

    await act(async () => {
      await store.dispatch(fetchMovies(searchTerm));
    });

    const actions = store.getActions();
    expect(actions[0].type).toBe(fetchMovies.pending.type);
    expect(actions[1].type).toBe(fetchMovies.fulfilled.type);
    expect(actions[1].payload).toEqual([
      { Title: 'Inception', Year: '2010', imdbID: 'tt1375666', Poster: 'inception.jpg' },
    ]);
  });

  test('fetchMovies thunk handles errors correctly', async () => {
    const store = mockStore({ movies: initialState });
    const searchTerm = 'InvalidMovie';

    fetch.mockRejectOnce(new Error('Network Error'));

    await act(async () => {
      await store.dispatch(fetchMovies(searchTerm));
    });

    const actions = store.getActions();
    expect(actions[0].type).toBe(fetchMovies.pending.type);
    expect(actions[1].type).toBe(fetchMovies.rejected.type);
    expect(actions[1].payload).toBeDefined();
  });

  test('should set loading to true when fetching movie details', () => {
    const action = { type: fetchMovieDetails.pending.type };
    const expectedState = {
      ...initialState,
      detailsLoading: true,
      detailsError: null,
    };
    expect(moviesReducer(initialState, action)).toEqual(expectedState);
  });

  test('should store movie details on successful fetch', () => {
    const mockMovieDetails = {
      Title: 'Inception',
      Year: '2010',
      imdbID: 'tt1375666',
    };

    const action = { type: fetchMovieDetails.fulfilled.type, payload: mockMovieDetails };
    const expectedState = {
      ...initialState,
      detailsLoading: false,
      movieDetails: mockMovieDetails,
    };

    expect(moviesReducer(initialState, action)).toEqual(expectedState);
  });

  test('should set detailsError on failed movie details fetch', () => {
    const action = { type: fetchMovieDetails.rejected.type, payload: 'Error fetching movie details' };
    const expectedState = {
      ...initialState,
      detailsLoading: false,
      detailsError: 'Error fetching movie details',
    };

    expect(moviesReducer(initialState, action)).toEqual(expectedState);
  });

  test('fetchMovieDetails thunk works correctly with mocked API', async () => {
    const store = mockStore({ movies: initialState });
    const movieId = 'tt1375666';

    fetch.mockResponseOnce(JSON.stringify({
      Title: 'Inception',
      Year: '2010',
      imdbID: 'tt1375666',
    }));

    await act(async () => {
      await store.dispatch(fetchMovieDetails(movieId));
    });

    const actions = store.getActions();
    expect(actions[0].type).toBe(fetchMovieDetails.pending.type);
    expect(actions[1].type).toBe(fetchMovieDetails.fulfilled.type);
    expect(actions[1].payload).toEqual({
      Title: 'Inception',
      Year: '2010',
      imdbID: 'tt1375666',
    });
  });

  test('fetchMovies thunk handles errors correctly', async () => {
    const store = mockStore({ movies: initialState });
    const searchTerm = 'InvalidMovie';

    fetch.mockRejectOnce(new Error('Network Error'));

    await act(async () => {
        await store.dispatch(fetchMovies(searchTerm));
    });

    const actions = store.getActions();
    expect(actions[0].type).toBe(fetchMovies.pending.type);
    expect(actions[1].type).toBe(fetchMovies.rejected.type);
    expect(actions[1].payload).toEqual(expect.any(String)); // Ensure payload is a string error message
});

});
