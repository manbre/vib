import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; /* !important! must be after import of App */
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { api } from "./features/api";
import videoReducer from "./features/video";
import viewReducer from "./features/view";
import reportWebVitals from "./reportWebVitals";

const store = configureStore({
  reducer: {
    video: videoReducer,
    view: viewReducer,
    //
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App   />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
