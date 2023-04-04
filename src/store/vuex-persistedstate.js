var r = function (r) {
  return function (r) {
    return !!r && "object" == typeof r
  }(r) && ! function (r) {
    var t = Object.prototype.toString.call(r);
    return "[object RegExp]" === t || "[object Date]" === t || function (r) {
      return r.$$typeof === e
    }(r)
  }(r)
},
  e = "function" == typeof Symbol && Symbol.for ? Symbol.for("react.element") : 60103;

function t(r, e) {
  return !1 !== e.clone && e.isMergeableObject(r) ? u(Array.isArray(r) ? [] : {}, r, e) : r
}

function n(r, e, n) {
  return r.concat(e).map(function (r) {
    return t(r, n)
  })
}

function o(r) {
  return Object.keys(r).concat(function (r) {
    return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(r).filter(function (e) {
      return r.propertyIsEnumerable(e)
    }) : []
  }(r))
}

function c(r, e) {
  try {
    return e in r
  } catch (r) {
    return !1
  }
}

function u(e, i, a) {
  (a = a || {}).arrayMerge = a.arrayMerge || n, a.isMergeableObject = a.isMergeableObject || r, a.cloneUnlessOtherwiseSpecified = t;
  var f = Array.isArray(i);
  return f === Array.isArray(e) ? f ? a.arrayMerge(e, i, a) : function (r, e, n) {
    var i = {};
    return n.isMergeableObject(r) && o(r).forEach(function (e) {
      i[e] = t(r[e], n)
    }), o(e).forEach(function (o) {
      (function (r, e) {
        return c(r, e) && !(Object.hasOwnProperty.call(r, e) && Object.propertyIsEnumerable.call(r, e))
      })(r, o) || (i[o] = c(r, o) && n.isMergeableObject(e[o]) ? function (r, e) {
        if (!e.customMerge) return u;
        var t = e.customMerge(r);
        return "function" == typeof t ? t : u
      }(o, n)(r[o], e[o], n) : t(e[o], n))
    }), i
  }(e, i, a) : t(i, a)
}
u.all = function (r, e) {
  if (!Array.isArray(r)) throw new Error("first argument should be an array");
  return r.reduce(function (r, t) {
    return u(r, t, e)
  }, {})
};
var i = u;

function a(r) {
  var e = (r = r || {}).storage || window && window.localStorage,
    t = r.key || "vuex";

  function n(r, e) {
    var t = e.getItem(r);
    try {
      return "string" == typeof t ? JSON.parse(t) : "object" == typeof t ? t : void 0
    } catch (r) { }
  }

  function o() {
    return !0
  }

  function c(r, e, t) {
    return t.setItem(r, JSON.stringify(e))
  }

  function u(r, e) {
    return Array.isArray(e) ? e.reduce(function (e, t) {
      return function (r, e, t, n) {
        return !/^(__proto__|constructor|prototype)$/.test(e) && ((e = e.split ? e.split(".") : e.slice(0)).slice(0, -1).reduce(function (r, e) {
          return r[e] = r[e] || {}
        }, r)[e.pop()] = t), r
      }(e, t, (n = r, void 0 === (n = ((o = t).split ? o.split(".") : o).reduce(function (r, e) {
        return r && r[e]
      }, n)) ? void 0 : n));
      var n, o
    }, {}) : r
  }

  function a(r) {
    return function (e) {
      return r.subscribe(e)
    }
  } (r.assertStorage || function () {
    e.setItem("@@", 1), e.removeItem("@@")
  })(e);
  var f, s = function () {
    return (r.getState || n)(t, e)
  };
  return r.fetchBeforeUse && (f = s()),
    function named(n) {
      r.fetchBeforeUse || (f = s()), "object" == typeof f && null !== f && (n.replaceState(r.overwrite ? f : i(n.state, f, {
        arrayMerge: r.arrayMerger || function (r, e) {
          return e
        },
        clone: !1
      })), (r.rehydrated || function () { })(n)), (r.subscriber || a)(n)(function (n, i) {
        (r.filter || o)(n) && (r.setState || c)(t, (r.reducer || u)(i, r.paths), e)
      })
    }
}
export default a;
//# sourceMappingURL=vuex-persistedstate.js.map