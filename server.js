const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const flash = require('connect-flash')
const hbs = require('express-handlebars');
const nocache = require('nocache');
const session = require('express-session')
const logger = require('morgan')
const PORT = process.env.PORT || 4000;
const cookieParser = require('cookie-parser')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const { isAdminLogedIn } = require('./middleware/authMiddleware');
const adminRoute = require('./routes/admin')
const userRoute = require('./routes/user')
const customHelpers = require('./config/helpers.js');
//db connectin
const connect = require('./config/dbConnect')
connect()
//parse request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger('dev'));
//connect flash
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}))
//public folder setup
app.use(express.static(path.join(__dirname, 'public')));

// -----view engine setup --------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
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
// Register the custom helpers from the separate file
customHelpers();
app.engine('hbs', xhbs.engine);


// clearing cache
app.use(nocache())
//router handler
app.use('/', userRoute) //user route
app.use('/admin', adminRoute); //admin route
app.use('*', isAdminLogedIn, notFound)
app.use(errorHandler)

app.listen(PORT, () => console.log(`listening on port ${PORT}`));