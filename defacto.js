'use strict';

const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');

function Server(port=null,options={"staticPath":null,"jsonLimit":1024*1024*1,"maxAge":1000 * 10,"cors":null}) {

  if (!port || typeof port !== 'number') {
    let err = new Error('Missing port!');
    throw(err);
    return null;
  }

  const app = express();

  app.use(compression());
  app.use(helmet());

  if (options.cors && typeof options.cors === 'object') {
    app.use(cors(options.cors));
  }
  if (options.staticPath && typeof options.staticPath === 'string') {
    app.use(express.static(options.staticPath,{"maxAge":(options.maxAge||1000 * 10)}));
  }

  app.use(bodyParser.json({
    "limit":(options.jsonLimit || 1024 * 1024 * 1)
  }));

  app.use((err,req,res,next)=>{
    res.status(400).json({"code":400,"message":err.message||err.toString()});
  });

  const server = app.listen(port,(err)=>{
    if (err) {
      throw(err);
      return null;
    }
  });

  return {"app":app,"server":server};

}

module.exports = Server;
