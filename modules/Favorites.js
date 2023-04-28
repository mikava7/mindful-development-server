import  mongoose  from 'mongoose';

const FavoritesSchema = new mongoose.Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,    
    }
}, {
    timestamps: true,
});


export default mongoose.model("Favorites", FavoritesSchema);