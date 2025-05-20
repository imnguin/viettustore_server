import { MongoData } from "../common/mongo.js";
import { genov } from "../common/utils/index.js";
import apiresult from '../model/apiresult.js';
import { baseItem } from "../model/baseItem.js";

const insert = async (req) => {
    try {
        let objMaster = {
            outputvoucherid: `OV0001${genov()}`,
            createdat: new Date(),
            totalamount: req.reduce((sum, item) => sum + item.totalamount, 0),
            discountamount: req.reduce((sum, item) => sum + item.discountamount, 0),
            createduser: req[0].createduser
        }
        await MongoData.withMongo('pm_outputvoucher', (collection) =>
            MongoData.insert(collection, objMaster)
        );
        let objInsertDetail;
        if (Array.isArray(req)) {
            objInsertDetail = req.map((item) => ({ ...item, outputvoucherid: objMaster.outputvoucherid, createdat: new Date() }));
        } else {
            objInsertDetail = { ...req, outputvoucherid: objMaster.outputvoucherid, createdat: new Date() };
        }
        await MongoData.withMongo('pm_outputvoucher_detail', (collection) =>
            MongoData.insert(collection, objInsertDetail)
        );
        return new apiresult(false, 'Tạo hóa đơn thành công!', 'Tạo hóa đơn thành công!');
    } catch (error) {
        return new apiresult(true, 'Lỗi tạo mới hóa đơn', error.message);
    }
};

export const outputvoucherFunc = {
    insert,
};