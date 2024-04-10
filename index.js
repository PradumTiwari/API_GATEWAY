const express=require('express');
const morgan=require('morgan');
const axios=require('axios');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require("express-rate-limit");
const app=express();

const PORT=3005;

const limiter=rateLimit({
    windows:2*60*1000,
    max:500,
})


app.use(morgan('combined'));
app.use(limiter);

app.use('/bookingservice',async(req,res,next)=>{
    console.log(req.headers['x-access-token']);

   try {
    const response=await axios.get('http://localhost:3000/api/v1/isAuthenticated',{
        headers:{
            'x-access-token':req.headers['x-access-token']
        }
    });
    console.log(response.data);
    console.log('Booking Service');
    if(response.data.sucess){
    next();
}
    else{
        res.status(401).send('Unauthorized');
    }
   } catch (error) {
return res.status(401).json({
    error:'Unauthorized'
})    
   }
})

app.use('/bookingservice',createProxyMiddleware({target:'http://localhost:3002',changeOrigin:true}));
app.use('/ReminderService',createProxyMiddleware({target:'http://localhost:3004',changeOrigin:true}));
app.get('/home',(req,res)=>{
    res.send('Hello Pradum');
})

app.get('/useLess',(req,res)=>{
    res.send("Naman Bhai is Useless");
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})