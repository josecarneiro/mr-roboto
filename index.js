'use strict';

const { URL } = require('url');
const request = require('request-promise-native');
const camelCase = require('camelcase');
const { match, normalizePath } = require('./util');

module.exports = class MrRoboto {
  constructor (url, options) {
    this._defaults = {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
      botName: ''
    };
    this._options = Object.assign(this._defaults, options);
    this._url = new URL('/robots.txt', url).href;
    this._body = null;
  }

  async _request () {
    try {
      const response = await request({
        url: this._url,
        headers: { 'User-Agent': this._options.userAgent },
        jar: true,
        maxRedirects: 6,
        resolveWithFullResponse: true
      });
      this._body = response.body;
      this._parse();
      return;
    } catch (error) {
      // console.log(error);
      throw error;
    }
  }

  _parse () {
    let lines = this._body.split('\n').map(value => value.split('\r').join(''));
    let parsed = [];
    let rules = {};

    for (let line of lines) {
      if (!line.length || !line.indexOf('#')) continue;
      line = line.split(': ');
      let key = line[0].toLowerCase();
      let value = line[1];
      if (key.includes('user-agent')) {
        if (rules.userAgent) {
          parsed.push(rules);
        }
        rules = {};
        rules.userAgent = value;
      } else if (key.includes('sitemap')) {
        parsed.push({ [key]: value });
        if (this._sitemap instanceof Array) {
          this._sitemap.push(value);
        } else {
          this._sitemap = [ value ];
        }
      } else if (key.includes('disallow') || key.includes('allow')) {
        if (!rules[key]) rules[key] = [];
        rules[key].push(normalizePath(value));
      } else {
        rules[camelCase(key)] = value.split(' #')[0];
      }
    }

    parsed.push(rules);

    this._parsed = parsed;
  }

  async load () {
    try {
      await this._request();
      return this;
    } catch (error) {
      throw error;
    }
  }

  get rules () {
    return this._parsed;
  }

  loadRule (rule) {
    let list = [];
    for (let item of this.rules) {
      if (item.userAgent && match(item.userAgent, this._options.botName) && item[rule]) list = list.concat(item[rule]);
    }
    return list;
  }

  get allowed () {
    return this.loadRule('allow');
  }

  get disallowed () {
    return this.loadRule('disallow');
  }

  get sitemap () {
    return this._sitemap || [];
  }

  isAllowed (path) {
    return !this.isDisallowed(path);
  }

  isDisallowed (path) {
    return !!this.disallowed.filter(value => match(value, normalizePath(path))).length;
  }

  _match (rule, value) {
    const tester = new RegExp(rule.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'));
    return tester.test(value);
  }

  _matchAny (rules, value) {
    return !!rules.filter(rule => this._match(rule, value)).length;
  }
};
