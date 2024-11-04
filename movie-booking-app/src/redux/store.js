import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import bookingsReducer from './bookingsSlice';
import moviesReducer from './moviesSlice';
import moviesDetailReducer from './movieDetailsSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedBookingsReducer = persistReducer(persistConfig, bookingsReducer);

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    movieDetails: moviesDetailReducer,
    bookings: persistedBookingsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
