var _ = require('lodash');
var hanson = require('hanson');

/**
* Take a string, array of strings, or objects and merge into one Sift compatible filter
* @param {array|string|Object} args... Arguments to merge
*/
var shorthand = function(...args) {
	var q = {};

	// Adopt settings {{{
	var settings = {...shorthand.defaults};
	if (args.length > 1 && _.isObject(args[args.length - 1])) { // Assume last argument is options
		_.merge(settings, args[args.length - 1]);
		args.pop();
	}
	// }}}

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
					if (!arg) return;
					var assigner = settings.stringAssignments.find(v => {
						if (!v.compiled) v.compiled = new RegExp('^(?<a>.+?)\\s*(?<assigner>' + shorthand.escapeRegExp(v.id) + ')\\s*(?<b>.+)$'); // Compile searcher if we don't have one already
						return v.compiled.test(arg);
					});
					if (assigner) {
						var bits = assigner.compiled.exec(arg);
						settings.merge(q,
							assigner.exec(bits.groups.a,
								settings.stringAssignmentGuessType
									? shorthand.guessType(bits.groups.b)
									: bits.groups.b, bits.groups.assigner
							)
						);
					} else {
						if (settings.throw) throw new Error(`Unknown string expression "${arg}"`);
					}
				})
		}
	});

	return q;
};


shorthand.values = function(...args) {
	var q = {};

	// Adopt settings {{{
	var settings = {...shorthand.defaults};
	if (args.length > 1 && _.isObject(args[args.length - 1])) { // Assume last argument is options
		_.merge(settings, args[args.length - 1]);
		args.pop();
	}
	// }}}

	return shorthand(...args, {
		stringAssignments: settings.stringAssignments.filter(a => a.values),
	});
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
			_.set(subject, k, shorthand.guessType(v))
		)
	);

	return subject;
};


/**
* Attempt to correctly guess the value type from context
* @param {string} input The value to guess the type of
* @returns {*} The input value with a guessed type
*/
shorthand.guessType = input =>
	!_.isString(input) ? input // Already typecast into JS primative
	: isFinite(input) ? parseFloat(input)
	: input == 'true' ? true
	: input == 'false' ? false
	: input;



/**
* Utility function to escape a string to be RegExp safe
* @param {string} input The input string to escape
* @returns {string} The escaped input string
*/
shorthand.escapeRegExp = input => input.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')


shorthand.defaults = {
	throw: true,
	merge: shorthand.mergeDotted, // Use shorthand.mergeDotted to honor dotted notation or _.merge for a simple merge
	hanson: true,
	isJSON: v => /^{.*}$/.test(v),
	stringAssignmentGuessType: true,
	stringAssignments: [
		// Arguments are evaluated in order so longer arguments with negation need to go first (i.e. `!=` should come before '=')
		{id: '!=', exec: (a, b) => ({[a]: {$ne: b}})},
		{id: '===null', compiled: /(?<a>.+)===null/, exec: a => ({[a]: null})},
		{id: '===undefined', compiled: /(?<a>.+)===undefined/, exec: a => ({[a]: undefined})},
		{id: '==', exec: (a, b) => ({[a]: b})},
		{id: '~=', exec: (a, b) => ({[a]: {$regex: b}})},
		{id: '~=', exec: (a, b) => ({[a]: {$regex: b}})},
		{id: '/=', exec: (a, b) => ({[a]: {$regex: b}})},
		{id: '^=', exec: (a, b) => ({[a]: {$regex: '^' + b}})},
		{id: '$=', exec: (a, b) => ({[a]: {$regex: b + '$'}})},
		{id: '![]=', exec: (a, b) => ({[a]: {$nin: b}})},
		{id: '[]=', exec: (a, b) => ({[a]: {$in: b}})},
		{id: '#=', exec: (a, b) => ({[a]: {$size: b}})},
		{id: '#>=', exec: (a, b) => ({[`${a}.${b}`]: {$exists: true}})},
		{id: '#>', exec: (a, b) => ({[`${a}.${b+1}`]: {$exists: true}})},
		{id: '>=', exec: (a, b) => ({[a]: {$gte: parseFloat(b)}})},
		{id: '<=', exec: (a, b) => ({[a]: {$lte: parseFloat(b)}})},
		{id: '>', exec: (a, b) => ({[a]: {$gt: parseFloat(b)}})},
		{id: '<', exec: (a, b) => ({[a]: {$lt: parseFloat(b)}})},
		{id: '=', exec: (a, b) => ({[a]: b}), values: true},
		{id: 'false', compiled: /^!(?<a>.+)$/, exec: a => ({[a]: false}), values: true},
		{id: 'true', compiled: /^(?<a>.+)$/, exec: a => ({[a]: true}), values: true},
	],
	stringSplit: /\s*,\s*/,
};

module.exports = shorthand;
