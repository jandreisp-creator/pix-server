const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor PIX rodando 🚀");
});

app.post("/webhook", (req, res) => {
  console.log("Webhook recebido:", JSON.stringify(req.body, null, 2));

  // Aqui você vai tratar pagamento aprovado
  if (req.body.type === "payment") {
    console.log("Pagamento recebido!");
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});