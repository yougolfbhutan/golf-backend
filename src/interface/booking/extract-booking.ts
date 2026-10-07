interface ExtractCustomerAttributes {
  customer_name: string;
  email: string;
  phone_number: string | null;
}

interface ExtractGolfCourseAttributes {
  golf_course_name: string;
  golf_course_location_name: string;
  golf_course_location_description: string;
}
interface ExtractCarrySetAttributes {
  carrysettname: string;
  availibility: boolean;
}


export interface ExtractBookingResponseAttributes{
  
    booking_status:string
    customer:ExtractCustomerAttributes
    golfCourse:ExtractGolfCourseAttributes
    carrySet:ExtractCarrySetAttributes | null 
}

export interface BookingCreatedResponseAttributes{
  id:number|null,
  booking_status:string
  date:Date,
  customerId: number|null,
  golfCourseId: number|null,
  carrySetId: number|null
}