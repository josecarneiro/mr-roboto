'use strict';

exports.match = (rule, value) => {
  const tester = new RegExp(`^${rule.split('*').join('.*')}$`);
  // Either alternative has downsides, both need to be better explored.
  // const tester = new RegExp(rule.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"));
  return tester.test(value);
};

exports.normalizePath = path => {
  return `/${path.split('/').filter(value => !!value).join('/')}`;
};

const normalize = require('normalize-url');

exports.normalizePath = path => {
  const options = {
    stripWWW: false,
    removeQueryParameters: [
      /^utm_\w+/i,
      'ref'
    ],
    removeDirectoryIndex: [
      'index.php',
      'index.html'
    ]
  };
  return normalize(path);
}
