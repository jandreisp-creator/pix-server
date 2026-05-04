const express = require("express");
const cors = require("cors");
const { MercadoPagoConfig, Payment } = require("mercadopago");

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 CONFIG MERCADO PAGO (SDK NOVO)
const client = new MercadoPagoConfig({
  accessToken: "APP_USR-964750908841284-042013-a2357a68ad09b64c752997470d8f29c7-1812220991"
});

const payment = new Payment(client);

// 🔥 TESTE
app.get("/", (req, res) => {
  res.send("Servidor PIX rodando 🚀");
});

// 🔥 CRIAR PIX
app.post("/pix", async (req, res) => {
  try {
    const { valor, descricao } = req.body;

    const pagamento = await payment.create({
      body: {
        transaction_amount: Number(valor),
        description: descricao,
        payment_method_id: "pix",
        payer: {
          email: "cliente@email.com"
        }
      }
    });

    res.json({
      id: pagamento.id,
      qr_code: pagamento.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: pagamento.point_of_interaction.transaction_data.qr_code_base64
    });

  } catch (error) {
    console.error("Erro PIX:", error);
    res.status(500).send("Erro ao gerar PIX");
  }
});

// 🔥 CONSULTAR STATUS
app.get("/status/:id", async (req, res) => {
  try {
    const pagamento = await payment.get({
      id: req.params.id
    });

    res.json({
      status: pagamento.status
    });

  } catch (error) {
    console.error("Erro status:", error);
    res.status(500).send("Erro ao consultar status");
  }
});

// 🔥 WEBHOOK
app.post("/webhook", (req, res) => {
  console.log("Webhook recebido:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// 🚀 PORTA (Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});