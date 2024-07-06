# Frameworks
This project aims to test out different frontend frameworks by building three different mini applications and seeing how each framework handles things such as reactivity, developer experience, etc.

## Frontend Frameworks
The current frameworks being tested include:
- Lit
- Solid-JS
- Vue JS

## Package Manager
The project uses `npm` to manage package dependencies and also uses the workspaces feature of `package.json`.

### Install Dependencies
The top-level `package.json` file includes shared dependencies and each `package.json` file in the `packages/<subpackage>` folders include their own dependencies.

To install a dependency in a subpackage, run the following command:

```
npm i -w @frameworks/<name> <dependency>[ <dependency>]
```

where `<name>` is the name of the subpackage such as `lit` or `vue` and `<dependency>` is the dependency that should be installed.

### Run a Package
In order to run one of the subpackages, use the following command:

```
npm run -w @frameworks/<name> dev
```

where `<name>` is the name of the subpackage such as `lit` or `vue`.

## Technology
All of the mini applications are written using Typescript for type checking and use the most bleeding edge JavaScript and CSS features currently available.

### CSS
- CSS Nesting
- Container Queries

### JavaScript
- Promise.withResolvers

## Browser Support
This project is supported by the following browsers:
- Applie Safari 17.4+
- Google Chrome 119+
- Microsoft Edge 119+
- Mozilla Firefox 121+

[Browserslist](https://browsersl.ist/#q=firefox+%3E%3D+121%0Achrome+%3E%3D+119%0Aedge+%3E%3D+119%0Asafari+%3E%3D+17.4%0Aios_saf+%3E%3D+17.4&region=alt-na)
