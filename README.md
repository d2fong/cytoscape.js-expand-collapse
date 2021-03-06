cytoscape-expand-collapse
================================================================================


## Description

Expand and collapse operations for compound nodes


## Dependencies

 * Cytoscape.js ^3.0.0
 * <List your dependencies here please>


## Usage instructions

Download the library:
 * via npm: `npm install cytoscape-expand-collapse`,
 * via bower: `bower install cytoscape-expand-collapse`, or
 * via direct download in the repository (probably from a tag).

Import the library as appropriate for your project:

ES import:

```js
import cytoscape from 'cytoscape';
import expand-collapse from 'cytoscape-expand-collapse';

cytoscape.use( expand-collapse );
```

CommonJS require:

```js
let cytoscape = require('cytoscape');
let expand-collapse = require('cytoscape-expand-collapse');

cytoscape.use( expand-collapse ) // register extension
```

AMD:

```js
require(['cytoscape', 'cytoscape-expand-collapse'], function( cytoscape, expand-collapse ){
  expand-collapse( cytoscape ); // register extension
});
```

Plain HTML/JS has the extension registered for you automatically, because no `require()` is needed.


## API

TODO describe the API of the extension here.


## Build instructions

* `npm run build` : Build `./src/**` into `cytoscape-expand-collapse.js`
* `npm run watch` : Automatically build on changes with live reloading (N.b. you must already have an HTTP server running)
* `npm run dev` : Automatically build on changes with live reloading with webpack dev server
* `npm run lint` : Run eslint on the source

N.b. all builds use babel, so modern ES features can be used in the `src`.


## Publishing instructions

This project is set up to automatically be published to npm and bower.  To publish:

1. Build the extension : `npm run build`
1. Bump the version number and tag: `npm version major|minor|patch`
1. Publish to npm: `npm publish .`
1. If publishing to bower for the first time, you'll need to run `bower register cytoscape-expand-collapse https://github.com/d2fong&#x2F;cytoscape-expand-collapse.git`
