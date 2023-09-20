# Exercise 1: Component fragments

In this exercise, we will explore how to utilize GraphQL [fragments](https://graphql.org/learn/queries/#fragments) with components to declare their own data needs.

**Reference:** [Fragment colocation](https://www.apollographql.com/docs/react/data/fragments#colocating-fragments)

## Goal

Our goal is to convert the individual cells inside [`web/src/workshop/components`](https://github.com/jerelmiller/redwoodjs-conf-2023-workshop/tree/main/01-component-fragments/web/src/workshop/components) into components that use GraphQL fragments to declare data needs. Rather than having each comopnent fetch its own data, we want to reduce the number of network requests needed to build the UI.

You will find each of these individual cells used inside the [`PlaybarCell` component](https://github.com/jerelmiller/redwoodjs-conf-2023-workshop/blob/main/01-component-fragments/web/src/workshop/components/PlaybarCell/PlaybarCell.tsx). Because of its current component design, we have introduced a network waterfall that we want to get rid of.
