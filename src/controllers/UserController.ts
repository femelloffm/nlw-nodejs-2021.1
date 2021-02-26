import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class UserController {
    async create(req: Request, res: Response){
        const { name, email } = req.body;

        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required(),
        });

        try{
            await schema.validate(req.body, { abortEarly: false });
        } catch (err) {
            throw new AppError(err.message, 400);
        }

        const userRepository = getCustomRepository(UserRepository);

        const userAlreadyExists = await userRepository.findOne({ email });

        if(userAlreadyExists){
            throw new AppError("User with this email already exists", 400);
        }

        const user = userRepository.create({ name, email });
        await userRepository.save(user);

        return res.status(201).json(user);
    }
}

export { UserController };
