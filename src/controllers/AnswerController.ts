import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";

class AnswerController {
    async execute(req: Request, res: Response) {
        const { value } = req.params;
        const { u } = req.query;

        const surveyUserRepository = getCustomRepository(SurveyUserRepository);

        const surveyUser = await surveyUserRepository.findOne({ id: String(u) });

        if(!surveyUser) {
            throw new AppError("Survey_User does not exist", 400);
        }

        surveyUser.value = Number(value);

        await surveyUserRepository.save(surveyUser);

        return res.json(surveyUser);
    }
}

export { AnswerController };