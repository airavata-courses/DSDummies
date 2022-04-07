import express from "express";

import { register, login } from "../controllers/auth";

const router = express.Router();

const isWorking = async (req, res) => {
	return res.json("API is working!");
};

//check if api working
router.get("/isworking", isWorking);

//register user
// router.put("/register", register);

var amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost',  function(error0, connection) {
  if (error0) {
    throw error0;
  }
  console.log("Connection established with rabbitMQ");
  // create channel ,establiish connection and declare the queue
  connection.createChannel( function(error1, channel) {
    if (error1) {
      throw error1;
    }
    console.log("Channel connected");
    var queue = 'auth_qr';
    channel.assertQueue(queue, {
      durable: false
    });  
	channel.prefetch(1);
    console.log(' [x] Awaiting RPC requests');
    channel.consume('auth_qr', async function reply(msg) {
    console.log(msg.content.toString());
    var jsonObject = JSON.parse(msg.content.toString())
    var jsonObjectLength = Object.keys(jsonObject).length;
    if (jsonObjectLength == 2){
      var resp = await login(msg.content.toString());
      console.log("resp recvd login=",resp)
    }
    else if (jsonObjectLength == 4){
      var resp = await register(msg.content.toString());
      console.log("resp recvd register=",resp)
    }
	
  let stringData = resp.toString();
  channel.sendToQueue(msg.properties.replyTo,
    Buffer.from(stringData), {
      correlationId: msg.properties.correlationId
  });
  console.log("Sent this back:", stringData);
  channel.ack(msg);
})
})
});



module.exports = router;
