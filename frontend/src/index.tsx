import {
  ColorModeProvider,
  ColorModeScript,
  CSSReset,
  ThemeProvider,
} from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import theme from "./theme";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode="dark" />
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
        <App />
      </ColorModeProvider>
    </ThemeProvider>
  </React.StrictMode>
);
