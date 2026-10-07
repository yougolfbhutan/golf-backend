import * as yup from "yup";

// Define the validation schema
const CaddieSchema = yup.object().shape({
  caddiename: yup.string().required("caddiename is required"),
  // availibility: yup.boolean().required("availibility is required"),

  urls: yup.object({
    imageUrl: yup
      .string()
      .url("Invalid URL format")
      .required("Image URL is required"),
  }),
});
export default CaddieSchema;
