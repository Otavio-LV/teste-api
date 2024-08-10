const express = require('express');
const bodyParser = require('body-parser');
const mercadopago = require('mercadopago');

const app = express();
const port = 3000;

// Configurar o Access Token
mercadopago.configure({
    access_token: 'TEST-6387399809939200-080903-80aece7e3228452fb36e20b090fcc97f-324207934' // Substitua pelo seu Access Token
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
                success: 'http://www.seusite.com.br/success',
                failure: 'http://www.seusite.com.br/failure',
                pending: 'http://www.seusite.com.br/pending'
            },
            auto_return: 'approved',
            notification_url: 'http://www.seusite.com.br/notifications'
        };

        const preferenceResponse = await mercadopago.preferences.create(preference);
        res.json({ id: preferenceResponse.body.id });
    } catch (error) {
        console.error('Error creating preference:', error);
        res.status(500).json({ error: 'Error creating preference' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
