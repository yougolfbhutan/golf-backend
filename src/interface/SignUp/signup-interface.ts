interface SignUpAttributes {
  customer_name: string;
  email: string;
  password: string;
  phone_number: string;
  salt:string,

}

interface DatabaseRegisterSttributes extends SignUpAttributes{
  // roleId:number,
    login_type?: string; // 👈 add this line (optional if only needed for Google)

}

export {SignUpAttributes,DatabaseRegisterSttributes }