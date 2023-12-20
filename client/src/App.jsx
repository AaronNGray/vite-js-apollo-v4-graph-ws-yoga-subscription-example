import React from 'react';
import gql from 'graphql-tag';
import { Query } from '@apollo/client/react/components';

const GET_MESSAGES = gql`
  query {
    messages {
      id
      content
    }
  }
`;

const MESSAGE_CREATED = gql`
  subscription {
    messageCreated {
      id
      content
    }
  }
`;

const App = () => (
  <Query query={GET_MESSAGES}>
    {({ data, loading, subscribeToMore }) => {
      if (loading) {
        console.log("Loading ...");
        return <span>Loading ...</span>;
      }

      if (!data) {
        console.log("!data");
        return null;
      }

      return (
        <Messages
          messages={data.messages}
          subscribeToMore={subscribeToMore}
        />
      );
    }}
  </Query>
);

class Messages extends React.Component {
  componentDidMount() {
    console.log("Messages:componentDidMount()");
    this.props.subscribeToMore({
      document: MESSAGE_CREATED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        return {
          messages: [
            ...prev.messages,
            subscriptionData.data.messageCreated,
          ],
        };
      },
    });
  }

  render() {
    console.log("Messages:render()");
    return (
      <>
        <h1>Test</h1>
        <ul>
          {this.props.messages.map(message => (
            <li key={message.id}>{message.content}</li>
          ))}
        </ul>
      </>
    );
  }
}

export default App;
