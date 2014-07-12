/* jshint node: true */
/* jshint jquery: true */
/* jshint sub: true */
/* global window,document, $,alert,history */
'use strict';

var log = function(msg)
{
  console.log('core:', msg);
};


var blessed = require('blessed');

// Create a screen object.
var screen = blessed.screen();

// Create a box perfectly centered horizontally and vertically.

var outer0 = blessed
  .box(
  {
    fg: 'white',
    bg: 'default',
    tags: true,
    width: '100%',
    height: '100%',
    top: '0%',
    left: 'center'
  });
screen.append(outer0);

outer0.setLine(0, 'MT5 datacenter');

var outer = blessed.box(
{
  fg: 'white',
  bg: 'default',
  tags: true,
  width: '100%',
  height: '100%',
  top: '5%',
  left: '0%'
});
//outer.setLine(1, 'bar');
// Append our box to the screen.
outer0.append(outer);

var ticker = blessed.box(
{
  fg: 'white',
  bg: 'default',
  tags: true,
  //content: '{center}{green-fg}EURUSD{/green-fg}{/center}\n',
  width: '14%',
  height: '100%',
  top: '0%',
  left: '0%'
});
var m1 = blessed.box(
{
  fg: 'white',
  bg: 'default',
  tags: true,
  //content: '{center}{green-fg}USDJPY{/green-fg}{/center}\n',
  width: '14%',
  height: '100%',
  top: '0%',
  left: '14%'
});
var m5 = blessed.box(
{
  fg: 'white',
  bg: 'default',
  tags: true,
  //content: '{center}{green-fg}GBPUSD{/green-fg}{/center}\n',
  width: '14%',
  height: '100%',
  top: '0%',
  left: '28%'
});
var m30 = blessed.box(
{
  fg: 'white',
  bg: 'default',
  tags: true,
  //content: '{center}{green-fg}AUDUSD{/green-fg}{/center}\n',
  width: '14%',
  height: '100%',
  top: '0%',
  left: '42%'
});
var m120 = blessed.box(
{
  fg: 'white',
  bg: 'default',
  tags: true,
  //content: '{center}{green-fg}NZDUSD{/green-fg}{/center}\n',
  width: '14%',
  height: '100%',
  top: '0%',
  left: '56%'
});
var mD = blessed.box(
{
  fg: 'white',
  bg: 'default',
  tags: true,
  //content: '{center}{green-fg}CADUSD{/green-fg}{/center}\n',
  width: '14%',
  height: '100%',
  top: '0%',
  left: '70%'
});
var mW = blessed.box(
{
  fg: 'white',
  bg: 'default',
  tags: true,
  //content: '{center}{green-fg}CADUSD{/green-fg}{/center}\n',
  width: '14%',
  height: '100%',
  top: '0%',
  left: '84%'
});

outer.append(ticker);
outer.append(m1);
outer.append(m5);
outer.append(m30);
outer.append(m120);
outer.append(mD);
outer.append(mW);

ticker.setLine(0, 'Ticker');
m1.setLine(0, 'm1');
m5.setLine(0, 'm5');
m30.setLine(0, 'm30');
m120.setLine(0, 'm120');
mD.setLine(0, 'mD');
mW.setLine(0, 'mW');

var set = function(data)
{
  if (data.pair === 'EURUSD')
  {
    if (data.type == 'ticker')
    {}
    else if (data.type == 'm1')
    {}
    else if (data.type == 'm5')
    {}
    else if (data.type == 'm30')
    {}
    else if (data.type == 'm120')
    {}
    else if (data.type == 'mD')
    {}
    else if (data.type == 'mW')
    {}
  }

};
// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key)
{
  return process.exit(0);
});

// Render the screen.
screen.render();

//-------------
var _ = require('spacetime').lazy();
var __ = require('spacetime').timeline();

var _x = _(
{});
_x.compute(function(x)
{
  log('hey');
  log(x);
});
//_x /*.appear(100, 'test')*/ .compute();

/*
 _x.get(100).compute(function(x)
 {
   log(x);
 });
 */


var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer(
{
  port: 9998
});


var _sq = {};
_sq.eur = {};
_sq.jpy = {};
_sq.gbp = {};
_sq.chf = {};
_sq.aud = {};
_sq.nzd = {};
_sq.cad = {};


Object.keys(_sq).map(function(val)
{
  _sq[val]['m1'] = _(
  {});
  _sq[val]['m5'] = _(
  {});
  _sq[val]['m30'] = _(
  {});
  _sq[val]['m120'] = _(
  {});
  _sq[val]['mD'] = _(
  {});
  _sq[val]['mW'] = _(
  {});
});

var __sq = {};
__sq.eur = {};
__sq.jpy = {};
__sq.gbp = {};
__sq.chf = {};
__sq.aud = {};
__sq.nzd = {};
__sq.cad = {};

　　
/*
 _sq.eur.m1
   .appear('test')
   .appear('test2')
   .compute(function(x)
   {
     log('==result');
     log(x);
   });
 */

wss.on('connection', function(ws) //for every DLL websocket
  {　
    var wsTL = function(tl)
    {
      // ticker.setLine(2, 'wsTLset');
      //screen.render();
      ws.on('message', function(msg)
      {

        tl.val = msg;
        _sq[ws.pair][ws.period].appear(ws.timestamp, ws.data).compute();

        tl.next();

        ticker.setLine(5, msg);
        screen.render();
      });

      tl.stop = function() {

      };
    };

    __sq[ws.pair][ws.period] = __(wsTL);

    __sq[ws.pair][ws.period]
      .compute(function(x)
      {
        log(x);

        if (x.type === 'ticker')
          ticker.setLine(1, x);
        screen.render();
      });

  });






var natural = _(function(n)
{
  return n;
});
var timerTL = function(tl)
{
  var _natural = _(natural);
  var it = _natural.it();
  ticker.setLine(9, 'timerTLset');
  screen.render();
  var interval = setInterval(function()
  {
    tl.val = it.next();
    tl.next();
  }, 100);

  tl.stop = function()
  {
    clearInterval(interval);
  };
};


var __timerTL = __(timerTL);

__timerTL
  .compute(function(x)
  {
    ticker.setLine(10, x);
    screen.render();
  });
