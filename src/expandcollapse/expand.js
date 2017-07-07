const collectionUtil = require('./collectionUtil');

// relevant opts:
//  - fisheye
//  - animate
const expandNodes = (cy, eles, opts) => {
  eles.forEach((ele) => {
    expandNode(cy, ele, opts);
  });
};


const expandNode = (node) => {
  const posDiff = {
    x: node.position('x') - node.data('expandcollapse.pos-before').x,
    y: node.position('y') - node.data('expandcollapse.pos-before').y
  };

  node.trigger('expandcollapse.before-expand');

  node.data('expandcollapse.collapsed-collection').restore();
  collectionUtil.moveNodes(node.descendants(), posDiff);

  node.removeData('expandcollapse.pos-before');
  node.removeData('expandcollapse.size-before');
  node.removeData('expandcollapse.collapsed-collection');


  node.trigger('expandcollapse.after-expand');
  
};

module.exports = expandNodes;