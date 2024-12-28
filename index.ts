import express, { Express, Request, Response, Application } from 'express'
import dotenv from 'dotenv'
import winston from 'winston'
import expressWinston from 'express-winston'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
// import xss from "xss-clean"
// import ratelimit from 'express-rate-limit'
import hpp from 'hpp'
import cors from 'cors'
import responseTime from 'response-time'
import { createLogger, format, transports } from 'winston'
import router from './service/router'

const { combine, timestamp, label, prettyPrint } = format;


const app = express();

//security
app.use(helmet())
app.use(hpp())
app.use(mongoSanitize())
app.use(cors())


dotenv.config({path : './config/config.env'})



//set logger
app.use(
    expressWinston.logger({
        transports: [new winston.transports.Console(), new (winston.transports.File)({ filename: 'myLogs.log' })],
        format: format.combine(
            label({ label: 'right meow!' }),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            prettyPrint()
        ),
        statusLevels: true,
        meta: true,
        msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
        expressFormat: true,
        ignoreRoute() {
            return false;
        },
    })
);

// inside logger!!!!
winston.configure({
    format: format.combine(

        label({ label: 'right meow!' }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        prettyPrint()
    ),
    transports: [
        new (winston.transports.File)({ filename: 'inside.log' }),
        // new winston.transports.Console()
    ],
})



process.on('unhandledRejection', (error) => {
    console.log('error occured . . .', error)
});

process.on('uncaughtException', (error) => {
    console.log('error occured', error)
})

process.on('unhandledException', (error) => {
    console.log('error occured . . .', error)
})


const port = process.env.PORT || 8010

app.listen(port, () => {
    console.log('server connecting successfully . . .')
})

const routing = new router()

import {
    createProxyMiddleware,
    debugProxyErrorsPlugin, // subscribe to proxy errors to prevent server from crashing
    loggerPlugin, // log proxy events to a logger (ie. console)
    errorResponsePlugin, // return 5xx response on proxy error
    proxyEventsPlugin, // implements the "on:" option
    fixRequestBody
  } from 'http-proxy-middleware';
import ratelimit from './ratelimit'



// required plugins for proxy middleware
const plugins = [debugProxyErrorsPlugin, loggerPlugin, errorResponsePlugin, proxyEventsPlugin]

//proxeing

app.get('/' ,ratelimit ,(req:any , res:any , next:any)=>{
    let Ip = req.headers['x-real-ip']
    let html = `<!DOCTYPE html>
   <html>
    <head>
        <meta name="viewport" content="width=device-width">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js" integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy" crossorigin="anonymous"></script>
        <title>otp code for reseting password</title>
    </head>
    <body class="container-fluid justify-content-center">
        <div class="container-fluid justify-content-center">
        <div class="card text-center">
            <div  class="card-header" style=" height:60px; text-align : center; background-color: rgba(0, 190, 190, 0.316);">
                ocean journey
            </div>
            <div class="card-body">
              <h5 style="text-align : center;" class="card-title">Your IpAddress :: ${Ip}</h5>
              <p style="text-align : center;" class="card-text">please download the app named "ocean journey" and use it</p>
              <br>
              <p style="text-align : center;" class="card-text">this is warn page for accessing</p>
              <p style="text-align : center;" class="card-text"> you have not permisioned for access to this rout</p>
            </div>
            <div class="card-footer text-body-secondary">
                <h6 style="text-align: center;">  <span class="badge text-bg-secondary">inio.ac.ir</span></h6> 
            </div>
          </div>
    </div>
    </body>
   </html>`
    res.status(200).send(html)
})

app.use("/api/v1/set-user" , ratelimit ,routing.proxy(`${process.env.SET_USER}`));        // routing the req to set user service

app.use("/api/v1/get-user" , ratelimit ,routing.proxy(`${process.env.GET_USER}`));        // routing the req to get user service

app.use("/api/v1/set-content" , ratelimit , routing.proxy(`${process.env.SET_CONTENT}`));        // routing the req to set content service

app.use("/api/v1/get-content" , ratelimit , routing.proxy(`${process.env.GET_CONTENT}`));        // routing the req to get content service

app.use("/api/v1/set-quize" , ratelimit , routing.proxy(`${process.env.SET_QUIZE}`));        // routing the req to set quize service

app.use("/api/v1/get-quize" , ratelimit , routing.proxy(`${process.env.GET_QUIZE}`));        // routing the req to get quize service

app.use("/api/v1/set-admin" , ratelimit , routing.proxy(`${process.env.SET_ADMIN}`));        // routing the req to set admin service

app.use("/api/v1/user-log" , ratelimit , routing.proxy(`${process.env.LOG}`));        // routing the req to set admin service

app.use('/api/v1/upload-center' , ratelimit ,  routing.proxy(`${process.env.UPLOADCENTER}`))    // its for upload center