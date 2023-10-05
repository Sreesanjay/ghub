const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const flash = require('connect-flash')
const hbs = require('express-handlebars');
const handlebars = require('handlebars');
const nocache = require('nocache');
var fileupload = require("express-fileupload");
const asyncHandler = require('express-async-handler')
const session = require('express-session')
const logger = require('morgan')
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

// app.engine('hbs', hbs.engine({
//   layoutsDir: __dirname + '/views/layouts',
//   extname: 'hbs',
//   runtimeOptions: {
//     allowProtoPropertiesByDefault: true,
//     allowProtoMethodsByDefault: true,
//   },
//   defaultLayout: 'layout',
//   partialsDir: __dirname + '/views/partials/'
// }));


const xhbs = hbs.create({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  defaultLayout: 'layout',
  partialsDir: __dirname + '/views/partials/'
});
app.engine('hbs', xhbs.engine);
// Register the custom Handlebars helper for subtraction
handlebars.registerHelper('subtract', function (num1, num2) {
  return num1 - num2;
});

handlebars.registerHelper('devide', function (num1, num2) {
  return num1 / num2;
});

handlebars.registerHelper('toDate', function (date) {
  date = new Date(date)
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based, so add 1
  const day = date.getDate();
  return `${year}-${month}-${day}`
});

handlebars.registerHelper('isEqual', function (str1, str2, options) {
  if (str1 === str2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
})

handlebars.registerHelper('isWishlist', function (key, array, options) {
  for (let arr of array) {
    if (key.toString() === arr.product_id.toString()) {
      return options.fn(this);
    }
  }
  return options.inverse(this);
})



// clearing cache
app.use(nocache())

//router handler
app.use('/', require('./routes/user'))
app.use('/account', require('./routes/userProfile'))
app.use('/my-cart', require('./routes/userCartRout'))
app.use('/order', require('./routes/orderRout'))


//admin
app.use('/admin', require('./routes/admin'));
app.use('/admin/category', require('./routes/adminCatRout'));
app.use('/admin/products', require('./routes/adminProductRout'));
app.use('/admin/customers', require('./routes/adminCustomerRout'));
app.use('/admin/banner-management', require('./routes/adminBannerRout'))
app.use('/admin/coupon-management', require('./routes/adminCouponRout'))
app.use('/admin/orders', require('./routes/adminOrderRout'))
app.use('/admin/sales-report', require('./routes/adminSaleReportRout'))

app.use('/get-pdf', require('./routes/testRout'))

app.use('*', isAdminLogedIn, notFound)
app.use(errorHandler)

app.listen(PORT, () => console.log(`listening on port ${PORT}`));