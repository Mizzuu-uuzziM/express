import express from 'express'
const app = express()
import * as qris from './lib/qris.js'

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/qris/create', (req, res) => {
    const { username, nominal, note } = req.query
 
    if(!username && !nominal && !note) return res.json({
        status: false,
        message: 'Query username, nominal, note dibutuhkan'
    });

    const result = qris.createQris(username, nominal, note);
    res.json({
        status: true,
        result
    })
})

app.get('/qris/status', (req, res) => {
    const { orderId, nomoinal } = req.query;

    if(!orderId && !nominal) return res.json({
        status: false,
        message: 'Query orderId dan nomonal dibutuhkan'
    });

    const result = qris.checkStatus(orderId, nomoinal)
    res.json({
        status: true,
        result
    })
})

app.listen(8000, () => console.log('Server Running'))