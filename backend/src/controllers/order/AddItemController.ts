import {Request, Response} from 'express'
import { AddItemServce } from '../../services/order/AddItemService';

class AddItemController{
    async handle(req: Request, res:Response){
        const {order_id, product_id, amount}= req.body;
        const addItem = new AddItemServce();
        const order = await addItem.execute({
            order_id,
            product_id,
            amount
        })
        return res.json(order);
    }
}

export {AddItemController}