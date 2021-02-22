import express from 'express';

const app = express();

app.get('/teste', (req, res) => {
    return res.json({ message: 'Hello world!' });
})

app.post('/teste', (req, res) => {
    return res.json({ message: 'Os dados foram salvos com sucesso' })
})

app.listen(3333, () => {
    console.log('Server is running on port ' + 3333);
})