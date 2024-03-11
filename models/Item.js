const { model, Schema, models } = require("mongoose");

const ItemSchema = new Schema({
    title: {type:String, required:true},
    description: {type: String},
    amount: {type:Number, required:true},
    images: [{type: String}],
})

export const Item = models.Item || model('Item', ItemSchema);