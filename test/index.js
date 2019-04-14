var expect = require('chai').expect;
var ss = require('..');

describe('Basic object merging', ()=> {

	it('should parse simple JS inputs', ()=> {
		expect(ss({foo: 'Foo!'})).to.deep.equal({foo: 'Foo!'});
		expect(ss({foo: 'Foo!'}, {bar: 123})).to.deep.equal({foo: 'Foo!', bar: 123});
		expect(ss({'foo.bar.baz': 'nested'}, {'foo.quz': 123})).to.deep.equal({foo: {bar: {baz: 'nested'}, quz: 123}});
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
	})

	it('should support boolean queries', ()=> {
		expect(ss('foo')).to.deep.equal({foo: true});
		expect(ss('!foo')).to.deep.equal({foo: false});
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

	it('should support array quries', ()=> {
		expect(ss('foo[]=123')).to.deep.equal({foo: {$in: 123}});
		expect(ss('foo![]=123')).to.deep.equal({foo: {$nin: 123}});
	});

	it('should support type queries', ()=> {
		expect(ss('foo===null')).to.deep.equal({foo: null});
		expect(ss('foo===undefined')).to.deep.equal({foo: undefined});
	});

});
