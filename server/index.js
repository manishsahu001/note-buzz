const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 4000;
const HOSTNAME = '127.0.0.1';
require('./db/database');

app.use(cors());
app.use(express.json());
app.use('/api/auth/', require('./routes/auth'));
app.use('/api/post/', require('./routes/post'));
app.listen(PORT, HOSTNAME, ()=>{
    console.log(`Server is running at ${PORT}`);
})