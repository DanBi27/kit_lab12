import "./styles.css";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import apolloLogger from "apollo-link-logger";

function token() {
  localStorage.setItem("token", prompt("Введите токен", ""));
  window.location.reload();
}

const httpLink = new HttpLink({
  uri: "https://api.github.com/graphql",
  headers: {
    authorization: "Bearer " + localStorage.getItem("token")
  }
});
const link = ApolloLink.from([apolloLogger, httpLink]);

const cache = new InMemoryCache({
  logger: console.log,
  loggerEnabled: true
});

const client = new ApolloClient({
  link,
  cache
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <div align="center">
      <button class="but" onClick={() => token()}>
        Ввести токен
      </button>
    </div>

    <div align="center">
      {localStorage.getItem("token") !== null
        ? "Ваш токен: " + localStorage.getItem("token")
        : "Токен не введён"}
    </div>

    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
