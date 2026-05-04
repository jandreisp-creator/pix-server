const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor PIX rodando 🚀");
});

const { MercadoPagoConfig, Payment } = require("mercadopago");

const client = new MercadoPagoConfig({
  accessToken: "APP_USR-964750908841284-042013-a2357a68ad09b64c752997470d8f29c7-1812220991",
});

const payment = new Payment(client);
app.post("/pix", async (req, res) => {
  try {
    const payment_data = {
      transaction_amount: 1,
      description: "Pagamento teste",
      payment_method_id: "pix",
      payer: {
        email: "teste@teste.com",
      },

      // 🔥 ESSENCIAL
      notification_url: "https://pix-server-fscq.onrender.com/webhook",
    };

    const result = await mercadopago.payment.create(payment_data);

    res.json(result.body);
  } catch (error) {
    console.error("Erro ao criar PIX:", error.message);
    res.status(500).send("Erro ao gerar PIX");
  }
});

app.post("/webhook", async (req, res) => {
  console.log("Webhook recebido:", JSON.stringify(req.body, null, 2));

  try {
    if (req.body.type === "payment") {
      const paymentId = req.body.data.id;

      const paymentData = await payment.get({ id: paymentId });

console.log("Status do pagamento:", paymentData.status);

if (paymentData.status === "approved") {
  console.log("✅ PAGAMENTO APROVADO!");
}

      console.log("Status do pagamento:", payment.body.status);

      if (payment.body.status === "approved") {
        console.log("✅ PAGAMENTO APROVADO!");
      }
    }
  } catch (error) {
    console.error("Erro no webhook:", error.message);
  }

  res.sendStatus(200);
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});