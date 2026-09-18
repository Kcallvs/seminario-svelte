// Servidor de produção com HTTPS, usando o adapter-node.
// Uso:
//   1. npm run build
//   2. node server.js
// Depois acesse https://localhost:8443 (o navegador vai avisar que o
// certificado é autoassinado — é normal em ambiente de teste; clique em
// "avançar/continuar mesmo assim").
import { handler } from "./build/handler.js";
import { createServer } from "https";
import fs from "fs";

const opcoesTLS = {
	key: fs.readFileSync("certs/chave.pem"),
	cert: fs.readFileSync("certs/certificado.pem")
};

const PORTA = process.env.PORT || 8443;

createServer(opcoesTLS, handler).listen(PORTA, () => {
	console.log(`Servindo em https://localhost:${PORTA}`);
});
