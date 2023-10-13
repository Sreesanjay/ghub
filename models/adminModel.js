const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// Declare the Schema of the Mongo model
var adminSchema = new mongoose.Schema(
     {
          user_name: {
               type: String,
               required: true,
          },
          admin_email: {
               type: String,
               required: true,
               unique: true,
          },
          admin_password: {
               type: String,
               required: true,
          },
     },
     {
          timestamps: true,
     }
);
// hashing admins password
adminSchema.pre("save", async function (next) {
     const salt = await bcrypt.genSalt(10);
     console.log(this);
     this.admin_password = await bcrypt.hash(this.admin_password, salt);
     next();
});

//static functions for login and password
adminSchema.statics.login = async function (email, password) {
     const admin = await this.findOne({ admin_email:email });
     console.log(admin)
     if (admin) {
          let auth = await bcrypt.compare(password, admin.admin_password);
          if (auth) {
               return admin;
          } else {
               throw Error("Incorrect password!");
          }
     } else {
          throw Error("User not found!");
     }
};

//Export the model
module.exports = mongoose.model("Admin", adminSchema);
