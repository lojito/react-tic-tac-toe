import { ApolloProvider, HttpLink } from "@apollo/client";
import { InMemoryCache } from "@apollo/client/cache";
import { ApolloClient } from "@apollo/client/core";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.scss";
import DictionaryContextProvider from "./contexts/dictionary/DictionaryContextProvider";
import LanguageContextProvider from "./contexts/language/LanguageContextProvider";
// import * as serviceWorker from './serviceWorker';

const cache = new InMemoryCache();
const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
  cache,
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <LanguageContextProvider>
        <DictionaryContextProvider>
          <App />
        </DictionaryContextProvider>
      </LanguageContextProvider>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
