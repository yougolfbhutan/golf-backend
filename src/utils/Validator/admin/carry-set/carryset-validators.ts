import * as yup from "yup";

// Define the validation schema
const uploadCarrySetSchema = yup.object().shape({
  // carrysetname: yup.string().required("carrysettname is required"),
  // availibility: yup.boolean().required("availibility is required"),

  urls: yup
    .array()
    .of(yup.string().url("Each URL must be valid"))
    .required("urls is required")
    .min(1, "At least one URL is required"),
});

export default uploadCarrySetSchema;
