import React from "react";
import {
  createClient,
  Provider,
  dedupExchange,
  fetchExchange,
  cacheExchange,
  subscriptionExchange
} from "urql";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { Todos } from "./Todos";
import { getToken } from "./utils";
import { Login } from "./Login";

const subscriptionClient = new SubscriptionClient(
  "wss://k1ths.sse.codesandbox.io/graphql",
  {}
);

const subscriptions = subscriptionExchange({
  forwardSubscription: operation => subscriptionClient.request(operation)
});

const client = createClient({
  url: "https://k1ths.sse.codesandbox.io/",
  exchanges: [dedupExchange, cacheExchange, fetchExchange, subscriptions],
  fetchOptions: () => {
    const token = getToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }
});

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    () => !!getToken()
  );

  return (
    <Provider value={client}>
      {isAuthenticated ? (
        <Todos setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <Login setIsAuthenticated={setIsAuthenticated} />
      )}
    </Provider>
  );
};
