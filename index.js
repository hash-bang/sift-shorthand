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
			settings.merge(q, arg);
		} else if (_.isString(arg) && settings.isJSON(arg)) {
			try {
				settings.merge(q, settings.hanson ? hanson.parse(arg) : JSON.parse(arg));
			} catch (e) {
				if (settings.throw) throw e;
			}
		} else if (_.isString(arg)) {
			arg
				.split(settings.stringSplit)
				.forEach(arg => {
					var assigner = settings.stringAssignments.find(v => {
						if (!v.compiled) v.compiled = new RegExp('^(?<a>.+?)\s*(?<assigner>' + v.id + ')\s*(?<b>.+)$'); // Compile searcher if we don't have one already
						return v.compiled.test(arg);
					});
					if (assigner) {
						var bits = assigner.compiled.exec(arg);
						settings.merge(q, assigner.exec(bits.groups.a, bits.groups.b, bits.groups.assigner));
					} else {
						if (settings.throw) throw new Error(`Unknown string expression "${arg}"`);
					}
				})
		}
	});

	return q;
};


/**
* Like _.merge() but also processes dotted key values
* @param {Object} subject The subject to merge into
* @param {Object} merges... Additional objects (which may contain dotted keys) to merge into subject
* @returns {Object} The input subject
*/
shorthand.mergeDotted = (subject, ...merges) => {
	merges.forEach(merge =>
		_.forEach(merge, (v, k) =>
			_.set(subject, k,
				! _.isString(v) ? v // Already typecast into JS primative
				: isFinite(v) ? parseFloat(v)
				: v == 'true' ? true
				: v == 'false' ? false
				: v,
			)
		)
	);

	return subject;
};


shorthand.defaults = {
	throw: true,
	merge: shorthand.mergeDotted, // Use shorthand.mergeDotted to honor dotted notation or _.merge for a simple merge
	hanson: true,
	isJSON: v => /^{.*}$/.test(v),
	stringAssignments: [
		{id: '=', exec: (a, b) => ({[a]: b})},
		{id: '==', exec: (a, b) => ({[a]: b})},
		{id: '!=', exec: (a, b) => ({[a]: {$ne: b}})},
		{id: 'true', compiled: /^(?<a>.+)$/, exec: a => ({[a]: true})},
	],
	stringSplit: /\s*,\s*/,
	assignType: v =>
		_.isFinite(v) ? new Number(v)
		: v,
};

module.exports = shorthand;
