const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const flash = require('connect-flash')
const hbs = require('express-handlebars');
const nocache = require('nocache');
var fileupload = require("express-fileupload");
const asyncHandler = require('express-async-handler')
const session = require('express-session')
const logger=require('morgan')
const PORT = process.env.PORT || 4000;
const cookieParser = require('cookie-parser')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const { isAdminLogedIn } = require('./middleware/authMiddleware');


//db connectin
const connect = require('./config/dbConnect')
connect()

//parse request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(logger('dev'));
//file upload
// app.use(fileupload());
//connect flash
app.use(flash())

app.use(session({
  secret: 'session key',
  resave: false,
  saveUninitialized: true,
}))

//public folder setup
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs', hbs.engine({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  defaultLayout: 'layout',
  partialsDir: __dirname + '/views/partials/'
}));

// clearing cache
app.use(nocache())

//router handler
app.use('/', require('./routes/user'))
app.use('/account', require('./routes/userProfile'))


//admin
app.use('/admin', require('./routes/admin'));
app.use('/admin/category', require('./routes/adminCatRout'));
app.use('/admin/products', require('./routes/adminProductRout'));
app.use('/admin/customers', require('./routes/adminCustomerRout'));
app.use('/admin/banner-management',require('./routes/adminBannerRout'))
app.use('/admin/coupon-management',require('./routes/adminCouponRout'))

app.use('*', isAdminLogedIn, notFound)
app.use(errorHandler)

app.listen(PORT, () => console.log(`listening on port ${PORT}`));