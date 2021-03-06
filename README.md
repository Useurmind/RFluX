RFluxx - Flux in Typescript with RxJS
============================

## Docs

See the docs at https://rfluxx.readthedocs.io

Framework that implements the Flux pattern applied in many React apps using RxJS.

This framework basically provides two classes:
- Actions which are subjects
- Stores which are behaviour subjects

A UI component (exemplary implemented with react) can bind to the stores which are observables of their state.

When a user interaction must be handled the UI components can call an action on the stores which in turn will update its state.

## Install core library

    npm i rfluxx

Usage by importing:

```typescript
import { /* ... */ } from "rfluxx";
```

## Install routing library

    npm i rfluxx-routing

Usage by importing:

```typescript
import { /* ... */ } from "rfluxx-routing";
```

## Build and Run

Prerequisites:

    npm install -g lerna

In root:

    lerna bootstrap

In packages/rfluxx:

    npm run lint  // to execute tslint
    npm run test  // to execute karma
    npm run build // to execute tsc
    npm run start // to execute webpack-dev-server

In packages/rfluxx-routing:

    npm run lint  // to execute tslint
    npm run test  // to execute karma
    npm run build // to execute tsc
    npm run start // to execute webpack-dev-server

## License

MIT, see [LICENSE](LICENSE.MD)
