# Simple Aviasales application (test task)
## [Live demo](https://a-simo.github.io/aviasales-test-task/)
The application is a list of tickets with filters and sorting. The application uses backend [server](https://github.com/KosyanMedia/test-tasks/blob/master/aviasales_frontend/server.md) for getting random data.
The [description](https://github.com/KosyanMedia/test-tasks/tree/master/aviasales_frontend) of test task.

The application is written with **Vue 3 (Composition API), Typescript, and Vite**.

The template uses Vue 3 `<script setup>` [SFCs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup).

## Recommended extensions
- Prettier
- Eslint
- Volar

## Commands
### Project setup
`yarn install`

### Running a dev server
`yarn dev`

### Bundling a project
`yarn build`


## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases, this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.