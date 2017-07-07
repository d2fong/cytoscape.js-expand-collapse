

module.exports.rootNodes = (nodes) => nodes.filter((ele) => ele.isOrphan() && ele.isParent());

// get all nodes that are at the same 'level'
// child node -> get the child siblings
// orphan node -> get all top level nodes
module.exports.getNodesInProximity = (cy, node) => {
  let siblings = node.siblings();

  if (node.isOrphan()) {
    siblings = cy.nodes().orphans().difference(node);
  }
 
  return siblings;
};

// return the nodes position relative to the parent
// return nodes original position if it is a child
module.exports.relativePosInParent = (node) => {
  const parent = node.parent();
  const posInParent = {
    x: node.position('x'),
    y: node.position('y')
  };

  if (node.isChild()) {
    posInParent.x = node.relativePosition('x') + parent.outerWidth() / 2;
    posInParent.y = node.relativePosition('y') + parent.outerHeight() / 2;
  }

  return posInParent;
};

// move each node in nodes and each of their descendants by a position delta
module.exports.moveNodes = (nodes, positionDelta) => {
  nodes.positions((node) => {
    return {
      x: node.position('x') + positionDelta.x,
      y: node.position('y') + positionDelta.y
    };
  });
};