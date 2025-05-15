import { MongoData } from "../common/mongo.js";
import apiresult from '../model/apiresult.js';

const search = async (req) => {
    try {
        const data = await MongoData.withMongo('pm_product', (collection) => MongoData.get(collection, req));
        return new apiresult(false, 'Lấy danh sách thành công', 'Lấy danh sách thành công', data);
    } catch (error) {
        return new apiresult(true, 'Lỗi lấy danh sách', error.message);
    }
};

const load = async (req) => {
    try {
        const productInfo = await MongoData.withMongo('pm_product', (collection) => MongoData.findOne(collection, req));
        const unitInfo = await MongoData.withMongo('pm_quantityunit', (collection) => MongoData.findOne(collection, { quantityunitid: productInfo.quantityunitid }));
        const data = {
            ...productInfo,
            quantityunitname: unitInfo ? unitInfo.quantityunitname : '',
        };
        return new apiresult(false, 'Lấy thông tin thành công!', 'Lấy thông tin thành công!', data);
    } catch (error) {
        return new apiresult(true, 'Lỗi lấy thông tin nhân viên', error.message);
    }
};

const insert = async (req) => {
    try {
        const product = { ...req, createdat: new Date() };
        await MongoData.withMongo('pm_product', (collection) => MongoData.insert(collection, product));
        return new apiresult(false, 'Thêm mới thành công', 'Thêm mới thành công');
    } catch (error) {
        return new apiresult(true, 'Lỗi thêm mới', error.message);
    }
};

const update = async (req) => {
    try {
        const filter = { productid: req.productid };
        await MongoData.withMongo('pm_product', (collection) => MongoData.update(collection, req, filter));
        return new apiresult(false, 'Cập nhật thành công', 'Cập nhật thành công');
    } catch (error) {
        return new apiresult(true, 'Lỗi cập nhật', error.message);
    }
};

const deleted = async (req) => {
    try {
        const filter = { productid: req.productid };
        await MongoData.withMongo('pm_product', (collection) => MongoData.deleted(collection, filter));
        return new apiresult(false, 'Xóa thành công', 'Xóa thành công');
    } catch (error) {
        return new apiresult(true, 'Lỗi Xóa', error.message);
    }
};

export const productFunc = {
    search,
    insert,
    update,
    deleted,
    load
};