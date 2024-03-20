import { Request, Response } from 'express';
import Manager from '../models/Manager.js';
import Address from '../models/Address.js';
import { IAddress } from '../interface/IAddress.js';
import createUuid from '../createUuidUtil.js';


abstract class AddressController {
    public static async create({ cep, city, neighborhood, number, street, uf }: IAddress) {
        try {
            const address = await Address.create({ id: createUuid(),cep, city, neighborhood, number, street, uf })
            const addressId = address.getDataValue('id')
            await address.save()

            return addressId
        } catch (error) {
            console.log(error);
        }
    }
    static async getAll(req: Request, res: Response) {
        try {
            const managers = await Manager.findAll({})
            if (!managers) {
                return res.json({ msg: "Gerentes não encontrados" })
            }
            res.status(200).json({ msg: "Sucess", managers: managers })
        } catch (error) {
            console.log(error);
            res.json({ msg: "Ocorreu um erro no servidor" })
        }
    }
    static async getByStoreId(req: Request, res: Response) {
        try {
            const { idStore } = req.params
            const manager = await Manager.findOne({ where: { idStore: idStore } })
            if (!manager) {
                return res.json({ msg: "Gerente não encontrado" })
            }
            res.status(200).json({ msg: "Sucess", manager: manager })
        } catch (error) {
            console.log(error);
            res.json({ msg: "Ocorreu um erro no servidor" })
        }
    }
    // static async deleteManager(req: Request<{}, {}, RequestBodyPassword>, res: Response) {
    //     const { myId, key, myPassword } = req.params as RequestBodyPassword
    //     const saltToken = process.env.SALT!
    //     const passwordSalt = jwt.verify(myPassword, saltToken) as string
    //     try {
    //         const user = await User.findOne({ _id: myId })
    //         const checkPassword = await bcrypt.compare(passwordSalt, user!.password)
    //         if (!checkPassword) {
    //             return res.json({ resp: "Senha incorreta!" })
    //         }
    //         const teste = await Key.deleteOne({ key: key })
    //         return res.json({ resp: "Sucess" })
    //     } catch (error) {
    //         console.log(error);
    //         return res.json({ resp: "Ocorreu um erro ao deleter a chave!" })
    //     }
    // }
}
export default AddressController