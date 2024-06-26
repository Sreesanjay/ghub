
# GHub
<p>
    <img src="https://img.shields.io/badge/Node%20JS-black?logo=nodedotjs"/>
<img src="https://img.shields.io/badge/Javascript-black?logo=javascript"/>
<img src="https://img.shields.io/badge/express-black?logo=express"/>
<img src="https://img.shields.io/badge/MongoDB-black?logo=mongodb"/>
<img src="https://img.shields.io/badge/Razorpay-black?logo=razorpay"/>

</p>
<br>
<img src="screenshorts/Screenshot (144).png"/>
<br> <br>

## Description

An ecommerce platform that provides a seamless shopping experience for electronic gadget enthusiasts.
Features:
- Login/Signup User Account
- Update Profile/Password User Account
- Cart Add/Remove Items | Update Quantities
- Wishlist Add/Remove Items
- Products Pagination
- Product Search
- Product Filter and Sort Based on Category | Price Range | Brand
- Order Details of All Ordered Item
- Coupon and referral offers
- Review Products User Account
- Admin: Dashboard access to only admin
- Admin: Update Order Status | Delete Order
- Admin: Add/Update Products
- Admin: Block user
- Admin: Stock Management
  
## Demo
This website is deployed on Render Please check it out [here](https://ghub-c6o3.onrender.com/) 

## Install

1. Clone the repo using
```
git clone https://github.com/Sreesanjay/ghub.git
```
2. Install dependencies
```
cd ghub
npm install
```
3. Add Environment variables
   create .env file and add the following environment variables
   ```
    PORT= PORT
    DB_URL= YOUR_MONGODB_URI
    SECRET_KEY= JWT_SECRET
    RAZORPAY_KEY= YOUR_RAZORPAY_KEY
    RAZORPAY_SECRET= YOUR_RAZORPAY_SECRET
    SESSION_SECRET= SESSION SECRET
   ```
4. Run this project on your local server by using this command
   ```
   npm run dev
   ```

