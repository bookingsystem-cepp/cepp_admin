import mongoose, { Schema, model, models } from "mongoose";

const CategorySchema = new Schema({
    name: {type: String, required: true},
    parent: {type: mongoose.Types.ObjectId, ref:'Category'},
    location: {type: String, required: true},
    description: {type: String}
});

export const Category = models?.Category || model('Category', CategorySchema);