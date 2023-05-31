import REGEX from "../consts/regex";

const { nameRegex, passwordRegex, passphraseRegex, emailRegex, extPhoneRegex, phoneRegex } = REGEX;

export const validateInput = function (type, value) {
    const validationMap = {
        name: {
            regex: nameRegex,
            errorMessage: 'Name not valid'
        },
        lname: {
            regex: nameRegex,
            errorMessage: 'Last name not valid'
        },
        email: {
            regex: emailRegex,
            errorMessage: 'Email not valid'
        },
        password: {
            regex: passwordRegex,
            errorMessage: 'Password not valid'
        },
        passphrase: {
            regex: passphraseRegex,
            errorMessage: 'Passphrase not valid'
        },
        phone: {
            regex: phoneRegex,
            errorMessage: 'Phone not valid'
        },
        phoneExt: {
            regex: extPhoneRegex,
            errorMessage: 'Extension phone not valid'
        }
    };

    if (type in validationMap) {
        const { regex, errorMessage } = validationMap[type];

        if (!regex.test(value)) {
            return {
                valid: false,
                message: errorMessage
            };
        } else {
            return {
                valid: true,
                message: '',
            };
        }
    }

    return {
        valid: false,
        message: 'Invalid input type'
    };
};
