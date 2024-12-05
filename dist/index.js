"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const winston_1 = __importDefault(require("winston"));
const express_winston_1 = __importDefault(require("express-winston"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const cors_1 = __importDefault(require("cors"));
const winston_2 = require("winston");
const router_1 = __importDefault(require("./service/router"));
const { combine, timestamp, label, prettyPrint } = winston_2.format;
const app = (0, express_1.default)();
//security
app.use((0, helmet_1.default)());
app.use((0, hpp_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, cors_1.default)());
dotenv_1.default.config({ path: './config/config.env' });
//set logger
app.use(express_winston_1.default.logger({
    transports: [new winston_1.default.transports.Console(), new (winston_1.default.transports.File)({ filename: 'myLogs.log' })],
    format: winston_2.format.combine(label({ label: 'right meow!' }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), prettyPrint()),
    statusLevels: true,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
    expressFormat: true,
    ignoreRoute() {
        return false;
    },
}));
// inside logger!!!!
winston_1.default.configure({
    format: winston_2.format.combine(label({ label: 'right meow!' }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), prettyPrint()),
    transports: [
        new (winston_1.default.transports.File)({ filename: 'inside.log' }),
        // new winston.transports.Console()
    ],
});
process.on('unhandledRejection', (error) => {
    console.log('error occured . . .', error);
});
process.on('uncaughtException', (error) => {
    console.log('error occured', error);
});
process.on('unhandledException', (error) => {
    console.log('error occured . . .', error);
});
const port = process.env.PORT || 8010;
app.listen(port, () => {
    console.log('server connecting successfully . . .');
});
const routing = new router_1.default();
const http_proxy_middleware_1 = require("http-proxy-middleware");
// required plugins for proxy middleware
const plugins = [http_proxy_middleware_1.debugProxyErrorsPlugin, http_proxy_middleware_1.loggerPlugin, http_proxy_middleware_1.errorResponsePlugin, http_proxy_middleware_1.proxyEventsPlugin];
//proxeing
app.get('/test', (req, res, next) => {
    res.status(200).send('gateway is running successfully . . .');
});
app.use("/api/v1/set-user", routing.proxy(`${process.env.SET_USER}`)); // routing the req to set user service
app.use("/api/v1/get-user", routing.proxy(`${process.env.GET_USER}`)); // routing the req to get user service
app.use("/api/v1/set-content", routing.proxy(`${process.env.SET_CONTENT}`)); // routing the req to set content service
app.use("/api/v1/get-content", routing.proxy(`${process.env.GET_CONTENT}`)); // routing the req to get content service
app.use("/api/v1/set-quize", routing.proxy(`${process.env.SET_QUIZE}`)); // routing the req to set quize service
app.use("/api/v1/get-quize", routing.proxy(`${process.env.GET_QUIZE}`)); // routing the req to get quize service
app.use("/api/v1/set-admin", routing.proxy(`${process.env.SET_ADMIN}`)); // routing the req to set admin service
app.use("/api/v1/user-log", routing.proxy(`${process.env.LOG}`)); // routing the req to set admin service
app.use('/upload-center', routing.proxy(`${process.env.UPLOADCENTER}`)); // its for upload center
