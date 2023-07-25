import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css"; /* !important! must be after import of App */
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { backend } from "./features/backend";
import eventReducer from "./features/event";
import sourceReducer from "./features/source";
import videoReducer from "./features/video";
import viewReducer from "./features/view";

const store = configureStore({
  reducer: {
    source: sourceReducer,
    view: viewReducer,
    video: videoReducer,
    event: eventReducer,
    [backend.reducerPath]: backend.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(backend.middleware),
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
