import { outputvoucherFunc } from '../function/outputvoucher.js';

const insert = async (req, res) => {
    res.send(await outputvoucherFunc.insert(req.body));
}

export const outputvoucherController = {
    insert,
}