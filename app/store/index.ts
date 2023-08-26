import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const store = configureStore({
  reducer: { [api.reducerPath]: api.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: {
        ignoredPaths: [api.reducerPath],
      },
    }).concat(api.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

//individual listeners to only handle "visibilitychange" of window
//default listeners did also fire on document focus (page changes)
let listenersInitialized = false;
setupListeners(store.dispatch, (dispatch, actions) => {
  const handleVisibilityChange = () => {
    if (window.document.visibilityState === "visible") {
      dispatch(actions.onFocus());
    } else {
      dispatch(actions.onFocusLost());
    }
  };
  if (!listenersInitialized) {
    // Handle focus events
    window.addEventListener("visibilitychange", handleVisibilityChange, false);
    listenersInitialized = true;
  }
  const unsubscribe = () => {
    window.removeEventListener("visibilitychange", handleVisibilityChange);
    listenersInitialized = false;
  };
  return unsubscribe;
});
