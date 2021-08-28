import express from 'express';
import dotenv from 'dotenv';
import * as path from 'path';
import { connect } from 'mongoose';
import fs from 'fs';
import { API } from './routers/api';
import { API2 } from './routers/api.v2';

const app = express();
dotenv.config();
const env = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.resolve(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    next();
})

const returnFin = (res: express.Response, code: number, msg: string, json: any): express.Response => {
    const ec: number = code ? code : 400;
    const em: string = msg ? msg : "Bad Request.";
    const ej: any = json ? json : {};


    return res.status(ec).json({
        code: ec,
        msg: em,
        json: ej
    });
}

//? Routers
app.use('/api/v1', API)
app.use('/api/v2', API2)


app.get('/*', (req: express.Request, res: express.Response) => {
    return returnFin(res, 404, "Endpoint not found.", null);
});
app.post('/*', (req: express.Request, res: express.Response) => {
    return returnFin(res, 404, "Endpoint not found.", null);
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    return returnFin(res, 400, "Could not handle request...", {})
});

app.listen(env.port, () => console.log(`App online on port: ${env.port}`));