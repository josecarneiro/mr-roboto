'use strict';

// TEST FUNCTION THAT MATCHES robots.txt RULE WITH URL OR PATH
// SOME EXAMPLE RULES AND PATHS TAKEN FROM
// https://developers.google.com/search/reference/robots_txt#url-matching-based-on-path-values

const { expect } = require('chai');
const { match } = require('./../util');

describe('Match functionality', () => {
  let tests = [
    // EMPTY PATH
    [ '/', '/', true ],
    [ '/', '/?id=1', true ],
    [ '/', '/foo', true ],
    [ '/', '/foo.html', true ],
    [ '/', '/foo/bar', true ],
    [ '/', '/foo/bar.html', true ],
    // EMPTY WITH WILDCARDS
    [ '/*', '/', true ],
    [ '/*', '/foo', true ],
    [ '/*', '/foo/bar', true ],
    [ '/*', '/foo.html', true ],
    [ '/*', '/foo/bar.html', true ],
    // NON-EMPTY PATH
    [ '/foo', '/', false ],
    [ '/foo', '/bar', false ],
    [ '/foo', '/Foo', false ],
    [ '/foo', '/Foo.html', false ],
    [ '/foo', '/foo', true ],
    [ '/foo', '/foo?id=1', true ],
    [ '/foo', '/foo.html', true ],
    [ '/foo', '/foo.html?id=1', true ],
    [ '/foo', '/foo', true ],
    [ '/foo', '/foo/bar', true ],
    [ '/foo', '/foo/bar.html', true ],
    [ '/foo', '/foobar', true ],
    [ '/foo', '/foobar.html', true ],
    [ '/foo', '/foobar/baz', true ],
    [ '/foo', '/foobar/baz.html', true ],
    // NESTED PATH
    [ '/foo/bar', '/', false ],
    [ '/foo/bar', '/foo', false ],
    [ '/foo/bar', '/foo/bar', true ],
    [ '/foo/bar', '/foo/bar?id=1', true ],
    [ '/foo/bar', '/foo/bar.html', true ],
    [ '/foo/bar', '/foo/bar.html?id=1', true ],
    [ '/foo/bar', '/foo/bar', true ],
    // PATHS WITH WILDCARDS
    [ '/foo*', '/', false ],
    [ '/foo*', '/bar', false ],
    [ '/foo*', '/foo', true ],
    [ '/foo*', '/foo?id=1', true ],
    [ '/foo*', '/foo.html', true ],
    [ '/foo*', '/foo.html?id=1', true ],
    [ '/foo*', '/foo/bar', true ],
    [ '/foo*', '/foo/bar.html', true ],
    [ '/foo*', '/foobar', true ],
    [ '/foo*', '/foobar.html', true ],
    [ '/foo*', '/foobar/baz', true ],
    [ '/foo*', '/foobar/baz.html', true ],
    // PATHS WITH TRAILING SLASHES
    [ '/foo/', '/', false ],
    [ '/foo/', '/bar', false ],
    [ '/foo/', '/foo', false ],
    [ '/foo/', '/foo?id=1', false ],
    [ '/foo/', '/foo.html', false ],
    [ '/foo/', '/foo.html?id=1', false ],
    [ '/foo/', '/foo/', true ],
    [ '/foo/', '/foo/?id=1', true ],
    [ '/foo/', '/foo/bar', true ],
    [ '/foo/', '/foo/bar.html', true ],
    [ '/foo/', '/foobar', false ],
    [ '/foo/', '/foobar.html', false ],
    [ '/foo/', '/foobar/baz', false ],
    [ '/foo/', '/foobar/baz.html', false ],
    // FILE EXTENSIONS
    [ '/*.php', '/foo.php', true ],
    [ '/*.php', '/foo.php/', true ],
    [ '/*.php', '/foo/bar.php', true ],
    [ '/*.php', '/foo/bar.php?id=1', true ],
    [ '/*.php', '/foo/bar.php.baz.html', true ],
    [ '/*.php', '/', false ],
    [ '/*.php', '/foo', false ],
    [ '/*.php', '/foo.PHP', false ],
    // ENDING IN FILE EXTENSION
    [ '/*.php$', '/foo.php', true ],
    [ '/*.php$', '/foo.php/', false ],
    [ '/*.php$', '/foo/bar.php', true ],
    [ '/*.php$', '/foo.php?id=1', false ],
    [ '/*.php$', '/foo.php/', false ],
    [ '/*.php$', '/foo.php5', false ],
    [ '/*.php$', '/foo.PHP', false ],
    // ENDING IN FILE EXTENSION WITH WILDCARD
    [ '/foo*.php', '/', false ],
    [ '/foo*.php', '/foo.php', true ],
    [ '/foo*.php', '/foo.php/', false ],
    [ '/foo*.php', '/foobar.php', true ],
    [ '/foo*.php', '/foo/bar.php', true ],
    [ '/foo*.php', '/foo.php?id=1', true ],
    [ '/foo*.php', '/foo.php/', true ],
    [ '/foo*.php', '/foo.php5', true ],
    [ '/foo*.php', '/foo.PHP', false ]
  ];

  tests = tests.map(test => ({ rule: test[0], value: test[1], outcome: test[2] }))

  for (let test of tests) {
    it(`'${test.rule}' and '${test.value}' should ${test.outcome ? '' : 'not '}match.`, () => {
      let result = match(test.rule, test.value);
      expect(result).to.be.a('boolean');
      expect(result).to.equal(test.outcome);
    });
  }
});
