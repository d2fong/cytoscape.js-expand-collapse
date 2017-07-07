const collapseNodes = require('./collapse');
const expand = require('./expand');

module.exports = (cy, defaults) => {
  return {
    collapse (eles, opts=null) {
      if (opts == null) {
        opts = defaults;
      }

      collapseNodes(cy, eles, opts);
    },

    expand (eles, opts=null) {
      if (opts == null) {
        opts = defaults;
      }
    
      expand(cy, eles, opts);
    },
    
    getCollapsedChildren (node) {
      return node.data('expandcollapse-collapsed-children');
    }
  };
};