import jwt from "jsonwebtoken";

// Funcion to generate a tokken

export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  return token;
};
