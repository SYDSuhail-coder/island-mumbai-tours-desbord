// import { configureStore } from '@reduxjs/toolkit'
// import rootReducer from './rootReducer'
// import { persistStore } from 'redux-persist'
// const store = configureStore({
//     reducer: rootReducer
// })
// export const persistor = persistStore.store

// export default store


// import { configureStore } from '@reduxjs/toolkit'
// import rootReducer from './rootReducer'
// import { persistStore } from 'redux-persist'

// const store = configureStore({
//   reducer: rootReducer
// })

// export const persistor = persistStore(store)
// export default store


import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { persistStore } from "redux-persist";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
        ],
      },
    }),
});

export const persistor = persistStore(store);
export default store;