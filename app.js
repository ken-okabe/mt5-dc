/* jshint node: true */
/* jshint jquery: true */
/* jshint sub: true */
/* global window,document, $,alert,history */
'use strict';

var log = function(msg)
{
  console.log('core:', msg);
};

log('started');
var moment = require('moment');

var blessed = require('blessed');
/*
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
*/
//-------------
var _ = require('spacetime')
  .lazy();
var __ = require('spacetime')
  .timeline();

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


var WebSocketServer = require('ws')
  .Server;
var wss = new WebSocketServer(
{
  port: 9998
});

var wss1 = new WebSocketServer(
{
  port: 9999
});


var _sq = {};
var __sq = {};


wss.on('connection', function(ws) //for every DLL websocket
  {
    log('!!--------connected');
    ws.on('message', function(msg)
    {
      //  log(msg);
      var obj = JSON.parse(msg);

      if (!__sq[obj.pair])
      {
        _sq[obj.pair] = {};
        __sq[obj.pair] = {};
      }

      if (!__sq[obj.pair][obj.period]) //new connection
      {
        _sq[obj.pair][obj.period] = _(
        {});
        __sq[obj.pair][obj.period] = __();

        __sq[obj.pair][obj.period]
          .compute(function(x)
          {
            if (obj.period !== 'mTick')
              {
                _sq[obj.pair][obj.period].appear(x.time, x);
              }
          });
      }
      else
      {
           __sq[obj.pair][obj.period]
            .appear(obj);
      }

    });

  });


wss1.on('connection', function(ws) //for every DLL websocket
  {
    log('!!wss1--------connected');
log(_sq);
    Object.keys(_sq)
      .map(function(x)
      {
        log(x);
        Object.keys(_sq[x])
          .map(function(y)
          {
            log(y);
            _sq[x][y].compute(function(z)
            {
            //  log(z);
              var obj = {};
              obj.type = 'historical';
              obj.pair = x;
              obj.period = y;
              obj.data = z;
              ws.send(JSON.stringify(obj));
            });


          });


        Object.keys(__sq[x])
          .map(function(y)
          {

            __sq[x][y]
              .compute(function(z)
              {log(x);
              log(y);
              log(z);
              //  log(z);
                var obj = {};
                obj.type = 'onbar';
                obj.pair = x;
                obj.period = y;
                obj.data = z;
                ws.send(JSON.stringify(obj));


              });
          });
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
/*
__timerTL
  .compute(function(x)
  {
    log(x);
  });*/
