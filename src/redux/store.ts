import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api-slice";
import authReducer from "./auth/auth-slice";

/**
 * Builds a fresh store. The App Router runs Server Components per request, so a
 * module-singleton store would leak state across concurrent SSR requests — the
 * StoreProvider calls this once per request instead. Letting `configureStore`
 * infer its own type (no `EnhancedStore` annotation) keeps `RootState` and
 * `useSelector` properly typed instead of collapsing to `any`.
 */
export const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

  // Enables refetch-on-focus / refetch-on-reconnect behaviour for RTK Query.
  setupListeners(store.dispatch);

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
