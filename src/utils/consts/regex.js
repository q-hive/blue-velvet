const REGEX = {
  nameRegex: /^[a-zA-Z\sáéíóúÁÉÍÓÚ]{1,25}$/,
  passwordRegex: /^[a-zA-Z0-9\.\_\#]{6,20}$/,
  passphraseRegex: /^[\w\s]{4,50}$/,
  emailRegex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  extPhoneRegex: /^\+\d{2}$/  ,
  phoneRegex: /^[0-9]{10}$/,
}

export default REGEX;
