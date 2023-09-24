# Exercise 6: Advanced type policy

In this exercise, we will creating an advanced type policy that will allow us to handle cached data for an oddly designed field in our GraphQL schema. We will be using a lesser-known feature of Apollo's `read` and `merge` functions to accomplish this.

## Setup

1. Install dependencies
   ```
   yarn
   ```
2. Start the app
   ```
   yarn rw dev
   ```

You should now be running the app in the same state as you saw in [exercise 5](https://github.com/jerelmiller/redwoodjs-conf-2023-workshop/tree/main/05-update-list-after-mutation) which allows you to add and remove liked tracks with a direct cache write.

## Challenge

We have one last issue with our app which is that as I like and unlike a track, the heart icon next to the track is not properly updated to reflect the current state. We can see our track is properly added or removed from the liked songs page, but we'd really like the heart icon to display properly.

We'd like to fix this issue so that we can like or unlike a track from anywhere in our app.

By the end of this exercise, our app should behave like the following:

![06-liked-songs.gif](./web/public/06-liked-songs.gif)

## Exercise

In this exercise, we will be adding both `read` and `merge` functions to our type policy that will allow us to read and write the data for this field.

Our schema however is designed a bit oddly which makes caching this data tricky. Our schema contains a `tracksContains` field on the `CurrentUser` type which takes an array of IDs as an argument and returns an array of booleans. As we've learned with `keyFields`, by default Apollo will cache each combination of arguments separately in the cache. If we wanted to ask our cache if a specific track is liked, leaving it this way means we have to know the exact set of IDs used to query for the booleans.

We could set `keyArgs` to false, but doing so means that as I load different lists of IDs, the data gets overwritten. Worse yet, we have no way to know which boolean value corresponds to which ID.
