(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("extend"));
	else if(typeof define === 'function' && define.amd)
		define(["extend"], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeExpandCollapse"] = factory(require("extend"));
	else
		root["cytoscapeExpandCollapse"] = factory(root["extend"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {



module.exports.rootNodes = nodes => nodes.filter(ele => ele.isOrphan() && ele.isParent());

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
module.exports.relativePosInParent = node => {
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
  nodes.positions(node => {
    return {
      x: node.position('x') + positionDelta.x,
      y: node.position('y') + positionDelta.y
    };
  });
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const collapseNodes = __webpack_require__(3);
const expandNodes = __webpack_require__(4);

module.exports = (cy, defaults) => {
  return {

    collapse(eles, opts = null) {
      if (opts == null) {
        opts = defaults;
      }

      collapseNodes(cy, eles, opts);
    },

    expand(eles, opts = null) {
      if (opts == null) {
        opts = defaults;
      }

      expandNodes(cy, eles, opts);
    },

    // should return a new collection if the data field doesnt exist
    getCollapsedChildren(node) {
      return node.data('expandcollapse-collapsed-children');
    }
  };
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const collectionUtil = __webpack_require__(0);

// relevant options:
//  - recursive
// TODO create recursive version
const collapseNodes = (cy, opts, eles) => {
  const roots = collectionUtil.rootNodes(eles.nodes());

  roots.forEach(root => {
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

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const collectionUtil = __webpack_require__(0);

// relevant opts:
//  - fisheye
//  - animate
const expandNodes = (cy, eles, opts) => {
  eles.forEach(ele => {
    expandNode(cy, ele, opts);
  });
};

const expandNode = node => {
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

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const extend = __webpack_require__(2);

const expandCollapseAPI = __webpack_require__(1);

// registers the extension on a cytoscape lib ref
let register = function (cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  const defaults = {
    fisheye: true, // expand the surrounding area of the graph when expanding a node or shrink the area when collapsing
    animate: true, // animate drawing changes during fisheye
    recursive: false // apply expand/collapse operations recursively
  };

  cytoscape('core', 'expandCollapse', function (opts) {
    let cy = this;
    let apiOpts = extend({}, defaults, opts);

    return expandCollapseAPI(cy, apiOpts);
  });
};

if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape);
}

module.exports = register;

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAzYzEzODFkNDkyZGI1MDcxYWEzMSIsIndlYnBhY2s6Ly8vLi9zcmMvZXhwYW5kY29sbGFwc2UvY29sbGVjdGlvblV0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V4cGFuZGNvbGxhcHNlL2luZGV4LmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImV4dGVuZFwiIiwid2VicGFjazovLy8uL3NyYy9leHBhbmRjb2xsYXBzZS9jb2xsYXBzZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXhwYW5kY29sbGFwc2UvZXhwYW5kLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwicm9vdE5vZGVzIiwibm9kZXMiLCJmaWx0ZXIiLCJlbGUiLCJpc09ycGhhbiIsImlzUGFyZW50IiwiZ2V0Tm9kZXNJblByb3hpbWl0eSIsImN5Iiwibm9kZSIsInNpYmxpbmdzIiwib3JwaGFucyIsImRpZmZlcmVuY2UiLCJyZWxhdGl2ZVBvc0luUGFyZW50IiwicGFyZW50IiwicG9zSW5QYXJlbnQiLCJ4IiwicG9zaXRpb24iLCJ5IiwiaXNDaGlsZCIsInJlbGF0aXZlUG9zaXRpb24iLCJvdXRlcldpZHRoIiwib3V0ZXJIZWlnaHQiLCJtb3ZlTm9kZXMiLCJwb3NpdGlvbkRlbHRhIiwicG9zaXRpb25zIiwiY29sbGFwc2VOb2RlcyIsInJlcXVpcmUiLCJleHBhbmROb2RlcyIsImRlZmF1bHRzIiwiY29sbGFwc2UiLCJlbGVzIiwib3B0cyIsImV4cGFuZCIsImdldENvbGxhcHNlZENoaWxkcmVuIiwiZGF0YSIsImNvbGxlY3Rpb25VdGlsIiwicm9vdHMiLCJmb3JFYWNoIiwicm9vdCIsImNvbGxhcHNlTm9kZSIsInRyaWdnZXIiLCJjb2xsYXBzZWRDb2xsZWN0aW9uIiwiZGVzY2VuZGFudHMiLCJuZWlnaGJvdXJob29kIiwicmVtb3ZlIiwiZXhwYW5kTm9kZSIsInBvc0RpZmYiLCJyZXN0b3JlIiwicmVtb3ZlRGF0YSIsImV4dGVuZCIsImV4cGFuZENvbGxhcHNlQVBJIiwicmVnaXN0ZXIiLCJjeXRvc2NhcGUiLCJmaXNoZXllIiwiYW5pbWF0ZSIsInJlY3Vyc2l2ZSIsImFwaU9wdHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQzlEQUEsT0FBT0MsT0FBUCxDQUFlQyxTQUFmLEdBQTRCQyxLQUFELElBQVdBLE1BQU1DLE1BQU4sQ0FBY0MsR0FBRCxJQUFTQSxJQUFJQyxRQUFKLE1BQWtCRCxJQUFJRSxRQUFKLEVBQXhDLENBQXRDOztBQUVBO0FBQ0E7QUFDQTtBQUNBUCxPQUFPQyxPQUFQLENBQWVPLG1CQUFmLEdBQXFDLENBQUNDLEVBQUQsRUFBS0MsSUFBTCxLQUFjO0FBQ2pELE1BQUlDLFdBQVdELEtBQUtDLFFBQUwsRUFBZjs7QUFFQSxNQUFJRCxLQUFLSixRQUFMLEVBQUosRUFBcUI7QUFDbkJLLGVBQVdGLEdBQUdOLEtBQUgsR0FBV1MsT0FBWCxHQUFxQkMsVUFBckIsQ0FBZ0NI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QjRCLFdBQWpCLEM7Ozs7OztBQ2hDQSxNQUFNc0IsU0FBUyxtQkFBQXZCLENBQVEsQ0FBUixDQUFmOztBQUVBLE1BQU13QixvQkFBb0IsbUJBQUF4QixDQUFRLENBQVIsQ0FBMUI7O0FBRUE7QUFDQSxJQUFJeUIsV0FBVyxVQUFVQyxTQUFWLEVBQXFCO0FBQ2xDLE1BQUksQ0FBQ0EsU0FBTCxFQUFnQjtBQUFFO0FBQVMsR0FETyxDQUNOOztBQUUxQixRQUFNeEIsV0FBVztBQUNmeUIsYUFBUyxJQURNLEVBQ0c7QUFDbEJDLGFBQVMsSUFGTSxFQUVHO0FBQ2xCQyxlQUFXLEtBSEksQ0FHRztBQUhILEdBQWpCOztBQU1BSCxZQUFXLE1BQVgsRUFBbUIsZ0JBQW5CLEVBQXFDLFVBQVVyQixJQUFWLEVBQWdCO0FBQ25ELFFBQUl4QixLQUFLLElBQVQ7QUFDQSxRQUFJaUQsVUFBVVAsT0FBTyxFQUFQLEVBQVdyQixRQUFYLEVBQXFCRyxJQUFyQixDQUFkOztBQUVBLFdBQU9tQixrQkFBa0IzQyxFQUFsQixFQUFzQmlELE9BQXRCLENBQVA7QUFDRCxHQUxEO0FBTUgsQ0FmRDs7QUFpQkEsSUFBSSxPQUFPSixTQUFQLEtBQXFCLFdBQXpCLEVBQXNDO0FBQUU7QUFDdENELFdBQVVDLFNBQVY7QUFDRDs7QUFFRHRELE9BQU9DLE9BQVAsR0FBaUJvRCxRQUFqQixDIiwiZmlsZSI6ImN5dG9zY2FwZS1leHBhbmQtY29sbGFwc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJleHRlbmRcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wiZXh0ZW5kXCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImN5dG9zY2FwZUV4cGFuZENvbGxhcHNlXCJdID0gZmFjdG9yeShyZXF1aXJlKFwiZXh0ZW5kXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJjeXRvc2NhcGVFeHBhbmRDb2xsYXBzZVwiXSA9IGZhY3Rvcnkocm9vdFtcImV4dGVuZFwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzJfXykge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDUpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDNjMTM4MWQ0OTJkYjUwNzFhYTMxIiwiXG5cbm1vZHVsZS5leHBvcnRzLnJvb3ROb2RlcyA9IChub2RlcykgPT4gbm9kZXMuZmlsdGVyKChlbGUpID0+IGVsZS5pc09ycGhhbigpICYmIGVsZS5pc1BhcmVudCgpKTtcblxuLy8gZ2V0IGFsbCBub2RlcyB0aGF0IGFyZSBhdCB0aGUgc2FtZSAnbGV2ZWwnXG4vLyBjaGlsZCBub2RlIC0+IGdldCB0aGUgY2hpbGQgc2libGluZ3Ncbi8vIG9ycGhhbiBub2RlIC0+IGdldCBhbGwgdG9wIGxldmVsIG5vZGVzXG5tb2R1bGUuZXhwb3J0cy5nZXROb2Rlc0luUHJveGltaXR5ID0gKGN5LCBub2RlKSA9PiB7XG4gIGxldCBzaWJsaW5ncyA9IG5vZGUuc2libGluZ3MoKTtcblxuICBpZiAobm9kZS5pc09ycGhhbigpKSB7XG4gICAgc2libGluZ3MgPSBjeS5ub2RlcygpLm9ycGhhbnMoKS5kaWZmZXJlbmNlKG5vZGUpO1xuICB9XG4gXG4gIHJldHVybiBzaWJsaW5ncztcbn07XG5cbi8vIHJldHVybiB0aGUgbm9kZXMgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIHBhcmVudFxuLy8gcmV0dXJuIG5vZGVzIG9yaWdpbmFsIHBvc2l0aW9uIGlmIGl0IGlzIGEgY2hpbGRcbm1vZHVsZS5leHBvcnRzLnJlbGF0aXZlUG9zSW5QYXJlbnQgPSAobm9kZSkgPT4ge1xuICBjb25zdCBwYXJlbnQgPSBub2RlLnBhcmVudCgpO1xuICBjb25zdCBwb3NJblBhcmVudCA9IHtcbiAgICB4OiBub2RlLnBvc2l0aW9uKCd4JyksXG4gICAgeTogbm9kZS5wb3NpdGlvbigneScpXG4gIH07XG5cbiAgaWYgKG5vZGUuaXNDaGlsZCgpKSB7XG4gICAgcG9zSW5QYXJlbnQueCA9IG5vZGUucmVsYXRpdmVQb3NpdGlvbigneCcpICsgcGFyZW50Lm91dGVyV2lkdGgoKSAvIDI7XG4gICAgcG9zSW5QYXJlbnQueSA9IG5vZGUucmVsYXRpdmVQb3NpdGlvbigneScpICsgcGFyZW50Lm91dGVySGVpZ2h0KCkgLyAyO1xuICB9XG5cbiAgcmV0dXJuIHBvc0luUGFyZW50O1xufTtcblxuLy8gbW92ZSBlYWNoIG5vZGUgaW4gbm9kZXMgYW5kIGVhY2ggb2YgdGhlaXIgZGVzY2VuZGFudHMgYnkgYSBwb3NpdGlvbiBkZWx0YVxubW9kdWxlLmV4cG9ydHMubW92ZU5vZGVzID0gKG5vZGVzLCBwb3NpdGlvbkRlbHRhKSA9PiB7XG4gIG5vZGVzLnBvc2l0aW9ucygobm9kZSkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICB4OiBub2RlLnBvc2l0aW9uKCd4JykgKyBwb3NpdGlvbkRlbHRhLngsXG4gICAgICB5OiBub2RlLnBvc2l0aW9uKCd5JykgKyBwb3NpdGlvbkRlbHRhLnlcbiAgICB9O1xuICB9KTtcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2V4cGFuZGNvbGxhcHNlL2NvbGxlY3Rpb25VdGlsLmpzIiwiY29uc3QgY29sbGFwc2VOb2RlcyA9IHJlcXVpcmUoJy4vY29sbGFwc2UnKTtcbmNvbnN0IGV4cGFuZE5vZGVzID0gcmVxdWlyZSgnLi9leHBhbmQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoY3ksIGRlZmF1bHRzKSA9PiB7XG4gIHJldHVybiB7XG5cbiAgICBjb2xsYXBzZSAoZWxlcywgb3B0cz1udWxsKSB7XG4gICAgICBpZiAob3B0cyA9PSBudWxsKSB7IG9wdHMgPSBkZWZhdWx0czsgfVxuXG4gICAgICBjb2xsYXBzZU5vZGVzKGN5LCBlbGVzLCBvcHRzKTtcbiAgICB9LFxuXG4gICAgZXhwYW5kIChlbGVzLCBvcHRzPW51bGwpIHtcbiAgICAgIGlmIChvcHRzID09IG51bGwpIHsgb3B0cyA9IGRlZmF1bHRzOyB9XG4gICAgXG4gICAgICBleHBhbmROb2RlcyhjeSwgZWxlcywgb3B0cyk7XG4gICAgfSxcbiAgICBcbiAgICAvLyBzaG91bGQgcmV0dXJuIGEgbmV3IGNvbGxlY3Rpb24gaWYgdGhlIGRhdGEgZmllbGQgZG9lc250IGV4aXN0XG4gICAgZ2V0Q29sbGFwc2VkQ2hpbGRyZW4gKG5vZGUpIHtcbiAgICAgIHJldHVybiBub2RlLmRhdGEoJ2V4cGFuZGNvbGxhcHNlLWNvbGxhcHNlZC1jaGlsZHJlbicpO1xuICAgIH1cbiAgfTtcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2V4cGFuZGNvbGxhcHNlL2luZGV4LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzJfXztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImV4dGVuZFwiXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IGNvbGxlY3Rpb25VdGlsID0gcmVxdWlyZSgnLi9jb2xsZWN0aW9uVXRpbC5qcycpO1xuXG4vLyByZWxldmFudCBvcHRpb25zOlxuLy8gIC0gcmVjdXJzaXZlXG4vLyBUT0RPIGNyZWF0ZSByZWN1cnNpdmUgdmVyc2lvblxuY29uc3QgY29sbGFwc2VOb2RlcyA9IChjeSwgb3B0cywgZWxlcykgPT4ge1xuICBjb25zdCByb290cyA9IGNvbGxlY3Rpb25VdGlsLnJvb3ROb2RlcyhlbGVzLm5vZGVzKCkpO1xuXG4gIHJvb3RzLmZvckVhY2goKHJvb3QpID0+IHtcbiAgICBjb2xsYXBzZU5vZGUobm9kZSwgb3B0cyk7XG4gIH0pO1xufTtcblxuY29uc3QgY29sbGFwc2VOb2RlID0gKG5vZGUsIG9wdHMpID0+IHtcbiAgbm9kZS5kYXRhKCdleHBhbmRjb2xsYXBzZS5wb3MtYmVmb3JlJywgbm9kZS5wb3NpdGlvbigpKTtcbiAgbm9kZS5kYXRhKCdleHBhbmRjb2xsYXBzZS5zaXplLWJlZm9yZScsIHsgXG4gICAgeDogbm9kZS5vdXRlcldpZHRoKCksIFxuICAgIHk6IG5vZGUub3V0ZXJIZWlnaHQoKSBcbiAgfSk7XG5cbiAgbm9kZS50cmlnZ2VyKCdleHBhbmRjb2xsYXBzZS5iZWZvcmUtY29sbGFwc2UnKTtcblxuICBjb25zdCBjb2xsYXBzZWRDb2xsZWN0aW9uID0gbm9kZS5kZXNjZW5kYW50cygpLm5laWdoYm91cmhvb2QoKTtcbiAgbm9kZS5kYXRhKCdleHBhbmRjb2xsYXBzZS5jb2xsYXBzZWQtY29sbGVjdGlvbicsIGNvbGxhcHNlZENvbGxlY3Rpb24pO1xuICBjb2xsYXBzZWRDb2xsZWN0aW9uLnJlbW92ZSgpO1xuXG4gIG5vZGUudHJpZ2dlcignZXhwYW5kY29sbGFwc2UuYWZ0ZXItY29sbGFwc2UnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29sbGFwc2VOb2RlcztcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZXhwYW5kY29sbGFwc2UvY29sbGFwc2UuanMiLCJjb25zdCBjb2xsZWN0aW9uVXRpbCA9IHJlcXVpcmUoJy4vY29sbGVjdGlvblV0aWwnKTtcblxuLy8gcmVsZXZhbnQgb3B0czpcbi8vICAtIGZpc2hleWVcbi8vICAtIGFuaW1hdGVcbmNvbnN0IGV4cGFuZE5vZGVzID0gKGN5LCBlbGVzLCBvcHRzKSA9PiB7XG4gIGVsZXMuZm9yRWFjaCgoZWxlKSA9PiB7XG4gICAgZXhwYW5kTm9kZShjeSwgZWxlLCBvcHRzKTtcbiAgfSk7XG59O1xuXG5cbmNvbnN0IGV4cGFuZE5vZGUgPSAobm9kZSkgPT4ge1xuICBjb25zdCBwb3NEaWZmID0ge1xuICAgIHg6IG5vZGUucG9zaXRpb24oJ3gnKSAtIG5vZGUuZGF0YSgnZXhwYW5kY29sbGFwc2UucG9zLWJlZm9yZScpLngsXG4gICAgeTogbm9kZS5wb3NpdGlvbigneScpIC0gbm9kZS5kYXRhKCdleHBhbmRjb2xsYXBzZS5wb3MtYmVmb3JlJykueVxuICB9O1xuXG4gIG5vZGUudHJpZ2dlcignZXhwYW5kY29sbGFwc2UuYmVmb3JlLWV4cGFuZCcpO1xuXG4gIG5vZGUuZGF0YSgnZXhwYW5kY29sbGFwc2UuY29sbGFwc2VkLWNvbGxlY3Rpb24nKS5yZXN0b3JlKCk7XG4gIGNvbGxlY3Rpb25VdGlsLm1vdmVOb2Rlcyhub2RlLmRlc2NlbmRhbnRzKCksIHBvc0RpZmYpO1xuXG4gIG5vZGUucmVtb3ZlRGF0YSgnZXhwYW5kY29sbGFwc2UucG9zLWJlZm9yZScpO1xuICBub2RlLnJlbW92ZURhdGEoJ2V4cGFuZGNvbGxhcHNlLnNpemUtYmVmb3JlJyk7XG4gIG5vZGUucmVtb3ZlRGF0YSgnZXhwYW5kY29sbGFwc2UuY29sbGFwc2VkLWNvbGxlY3Rpb24nKTtcblxuXG4gIG5vZGUudHJpZ2dlcignZXhwYW5kY29sbGFwc2UuYWZ0ZXItZXhwYW5kJyk7XG4gIFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBhbmROb2RlcztcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZXhwYW5kY29sbGFwc2UvZXhwYW5kLmpzIiwiY29uc3QgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyk7XG5cbmNvbnN0IGV4cGFuZENvbGxhcHNlQVBJID0gcmVxdWlyZSgnLi9leHBhbmRjb2xsYXBzZScpO1xuXG4vLyByZWdpc3RlcnMgdGhlIGV4dGVuc2lvbiBvbiBhIGN5dG9zY2FwZSBsaWIgcmVmXG5sZXQgcmVnaXN0ZXIgPSBmdW5jdGlvbiggY3l0b3NjYXBlICl7XG4gIGlmKCAhY3l0b3NjYXBlICl7IHJldHVybjsgfSAvLyBjYW4ndCByZWdpc3RlciBpZiBjeXRvc2NhcGUgdW5zcGVjaWZpZWRcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgZmlzaGV5ZTogdHJ1ZSwgICAgLy8gZXhwYW5kIHRoZSBzdXJyb3VuZGluZyBhcmVhIG9mIHRoZSBncmFwaCB3aGVuIGV4cGFuZGluZyBhIG5vZGUgb3Igc2hyaW5rIHRoZSBhcmVhIHdoZW4gY29sbGFwc2luZ1xuICAgICAgYW5pbWF0ZTogdHJ1ZSwgICAgLy8gYW5pbWF0ZSBkcmF3aW5nIGNoYW5nZXMgZHVyaW5nIGZpc2hleWVcbiAgICAgIHJlY3Vyc2l2ZTogZmFsc2UgIC8vIGFwcGx5IGV4cGFuZC9jb2xsYXBzZSBvcGVyYXRpb25zIHJlY3Vyc2l2ZWx5XG4gICAgfVxuXG4gICAgY3l0b3NjYXBlKCAnY29yZScsICdleHBhbmRDb2xsYXBzZScsIGZ1bmN0aW9uKCBvcHRzICl7XG4gICAgICBsZXQgY3kgPSB0aGlzO1xuICAgICAgbGV0IGFwaU9wdHMgPSBleHRlbmQoe30sIGRlZmF1bHRzLCBvcHRzKTtcblxuICAgICAgcmV0dXJuIGV4cGFuZENvbGxhcHNlQVBJKGN5LCBhcGlPcHRzKTtcbiAgICB9ICk7XG59O1xuXG5pZiggdHlwZW9mIGN5dG9zY2FwZSAhPT0gJ3VuZGVmaW5lZCcgKXsgLy8gZXhwb3NlIHRvIGdsb2JhbCBjeXRvc2NhcGUgKGkuZS4gd2luZG93LmN5dG9zY2FwZSlcbiAgcmVnaXN0ZXIoIGN5dG9zY2FwZSApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlZ2lzdGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==