# cycle-hls.js

* Version 0.0.1

This is a Cycle.js driver to implement hls.js. 

*STILL IN DEVELOPMENT*

## Getting Started

TODO: add notes on how to import the driver and use in a cycle.js app. 

## Contribution guidelines

## How do I get set up?

* Install [nodejs](http://nodejs.org).
* Type `npm i` at the prompt.
* Type `npm run lint` at the prompt to check ts files for lint errors.
* Type `npm test` at the prompt to run unit tests.
* Type `npm start` at the prompt to run the application.
* navigate to localhost:8000 to make sure the app is running.
* Type `npm run build` at the prompt to bundle the driver. Output is in the `build` directory.

## IDE Setup
In the project root dir are two files:

* tslint.json
* .editorconfig

Whatever IDE you are using, let's please install any plugins necessary to work with those so the repo stays consistant

* for vscode: "vscode-tslint" and "EditorConfig for Visual Studio Code"
* for Sublime: "SublimeLinter" with "SublimeLinter-contrib-tslint" and "EditorConfig"

### Style Guides

* All code written in TypeScript must pass the linter
* Declaritive over imperative
* Prefer easily inferable types over explicit
* Interfaces are never a bad thing
* All functions / methods are inferred to be void without an explicit return type
* Keep comments to a minimum and use thoughtfull variable or method names

### Documentation

* Use JSDoc style documentation on all public methods and members

### Unit Tests

* For every public method there should be applicable unit tests
* Tests should be thoughtfully-worded and well structured
* Treat `describe` as a noun or situation
* Treat `it` as a statement about state or how an operation changes state

### Pull Requests

* Develop in a topic branch, not master
* Run `npm run lint` and `npm test` and make sure there are no errors before opening PR
* PR's must be reviewed and approved by atleast one team member before being merged into master
