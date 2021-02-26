import express, { NextFunction } from 'express';
import 'express-async-errors';
import 'reflect-metadata';
import createConnection from './database';
import { AppError } from './errors/AppError';
import { router } from './routes';

createConnection();
const app = express();

app.use(express.json())
app.use(router);

app.use((err: Error, req: express.Request, res: express.Response, _next: NextFunction) => {
    if(err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message
        })
    }

    return res.status(500).json({
        status: "Error",
        message: `Internal server error ${err.message}`
    })
})

export { app };