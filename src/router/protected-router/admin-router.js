"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_constant_1 = __importDefault(require("./api-constant"));
const constant_1 = require("../../utils/constant/constant");
const adminRouter = express_1.default.Router();
adminRouter.post("/create-golf-course", api_constant_1.default.VERIFY_TOKEN, api_constant_1.default.checkPermission("Upload_Golf_Course"), api_constant_1.default.uploadGolfCourse.uploadGolfCourse);
adminRouter.post("/create-caddie", api_constant_1.default.VERIFY_TOKEN, api_constant_1.default.checkPermission("Upload_Caddie"), 
// ImportantFolder.upload.array("file", 5),
// ImportantFolder.uploadToCloudinary,
api_constant_1.default.caddieController.uploadCaddie);
adminRouter.delete("/delete-caddie/:id", api_constant_1.default.VERIFY_TOKEN, 
// ImportantFolder.checkPermission("delete-caddie"),
api_constant_1.default.caddieController.deleteCaddie);
adminRouter.get("/get-caddie", api_constant_1.default.VERIFY_TOKEN, 
// ImportantFolder.checkPermission("get-caddie"),
api_constant_1.default.caddieController.getCaddie);
adminRouter.put("/update-caddie/:id", api_constant_1.default.VERIFY_TOKEN, 
// ImportantFolder.checkPermission("get-caddie"),
api_constant_1.default.caddieController.updateCaddie);
adminRouter.post("/create-carryset", api_constant_1.default.VERIFY_TOKEN, api_constant_1.default.checkPermission("create-carryset"), api_constant_1.default.upload.array("file", 5), api_constant_1.default.uploadToCloudinary, api_constant_1.default.createCarrySet.addCarrySet);
adminRouter.delete("/delete-carryset/:id", api_constant_1.default.VERIFY_TOKEN, 
// ImportantFolder.checkPermission("delete-carryset"),
api_constant_1.default.createCarrySet.deleteCarrySet);
adminRouter.put("/update-carryset/:id", api_constant_1.default.VERIFY_TOKEN, 
// ImportantFolder.checkPermission("update-carryset"),
api_constant_1.default.upload.array("file", 5), api_constant_1.default.uploadToCloudinary, api_constant_1.default.createCarrySet.updateCarrySet);
adminRouter.get("/get-carryset", api_constant_1.default.VERIFY_TOKEN, 
// ImportantFolder.checkPermission("get-carryset"),
api_constant_1.default.createCarrySet.getCarrySet);
// adminRouter.post(
//   "/get-carryset",
//   ImportantFolder.VERIFY_TOKEN,
//   // ImportantFolder.checkPermission("get-carryset"),
//   ImportantFolder.createCarrySet.getCarrySet,
// );
adminRouter.post("/create-permission", api_constant_1.default.VERIFY_TOKEN, 
// ImportantFolder.checkPermission("create-permission"),
api_constant_1.default.CreatePermission.addPermission);
adminRouter.delete("/delete-permission/:id", api_constant_1.default.VERIFY_TOKEN, 
// ImportantFolder.checkPermission("delete-permission"),
api_constant_1.default.CreatePermission.deletePermission);
adminRouter.put("/update-permission/:id", api_constant_1.default.VERIFY_TOKEN, 
// ImportantFolder.checkPermission("update-permission"),
api_constant_1.default.CreatePermission.updatePermission);
adminRouter.get("/get-permission", api_constant_1.default.VERIFY_TOKEN, 
// ImportantFolder.checkPermission("get-permission"),
api_constant_1.default.CreatePermission.getPermission);
adminRouter.post("/create-role", api_constant_1.default.VERIFY_TOKEN, 
// ImportantFolder.checkPermission("create-permission"),
api_constant_1.default.RoleController.createRole);
adminRouter.delete("/delete-role/:id", api_constant_1.default.VERIFY_TOKEN, 
// ImportantFolder.checkPermission("create-permission"),
api_constant_1.default.RoleController.deleteRole);
adminRouter.put("/update-role/:id", api_constant_1.default.VERIFY_TOKEN, 
// ImportantFolder.checkPermission("create-permission"),
api_constant_1.default.RoleController.updateRole);
adminRouter.get("/get-role", api_constant_1.default.VERIFY_TOKEN, 
// ImportantFolder.checkPermission("create-permission"),
api_constant_1.default.RoleController.getRoles);
adminRouter.post("/create-souvenir", api_constant_1.default.VERIFY_TOKEN, api_constant_1.default.checkPermission("create-souvenir"), 
// ImportantFolder.upload.array("file", 5),
// ImportantFolder.uploadToCloudinary,
api_constant_1.default.SouvenirController.createSouvenir);
adminRouter.delete("/delete-souvenir/:id", api_constant_1.default.VERIFY_TOKEN, 
// ImportantFolder.checkPermission("delete-souvenir"),
api_constant_1.default.SouvenirController.deleteSouvenir);
adminRouter.put("/update-souvenir/:id", api_constant_1.default.VERIFY_TOKEN, 
// // ImportantFolder.checkPermission("create-souvenir"),
// ImportantFolder.upload.array("file", 5),
// ImportantFolder.uploadToCloudinary,
api_constant_1.default.SouvenirController.updateSouvenir);
adminRouter.get("/get-souvenirs", api_constant_1.default.VERIFY_TOKEN, api_constant_1.default.checkPermission("get-souvenir"), api_constant_1.default.SouvenirController.getSouvenirs);
adminRouter.post("/create-itemvariant", api_constant_1.default.VERIFY_TOKEN, api_constant_1.default.upload.array("file", 5), api_constant_1.default.uploadToCloudinary, api_constant_1.default.itemVariantController.createItemVariant);
adminRouter.put("/update-itemvariant/:id", api_constant_1.default.VERIFY_TOKEN, api_constant_1.default.upload.array("file", 5), api_constant_1.default.itemVariantController.updateItemVariant);
adminRouter.get("/get-itemvariant", api_constant_1.default.VERIFY_TOKEN, api_constant_1.default.itemVariantController.getItemVariant);
adminRouter.delete("/delete-itemvariant/:id", api_constant_1.default.VERIFY_TOKEN, api_constant_1.default.itemVariantController.deleteItemVariant);
adminRouter.get("/get-itemvariants", api_constant_1.default.VERIFY_TOKEN, 
// // ImportantFolder.checkPermission("create-souvenir"),
// ImportantFolder.SouvenirController.getSouvenirs,
api_constant_1.default.itemVariantController.getItemVariant);
adminRouter.post("/create-payment", api_constant_1.default.VERIFY_TOKEN, 
// ImportantFolder.checkPermission("create-souvenir"),
api_constant_1.default.PaymentController.createPayment);
adminRouter.get("/get-payment", api_constant_1.default.VERIFY_TOKEN, 
// ImportantFolder.checkPermission("create-souvenir"),
api_constant_1.default.PaymentController.getPayment);
// adminRouter.get(
//   "/get-order",
//   ImportantFolder.VERIFY_TOKEN,
//   // ImportantFolder.checkPermission("get-booking"),
//   bookingController.getOrder,
// );
// userRouter.post('/customer/signin',authController.createLogin);
// userRouter.post('/customer/logout',authController.logout);
//User Routers
adminRouter.post("/create-user", api_constant_1.default.VERIFY_TOKEN, 
// ImportantFolder.upload.array("file", 5),
// ImportantFolder.uploadToCloudinary,
api_constant_1.default.createUserController.createUser);
adminRouter.put("/update-user/:id", api_constant_1.default.VERIFY_TOKEN, api_constant_1.default.createUserController.updateUser);
adminRouter.get("/get-user", api_constant_1.default.VERIFY_TOKEN, api_constant_1.default.createUserController.getUsers);
adminRouter.delete("/delete-user/:id", api_constant_1.default.VERIFY_TOKEN, api_constant_1.default.createUserController.deleteUser);
//aprove booking /  order
// adminRouter.patch(
//   "/booking/:id/approve",
//   ImportantFolder.VERIFY_TOKEN,
//   // ImportantFolder.checkPermission("approve-booking"),
//   bookingController.approveBooking,
// );
adminRouter.patch("/booking/:id/approveorderbooking", api_constant_1.default.VERIFY_TOKEN, 
// ImportantFolder.checkPermission("approve-booking"),
constant_1.bookingController.approveBookingAndOrder);
adminRouter.get("/booking/get-orderbooking", api_constant_1.default.VERIFY_TOKEN, 
// ImportantFolder.checkPermission("get-booking"),
constant_1.bookingController.getOrderBooking);
// adminRouter.patch(
//   "/order/:id/approve",
//   ImportantFolder.VERIFY_TOKEN,
//     // ImportantFolder.checkPermission("approve-order"),
//   bookingController.approveOrder,
// );
// //cancel booking / order
// adminRouter.patch(
//   "/booking/:id/cancel",
//   ImportantFolder.VERIFY_TOKEN,
//     // ImportantFolder.checkPermission("cancel-booking"),
//   bookingController.cancelGolfBooking,
// );
// adminRouter.patch(
//   "/order/:id/cancel",
//   ImportantFolder.VERIFY_TOKEN,
//   // ImportantFolder.checkPermission("cancel-order"),
//   bookingController.cancelOrder,
// );
exports.default = adminRouter;
