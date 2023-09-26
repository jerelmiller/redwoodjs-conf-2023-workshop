# RedwoodJS Conf 2023 Apollo Client Workshop

Welcome to the RedwoodJS Conf 2023 Apollo Client Workshop!

In this workshop, we will be working with a scaled down version of Apollo's [Spotify Showcase](https://github.com/apollographql/spotify-showcase) built with Redwood. This app should provide enough complexity to get a more "real world" feel for the kinds of situations you may find yourself in with your own apps.

> **Note:** A Spotify account is not required for this workshop. The data used in this workshop is persisted to a local database.

This workshop covers 6 exercises:

1. Using GraphQL fragments to enable components to declare their own data needs.
2. Using GraphQL fragments to make components more reusable
3. Querying and reacting to cache updates with the `useFragment` hook
4. Defining type policies to enable infinite scroll
5. Updating a list of tracks after a mutation
6. Combining advanced type policies with `writeFragment` to cover a tricky GraphQL schema design

By the end of this exercise, we should have a fully functioning Spotify app.

## Before you arrive...

Before you arrive for the workshop, I ask that you work through the [setup](#setup) steps below to ensure we can hit the ground running. We have a good amount of material to cover and this will help ensure a smooth start to the workshop.

The setup steps will ensure that you're able to get the app up and running. This includes getting the database up and running, seeding the database with some initial data, and personalizing the workshop for you. This is crucial as it provides setup that will be shared by the rest of the exercises.

## Setup

> Like Redwood, this workshop requires [Node.js](https://nodejs.org/en/) >= 18.x and [Yarn](https://yarnpkg.com/) >= 1.15. Please ensure these versions are installed on your machine.

1. Install [Apollo Client's Devtools](https://github.com/apollographql/apollo-client-devtools) as we will be exploring the cache quite a lot throughout the exercises.
   - [Chrome Web Store](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm)
   - [Firefox Browser Add on](https://addons.mozilla.org/firefox/addon/apollo-developer-tools/)
2. (optional) Install GraphQL Network Inspector which makes it easier to view GraphQL requests and their operation names. This is not required but highly encouraged.

   - [Chrome Web Store](https://chrome.google.com/webstore/detail/graphql-network-inspector/ndlbedplllcgconngcnfmkadhokfaaln)
   - [Firefox Browser Add on](https://addons.mozilla.org/en-US/firefox/addon/graphql-network-inspector/)

3. Fork and clone the repo onto your machine. It's recommended that you add this repo as an upstream dependency so you can pull in any last minute updates.
4. Navigate to the [`00-setup` folder](./00-setup/) and follow the instructions in the [README.md](./00-setup/README.md). This will ensure you can successfully the run app for the workshop.

## Exercises

Each exercise is designed to build on the previous one. Because this app is complex with a good number of components that make up the UI, code that we interact with throughout the exercise will be available in the `web/src/workshop` folder. You're free to browse the other components and code that make up the app, but modifying code outside `web/src/workshop` isn't necessary to complete the exercises.

> **NOTE:** In earlier exercises, you might start interacting with the app in a way that feels broken (e.g. a UI element not updating quite as you expect after an interaction). This is designed that way! Throughout each exercise, we will update various of our application to "fix" these issues. By the end, we should have a functioning app that works more like you'd expect.

While working through this workshop, **IT IS OK** if you are unable to complete each exercise in totality before we move to the next one. Each exercise will contain the solutions from the previous one to ensure you don't get stuck in a way that makes it impossible to continue with the workshop. If you find yourself out of time, I highly encourage you to come back to the exercise and try to complete the exercises on your own.

### Instructions

Each exercise contains its own README.md file with instructions for the exercise content. The README.md content will also be displayed on the _logged out_ home page in case you prefer it in the app itself.

### Exercise setup

Each exercise is its own Redwood app. You will need to install dependencies, then start the Redwood app as you normally would. These instructions are added to the start of each exercise's README.md as well.

Each exercise is also responsible for linking to some shared files that you created in the [workshop setup](./00-setup/) step, such as the database and workshop config. This is run as part of a `postinstall` script for each exercise. In case you are running into issues booting the app, you can run the setup script manually with the following command:

```sh
yarn rw exec setup
```

### Reset playback state

In some exercises, we will be working with Apollo's cache configuration, which include handling cases where playback state is `null`. Once the playback state is created in the workshop exercise, it will remain until you manually clear it. If you'd like to run the exercise with a `null` playback state, you can run the reset script.

```
yarn rw exec reset
```

> **NOTE:** This script **DOES NOT** fully reset your database to its initial state. If you prefer to reset your database in full, use `prisma` to do so:
>
> ```sh
> yarn rw prisma migrate reset
> ```
>
> Resetting your database in full may require you to login to the app in the exercise again to reset cookies. Visit http://localhost:8910/logout to log out of the app to clear cookies, then log in again.

### GraphiQL

You will be able to use GraphiQL to explore the schema, but if you want to query against authenticated fields, you will need to add the necessary headers to GraphiQL.

In the "Headers" section of the GraphiQL interface, copy the following JSON value:

```json
{
  "auth-provider": "custom-auth",
  "cookie": "session=<use browser devtools>",
  "authorization": "Bearer <your user id>"
}
```

You will need to replace the `cookie` and `authorization` values with the values from your browser's devtools. You can find the value of both of these headers for any GraphQL request from the app.
