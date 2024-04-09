import { BaseController } from "@authorization-provider/core";
import { Request, Response } from 'express';
import UserModel from "../user/user.schema";
import bcrypt from 'bcrypt'

export class LoginController extends BaseController {
    // constructor() {}

    // register (req: Request, res: Response) {
    //     req.body
    // }
    login (req: Request, res: Response) {
        const redirectUri = req.body.redirect_uri
        console.log('🚀 ~ redirectUri:', redirectUri)
        if (req.body.username && req.body.password) {
            const username = req.body.username
            const password = bcrypt.hash(req.body.password, 10)
            const result = UserModel.findOne(username, password)
            console.log('🚀 ~ result:', result)
            return result
        }
    }
    // logout (req: Request, res: Response) {

    // }
}