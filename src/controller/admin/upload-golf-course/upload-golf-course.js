"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadGolfCourse = void 0;
const constants_1 = __importDefault(require("./constants"));
const response_handler_1 = require("../../../utils/response-handler/response-handler");
class UploadGolfCourse {
    // public service = new UploadImportantFiles.AdminService();
    constructor() {
        this.uploadGolfCourse = this.uploadGolfCourse.bind(this);
    }
    uploadGolfCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('req.body', req.body);
                const { golf_course_name, golf_course_location_name, golf_course_location_description, } = req.body;
                // const {data} = await this.service.ResgisterGolfCourse({
                //    golf_course_name,
                //   golf_course_location_name,
                //   golf_course_location_description,
                // })
                return response_handler_1.ApiResponse.success(res, "Successfully logged in", 200);
            }
            catch (error) {
                return constants_1.default.ApiResponse.error(res, error instanceof Error ? error.message : "An unexpected error occurred", 500);
            }
        });
    }
}
exports.UploadGolfCourse = UploadGolfCourse;
