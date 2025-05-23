import { MongoData } from "../common/mongo.js";
import apiresult from '../model/apiresult.js';
import { baseItem } from "../model/baseItem.js";

const search = async (req) => {
    try {
        const data = await MongoData.withMongo('pm_branch', (collection) => MongoData.get(collection, req));
        return new apiresult(false, 'Lấy danh sách thành công', 'Lấy danh sách thành công', data);
    } catch (error) {
        return new apiresult(true, 'Lỗi lấy danh sách', error.message);
    }
};

const load = async (req) => {
    try {
        const data = await MongoData.withMongo('pm_branch', (collection) => MongoData.findOne(collection, req));
        return new apiresult(false, 'Lấy thông tin thành công!', 'Lấy thông tin thành công!', data);
    } catch (error) {
        return new apiresult(true, 'Lỗi lấy thông tin', error.message);
    }
};

const insert = async (req) => {
    try {
        const user = { ...req, ...baseItem };
        user.createdat = new Date();
        await MongoData.withMongo('pm_branch', (collection) => MongoData.insert(collection, user));
        return new apiresult(false, 'Thêm mới thành công', 'Thêm mới thành công');
    } catch (error) {
        return new apiresult(true, 'Lỗi thêm mới', error.message);
    }
};

const update = async (req) => {
    try {
        const filter = { branchid: req.branchid };
        await MongoData.withMongo('pm_branch', (collection) => MongoData.update(collection, req, filter));
        return new apiresult(false, 'Cập nhật thành công', 'Cập nhật thành công');
    } catch (error) {
        return new apiresult(true, 'Lỗi cập nhật', error.message);
    }
};

const deleted = async (req) => {
    try {
        const filter = { branchid: req.branchid };
        await MongoData.withMongo('pm_branch', (collection) => MongoData.deleted(collection, filter));
        return new apiresult(false, 'Xóa thành công', 'Xóa thành công');
    } catch (error) {
        return new apiresult(true, 'Lỗi Xóa', error.message);
    }
};

const getCache = async (req) => {
    try {
        const data = await MongoData.withMongo('pm_branch', (collection) => MongoData.get(collection, {}));
        return new apiresult(false, 'Lấy thông tin thành công!', 'Lấy thông tin thành công!', data);
    } catch (error) {
        return new apiresult(true, 'Lỗi lấy thông tin', error.message);
    }
};

export const branchFunc = {
    search,
    insert,
    update,
    deleted,
    load,
    getCache
};