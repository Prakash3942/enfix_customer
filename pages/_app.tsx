import "../styles/globals.css";
import * as React from "react";
import { Provider } from "react-redux";
// import App from "../app/modules/app/presentation";
import { store } from "../src/store/store";
import App from "../src/modules/app";
// import {store} from "../app/core/store/store";

function MyApp(props: any) {
  return (
    <Provider store={store}>
      <App {...props} />
    </Provider>
  );
}

export default MyApp;
