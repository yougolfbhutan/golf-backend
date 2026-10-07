"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_handler_1 = require("../../../utils/response-handler/response-handler");
const app_error_1 = require("../../../custom-error/app-error");
// import AdminService from "../../../services/admin-services/add-golf-course/adim-services";
const UploadImportantFiles = {
    ApiResponse: response_handler_1.ApiResponse,
    APIError: app_error_1.APIError,
    // AdminService:AdminService
};
exports.default = UploadImportantFiles;
