import * as yup from "yup";

// Define the validation schema
const loginCutomerSchema = yup.object().shape({
  email: yup.string().email().required("email is required"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters"),
});

export const loginGoogleCutomerSchema = yup.object().shape({
  email: yup.string().email().required("email is required"),
});
export const UpdateCustomerPassword = yup.object().shape({
   password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters"),
});
export default loginCutomerSchema;
