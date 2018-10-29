# RFluxx

## Motivation

I wrote some blog posts that should cover the idea and motivation behind the framework:

- https://useurmind.de/RFluXX-Flux-in-Typescript-with-Rx/
- https://useurmind.de/RFluXX-Middleware/

## Core concepts

The core concepts that you need to understand to work with the framework are the following:

- __Stores__: Stores keep track of the state of a part of the UI of your app. They are implemented as an observable that can be subscribed by components to be updated when the state changes.
- __Actions__: Actions are usually provided by stores (but this is not always true) to allow components to communicate with them. Actions trigger state changes in the stores and can be handed an argument to describe details of the action.

## Advanced concepts

There are however some more advanced concepts that if understood can help you use the more interesting features of the framework.

- __Middleware__: The framework allows you to attach middleware to all actions that are executed. Middleware can be anything from logging to ignoring the action altogether.
- __Time Travel__: If the action pattern is applied correctly you can time travel and rewind the actions that the user performed when interacting with the UI.
    - __Action Events__:
    - __Replay__
    - 
- 