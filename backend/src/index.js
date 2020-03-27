const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();

app.use(cors()); //determina qual endereço pode acessar nossa aplicação.(sem argumento = qualquer endereço)
app.use(express.json());
app.use(routes);



app.listen(3333);
