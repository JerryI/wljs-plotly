function _mergeNamespaces(n, m) {
	m.forEach(function (e) {
		e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
			if (k !== 'default' && !(k in n)) {
				var d = Object.getOwnPropertyDescriptor(e, k);
				Object.defineProperty(n, k, d.get ? d : {
					enumerable: true,
					get: function () { return e[k]; }
				});
			}
		});
	});
	return Object.freeze(n);
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var plotly_min$2 = {exports: {}};

/**
* plotly.js v2.26.0
* Copyright 2012-2023, Plotly, Inc.
* All rights reserved.
* Licensed under the MIT license
*/

(function (module, exports) {
	/*! For license information please see plotly.min.js.LICENSE.txt */
} (plotly_min$2));

var plotly_minExports = plotly_min$2.exports;
var plotly_min = /*@__PURE__*/getDefaultExportFromCjs(plotly_minExports);

var plotly_min$1 = /*#__PURE__*/_mergeNamespaces({
	__proto__: null,
	default: plotly_min
}, [plotly_minExports]);

export { plotly_min$1 as p };