import { Request, Response } from "express";
import { AuthUsersService } from "../../services/user/AuthUserService";

class AuthUseContoller{
    async handle(req:Request, res:Response){
        const {email, password} = req.body;
        const authUsersService = new AuthUsersService();
        const auth = await authUsersService.execute({
            email,
            password
        })
        return res.json(auth)
    }
}
export {AuthUseContoller}