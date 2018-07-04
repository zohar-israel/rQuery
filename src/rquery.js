import React from "react";
import ReactDOM from "react-dom";

var stores = {};
var config = { trace: false };

function R$(selector) {
  let ra = selector.split(",");
  let r = getState(ra[0]);
  for (var i = 1; i < ra.length; i++) {
    r = r.concat(getState(ra[i]));
  }
  function arrayUnique(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j]) a.splice(j--, 1);
      }
    }
    return a;
  }

  r = arrayUnique(r);

  r.firstComponent = function() {
    if (this.length > 0) return this[0];
    return { state: {} };
  };

  r.state = r.firstComponent().state;
  r.first = r.firstComponent();
  r.setState = function(state) {
    this.forEach(a => a.setState(state));
    return r;
  };

  r.forceUpdate = function() {
    this.forEach(a => a.forceUpdate());
    return r;
  };

  r.forEachDOMNode = function(callback) {
    this.forEach(elm => callback(ReactDOM.findDOMNode(elm)));
    return r;
  };

  return r;
}
function getState(key, state) {
  if (stores[key]) {
    return stores[key];
  } else return [];
}
R$.configure = function(options) {
  Object.assign(config, options);
};
R$.reset = function() {
  stores = {};
  config = { trace: false };
};
R$.registerComponent = function(elm, key) {
  function _register(id, elm) {
    if (id === null) return;
    if (id.indexOf("className:") === 0) {
      let classes = id.substring(10).split(" ");
      classes.map(c => _register("." + c, elm));
      return;
    }
    if (stores[id]) {
      if (stores[id].indexOf(elm) === -1) stores[id].push(elm);
    } else {
      stores[id] = [elm];
    }
  }

  if (key) _register(key, elm);
  Object.keys(elm.props).map(p =>
    _register(
      p === "id"
        ? "#" + elm.props[p]
        : p === "className"
          ? "className:" + elm.props[p]
          : "[" + p + '="' + elm.props[p] + '"]',
      elm
    )
  );

  Object.keys(elm.props).map(p =>
    _register(
      p === "id"
        ? "#" + elm.props[p]
        : p === "className" ? "className:" + elm.props[p] : null,
      elm
    )
  );
  _register(elm.constructor.name, elm);
  if (config.trace) console.log(stores);
};
R$.setState = function(key, state) {
  if (stores[key]) {
    if (Array.isArray(stores[key])) {
      stores[key].map(s => s.setState(state));
    } else {
      stores[key].setState(state);
    }
  } else if (config.trace) console.warn("Key: " + key + " not mached");
};
R$.unregisterComponent = function(elm) {
  Object.keys(stores).map(s => {
    stores[s] = stores[s].filter(e => e !== elm);
    if (stores[s].length === 0) delete stores[s];
    return true;
  });
};

R$.Component = class extends React.Component {
  componentWillMount() {
    R$.registerComponent(this);
  }
  componentWillUnmount() {
    R$.unregisterComponent(this);
  }
};
React.$Component = R$.Component;

export default R$;
