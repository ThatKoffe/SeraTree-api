import { nanoid } from 'nanoid';

class db {
    data: JSON;
    dobj: any = {};

    constructor(){
        this.data = <JSON>this.dobj;
    }

    public init(): Boolean {
        this.dobj["users"] = [];


        console.log(this.push("System", nanoid(40)), 'SystemCreated')

        return true
    }

    public push(name: string, password: string): JSON {
        let id = this.dobj["users"].length;

        // ? check if a user exists
        const userExists = this.dobj["users"].find((x: any) => x.name.toLowerCase() === name.toLocaleLowerCase());

        let errorJsonToStr = JSON.stringify({error: true, msg: 'User with this name exists.', user: {}})
        if(userExists) return JSON.parse(errorJsonToStr)

        const token = nanoid(100);
        this.dobj["users"].push({
            id: id,
            name: name,
            password: password,
            token: token,
            links: []
        });

        let JsonToStr = JSON.stringify({
            error: false,
            msg: 'OK',
            user: {
                id: id,
                name: name,
                password: password,
                token: token,
                links: []
            }
        })

        this.data = <JSON>this.dobj;
        return JSON.parse(JsonToStr)
    }

    public get(id: number): JSON {
        const continueScript = (): JSON => {
            let OutJson = {error: true, user: {}};
            let user = this.dobj["users"].find((x: any) => x.id === id);
            if(user) OutJson = {error: false, user: user};
            let JsonToStr = JSON.stringify(OutJson);
            return JSON.parse(JsonToStr)
        }

        if(!this.dobj["users"][0]){ 
            this.dobj["users"].shift();
            return continueScript()
        } else {
            return continueScript()
        }
    }

    public getByToken(token: string): JSON {
        const continueScript = (): JSON => {
            let OutJson = {error: true, user: {}};
            let user = this.dobj["users"].find((x: any) => x.token === token);

            if(user) OutJson = {error: false, user: user};
            let JsonToStr = JSON.stringify(OutJson);
            return JSON.parse(JsonToStr)
        }

        if(!this.dobj["users"][0]){ 
            this.dobj["users"].shift();
            return continueScript()
        } else {
            return continueScript()
        }
    }

    public update(id: number, links: any): JSON{
        try {  
            const user = this.dobj["users"].find((x: any) => x.id === id);

            let Json: any = {
                error: true,
                msg: "User not updated.",
                links: []
            }


            if(!user){
                Json = JSON.stringify(Json);
                return JSON.parse(Json);
            }
            let newArray: any = links;

            user.links = newArray;
            Json = {
                error: false,
                msg: "Links updated!",
                links: newArray
            }

            this.data = <JSON>this.dobj;

            Json = JSON.stringify(Json);
            return JSON.parse(Json);
        } catch(e){
            let Json: any = {
                error: true,
                msg: "An error occured while updating.",
                links: []
            }
            Json = JSON.stringify(Json);
            return JSON.parse(Json);
        }
    }
}

export { 
    db
}