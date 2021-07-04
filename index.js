//create branch
//create branch manjitha
// create branch shubangi
// create branch reshani
const express = require('express');
const app = express();
const port = 3000;

app.get('/',(req,res)=>{
    res.send('<h1>hello success</h1>')
})

app.get('/test',(req,res)=>{
    res.send('<h1>hello test</h1>')
})

app.listen(port,()=>{
    console.log(`listening to port ${port}`);
})