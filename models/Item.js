import mongoose, {model, Schema, models} from 'mongoose';

const ItemSchema = new Schema({
    title: {type:String, required:true},
    description: {type: String},
    amount: {type:Number, required:true},
    images: [{type: String}],
    category: {type: mongoose.Types.ObjectId, ref:'Category', required:true}
})

export const Item = models.Item || model('Item', ItemSchema);