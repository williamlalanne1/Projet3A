const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

app.use(express.json());

app.use(express.static('public'));

module.exports = app;