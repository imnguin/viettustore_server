import { MongoData } from "../common/mongo.js";
import { genov } from "../common/utils/index.js";
import apiresult from '../model/apiresult.js';
import { baseItem } from "../model/baseItem.js";

const search = async (req) => {
    const { outputvoucherid, fromdate = new Date(), todate = new Date() } = req;
    try {
        let filter = {
            createdat: {
                $gte: new Date(fromdate),
                $lte: new Date(todate)
            }
        };
        if (!!outputvoucherid) {
            filter = { outputvoucherid }
        }
        const data = await MongoData.withMongo('pm_outputvoucher', (collection) => MongoData.get(collection, filter));
        return new apiresult(false, 'Lấy danh sách thành công', 'Lấy danh sách thành công', data);
    } catch (error) {
        return new apiresult(true, 'Lỗi lấy danh sách', error.message);
    }
};

const load = async (req) => {
    try {
        const ovInfo = await MongoData.withMongo('pm_outputvoucher', (collection) => MongoData.findOne(collection, req));
        if (!ovInfo) {
            return new apiresult(true, 'Không tìm thấy thông tin hóa đơn!', 'Không tìm thấy thông tin hóa đơn!', null);
        }
        const ovDTInfo = await MongoData.withMongo('pm_outputvoucher_detail', (collection) => MongoData.get(collection, req));
        return new apiresult(false, 'Lấy thông tin thành công!', 'Lấy thông tin thành công!', { ...ovInfo, outputvoucherdetail: ovDTInfo });
    } catch (error) {
        return new apiresult(true, 'Lỗi lấy thông tin!', error.message);
    }
};

const insert = async (req) => {
    try {
        let objMaster = {
            outputvoucherid: `OV0001${genov()}`,
            createdat: new Date(),
            totalamount: req.reduce((sum, item) => sum + item.totalamount, 0),
            promotion: req.reduce((sum, item) => sum + item.promotion, 0),
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
    search,
    insert,
    load
};