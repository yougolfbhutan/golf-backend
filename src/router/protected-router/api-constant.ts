import { checkPermission } from "../../utils/check-permission/check-permission";
import { VERIFY_TOKEN } from "../../middleware/token/token-access";
import {
  upload,
  uploadToCloudinary,
} from "../../utils/cloudinary-image/image-upload";
import { UploadGolfCourse } from "../../controller/admin/upload-golf-course/upload-golf-course";
// import { UploadCarrySet } from "../../controller/admin/upload-carry-set/upload-carry-set";
// import { GetBookingcontroller } from "../../controller/admin/get-booking/get-booking";
import { CaddieController } from "../../controller/admin/caddie/caddie-controller";
import { UploadCarrySet } from "../../controller/admin/carry-set/carry-set";
import { CreatePermissionController } from "../../controller/admin/permission/permission.controller";
import { RoleController } from "../../controller/admin/role/role.controller";
import { SouvenirController } from "../../controller/admin/souvenir/souvenir.controller";
import { PaymentController } from "../../controller/admin/payment/payment.controller";
import { ItemVariantController } from "../../controller/admin/item-variant/item-variant.controller";
import { CreateUserController } from "../../controller/admin/user-controller/user.controller";
// import { GetGolfCourseController } from "../../controller/user/extract-golfcourse/extract-golfcourse";
const uploadGolfCourse = new UploadGolfCourse();
const createCarrySet = new UploadCarrySet();
// const BookingController = new GetBookingcontroller();
// const getGolfCourseController = new GetGolfCourseController();
 const CreatePermission = new CreatePermissionController();
const caddieController = new CaddieController();
const roleController = new RoleController();
const souvenirController = new SouvenirController();
const paymentController = new PaymentController();
const itemVariantController = new ItemVariantController()
const createUserController = new CreateUserController();
const ImportantFolder = {
  checkPermission: checkPermission,
  VERIFY_TOKEN: VERIFY_TOKEN,
  uploadToCloudinary: uploadToCloudinary,
  upload: upload,
  uploadGolfCourse: uploadGolfCourse,
  createCarrySet: createCarrySet,
  // bookingController: BookingController,
  caddieController: caddieController,
  // getGolfCourseController: getGolfCourseController,
  CreatePermission: CreatePermission,
  RoleController: roleController,
  SouvenirController: souvenirController,
  PaymentController: paymentController,
  itemVariantController:itemVariantController,
  createUserController: createUserController
};
export default ImportantFolder;
