# RedwoodJS Conf 2023 Apollo Client Workshop

Welcome to the RedwoodJS Conf 2023 Apollo Client Workshop!

In this workshop, we will be working with a scaled down version of Apollo's [Spotify Showcase](https://github.com/apollographql/spotify-showcase) built with Redwood. This app should provide enough complexity to get a more "real world" feel for the kinds of situations you may find yourself in with your own apps.

In this workshop, we will be learning more about GraphQL fragments and the Apollo cache. We will cover topics such as:

- Utilizing GraphQL fragments with components to declare their data needs
- Using the cache as a state manager by using GraphQL fragments to query against the cache
- Using type policies to declare singleton types and why this can be beneficial

TODO NEED TO FINISH THIS LIST

## Before you arrive...

Before you arrive for the workshop, I ask that you work through the [setup](#setup) steps below to ensure we can hit the ground running. We have a good amount of material to cover and this will help ensure a smooth start to the workshop.

The setup steps will ensure that you're able to get the app up and running. This includes getting the database up and running, seeding the database with some initial data, and personalizing the workshop for you. This is crucial as it provides setup that will be shared by the rest of the exercises.

## Setup

Like Redwood, this workshop requires [Node.js](https://nodejs.org/en/) >= 18.x and [Yarn](https://yarnpkg.com/) >= 1.15. Please ensure these versions are installed on your machine.

To get started, clone this repo onto your machine.

```sh
git clone https://github.com/jerelmiller/redwoodjs-conf-2023-workshop.git
```

Once cloned, navigate to the [`00-setup` folder](./00-setup/) and follow the instructions in the [README.md](./00-setup/README.md) to get the app up and running.

TODO add note about devtools

## Exercises

Each exercise is designed to build on the previous one. Because this app is complex with a good number of components that make up the UI, code that we interact with throughout the exercise will be available in the `web/src/workshop` folder. You're free to browse the other components and code that make up the app, but modifying anything outside `web/src/workshop` isn't necessary to complete the exercise.

> **NOTE:** In earlier exercises, you might start interacting with the app in a way that feels broken (e.g. a UI element not updating quite as you expect after an interaction). This is designed that way! Throughout each exercise, we will update various of our application to "fix" these issues. By the end, we should have a functioning app that works more like you'd expect.

While working through this workshop, **DO NOT STRESS** if you are unable to complete each exercise in its totality before we move onto the next one. Each exercise will contain solutions from the previous one to make sure you don't get stuck in a state that makes it impossible to continue with the workshop. If you find yourself out of time, I highly encourage you to come back to try and complete the exercises on your own.

Each exercise contains a few shared concepts throughout the workshop:

**README.md**

The README.md file in each exercise will provide the instructions for the exercise. It will contain material such as the goal of the exercise, links to documentation useful for the exercise, and references to code that we will be working with.

This README.md is also rendered on the home page of the running Redwood app when logged out.

**Setup script**

Each exercise has its own setup script that will run on `postinstall` when Yarn completes installation. The setup script is responsible for linking shared files from the [`00-setup`](./00-setup/) folder into that exercise, such as the database and workshop config. By linking to the same database for each exercise, this should make it possible for changes to persist throughout every exercise and avoids the need to run migrations/seeds in each exercise. This script will also run any other step needed for the exercise to function.

If you find that the `postinstall` script did not run for whatever reason, you can manually run the setup script yourself using the following command:

```sh
yarn rw exec setup
```

**Reset script**

Each exercise contains its own reset script to put your database back into a state that makes it easier to work with the exercise. Each exercise will call out specifically what the reset script will do. To run the reset script, run the following command:

```
yarn rw exec reset
```

> **NOTE:** This script **DOES NOT** fully reset your database to its initial state. If you prefer to reset your database in full, use `prisma` to do so:
>
> ```sh
> yarn rw prisma migrate reset
> ```
>
> Resetting your database in full may require you to login to the app in the exercise again to reset cookies.
