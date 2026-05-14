const { Schema, model } = require('mongoose')
const { createHmac, randomBytes } = require('crypto')
const { createToken } = require('../services/auth')
const userSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    profileImage: {
        type: String,
        required: false,
        default: '/images/default.png'
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    },
    salt: {
        type: String,

    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

// Remove 'next' from the arguments and add 'async'
userSchema.pre('save', async function () {
    const user = this;

    if (!user.isModified('password')) return; // Just return, no next() needed

    const salt = randomBytes(16).toString('hex');
    const hashedpwd = createHmac('sha256', salt).update(user.password).digest('hex');

    user.salt = salt;
    user.password = hashedpwd;

    // No need to call next() at the end
});
userSchema.static('matchpwd', async function (email, password) {
    const user = await this.findOne({ email })
    if (!user) throw new Error('User not found')

    const salt = user.salt
    const storedhash = user.password

    const enteredpwdhash = createHmac('sha256', salt).update(password).digest('hex');

    if (enteredpwdhash !== storedhash) throw new Error('Invalid Password')

    const token = createToken(user)
    return token
})
const User = model('User', userSchema)

module.exports = User