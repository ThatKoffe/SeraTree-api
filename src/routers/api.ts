import express from 'express';
const API = express.Router();

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

API.get('/user', (req: express.Request, res: express.Response) => {
    return returnFin(res, 200, "OK", {
        id: 0,
        icon: "AUTHOR_ICON",
        username: "AUTHOR_NAME"
    })
})

API.get('/products', (req: express.Request, res: express.Response) => {
    return returnFin(res, 200, "OK", [

        {
            id: 0,
            name: 'item-000',
            details: { 
                icon: 'ICON_URL',
                pricing: 'PRICE_NUM_FLOAT'
            }
        }

    ]);
});

export {
    API
}