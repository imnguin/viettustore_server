import { outputvoucherFunc } from '../function/outputvoucher.js';
const search = async (req, res) => {
    const data = await outputvoucherFunc.search(req.body);
    res.send(data);
}

const load = async (req, res) => {
    const data = await outputvoucherFunc.load(req.body);
    res.send(data);
}

const insert = async (req, res) => {
    res.send(await outputvoucherFunc.insert(req.body));
}

export const outputvoucherController = {
    search,
    insert,
    load
}