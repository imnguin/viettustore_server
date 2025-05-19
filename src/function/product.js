import { MongoData } from '../common/mongo.js';
import ApiResult from '../model/apiresult.js';

// Tìm kiếm danh sách sản phẩm theo query
const search = async (req) => {
    try {
        const data = await MongoData.withMongo('pm_product', (collection) =>
            MongoData.get(collection, req)
        );
        return new ApiResult(false, 'Lấy danh sách thành công', 'Lấy danh sách thành công', data);
    } catch (error) {
        return new ApiResult(true, 'Lỗi lấy danh sách', error.message);
    }
};

// Lấy thông tin chi tiết sản phẩm và đơn vị tính
const load = async (req) => {
    try {
        const productInfo = await MongoData.withMongo('pm_product', (collection) =>
            MongoData.findOne(collection, req)
        );
        const unitInfo = await MongoData.withMongo('pm_quantityunit', (collection) =>
            MongoData.findOne(collection, { quantityunitid: productInfo.quantityunitid })
        );
        const data = {
            ...productInfo,
            quantityunitname: unitInfo ? unitInfo.quantityunitname : '',
        };
        return new ApiResult(false, 'Lấy thông tin thành công', 'Lấy thông tin thành công', data);
    } catch (error) {
        return new ApiResult(true, 'Lỗi lấy thông tin sản phẩm', error.message);
    }
};

// Thêm mới sản phẩm (hỗ trợ thêm một hoặc nhiều sản phẩm)
const insert = async (req) => {
    try {
        let objInsert;
        if (Array.isArray(req)) {
            objInsert = req.map((item) => ({ ...item, createdAt: new Date() }));
        } else {
            objInsert = { ...req, createdAt: new Date() };
        }
        await MongoData.withMongo('pm_product', (collection) =>
            MongoData.insert(collection, objInsert)
        );
        return new ApiResult(false, 'Thêm mới thành công', 'Thêm mới thành công');
    } catch (error) {
        return new ApiResult(true, 'Lỗi thêm mới', error.message);
    }
};

// Cập nhật thông tin sản phẩm
const update = async (req) => {
    try {
        const filter = { productid: req.productid };
        await MongoData.withMongo('pm_product', (collection) =>
            MongoData.update(collection, req, filter)
        );
        return new ApiResult(false, 'Cập nhật thành công', 'Cập nhật thành công');
    } catch (error) {
        return new ApiResult(true, 'Lỗi cập nhật', error.message);
    }
};

// Xóa sản phẩm (hỗ trợ xóa một hoặc nhiều sản phẩm)
const deleted = async (req) => {
    try {
        let filter;
        if (Array.isArray(req)) {
            const productIds = req.map((item) => item.productid);
            filter = { productid: { $in: productIds } };

            // Xóa sản phẩm
            await MongoData.withMongo('pm_product', (collection) =>
                MongoData.deleteMany(collection, filter)
            );
        } else {
            filter = { productid: req.productid };
            
            // Xóa sản phẩm
            await MongoData.withMongo('pm_product', (collection) =>
                MongoData.deleted(collection, filter)
            );
        }
        return new ApiResult(false, 'Xóa thành công', 'Xóa thành công');
    } catch (error) {
        return new ApiResult(true, 'Lỗi xóa', error.message);
    }
};

export const productFunc = {
    search,
    insert,
    update,
    deleted,
    load,
};