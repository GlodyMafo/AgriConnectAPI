// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     firstName: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     lastName: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         lowercase: true,
//         trim: true
//     },
//     phone: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     role: {
//         type: String,
//         enum: ['admin', 'farmer', 'buyer'], 
//         default: 'buyer'
//     },
//     location: {
//         type: String,
//         trim: true,
//         required:true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('User', userSchema);

class User {
  constructor(firstName, lastName, email, phone, role, location, passWord) {
    const allowedRoles= ["Admin", "Farmer", "Buyer"];

    if (!allowedRoles.includes(role)) {
      throw new Error(`Invalid role: ${role}. Allowed roles are ${allowedRoles.join(", ")}`);
    }

    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.role = role;
    this.location = location;
    this.passWord = passWord;
    this.createdAt = new Date();
  }
}


module.exports = User;
