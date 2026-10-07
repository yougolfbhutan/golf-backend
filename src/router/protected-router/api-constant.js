"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_permission_1 = require("../../utils/check-permission/check-permission");
const token_access_1 = require("../../middleware/token/token-access");
const image_upload_1 = require("../../utils/cloudinary-image/image-upload");
const upload_golf_course_1 = require("../../controller/admin/upload-golf-course/upload-golf-course");
// import { UploadCarrySet } from "../../controller/admin/upload-carry-set/upload-carry-set";
// import { GetBookingcontroller } from "../../controller/admin/get-booking/get-booking";
const caddie_controller_1 = require("../../controller/admin/caddie/caddie-controller");
const carry_set_1 = require("../../controller/admin/carry-set/carry-set");
const permission_controller_1 = require("../../controller/admin/permission/permission.controller");
const role_controller_1 = require("../../controller/admin/role/role.controller");
const souvenir_controller_1 = require("../../controller/admin/souvenir/souvenir.controller");
const payment_controller_1 = require("../../controller/admin/payment/payment.controller");
const item_variant_controller_1 = require("../../controller/admin/item-variant/item-variant.controller");
const user_controller_1 = require("../../controller/admin/user-controller/user.controller");
// import { GetGolfCourseController } from "../../controller/user/extract-golfcourse/extract-golfcourse";
const uploadGolfCourse = new upload_golf_course_1.UploadGolfCourse();
const createCarrySet = new carry_set_1.UploadCarrySet();
// const BookingController = new GetBookingcontroller();
// const getGolfCourseController = new GetGolfCourseController();
const CreatePermission = new permission_controller_1.CreatePermissionController();
const caddieController = new caddie_controller_1.CaddieController();
const roleController = new role_controller_1.RoleController();
const souvenirController = new souvenir_controller_1.SouvenirController();
const paymentController = new payment_controller_1.PaymentController();
const itemVariantController = new item_variant_controller_1.ItemVariantController();
const createUserController = new user_controller_1.CreateUserController();
const ImportantFolder = {
    checkPermission: check_permission_1.checkPermission,
    VERIFY_TOKEN: token_access_1.VERIFY_TOKEN,
    uploadToCloudinary: image_upload_1.uploadToCloudinary,
    upload: image_upload_1.upload,
    uploadGolfCourse: uploadGolfCourse,
    createCarrySet: createCarrySet,
    // bookingController: BookingController,
    caddieController: caddieController,
    // getGolfCourseController: getGolfCourseController,
    CreatePermission: CreatePermission,
    RoleController: roleController,
    SouvenirController: souvenirController,
    PaymentController: paymentController,
    itemVariantController: itemVariantController,
    createUserController: createUserController
};
exports.default = ImportantFolder;
