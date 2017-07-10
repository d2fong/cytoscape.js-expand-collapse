const collapseNodes = require('./collapse');
const expandNodes = require('./expand');

module.exports = (cy, defaults) => {
  return {

    collapse (eles, opts=null) {
      if (opts == null) { opts = defaults; }

      collapseNodes(cy, eles, opts);
    },

    expand (eles, opts=null) {
      if (opts == null) { opts = defaults; }
    
      expandNodes(cy, eles, opts);
    },
    
    // should return a new collection if the data field doesnt exist
    getCollapsedChildren (node) {
      return node.data('expandcollapse-collapsed-children');
    }
  };
};