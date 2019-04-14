Sift-Shorthand
==============
An expansion library for [Sift](https://github.com/crcn/sift.js#readme) which supports a human readable and CLI compatible syntax.


```javascript
var shorthand = require('sift-shorthand');

// Parse {a: 1} in a variety of ways
shorthand('a=1') // Key/val setting
shorthand(['a=1']) // Key/val setting within an array
shorthand('{"a":1}') // JSON
shorthand('{a:1}') // HanSON


// Parse various types of input
siftShorthand(
	'a=1', // Strings are fine
	['b=2', '{"c":3}'], // Array input with nested types (string + JSON)
	{d: 4}, // Also objects
	{'e.f': 5}, // Also dotted notation nested objects
	'{g: 6}', // Also HanSON format
) //= {a: 1, b: 2, c: 3, d: 4, e: {f: 5}, g: 7}
```


Supported Syntax Types
----------------------
The main API supports simple string, CSV, arrays and a variety of other input types. The below is a quick-reference table for the compatible inputs.


| Name              | Type    | Example input     | Sift Equivalent           | Description                                                   |
|-------------------|---------|-------------------|---------------------------|---------------------------------------------------------------|
| `key=val`         | String  | `foo=bar`         | `{foo: "bar"}`            | Simple key/value assignment                                   |
| `key==val`        |         | `foo==bar`        | `{foo: "bar"}`            | Simple key/value assignment, alternative syntax               |
| `key!=vak`        |         | `foo!=bar`        | `{foo: ${ne: "bar"}}`     | Negation syntax                                               |
| `key`             | Boolean | `foo`             | `{foo: true}`             | Simple boolean flag                                           |
| `!key`            |         | `!foo`            | `{foo: false}`            | Simple negation boolean flag                                  |
| `key<number`      | Number  | `foo<123`         | `{foo: {$lt: 123}}`       | Number is-less-than                                           |
| `key<=number`     |         | `foo<=123`        | `{foo: {$lte: 123}}`      | Number is-less-or-equal-to                                    |
| `key>number`      |         | `foo>123`         | `{foo: {$gt: 123}}`       | Number is-greater-than                                        |
| `key>=number`     |         | `foo>=123`        | `{foo: {$gte: 123}}`      | Number is-greater-or-equal-to                                 |
| `key~=RE`         | RegEx   | `foo!=o`          | `{foo: {$regex: 'o'}}`    | Simple search-anywhere Regular Expression syntax              |
| `key/=RE`         |         | `foo/=o`          | `{foo: {$regex: 'o'}}`    | Simple search-anywhere Regular Expression syntax, alt syntax  |
| `key^=val`        |         | `foo^=bar`        | `{foo: {$regex: '^bar'}}` | String begins-with                                            |
| `key$=val`        |         | `foo$=val`        | `{foo: {$regex: 'bar$'}}` | String ends-with                                              |
| `key[]=val`       | Array   | `foo[]=bar`       | `{foo: {$in: 'bar'}}`     | Checks whether the given value exists within an array         |
| `key![]=val`      |         | `foo[]=bar`       | `{foo: {$nin: 'bar'}}`    | Checks whether the given value does not exist within an array |
| `key===null`      | Types   | `foo===null`      | `{foo: null}`             | Checks against the `null` type                                |
| `key===undefined` |         | `foo===undefined` | `{foo: undefined}`        | Checks against the `undefined` type                           |


**Notes**:

* All fields work with dotted notation and will be expanded in the output. For example `foo.bar.baz=123` becomes `{foo: {bar: {baz: 123}}}`
* [HanSON](https://github.com/timjansen/hanson) is used by default to decode entries that *look* like JSON


API
===

siftShorthand(args...)
--------------------------------
Parse one or more strings, arrays, objects etc. into a single Sift compatible output query.



siftShorthand.defaults
----------------------
Object containing the default values used in the main `siftShorthand()` function.


| Setting                     | Type             | Default                 | Description                                                             |
|-----------------------------|------------------|-------------------------|-------------------------------------------------------------------------|
| `throw`                     | `boolean`        | `true`                  | Whether to throw an error when input JSON / HanSON is invalid           |
| `merge`                     | `function`       | `shorthand.mergeDotted` | The default merge method to use                                         |
| `hanson`                    | `boolean`        | `true`                  | Whether to enable HanSON decoding (slower but easier to use than JSON)  |
| `isJSON`                    | `RegExp`         | See code                | How to determine if an argument is JSON / HanSON                        |
| `stringAssignmentGuessType` | `boolean`        | `true`                  | Try to guess and correct the incoming input type for string assignments |
| `stringAssignments`         | `array <Object>` | See code                | Rules used to assign string assignment tuples                           |
| `stringSplit`               | `RegExp`         | See code                | How to split a string of tuples                                         |