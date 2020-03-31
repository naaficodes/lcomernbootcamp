const express = require('express');

const app=express();
const port = 8000;

app.get('/login',(req,res)=>{
    return res.send("login route");
});

app.get('/signout',(req,res)=>{
    return res.send("Signed out");
});



app.get('/',(req,res)=>{
    return res.send("home");
});

app.listen(port,()=>console.log("server is up and running..."));

// const port = 3000

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))