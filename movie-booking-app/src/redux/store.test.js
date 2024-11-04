import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { fetchMovies } from './moviesSlice'; // Your action creator
import { fetchMock } from 'jest-fetch-mock';

fetchMock.enableMocks();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('fetchMovies action', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    fetch.resetMocks();
  });

  it('should fetch movies successfully', async () => {
    fetch.mockResponseOnce(JSON.stringify({ Search: [{ Title: 'Inception', Year: '2010' }] }));

    await store.dispatch(fetchMovies('Inception'));

    const actions = store.getActions();
    const expectedAction = {
      type: fetchMovies.fulfilled.type,
      payload: [{ Title: 'Inception', Year: '2010' }],
    };

    expect(actions).toEqual([expectedAction]);
  });

  it('should handle fetch error', async () => {
    fetch.mockRejectOnce(new Error('Fetch error'));

    await store.dispatch(fetchMovies('Inception'));

    const actions = store.getActions();

    const rejectedAction = actions.find(action => action.type === fetchMovies.rejected.type);
    
    expect(rejectedAction).toEqual(
      expect.objectContaining({
        type: fetchMovies.rejected.type,
        payload: expect.any(String),
      })
    );
  });
});
