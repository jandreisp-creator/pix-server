const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Payment } = require("mercadopago");

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 CONFIG MERCADO PAGO
const client = new MercadoPagoConfig({
  accessToken: "APP_USR-964750908841284-042013-a2357a68ad09b64c752997470d8f29c7-1812220991"
});

const payment = new Payment(client);

// TESTE
app.get("/", (req, res) => {
  res.send("Servidor PIX rodando 🚀");
});

// CRIAR PIX
app.post("/pix", async (req, res) => {
  try {

    const { valor, descricao } = req.body;

    const result = await payment.create({
      body: {
        transaction_amount: Number(valor),
        description: descricao,
        payment_method_id: "pix",
        payer: {
          email: "teste@teste.com"
        }
      }
    });

    res.json({
      id: result.id,
      qr_code: result.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: result.point_of_interaction.transaction_data.qr_code_base64
    });

  } catch (error) {
    console.log("Erro PIX:", error);
    res.status(500).send("Erro ao gerar PIX");
  }
});

// 🔥 STATUS (ESSA É A CHAVE DO PROBLEMA)
app.get("/status/:id", async (req, res) => {
  try {

    const result = await payment.get({
      id: req.params.id
    });

    res.json({
      status: result.status
    });

  } catch (error) {
    console.log("Erro status:", error);
    res.status(500).json({ status: "error" });
  }
});

// WEBHOOK (opcional)
app.post("/webhook", (req, res) => {
  console.log("Webhook:", req.body);
  res.sendStatus(200);
});

// PORTA
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});