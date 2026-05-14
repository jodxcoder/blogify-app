require('dotenv').config();
const express=require('express')
const path=require('path')
const userRoute=require('./routes/user')
const blogRoute=require('./routes/blog')
const mongoose=require('mongoose')
const cookieParser = require('cookie-parser')
const { checkForAuthenticationCookie } = require('./middlewares/auth')

const app=express()
const port=process.env.PORT ||8000

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('MongoDB connected successfully');
    
}).catch((err)=>{
    console.log('MongoDB connection failed',err);
})

app.use(express.urlencoded({extended:false}))
app.use(express.static(path.resolve('./public')));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'))

app.set('view engine','ejs')
app.set('views',path.resolve('./views'))

const Blog = require('./models/blog')

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({}).populate('createdBy');
    res.render('home', {
        user: req.user,
        blogs: allBlogs,
    });
})

app.use('/user',userRoute)
app.use('/blog',blogRoute)

app.listen(port,()=>{
    console.log(`server started on port ${port}`);
})