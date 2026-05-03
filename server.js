const express = require('express');
const cors = require('cors');

// SDK NOVO MERCADO PAGO
const { MercadoPagoConfig, Payment } = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors());

// 🔐 CONFIG
const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-964750908841284-042013-a2357a68ad09b64c752997470d8f29c7-1812220991'
});

const payment = new Payment(client);

// 🔥 ROTA PIX
app.post('/pix', async (req, res) => {

    try {

        const { total } = req.body;

        console.log("💰 Valor recebido:", total);

        const result = await payment.create({
            body: {
                transaction_amount: Number(total) || 10,
                description: "Compra Ajad Cosméticos",
                payment_method_id: "pix",
                payer: {
                    email: "teste@teste.com"
                }
            }
        });

        const qr_base64 = result.point_of_interaction.transaction_data.qr_code_base64;

        console.log("✅ PIX criado:", result.id);

        res.json({
            id: result.id,
            qrCode: `data:image/png;base64,${qr_base64}`
        });

    } catch (error) {

        console.log("❌ ERRO PIX:", error);

        res.status(500).json({
            erro: "Erro ao gerar PIX"
        });

    }

});

// 🔎 STATUS
app.get('/status/:id', async (req, res) => {

    try {

        const result = await payment.get({
            id: req.params.id
        });

        res.json({
            status: result.status
        });

    } catch (error) {

        console.log("❌ ERRO STATUS:", error);

        res.status(500).json({
            erro: "Erro ao verificar"
        });

    }

});

// 🚀 START
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Servidor rodando na porta", PORT);
});