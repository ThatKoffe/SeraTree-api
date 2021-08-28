import express from 'express';
const API2 = express.Router();
import { db } from '../utils/cache';
const cache = new db();
// ? init cache
console.log('Cache init:',cache.init())


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

API2.get('/user/:id', (req: express.Request, res: express.Response) => {
    let user: any = cache.get(parseInt(req.params.id));
    user = user;
    user["user"]["password"] = '';
    user["user"]["token"] = '';

    return returnFin(res, 200, "OK", user)
});

API2.post('/user', (req: express.Request, res: express.Response) => {
   const name = req.body.name;
   const pass = req.body.password;
   if(!name) return returnFin(res, 400, "No name provided.", {});
   if(!pass) return returnFin(res, 400, "No password provided.", {});
   if(name.length > 30) return returnFin(res, 400, "Name may only be 30 characters.", {});
   if(pass.length < 6) return returnFin(res, 400, "Password must be at least 6 characters.", {});
   if(pass.length > 60) return returnFin(res, 400, "Password may be only be 60 characters.", {});

   const result: any = cache.push(name, pass);
   if(result.error) return returnFin(res, 400, result.msg, {});

   return returnFin(res, 200, "Account Created.", result["user"]);
});

API2.post('/user/validate', (req: express.Request, res: express.Response) => {
    try {
        const token: any = req.header("token");
        if(!token) return returnFin(res, 400, "Action Not Allowed", {});

        const user: any = cache.getByToken(token);

        if(user.error) return returnFin(res, 400, "Action Not Allowed.", {});

        return returnFin(res, 200, "OK", user);
    } catch(e){
        return returnFin(res, 400, "An error occured.", {})
    }
});

API2.post('/user/links', (req: express.Request, res: express.Response) => {
    try {
        const links = req.body.links;
        const token: any = req.header("token");
        if(!links) return returnFin(res, 400, "No link array provided.", {});
        if(!token) return returnFin(res, 400, "Action Not Allowed", {});

        const user: any = cache.getByToken(token);

        if(user.error) return returnFin(res, 400, "Action Not Allowed.", {});

        if(typeof(links) !== "object") return returnFin(res, 400, "Bad Request.", {});

        if(!Array.isArray(links)) return returnFin(res, 400, 'Bad Request.', {});

        if(links.length > 10) return returnFin(res, 401, "You may only have 10 links!", {});

        let newArray = [];
        for(const link of links){
            const linkName = link["name"];
            const linkUri = link["uri"];
            if(linkName && linkName.length < 50){
                if(linkUri && linkUri.length < 200){
                    newArray.push({
                        name: linkName,
                        uri: linkUri
                    });
                }
            }
        }

        const result = cache.update(user["user"].id, newArray);

        return returnFin(res, 200, "OK", result);
    } catch(e){
        return returnFin(res, 400, "An error occured.", {})
    }
});

export {
    API2
}