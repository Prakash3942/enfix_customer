// Required
// Email Validator
// Phone Validator
// Price Validator
// Number Validator
// Past Date Validator
// Future Date Validator

import GoogleLibPhoneNumber from "google-libphonenumber";

export const notEmpty = (string: string) => {
    return (string && string.length > 0);
}

export const isValidEmail = (email: string) => {
    return (
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email,
        )
    );
}

export const isValidPhoneNumber = (phone: string, region: string = 'IN') => {
    const phoneUtil = GoogleLibPhoneNumber.PhoneNumberUtil.getInstance();
    return (phoneUtil.isValidNumberForRegion(phoneUtil.parse(phone, region), region));
}

export const isValidPrice = (price: any = '') => {
    if(typeof price === "string") {
        return (parseFloat(price) > 0)
    }else {
        return (price > 0)
    }
}

export const isValidNumber = (number: any = '') => {
    if (typeof number === "number"){
        return !isNaN(number);
    }else {
        return false;
    }
}

