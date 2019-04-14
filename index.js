var _ = require('lodash');
var hanson = require('hanson');

/**
* Take a string, array of strings, or objects and merge into one Sift compatible filter
* @param {array|string|Object} args... Arguments to merge
*/
var shorthand = function(...args) {
	var q = {};

	var settings = {
		...shorthand.defaults,
	};

	_.flatten(args).forEach(arg => {
		if (_.isArray(arg)) {
			throw new Error('Dont know how to handle array input');
		} else if (_.isObject(arg)) {
			if (settings.dotObjects) {
				_.forEach(arg, (v, k) => _.set(q, k, v));
			} else {
				settings.merge(q, arg);
			}
		} else if (_.isString(arg) && settings.hanson) {
			try {
				var decoded = settings.hanson ? hanson.parse(arg) : JSON.parse(arg);
				if (settings.dotObjects) {
					_.forEach(decoded, (v, k) => _.set(q, k, v));
				} else {
					settings.merge(q, decoded);
				}
			} catch (e) {
				if (settings.throw) throw e;
			}
		} else if (_.isString(arg)) {
			arg
				.split(settings.stringSplit)
				.forEach(arg => {
					var assigner = _.findIndex(_.keys(settings.stringAssignments), (v, k) => {
						if (!v.compiled) v.compiled = new RegExp('^(?<a>.+?)(?<assigner>' + k + ')(?<b>.+)$'); // Compile searcher if we don't have one already
						var bits = v.compiled.exec(arg);
						console.log('EXTRACTED', bits);
					});
				})
		}
	});

	return q;
};

shorthand.defaults = {
	throw: true,
	merge: _.merge,
	hanson: true,
	isJSON: v => /^{.*}$/.test(v),
	stringAssignments: {
		'=': {exec: (a, b) => ({[a]: b})},
		'==': {exec: (a, b) => ({[a]: b})},
		'!=': {exec: (a, b) => ({[a]: {$ne: b}})},
	},
	stringSplit: /\s*(,|\&\&|\|\|)\s*/,
	dotObjects: true, // Scan object assignments and reparse paths as dotted notation
};

module.exports = shorthand;
