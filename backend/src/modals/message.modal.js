import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    text: String,
    image: String,
    senderId:{
        required:true,
        ref:"User",
        type:mongoose.Schema.Types.ObjectId
    },
    reciverId:{
        required:true,
        ref:"User",
        type:mongoose.Schema.Types.ObjectId
    }
    },{
        timestamps:true
    });

const Message = mongoose.model('Message', messageSchema);
export default Message;