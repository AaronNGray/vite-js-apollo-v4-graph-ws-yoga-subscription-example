import React from 'react';
import * as ReactDOM from 'react-dom/client';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

import App from './App';

const httpLink = new HttpLink({
  uri: 'https://localhost/graphql'
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'wss://localhost/graphql'
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
)
