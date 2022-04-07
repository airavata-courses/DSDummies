var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');
var cors = require('cors')

var amqp = require('amqplib/callback_api');

let respList = [];
var connectionVar;
var channelVar;

amqp.connect('amqp://localhost', ampqConnectionInit);

const http = require("http");
// const WebSocket = require("ws");
// const serverSocket = require("./socket.js");
var app = express();

// const port = 4000;

app.use(cors({ credentials: true,
  origin: "http://localhost:3000",
    }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
var port = process.env.PORT || '4000';
var correlationIds = [];
app.listen(port, () => console.log(`Listening on port ${port}`));

app.post('/loginregister', postHandlerAuth);
app.post('/getplot', postHandlerPlot);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}

function ampqConnectionInit(error0, connection) {
  if (error0) {
    throw error0;
  }
  console.log("Connection to Rabbit MQ successful");
  connectionVar = connection;
  connectionVar.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    console.log("Channel created for Rabbit MQ");
    channelVar = channel;
  });
}

function ampqConnectionHandler(error0, connection) {
  if (error0) {
    respBody = {"error":"Could not create connection"};
    console.log(respBody);
    throw error0;
  }
  console.log("We have connection now",connection);
  connectionVar = connection;
}

function ampqChannelHandler(error1, channel) {
  if (error1) {
    respBody = {"error":"Could not create channel"};
    console.log(respBody);
    // resp.json(respBody).status(500);
    throw error1;
  }
  console.log("Channel Created now");
  channelVar = channel;
}

async function postHandlerAuth(req, resp, next) {
  console.log("here")  
  let respBody;
  // resp.header("Access-Control-Allow-Origin", "*");
  console.log("Received POST request at orionweather");
  console.log(req.body);
  if(!connectionVar) {
    amqp.connect('amqp://localhost', ampqConnectionHandler);
  }
  if(!channelVar) {
    connectionVar.createChannel(ampqChannelHandler);
  }

  channelVar.assertQueue("auth_qt", {
    exclusive: false
  }, function(error2, q) {
    if (error2) {
      respBody = {"error":"Could not connect to queue to send message"};
      console.log(respBody);
      throw error2;
    }
    console.log("auth_qt channel association successful");
    var correlationId = generateUuid();
    correlationIds.push(correlationId);
    console.log("req=",req.body)
    let stringData = JSON.stringify(req.body);
    console.log("This is how it's getting sent: ",stringData);

    var nLog;
    channelVar.consume("auth_qt", function(msg) {
    console.log("hoooooi",msg)
    let correlationRecv = msg.properties.correlationId;
    if (correlationIds.indexOf(correlationRecv)>-1) {
      correlationIds.filter(function(value, index, arr){ 
        return value != correlationRecv;
      });
      nLog = JSON.parse(msg.content.toString());
      console.log(' [.] Received from queue: ', nLog);
      respList.push(nLog);
    }
  }, {
    noAck: true
  });

    channelVar.sendToQueue('auth_qr',
      Buffer.from(stringData),{
        correlationId,
        replyTo:"auth_qt"});
});    
    
  await sleep(2000);
  let val = respList.pop();
  console.log("val=",val);
 }


 async function postHandlerPlot(req, resp, next) {
  console.log("here")  
  let respBody;
  // resp.header("Access-Control-Allow-Origin", "*");
  console.log("Received POST request at orionweather");
  console.log(req.body);
  if(!connectionVar) {
    amqp.connect('amqp://localhost', ampqConnectionHandler);
  }
  if(!channelVar) {
    connectionVar.createChannel(ampqChannelHandler);
  }
   channelVar.assertQueue('cache_qt', {
    exclusive: false
  }, function(error2, q) {
    if (error2) {
      respBody = {"error":"Could not connect to queue to send message"};
      console.log(respBody);
      throw error2;
    }
    console.log("cache_qt channel association successful");
    var correlationId = generateUuid();
    correlationIds.push(correlationId);
    let stringData = JSON.stringify(req.body);
    console.log("This is how it's getting sent to cache: ",stringData, typeof(stringData));

    channelVar.consume("cache_qt", function(msg) {
        console.log("comes here")
        nLog = JSON.parse(msg.content.toString());
        console.log(' [.] Received from queue: ', nLog);
        respList.push(nLog);
      // }
    }, {
      noAck: true
    });

    channelVar.sendToQueue('cache_qr',
      Buffer.from(stringData),{
        correlationId,
        replyTo: "cache_qt" });
  });

  await sleep(20000);
  let val2 = respList.pop();
  // console.log("val2--",val2);

  // resp.json(val2).status(200).send();
  // return;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = app;