import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt'
import User from '../models/User.js';
import jwt from 'jsonwebtoken'
import Patients, { IPatients } from '../models/Patient.js';
import deseasesType from '../types/deseasesType.js';
interface RequestBodyPassword {
    myId: string;
    idPatient: string
    myPassword: string
}
interface RequestBodyPassword {
    name: string
    birthDay: Date
    cpf: string
    imageAnalyzis: {
        image: string
        biggestChance: {
            type: deseasesType
            value: number
        },
        smallestChance: {
            type: deseasesType
            value: number
        }
    }
    possibleIllness: deseasesType
}
abstract class PatientsController {
    static async getAll(req: Request, res: Response) {
        try {
            const patients = await Patients.find({})
            if (!patients) {
                return res.json({ msg: "Pacientes não encontrados" })
            }
            res.status(200).json({ msg: "Sucess", patients: patients })
        } catch (error) {
            console.log(error);
            res.json({ msg: "Ocorreu um erro no servidor" })
        }
    }
    static async findPatientById(req: Request, res: Response) {
        try {
            const { idPatient } = req.params
            const patient = await Patients.find({ _id: idPatient })
            if (!patient) {
                return res.json({ msg: "Paciente não encontrada" })
            }
            res.status(200).json({ msg: "Sucess", patient: patient[0] })
        } catch (error) {
            console.log(error);
            res.json({ msg: "Ocorreu um erro no servidor" })
        }
    }
    static async createPatient(req: Request<{}, {}, RequestBodyPassword>, res: Response) {
        const { name, birthDay, cpf, imageAnalyzis, possibleIllness } = req.body as RequestBodyPassword
        try {
            const createdPatient = new Patients({
                createdDate: new Date(),
                name,
                birthDay,
                cpf,
                imageAnalyzis: {
                    image: imageAnalyzis.image,
                    smallestChance: {
                        type: imageAnalyzis.smallestChance.type,
                        value: imageAnalyzis.smallestChance.value
                    },
                    biggestChance: {
                        type: imageAnalyzis.biggestChance.type,
                        value:imageAnalyzis.biggestChance.value
                    }
                },
                possibleIllness,
            })

            if (!createdPatient) {
                return res.json({ msg: "Não foi possível criar o paciente" })
            }
            createdPatient.save()
            res.status(200).json({ msg: "Sucess", patient: createdPatient })
        } catch (error) {
            console.log(error);
            res.json({ msg: "Ocorreu um erro no servidor" })
        }
    }
    static async deletePatient(req: Request<{}, {}, RequestBodyPassword>, res: Response) {
        const { myId, idPatient, myPassword } = req.params as RequestBodyPassword
        const saltToken = process.env.SALT!
        const passwordSalt = jwt.verify(myPassword, saltToken) as string
        try {
            const user = await User.findOne({ _id: myId })
            const checkPassword = await bcrypt.compare(passwordSalt, user!.password)
            if (!checkPassword) {
                return res.json({ resp: "Senha incorreta!" })
            }
            await Patients.deleteOne({ _id: idPatient })
            return res.json({ resp: "Sucess" })
        } catch (error) {
            console.log(error);
            return res.json({ resp: "Ocorreu um erro ao deleter o paciente!" })
        }
    }
}
export default PatientsController