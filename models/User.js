import mongoose from 'mongoose';


const userScheme = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    created_at:{
        type: Date,
        required: true,
        default: Date.now
    }
})


const User = mongoose.model('User', userScheme)

export default User