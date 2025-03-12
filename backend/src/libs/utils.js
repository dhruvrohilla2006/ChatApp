import jwt from 'jsonwebtoken';

export const generateToken = (userId,res) => {
    const token = jwt.sign({},process.env.JWT_SECRET_KEY,{
        expiresIn:"7d",
    })

    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        httpOnly:true,// only server can access this cookie
        secure:process.env.NODE_ENV !== "development", // only https can access this cookie
        samesite:'strict'
    })

    return token;
}

