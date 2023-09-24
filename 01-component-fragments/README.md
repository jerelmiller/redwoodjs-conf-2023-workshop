# Exercise 1: Component fragments

In this exercise, we will explore how to utilize GraphQL [fragments](https://graphql.org/learn/queries/#fragments) with components to declare their own data needs. This will allow us to reduce the number of network requests to the server needed to render our UI and improve the overall UX.

## Setup

1. Install dependencies
   ```
   yarn
   ```
2. Start the app
   ```
   yarn rw dev
   ```

You should now be running the app in the same state as you saw it in the [setup step](https://github.com/jerelmiller/redwoodjs-conf-2023-workshop/tree/main/00-setup).

## Challenge

In this exercise, we have several components that make up the app's playbar that are rendered using cells. Each cell is responsible for loading a small bit of of data from the server to properly display the playback state. This is causing quite a few network requests and our overall UX in the playbar suffers as a result because each of these components finish loading their data at separate times. Worse yet, these components are rendered inside another cell, named `PlaybarCell`, which fetches some data on its own. This is causing a network waterfall since our individual cells won't be able to start fetching their own data until the `PlaybarCell` has completed its request.

Our goal is to convert each of these individual cells to a regular component that declares its data needs via a GraphQL fragment. This data will then be passed from the parent component via props to these components.

By the end of the exercise, we should be able to load all the data needed to render the playbar in a single query (the `PlaybarQuery`) by using the fragments declared with the components. We should also see an improved user experience since the data for the playbar is loaded together in a single query.

## Exercise

You will be working in the [`web/src/workshop/components`](https://github.com/jerelmiller/redwoodjs-conf-2023-workshop/tree/main/01-component-fragments/web/src/workshop/components) directory. Here you will find the [`PlaybarCell` component](https://github.com/jerelmiller/redwoodjs-conf-2023-workshop/blob/main/01-component-fragments/web/src/workshop/components/PlaybarCell/PlaybarCell.tsx) which renders a the other cells which can be found in the same directory.

Convert each these cells into a component that declares a fragment, then add that fragment to the `PlaybarQuery` in `PlaybarCell`. Don't forget to pass the data from `PlaybarCell` to the updated component!

**DO NOT WORRY** if you are unable to convert all of the components before we move onto the next exercise. The number of components to convert for this exercise is for repetition and practice with this technique. If you do finish within the time limit, note there are a few more components in `web/src/components` that are not in the `workshop` folder. Feel free to convert these as well for extra practice.

## Step-by-step

We will be using Apollo's recommended approach to [colocating fragments](https://www.apollographql.com/docs/react/data/fragments#colocating-fragments) with components which uses a `fragments` static property on the component to declare the fragment definitions. This approach is **not a requirement** to use fragments in this manner within Apollo Client. It is ok if you prefer a different approach, such as named exports, to export the fragment definitions.

> NOTE: This workshop will not be using Apollo's [fragment registry](https://www.apollographql.com/docs/react/data/fragments#registering-named-fragments-using-createfragmentregistry) for fragment registration, which provide a bit nicer developer experience. I encourage you to explore this utility yourself. Be on the lookout for some announcements from the Redwood team sometime soon in this regard 🙂.

We will start by adding a fragment to a component by creating a `fragments` static property on the component itself. Its value will be an object which will allow us to add named properties for each fragment definition.

```ts
const PlayControlCell = () => {
  // JSX
}

PlayControlCell.fragments = {}
```

Now we can start adding fragment definitions to this component using the `gql` function. I recommend naming object keys the same as the prop name that will receive the data.

In this example, we want some data for the `PlaybackState` type in our component. We are first going to add a prop named `playbackState` that will receieve the data. We will also add a `playbackState` key to the `fragments` object with a value equal to an empty `gql` function. We will be declaring our fragment definition in the next step.

```ts
interface PlayControlCellProps {
  // playbackState is nullable so we want to account for that and handle the fallback.
  // Note also that the type matches the name of our fragment.
  playbackState: PlayControlCell_playbackState | null | undefined
}

const PlayControlCell = ({ playbackState }) => {
  // JSX
}

PlayControlCell.fragments = {
  playbackState: gql``,
}
```

Now we will add the fragment definition. We are going to use a naming convention of `ComponentName_propName` which makes it easy to understand which component declares the fragment and which prop will receive the data.

> **Note:** this naming scheme is merely a convention I prefer to and is not a requirement for this pattern. You may prefer a different naming scheme for your fragment definitions and that is perfectly ok.

Let's go ahead add the fragment definition to our `gql` function. We are going to select the `isPlaying` field to allow our `PlayControlCell` to determine whether the music is actively playing or paused.

```ts
PlayControlCell.fragments = {
  playbackState: gql`
    fragment PlayControlCell_playbackState on PlaybackState {
      isPlaying
    }
  `,
}
```

With the fragment definition in place, its time to add it our our query. Open up `PlaybarCell`, find the GraphQL query, and add the fragment definition under the `playbackState` field. We will also need to ensure the fragment definition is included in the query. We can use string interpolation syntax for this.

> NOTE: It is ok to remove the `__typename` field. This was included as a starting point to demonstrate the request waterfall.

```ts
// PlaybarCell.ts
export const QUERY = gql`
  query PlaybarQuery {
    me {
      player {
        playbackState {
          ...PlayControlCell_playbackState
        }
      }
    }
  }

  ${PlayControlCell.fragments.playbackState}
`
```

Notice here how the naming convention makes it easy to determine which component has a data requirement in our graph and which prop will receive that data.

With that in place, we now need to make sure to pass this data to the component.

```ts
// PlaybarCell.ts
export const Success = ({
  me,
}: CellSuccessProps<PlaybarQuery, PlaybarQueryVariables>) => {
  return (
    // ...
    <PlayControlCell playbackState={me.player.playbackState} />
    // ...
  )
}
```

And thats it! We've now got a component that can now express its data needs via the fragment declaration.
