import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../models/User';

class UserController {
    async create(req: Request, res: Response){
        const { name, email } = req.body;

        const usersRepository = getRepository(User);

        const userAlreadyExists = await usersRepository.findOne({ email });

        if(userAlreadyExists){
            res.send(
                res.status(400).json({
                    error: 'User with this email already exists'
                })
            )
        }

        const user = usersRepository.create({ name, email });
        await usersRepository.save(user);

        res.send(
            res.status(200).json({
                message: 'User registered successfully'
            })
        );
          
    }
}

export { UserController };