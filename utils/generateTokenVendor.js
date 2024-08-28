const jwt = require("jsonwebtoken");

const generateTokenVendor = (
  id,
  name, nameAm,
  email,
  registered,
  phone,
  category,
  logo,
  registrationNumber
) => {
  return jwt.sign(
    { id, name, nameAm, email, registered, phone, category, logo, registrationNumber },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

module.exports = generateTokenVendor;
