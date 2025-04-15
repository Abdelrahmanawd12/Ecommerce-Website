export interface Seller {
    firstName:string,
    lastName:string,
    gender:string,
    email:string,
    phone:string,
    password:string,
    dob:Date,
    address:{
        street:string,
        city:string,
        country:string
    },
    createdAt:Date,
    storeName:String,
    shippingZone:string,
    storeAddress:string
}
