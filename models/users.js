

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
