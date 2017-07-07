const extend = require('extend');

const expandCollapseAPI = require('./expandcollapse');

// registers the extension on a cytoscape lib ref
let register = function( cytoscape ){
  if( !cytoscape ){ return; } // can't register if cytoscape unspecified

    const defaults = {
      fisheye: true,    // expand the surrounding area of the graph when expanding a node or shrink the area when collapsing
      animate: true,    // animate drawing changes during fisheye
      recursive: false  // apply expand/collapse operations recursively
    }

    cytoscape( 'core', 'expandCollapse', function( opts ){
      let cy = this;
      let apiOpts = extend({}, defaults, opts);

      return expandCollapseAPI(cy, apiOpts);
    } );
};

if( typeof cytoscape !== 'undefined' ){ // expose to global cytoscape (i.e. window.cytoscape)
  register( cytoscape );
}

module.exports = register;
