var expect = require('chai').expect;
var ss = require('..');

describe('Basic object merging', ()=> {

	it('should parse simple JS inputs', ()=> {
		expect(ss({foo: 'Foo!'})).to.deep.equal({foo: 'Foo!'});
		expect(ss({foo: 'Foo!'}, {bar: 123}, '')).to.deep.equal({foo: 'Foo!', bar: 123});
		expect(ss({'foo.bar.baz': 'nested'}, {'foo.quz': 123}, 0)).to.deep.equal({foo: {bar: {baz: 'nested'}, quz: 123}});
	});

	it('should parse simple object syntax', ()=> {
		expect(ss('{"foo":"Foo!"}')).to.deep.equal({foo: 'Foo!'});
		expect(ss('{"foo":"Foo!"}', '{"bar":123}')).to.deep.equal({foo: 'Foo!', bar: 123});
		expect(ss('{"foo.bar.baz":"nested"}', '{"foo.quz":123}')).to.deep.equal({foo: {bar: {baz: 'nested'}, quz: 123}});
	});


	it('should support HanSON object syntax', ()=> {
		expect(ss('{foo:"Foo!"}')).to.deep.equal({foo: 'Foo!'});
		expect(ss('{foo:"Foo!"}', '{bar:123}')).to.deep.equal({foo: 'Foo!', bar: 123});
		expect(ss('{"foo.bar.baz":"nested"}', '{"foo.quz":123}')).to.deep.equal({foo: {bar: {baz: 'nested'}, quz: 123}});
	});
});


describe('Query syntax', ()=> {

	it('should support string queries', ()=> {
		expect(ss('foo=Foo!')).to.deep.equal({foo: 'Foo!'});
		expect(ss('foo=Foo!,bar=123')).to.deep.equal({foo: 'Foo!', bar: 123});
		expect(ss('foo!=Foo!')).to.deep.equal({foo: {$ne: 'Foo!'}});
		expect(ss('foo!=123')).to.deep.equal({foo: {$ne: 123}});
		expect(ss('status=active')).to.deep.equal({status: 'active'});
	})

	it('should support boolean queries', ()=> {
		expect(ss('foo')).to.deep.equal({foo: true});
		expect(ss('!foo')).to.deep.equal({foo: false});
		expect(ss('foo?')).to.deep.equal({foo: {$exists: true}});
		expect(ss('foo!?')).to.deep.equal({foo: {$exists: false}});
	});

	it('should support number queries', ()=> {
		expect(ss('foo<123')).to.deep.equal({foo: {$lt: 123}});
		expect(ss('foo<=123')).to.deep.equal({foo: {$lte: 123}});
		expect(ss('foo>123')).to.deep.equal({foo: {$gt: 123}});
		expect(ss('foo>=123')).to.deep.equal({foo: {$gte: 123}});
	});

	it('should support RegEx queries', ()=> {
		expect(ss('foo~=bar')).to.deep.equal({foo: {$regex: 'bar'}});
		expect(ss('foo/=bar')).to.deep.equal({foo: {$regex: 'bar'}});
		expect(ss('foo^=bar')).to.deep.equal({foo: {$regex: '^bar'}});
		expect(ss('foo$=bar')).to.deep.equal({foo: {$regex: 'bar$'}});
	});

	it('should support array queries', ()=> {
		expect(ss('foo[]=123')).to.deep.equal({foo: {$in: [123]}});
		expect(ss('foo[]=1|2|3|4|5|6')).to.deep.equal({foo: {$in: [1, 2, 3, 4, 5, 6]}});
		expect(ss('foo![]=123')).to.deep.equal({foo: {$nin: [123]}});
		expect(ss('foo![]=1|2|3|4|5|6')).to.deep.equal({foo: {$nin: [1, 2, 3, 4, 5, 6]}});
		expect(ss('foo#=3')).to.deep.equal({foo: {$size: 3}});
		expect(ss('foo#>4')).to.deep.equal({'foo.5': {$exists: true}});
		expect(ss('foo#>=5')).to.deep.equal({'foo.5': {$exists: true}});
	});

	it('should support type queries', ()=> {
		expect(ss('foo===null')).to.deep.equal({foo: null});
		expect(ss('foo===undefined')).to.deep.equal({foo: undefined});
	});

	it('should support combined values', ()=> {
		expect(ss('foo=Foo!,bar= bar , baz=Hello World,quz=\'Hello \'World\',flarp=123')).to.deep.equal({foo: 'Foo!', bar: 'bar', baz: 'Hello World', quz: 'Hello \'World', flarp: 123});
		expect(ss('foo[]=1|2|3 or three|four maybe five')).to.deep.equal({foo: {$in: [1, 2, '3 or three', 'four maybe five']}});

	});

	it('should support disabling of HanSON rewriting', ()=> {
		expect(ss('{foo:"Foo!"}', {mergeJSON: Object.assign})).to.deep.equal({'foo': 'Foo!'});
		expect(ss('{"foo.bar.baz":"nested"}', '{"foo.quz":123}', {mergeJSON: Object.assign})).to.deep.equal({'foo.bar.baz': 'nested', 'foo.quz': 123});
	});

});
