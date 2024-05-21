import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../modules/Login/login.slice";
import appReducer from "../modules/app/slice";

export const store = configureStore({
  reducer: {
    loginData: loginReducer,
    app: appReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export type AppStoreState = ReturnType<typeof store.getState>;
