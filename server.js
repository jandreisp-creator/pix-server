const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor PIX rodando 🚀");
});

const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: "APP_USR-964750908841284-042013-a2357a68ad09b64c752997470d8f29c7-1812220991",
});

app.post("/webhook", async (req, res) => {
  console.log("Webhook recebido:", JSON.stringify(req.body, null, 2));

  try {
    if (req.body.type === "payment") {
      const paymentId = req.body.data.id;

      const payment = await mercadopago.payment.findById(paymentId);

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