/* jshint node: true */
/* jshint jquery: true */
/* jshint sub: true */
/* global window,document, $,alert,history */
'use strict';

var log = function(msg)
{
  console.log('core:', msg);
};


var _ = require('spacetime').lazy();
var __ = require('spacetime').timeline();

var _x = _(
{});

_x.appear(100, 'test').compute(function(x)
{
  log('==computed val');
  log(x);
});

_x.get(100).compute(function(x)
{
  log('==computed val');
  log(x);
});
