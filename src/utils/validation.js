const validator = require("validator");

const validateRegister = (req) => {
    const { firstName, lastName, emailId, password, age, gender } = req.body;

    if (!firstName || !lastName || !emailId || !password || !age || !gender) {
        return { isValid: false, message: "All fields are required" };
    }
    else if (!validator.isEmail(emailId)) {
        return { isValid: false, message: "Invalid email format" };
    }
    else if(!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        return { isValid: false, message: "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol" };
    }
    else {
        return { isValid: true, message: "Validation passed" };
    }
}

module.exports =  validateRegister ;