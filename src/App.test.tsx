import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
import store from "./store";
import { HashRouter } from "react-router-dom";
import { StylesProvider } from "@material-ui/core/styles";
import { Provider } from "react-redux";

test('renders learn react link', () => {
  const { getByText } = render(
      <Provider store={store}>
        <HashRouter>
          <StylesProvider injectFirst>
            <App />
          </StylesProvider>
        </HashRouter>
      </Provider>
  );
  const nowPlaying = getByText("Now Playing");

  expect(nowPlaying).toBeInTheDocument();
});
