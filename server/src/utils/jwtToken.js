import jwt from 'jsonwebtoken';


const generateToken = (id) => {
const token = jwt.sign({id:id},process.env.JWT_TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
return token;
}

export default generateToken;