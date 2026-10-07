interface SignInAttributes{
    email : string
    password:string
    
    
}
interface loginAttributes {
    username: string;
    password: string;
    id?:number
  }

interface GoogleSigninAttributes{
  email?:string,
  provider?:string
  customer_name?:string;
  userId?:any;
  providerAccountId?:any
  

}

interface getUserWithOauthIdAttributes{
  email:string
  provider:string
}


  
interface GoogleAuthAttributes{
   email:string,
  provider?:string
  userId:number
  providerAccountId?:any
}
interface createUserWithOauthAttributes{
   email:string,
  provider:string
  name:string
  providerAccountId?:any
}
interface linkUserWithOauthAttributes{
   provider:string
  userId:number
  providerAccountId:any
}
interface forgotPasswordAttributes{
  email:string
}
interface resetPasswordAttributes{
  token:string
  password:string
}

export{linkUserWithOauthAttributes,resetPasswordAttributes,getUserWithOauthIdAttributes,SignInAttributes,createUserWithOauthAttributes,forgotPasswordAttributes,loginAttributes,GoogleSigninAttributes,GoogleAuthAttributes}
