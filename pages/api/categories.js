import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Item } from "@/models/Item";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'GET') {
        res.json(await Category.find().populate('parent'));
    }

    if (method === 'POST') {
        const {name, parentCategory, location, description} = req.body;
        const categoryDoc = await Category.create({
            name, 
            parent:parentCategory || undefined,
            location,
            description
        });
        res.json(categoryDoc);
    }

    if (method === 'PUT') {
        const {name, parentCategory, location, description, _id} = req.body;
        const categoryDoc = await Category.updateOne({_id}, {
            name,
            parent:parentCategory,
            location,
            description
        });
        res.json(categoryDoc);
    }

    if (method === 'DELETE') {
        const {_id} = req.query;
        const parent = await Category.find({ parent: _id});
        const category_id = [...parent.map(category => category._id), _id];
        const items = await Item.find({ category: { $in: category_id } });

        if (parent.length > 0 || items.length > 0) {
            res.json('error', 400);
        } else {
            await Category.deleteOne({_id});
            res.json('ok');
        }
        res.json('ok');
    }
}