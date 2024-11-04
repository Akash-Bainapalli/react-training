import movieDetailsReducer, { fetchMovieDetails } from './movieDetailsSlice';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { act } from 'react-dom/test-utils';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('movieDetailsSlice', () => {
  const initialState = {
    movieDetails: null,
    loading: false,
    error: null,
  };

  beforeEach(() => {
    fetch.mockClear();
  });

  test('should return the initial state', () => {
    expect(movieDetailsReducer(undefined, {})).toEqual(initialState);
  });

  test('should set loading to true when fetching movie details', () => {
    const action = { type: fetchMovieDetails.pending.type };
    const expectedState = {
      ...initialState,
      loading: true,
    };
    expect(movieDetailsReducer(initialState, action)).toEqual(expectedState);
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
      loading: false,
      movieDetails: mockMovieDetails,
    };

    expect(movieDetailsReducer(initialState, action)).toEqual(expectedState);
  });

  test('should set error on failed fetch', () => {
    const action = { type: fetchMovieDetails.rejected.type, payload: 'Error fetching movie details' };
    const expectedState = {
      ...initialState,
      loading: false,
      error: 'Error fetching movie details',
    };

    expect(movieDetailsReducer(initialState, action)).toEqual(expectedState);
  });

  test('fetchMovieDetails thunk works correctly with mocked API', async () => {
    const store = mockStore({ movieDetails: initialState });
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

  test('fetchMovieDetails thunk handles errors correctly', async () => {
    const store = mockStore({ movieDetails: initialState });
    const movieId = 'invalid_id';

    fetch.mockResponseOnce(JSON.stringify({ Response: 'False', Error: 'Movie not found' }));

    await act(async () => {
      await store.dispatch(fetchMovieDetails(movieId));
    });

    const actions = store.getActions();
    expect(actions[0].type).toBe(fetchMovieDetails.pending.type);
    expect(actions[1].type).toBe(fetchMovieDetails.rejected.type);
    expect(actions[1].payload).toBe('Movie not found');
  });
});
