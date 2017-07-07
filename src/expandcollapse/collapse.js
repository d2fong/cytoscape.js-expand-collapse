const collectionUtil = require('./collectionUtil.js');

// relevant options:
//  - recursive
// TODO create recursive version
const collapseNodes = (cy, opts, eles) => {
  const roots = collectionUtil.rootNodes(eles.nodes());

  roots.forEach((root) => {
    collapseNode(node, opts);
  });
};

const collapseNode = (node, opts) => {
  node.data('expandcollapse.pos-before', node.position());
  node.data('expandcollapse.size-before', { 
    x: node.outerWidth(), 
    y: node.outerHeight() 
  });

  node.trigger('expandcollapse.before-collapse');

  const collapsedCollection = node.descendants().neighbourhood();
  node.data('expandcollapse.collapsed-collection', collapsedCollection);
  collapsedCollection.remove();

  node.trigger('expandcollapse.after-collapse');
};

module.exports = collapseNodes;