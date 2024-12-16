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

app.get('/test' , (req:any , res:any , next:any)=>{
    res.status(200).send('gateway is running successfully . . .')
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