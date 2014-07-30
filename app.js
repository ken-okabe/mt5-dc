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
              log(obj.pair);
              log(obj.period);

              log(x);
              _sq[obj.pair][obj.period].appear(x.time, x);
            }


          });
      }
      else
      {
        var dt = obj.time;

        var date = dt.split(' ')[0];
        var time = dt.split(' ')[1];

        var YY = date.split('.')[0];
        var MM = date.split('.')[1];
        var DD = date.split('.')[2];

        var hh = time.split(':')[0];
        var mm = time.split(':')[1];

        //1412310100
        var cD = YY * 100000000 + MM * 1000000 + DD * 10000;
        var cT = hh * 100 + mm * 1;

        var c = cD + cT;
        obj.time = c;

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
            log('!!!!!!!!!!!');

            _sq[x][y].compute(function(z)
            {
              log('######');
              log(z);
              var obj = {};
              obj.type = 'historical';
              obj.pair = x;
              obj.period = y;
              obj.data = z;

              try
              {
                ws.send(JSON.stringify(obj));
              }
              catch (e)
              {}
            });


          });


        Object.keys(__sq[x])
          .map(function(y)
          {
            var __tl = __sq[x][y]
              .map(function(z)
              {
                return z;
              });

            __tl
              .compute(function(z)
              {
                log(x);
                log(y);
                log(z);
                //  log(z);
                var obj = {};
                obj.type = 'onbar';
                obj.pair = x;
                obj.period = y;
                obj.data = z;
                try
                {
                  ws.send(JSON.stringify(obj));
                }
                catch (e)
                {
                  log('error/disconnected');

                  delete __tl.compute;


                }

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