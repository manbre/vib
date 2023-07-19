import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css"; /* !important! must be after import of App */
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { api } from "./features/api";
import sourceReducer from "./features/source";
import typeReducer from "./features/type";
import videoReducer from "./features/video";

const store = configureStore({
  reducer: {
    source: sourceReducer,
    type: typeReducer,
    video: videoReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
