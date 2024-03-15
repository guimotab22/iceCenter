import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt'
import crypto from 'crypto'
import Key from '../models/Keys.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken'
interface RequestBodyPassword {
    myId: string;
    key: string
    myPassword: string
}
abstract class KeysController {
    static async allKeys(req: Request, res: Response) {
        try {
            const keys = await Key.find({})
            if (!keys) {
                return res.json({ msg: "Chave não encontrada" })
            }
            res.status(200).json({ msg: "Sucess", keys: keys })
        } catch (error) {
            console.log(error);
            res.json({ msg: "Ocorreu um erro no servidor" })
        }
    }
    static async findKeyByUserId(req: Request, res: Response) {
        try {
            const { userId } = req.params
            const key = await Key.find({ userId: userId })
            if (!key) {
                return res.json({ msg: "Chave não encontrada" })
            }
            res.status(200).json({ msg: "Sucess", key: key[0] })
        } catch (error) {
            console.log(error);
            res.json({ msg: "Ocorreu um erro no servidor" })
        }
    }
    static async createKey(req: Request, res: Response) {
        try {
            const buffer1 = crypto.randomBytes(4);
            const buffer2 = crypto.randomBytes(8);
            const key = buffer1.toString('hex') + "-" + buffer2.toString('hex');
            const createdKey = new Key({
                active: false, key: key, userId: ""
            })
            if (!createdKey) {
                return res.json({ msg: "Não foi possível criar a chave" })
            }
            createdKey.save()
            res.status(200).json({ msg: "Sucess", key: createdKey })
        } catch (error) {
            console.log(error);
            res.json({ msg: "Ocorreu um erro no servidor" })
        }
    }
    static async deleteKey(req: Request<{}, {}, RequestBodyPassword>, res: Response) {
        const { myId, key, myPassword } = req.params as RequestBodyPassword
        const saltToken = process.env.SALT!
        const passwordSalt = jwt.verify(myPassword, saltToken) as string
        try {
            const user = await User.findOne({ _id: myId })
            const checkPassword = await bcrypt.compare(passwordSalt, user!.password)
            if (!checkPassword) {
                return res.json({ resp: "Senha incorreta!" })
            }
            const teste = await Key.deleteOne({ key: key })
            return res.json({ resp: "Sucess" })
        } catch (error) {
            console.log(error);
            return res.json({ resp: "Ocorreu um erro ao deleter a chave!" })
        }
    }
}
export default KeysController