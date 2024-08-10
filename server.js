const express = require('express');
const bodyParser = require('body-parser');
const mercadopago = require('mercadopago');

const app = express();
const port = 3000;

// Configurar o Access Token
mercadopago.configure({
    access_token: 'TEST-6387399809939200-080903-80aece7e3228452fb36e20b090fcc97f-324207934' // Substitua pelo seu Access Token do Mercado Pago
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rota para criar uma preferência de pagamento
app.post('/create_preference', async (req, res) => {
    const { valor } = req.body;

    try {
        const preference = {
            items: [{
                title: 'Compra de Pontos',
                unit_price: parseFloat(valor),
                quantity: 1
            }],
            back_urls: {
                success: 'http://localhost:3000/success',
                failure: 'http://localhost:3000/failure',
                pending: 'http://localhost:3000/pending'
            },
            auto_return: 'approved'
        };

        const preferenceResponse = await mercadopago.preferences.create(preference);
        res.json({ id: preferenceResponse.body.id });
    } catch (error) {
        console.error('Error creating preference:', error);
        res.status(500).json({ error: 'Error creating preference' });
    }
});

app.get('/success', (req, res) => {
    res.send('Pagamento realizado com sucesso!');
});

app.get('/failure', (req, res) => {
    res.send('O pagamento falhou. Tente novamente.');
});

app.get('/pending', (req, res) => {
    res.send('O pagamento está pendente.');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
