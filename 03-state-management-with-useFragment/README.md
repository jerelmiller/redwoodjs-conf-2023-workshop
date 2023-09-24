# Exercise 3: State management with the cache via `useFragment`

In this exercise, we will be using GraphQL fragments in a slightly different way. Apollo Client 3.8 added support for a new hook called `useFragment` that we will use as a way to query our cache and bind to cache updates to keep our UI in sync. We will begin to explore how Apollo Client's cache can be used as a state management tool without the need for extra Redwood cells to query to our server for the state.

## Setup

1. Install dependencies
   ```
   yarn
   ```
2. Start the app
   ```
   yarn rw dev
   ```

You should now be running the app in the same state as you saw in [exercise 2](https://github.com/jerelmiller/redwoodjs-conf-2023-workshop/tree/main/02-reusable-components-with-fragments) with the updates to the album tile and track details in place.

## Challenge

In this exercise, we notice that as we start to click around, our app is completely broken. Interacting with any of the playback controls (play, pause, shuffle, etc.) does not update our UI. We can see that the state is properly persisted when we refresh the page, so this isn't our issue.

On top of that, we notice that we have no way to denote the currently playing track anywhere in our UI. We want to make our app more robust by ensuring we stay in sync with the playback state outside of the playbar.

When a track is playing, we want several areas of our UI to update:

- The big green button on the page should become a pause button since we are playing tracks within this playlist.
- The currently playing track name should be highlighted in a green color on the track list to make it easily visible within the playlist.
- The track number should display an animated sound icon when in a play state. When paused, the track number should show.
- The playlist name in the sidebar should be highlighted in a green color to denote that the track is currently playing in this context.
- The playlist in the sidebar should display a speaker icon when in a play state, otherwise hide it when paused.

It should be noted that we want to avoid additional network requests for this data since we already have the data in the cache. This means that we do not want convert our existing components to Redwood cells.

Our goal is to fix the playback behavior so that interacting with playback controls properly updates our UI as well as keeping the areas mentioned above in sync with the playback state.

By the end of this exercise, our UI should look and behave like the following:

![03-final-behavior.gif](./web/public/03-final-behavior.gif)

## Exercise

We will be using GraphQL fragments as a means to query the cache in this exercise. While fragments are typically used as a part of GraphQL queries, Apollo uses them in various ways.

We will be using a new hook in Apollo Client 3.8 called [`useFragment`](https://www.apollographql.com/docs/react/data/fragments/#usefragment) that will allow us to ask our cache for the data and react to updates. Used in this way, fragments can be thought of as a sort of data selector on a specific record in our cache. The cache uses the selection set in the fragment definition to traverse the cache and retrieve the data for us. Because of this, fragments passed to `useFragment` can be arbitrary and do not have to represent an actual fragment in an existing query.

> NOTE: You may decide that fragments used with `useFragment` should be included in your queries to ensure the data will exist in the cache. To keep this exercise simpler, we will not add these fragments to any of our queries.

To keep this exercise simpler, each component declares variables with static values at the top of the component. We will update these static values to use the dynamic values in our cache for this exercise. This way you do not need to find the UI elements or learn the styles that make up our UI for our play/pause states.

As an example, our `PagePlayButton` looks like this:

```ts
const PagePlayButton = ({ disabled, contextUri }: PagePlayButtonProps) => {
  // ...
  const isPlaying = false
  const isCurrentContext = false
  const isPlayingInContext = isPlaying && isCurrentContext
}
```

Here `isPlaying` and `isCurrentContext` are set to the static value `false`. We want to these values to be dynamic and bind to the values in the cache so that as the user plays/pauses playback, our UI updates accordingly. You do not need to update more than these variables in each component for the UI to function correctly.

This exercise will also require us to learn more about [type policies](https://www.apollographql.com/docs/react/caching/cache-configuration#typepolicy-fields) and [customizing cache IDs](https://www.apollographql.com/docs/react/caching/cache-configuration#customizing-cache-ids) which allows us to specify how data in the cache should be represented. Apollo uses a [normalized cache](https://www.apollographql.com/docs/react/caching/overview#data-normalization) which is an important to best understand how data is stored in the cache.
