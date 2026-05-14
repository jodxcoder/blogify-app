const JWT=require('jsonwebtoken')

const secret='vedant@2005'


function createToken(user){
    const payload={
        _id:user._id,
        fullname:user.fullname,
        email:user.email,
        profileimgurl:user.profileImage,
        role:user.role
    }

    const token=JWT.sign(payload,secret)

    return token
}

function validatetoken(token){
    const payload=JWT.verify(token,secret)
    return payload
}

module.exports={
    createToken,
    validatetoken
}