import  mongoose  from 'mongoose';

const ReadListSchema = new mongoose.Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,    
    }, 
    read:{
        type: Boolean
    },
}, {
    timestamps: true,
});


export default mongoose.model("ReadList", ReadListSchema);
