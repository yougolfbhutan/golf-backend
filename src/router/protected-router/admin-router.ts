import express from "express";
import ImportantFolder from "./api-constant";
import { bookingController } from "../../utils/constant/constant";

const adminRouter = express.Router();

adminRouter.post(
  "/create-golf-course",
  ImportantFolder.VERIFY_TOKEN,
  ImportantFolder.checkPermission("Upload_Golf_Course"),
  ImportantFolder.uploadGolfCourse.uploadGolfCourse,
);
adminRouter.post(
  "/create-caddie",
  ImportantFolder.VERIFY_TOKEN,
  ImportantFolder.checkPermission("Upload_Caddie"),
  // ImportantFolder.upload.array("file", 5),
  // ImportantFolder.uploadToCloudinary,
  ImportantFolder.caddieController.uploadCaddie,
);
adminRouter.delete(
  "/delete-caddie/:id",
  ImportantFolder.VERIFY_TOKEN,
  // ImportantFolder.checkPermission("delete-caddie"),
  ImportantFolder.caddieController.deleteCaddie,
);
adminRouter.get(
  "/get-caddie",
  ImportantFolder.VERIFY_TOKEN,
  // ImportantFolder.checkPermission("get-caddie"),
  ImportantFolder.caddieController.getCaddie,
);
adminRouter.put(
  "/update-caddie/:id",
  ImportantFolder.VERIFY_TOKEN,
  // ImportantFolder.checkPermission("get-caddie"),
  ImportantFolder.caddieController.updateCaddie,
);

adminRouter.post(
  "/create-carryset",
  ImportantFolder.VERIFY_TOKEN,
  // ImportantFolder.checkPermission("create-carryset"),
  ImportantFolder.upload.array("file", 5),
  ImportantFolder.uploadToCloudinary,
  ImportantFolder.createCarrySet.addCarrySet,
);
adminRouter.delete(
  "/delete-carryset/:id",
  ImportantFolder.VERIFY_TOKEN,
  // ImportantFolder.checkPermission("delete-carryset"),
  ImportantFolder.createCarrySet.deleteCarrySet,
);
adminRouter.put(
  "/update-carryset/:id",
  ImportantFolder.VERIFY_TOKEN,
  // ImportantFolder.checkPermission("update-carryset"),
  ImportantFolder.upload.array("file", 5),
  ImportantFolder.uploadToCloudinary,
  ImportantFolder.createCarrySet.updateCarrySet,
);
adminRouter.get(
  "/get-carryset",
  ImportantFolder.VERIFY_TOKEN,
  // ImportantFolder.checkPermission("get-carryset"),
  ImportantFolder.createCarrySet.getCarrySet,
);
// adminRouter.post(
//   "/get-carryset",
//   ImportantFolder.VERIFY_TOKEN,
//   // ImportantFolder.checkPermission("get-carryset"),
//   ImportantFolder.createCarrySet.getCarrySet,
// );
adminRouter.post(
  "/create-permission",
  ImportantFolder.VERIFY_TOKEN,
  // ImportantFolder.checkPermission("create-permission"),
  ImportantFolder.CreatePermission.addPermission,
);
adminRouter.delete(
  "/delete-permission/:id",
  ImportantFolder.VERIFY_TOKEN,
  // ImportantFolder.checkPermission("delete-permission"),
  ImportantFolder.CreatePermission.deletePermission,
);
adminRouter.put(
  "/update-permission/:id",
  ImportantFolder.VERIFY_TOKEN,
  // ImportantFolder.checkPermission("update-permission"),
  ImportantFolder.CreatePermission.updatePermission,
);
adminRouter.get(
  "/get-permission",
  ImportantFolder.VERIFY_TOKEN,
  // ImportantFolder.checkPermission("get-permission"),
  ImportantFolder.CreatePermission.getPermission,
);
adminRouter.post(
  "/create-role",
  ImportantFolder.VERIFY_TOKEN,
  // ImportantFolder.checkPermission("create-permission"),
  ImportantFolder.RoleController.createRole,
);
adminRouter.delete(
  "/delete-role/:id",
  ImportantFolder.VERIFY_TOKEN,
  // ImportantFolder.checkPermission("create-permission"),
  ImportantFolder.RoleController.deleteRole,
);
adminRouter.put(
  "/update-role/:id",
  ImportantFolder.VERIFY_TOKEN,
  // ImportantFolder.checkPermission("create-permission"),
  ImportantFolder.RoleController.updateRole,
);
adminRouter.get(
  "/get-role",
  ImportantFolder.VERIFY_TOKEN,
  // ImportantFolder.checkPermission("create-permission"),
  ImportantFolder.RoleController.getRoles,
);

adminRouter.post(
  "/create-souvenir",
  ImportantFolder.VERIFY_TOKEN,
  ImportantFolder.checkPermission("create-souvenir"),
  // ImportantFolder.upload.array("file", 5),
  // ImportantFolder.uploadToCloudinary,
  ImportantFolder.SouvenirController.createSouvenir,
);
adminRouter.delete(
  "/delete-souvenir/:id",
  ImportantFolder.VERIFY_TOKEN,
  // ImportantFolder.checkPermission("delete-souvenir"),
  ImportantFolder.SouvenirController.deleteSouvenir,
);

adminRouter.put(
  "/update-souvenir/:id",
  ImportantFolder.VERIFY_TOKEN,
  // // ImportantFolder.checkPermission("create-souvenir"),
  // ImportantFolder.upload.array("file", 5),
  // ImportantFolder.uploadToCloudinary,
  ImportantFolder.SouvenirController.updateSouvenir,
);
adminRouter.get(
  "/get-souvenirs",
  ImportantFolder.VERIFY_TOKEN,
  ImportantFolder.checkPermission("get-souvenir"),
  ImportantFolder.SouvenirController.getSouvenirs,
  // ImportantFolder.itemVariantController.createItemVariant,
);

adminRouter.post(
  "/create-itemvariant",
  ImportantFolder.VERIFY_TOKEN,
  ImportantFolder.upload.array("file", 5),
  ImportantFolder.uploadToCloudinary,
  ImportantFolder.itemVariantController.createItemVariant,
);
adminRouter.put(
  "/update-itemvariant/:id",
  ImportantFolder.VERIFY_TOKEN,
  ImportantFolder.upload.array("file", 5),
  ImportantFolder.itemVariantController.updateItemVariant,
);
adminRouter.get(
  "/get-itemvariant",
  ImportantFolder.VERIFY_TOKEN,

  ImportantFolder.itemVariantController.getItemVariant,
);
adminRouter.delete(
  "/delete-itemvariant/:id",
  ImportantFolder.VERIFY_TOKEN,

  ImportantFolder.itemVariantController.deleteItemVariant,
);
adminRouter.get(
  "/get-itemvariants",
  ImportantFolder.VERIFY_TOKEN,
  // // ImportantFolder.checkPermission("create-souvenir"),
  // ImportantFolder.SouvenirController.getSouvenirs,
  ImportantFolder.itemVariantController.getItemVariant,
);
adminRouter.post(
  "/create-payment",
  ImportantFolder.VERIFY_TOKEN,
  // ImportantFolder.checkPermission("create-souvenir"),
  ImportantFolder.PaymentController.createPayment,
);

adminRouter.get(
  "/get-payment",
  ImportantFolder.VERIFY_TOKEN,
  // ImportantFolder.checkPermission("create-souvenir"),
  ImportantFolder.PaymentController.getPayment,
);


// adminRouter.get(
//   "/get-order",
//   ImportantFolder.VERIFY_TOKEN,
//   // ImportantFolder.checkPermission("get-booking"),
//   bookingController.getOrder,
// );
// userRouter.post('/customer/signin',authController.createLogin);
// userRouter.post('/customer/logout',authController.logout);
//User Routers

adminRouter.post(
  "/create-user",
  ImportantFolder.VERIFY_TOKEN,
  // ImportantFolder.upload.array("file", 5),
  // ImportantFolder.uploadToCloudinary,
  ImportantFolder.createUserController.createUser,
);
adminRouter.put(
  "/update-user/:id",
  ImportantFolder.VERIFY_TOKEN,
  ImportantFolder.createUserController.updateUser,
);
adminRouter.get(
  "/get-user",
  ImportantFolder.VERIFY_TOKEN,

  ImportantFolder.createUserController.getUsers,
);
adminRouter.delete(
  "/delete-user/:id",
  ImportantFolder.VERIFY_TOKEN,

  ImportantFolder.createUserController.deleteUser,
);

//aprove booking /  order
// adminRouter.patch(
//   "/booking/:id/approve",
//   ImportantFolder.VERIFY_TOKEN,
//   // ImportantFolder.checkPermission("approve-booking"),
//   bookingController.approveBooking,
// );

// adminRouter.patch(
//   "/booking/:id/approveorderbooking",
//   ImportantFolder.VERIFY_TOKEN,
//   // ImportantFolder.checkPermission("approve-booking"),
//   bookingController.approveBookingAndOrder,
// );
// adminRouter.get(
//   "/booking/get-orderbooking",
//   ImportantFolder.VERIFY_TOKEN,
//   // ImportantFolder.checkPermission("get-booking"),
//   bookingController.getOrderBooking,
// );

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

export default adminRouter;
