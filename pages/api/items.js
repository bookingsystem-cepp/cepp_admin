import { Item } from '@/models/Item';
import { mongooseConnect } from '@/lib/mongoose';

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Item.findOne({_id:req.query.id}));
        }else {
            res.json(await Item.find());
        }
    }

    if (method === "POST") {
        const {title, description, amount, images} = req.body;
        const itemDoc = await Item.create({
            title, description, amount, images
        })
        res.json(itemDoc);
    }

    if (method === "PUT") {
        const {title, description, amount, images,  _id} = req.body;
        await Item.updateOne({_id}, {title, description, amount, images})
        res.json(true);
    }

    if (method === "DELETE") {
        if (req.query?.id) {
            await Item.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
}