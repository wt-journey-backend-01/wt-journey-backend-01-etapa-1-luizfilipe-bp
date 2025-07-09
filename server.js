const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('devburger/public'));

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'devburger', 'views', 'index.html'));
});

app.get('/sugestao', async (req, res) => {
    const nome = req.query.nome;
    const ingredientes = req.query.ingredientes;

    if(!nome || !ingredientes){
        return res.status(400).send('O campo nome e ingredientes são obrigatórios.');
    }

    res.status(200).send(`
        <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset='utf-8'>
                <title>Obrigado pela contribuição</title>
                <meta name='viewport' content='width=device-width, initial-scale=1'>
                <link rel='stylesheet' href="/css/style.css">
            </head>
            <body>
                <h1>Sugestão recebida pela nossa equipe!</h1>
                <p>A sua sugestão já está em nosso sistema, obrigado por contribuir!</p>
                <p>O nome que você sugeriu: ${nome}</p>
                <p>Os ingredientes de seu lanche: ${ingredientes}</p>
                <p>
                    <a href="/">Voltar para o cardápio</a>
                </p>
            </body>
        </html>
        `)
});

app.get('/contato', (req, res) =>{
    res.status(200).sendFile(path.join(__dirname, 'devburger', 'views', 'contato.html'));
});

app.post('/contato', (req, res) => {
    const nome = req.body.nome;
    const email = req.body.email;
    const assunto = req.body.assunto;
    const mensagem = req.body.mensagem;

    if (!nome || !email || !assunto || !mensagem) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const informacoes_formulario_contato = new URLSearchParams({nome, email, assunto, mensagem}).toString();
    res.redirect(`/contato-recebido?${informacoes_formulario_contato}`);
});

app.get('/contato-recebido', (req, res) => {
    const nome = req.query.nome;
    const email = req.query.email;
    const assunto = req.query.assunto;
    const mensagem = req.query.mensagem;

    if (!nome || !email || !assunto || !mensagem) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }
    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset='utf-8'>
            <title>Contato Recebido</title>
            <meta name='viewport' content='width=device-width, initial-scale=1'>
            <link rel='stylesheet' href="/css/style.css">
        </head>
        <body>
            <h1>O seu contato foi recebido pela nossa equipe</h1>
            <p>Você receberá uma resposta em breve! As informações que recebemos: </p>
            <p>Nome: ${nome}</p>
            <p>Email: ${email}</p>
            <p>Assunto: ${assunto}</p>
            <p>Mensagem: ${mensagem}</p>
            <p>
                <a href="/">Voltar para o cardápio</a>
            </p>
        </body>
        </html>
    `);
});

app.get('/api/lanches', (req, res) => {
    fs.readFile(path.join(__dirname, 'devburger', 'public', 'data', 'lanches.json'), 'utf-8', (err, data) =>{
        if(err){
            return res.status(500).send('Erro ao ler o cardápio de lanches.');
        }

        return res.status(200).json(JSON.parse(data));
    })
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'devburger', '404.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor da DevBurger rodando em localhost:${PORT}`);
});