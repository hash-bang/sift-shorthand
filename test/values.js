var expect = require('chai').expect;
var ss = require('..');

describe('siftShorthand.values()', ()=> {

	it('should extract simple value sets', ()=> {
		expect(ss.values('foo=Foo!')).to.deep.equal({foo: 'Foo!'});
		expect(ss.values({foo: 'Foo!'}, {bar: 123}, '')).to.deep.equal({foo: 'Foo!', bar: 123});
		expect(ss.values({'foo.bar.baz': 'nested'}, {'foo.quz': 123}, 0)).to.deep.equal({foo: {bar: {baz: 'nested'}, quz: 123}});
		expect(ss.values('{"foo":"Foo!"}')).to.deep.equal({foo: 'Foo!'});
		expect(ss.values('{"foo":"Foo!"}', '{"bar":123}')).to.deep.equal({foo: 'Foo!', bar: 123});
		expect(ss.values('{"foo.bar.baz":"nested"}', '{"foo.quz":123}')).to.deep.equal({foo: {bar: {baz: 'nested'}, quz: 123}});
		expect(ss.values('{foo:"Foo!"}')).to.deep.equal({foo: 'Foo!'});
		expect(ss.values('{foo:"Foo!"}', '{bar:123}')).to.deep.equal({foo: 'Foo!', bar: 123});
		expect(ss.values('{"foo.bar.baz":"nested"}', '{"foo.quz":123}')).to.deep.equal({foo: {bar: {baz: 'nested'}, quz: 123}});
		expect(ss.values('foo')).to.deep.equal({foo: true});
		expect(ss.values('!foo')).to.deep.equal({foo: false});
	});

});
