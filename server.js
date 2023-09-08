const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const hbs = require('express-handlebars');
const PORT = process.env.PORT || 4000;
const cookieParser = require('cookie-parser')
//db connectin
const connect = require('./config/dbConnect')
connect()
const errMiddleware = require('./middleware/errorMiddleware')



//parse request
app.use(express.json());
app.use(express.urlencoded({ extended:true}))
app.use(cookieParser());
//creating public folder
app.use(express.static(path.join(__dirname, 'public')));
// view engine setup 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({ 
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'layout',
    partialsDir:__dirname+'/views/partials/'
    }));
app.use('/' , require('./routes/user'))
app.use('/admin', require('./routes/admin'));
app.use(errMiddleware.notFound)
app.use(errMiddleware.errorHandler)

app.listen(PORT,()=>console.log(`listening on port ${PORT}`));