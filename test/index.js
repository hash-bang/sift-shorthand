var expect = require('chai').expect;
var ss = require('..');

describe('sift-shorthand', ()=> {

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

	it('should support string syntax', ()=> {
		expect(ss('foo=Foo!')).to.deep.equal({foo: 'Foo!'});
		expect(ss('foo=Foo!,bar=123')).to.deep.equal({foo: 'Foo!', bar: 123});
		expect(ss('foo')).to.deep.equal({foo: true});
	});

});
