import { Request, Response } from 'express';
import { resolve } from 'path';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { SurveyRepository } from '../repositories/SurveyRepository';
import { SurveyUserRepository } from '../repositories/SurveyUserRepository';
import { UserRepository } from '../repositories/UserRepository';
import SendMailService from '../services/SendMailService';

class SendMailController {
    async execute(req: Request, res: Response) {
        const { email, survey_id } = req.body;

        const userRepository = getCustomRepository(UserRepository);
        const surveyRepository = getCustomRepository(SurveyRepository);
        const surveyUserRepository = getCustomRepository(SurveyUserRepository);

        const user = await userRepository.findOne({ email });
        if(!user){
            throw new AppError("User does not exist", 400);
        }
        const survey = await surveyRepository.findOne({ id: survey_id });
        if(!survey){
            throw new AppError("Survey does not exist", 400);
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const surveyUserAlreadyExists = await surveyUserRepository.findOne({
            where: { user_id: user.id, value: null },
            relations: ["user", "survey"]
        })

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }

        if(surveyUserAlreadyExists){
            variables.id = surveyUserAlreadyExists.id;
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return res.json(surveyUserAlreadyExists);
        }

        //Salvar infos na tabela surveys_users
        const surveyUser = surveyUserRepository.create({
            user_id: user.id,
            survey_id: survey_id,
        })
        await surveyUserRepository.save(surveyUser);

        //Enviar email
        variables.id = surveyUser.id;
        await SendMailService.execute(email, survey.title, variables, npsPath);
        
        return res.json({
            surveyUser
        })
    }
}

export { SendMailController };
