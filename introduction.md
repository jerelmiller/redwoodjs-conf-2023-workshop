# https://bit.ly/rw-apollo-workshop

<img src="./assets/code.png" alt="code.png" width="200" />

## Introduction

Hello and welcome to the RedwoodJS Conf Apollo workshop! In this workshop, we will be exploring Apollo Client more deeply, covering more advanced usages of Apollo Client and it's cache. My goal is to get you more familiar with these tools to unlock the potential in your apps.

Each exercise in this workshop is contained in its own folder starting with a number (e.g. [01-component-fragments](./01-component-fragments/)). Each of these exercises is its own Redwood app. Once you've completed the [workshop setup](./00-setup/), each exercise can be started as a regular Redwood app.

1. Install dependencies
   ```sh
   yarn
   ```
2. Start the app
   ```sh
   yarn rw dev
   ```

## Schema

### Current user

Much of this workshop will be working with the `CurrentUser` GraphQL object type. This type contains the fields that allow you to get data for the logged in user (that's you!), such as your saved tracks, playback state, etc.

The `CurrentUser` type can be found as the `me` field in the root `Query` type.

```gql
query {
  me {
    profile {
      displayName
    }
  }
}
```

This type does _not_ contain an `id` field, but rather acts as a namespace for data related to the current user. This will be important for some of the exercises in this workshop.

### Pagination

Each list type in this workshop is created using a Relay-like [connection type](https://relay.dev/graphql/connections.htm#sec-Connection-Types) albeit with an offset-based pagination scheme. For example, to query for a playlist's tracks:

```gql
query FindPlaylistQuery($id: ID!, $limit: Int, $offset: Int) {
  # Each paginated type contains a `limit` and `offset` argument
  playlist(id: $id, limit: $limit, offset: $offset) {
    tracks {
      # Pagination information for the list type
      pageInfo {
        total
      }
      # List of edges which may contain information about the relationship between the parent type and the list
      edges {
        # The actual record, in this case `Track`.
        node {
          id
        }
      }
    }
  }
}
```
