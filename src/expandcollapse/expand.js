const collectionUtil = require('./collectionUtil');

// relevant opts:
//  - fisheye
//  - animate
const expandNodes = (eles, opts) => {
  eles.forEach((ele) => {
    expandNode(ele, opts);
  });
};


const expandNode = (eles, opts) => {
  const posDiff = {
    x: node.position('x') - node.data('expandcollapse.pos-before').x,
    y: node.position('y') - node.data('expandcollapse.pos-before').y
  };

  node.trigger('expandcollapse.before-expand');

  node.data('expandcollapse.collapsed-collection').positions(node.position());
  node.data('expandcollapse.collapsed-collection').restore();

  node.removeData('expandcollapse.pos-before');
  node.removeData('expandcollapse.size-before');
  node.removeData('expandcollapse.collapsed-collection');


  node.trigger('expandcollapse.after-expand');
  
};

module.exports = expandNodes;