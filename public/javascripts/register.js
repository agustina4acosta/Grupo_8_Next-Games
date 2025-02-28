const $ = (id) => document.getElementById(id);

const msgError = (element, message, {target}) => {
    $(element).innerHTML = message
    target.classList.add('is-invalid')
}

const cleanError = (element, {target}) => {
    target.classList.remove('is-invalid')
    target.classList.remove('is-valid')
    $(element).innerHTML = null
}

async function verifyEmail(email) {
  try {
    const response = await fetch('/api/users/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email
      })
    });

    const result = await response.json();

    return result.data.existUser;
  } catch (error) {
    console.error(error);
    throw {
      status: 500,
      message: error.message
    };
  }
}

async function verifyuserName(userName) {
  try {
    const response = await fetch('/api/users/verify-username', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName: userName
      })
    });

    const result = await response.json();

    return result.data.existUser;
  } catch (error) {
    console.error(error);
    throw {
      status: 500,
      message: error.message
    };
  }
}

const regExLetter = /^[A-Z]+$/i;
const regExEmail =
  /^(([^<>()\[\]\.,;:\s@\”]+(\.[^<>()\[\]\.,;:\s@\”]:+)*)|(\”.+\”))@(([^<>()[\]\.,;:\s@\”]+\.)+[^<>()[\]\.,;:\s@\”]{2,})$/;
const regExPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/; //mayuscula, numero y 6 a 12 caracteres
const regExPass2 =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_-])[A-Za-z\d$@$!%*?&_-]{6,12}/;

  const regExExt = /\.(jpg|jpeg|png|gif|webp)$/i;

  $('image').addEventListener('change', function (e) {
    const submitBtnContainer = document.querySelector('.submit-btn--crear');
    const selectedImage = document.getElementById('selectedImage');
    const boxImagePreview = document.getElementById('boxImagePreview');
  
    $('btnImage').innerText = "Subir imagen";
  
    if (!regExExt.test(this.value)) {
      $('imageError').innerHTML = "Solo se admiten imágenes jpg | jpeg | png | gif | webp";
      selectedImage.style.display = 'none';
      boxImagePreview.querySelector('.fa-image').style.display = 'inline-block';
      submitBtnContainer.classList.remove('is-valid');
      submitBtnContainer.classList.add('is-invalid');
    } else {
      cleanError('imageError', event);
      $('btnImage').innerText = "Cambiar imagen";
      submitBtnContainer.classList.remove('is-invalid');
      submitBtnContainer.classList.add('is-valid');
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
          selectedImage.src = e.target.result;
          selectedImage.style.display = 'inline-block';
          selectedImage.style.marginBottom = '8px';
          selectedImage.style.display = 'inline-block';
          selectedImage.style.height = '180px';
          selectedImage.style.marginTop = '20px';
          selectedImage.style.objectFit = 'contain';
          selectedImage.style.border = '2px solid black';
          selectedImage.style.backgroundColor = 'white';
          boxImagePreview.querySelector('.fa-image').style.display = 'none';
        };
        reader.readAsDataURL(this.files[0]);
      }
    }
});


  $('name').addEventListener('blur', function(e){
    switch (true) {
        case !this.value.trim():
            msgError('errorName',"El nombre es obligatorio",e)
            
            break;
            case this.value.trim().length < 2 || this.value.trim().length > 50 :
                msgError('errorName', "Entre 2 y 50 caracteres",e)
                break
                case !regExLetter.test(this.value.trim()):
                    msgError('errorName', "Solo caracteres alfabeticos",e)
                break 
    
        default:
            this.classList.add('is-valid')
            checkedFields()
            break;
    }
  });
  $('name').addEventListener('focus', function(e) {
    cleanError('errorName', e)
  })

  $('surname').addEventListener('blur', async function(e) {
    switch (true) {
      case !this.value.trim():
        msgError('errorSurname', "El apellido es obligatorio", e);
        break;
      case this.value.trim().length < 2 || this.value.trim().length > 50:
        msgError('errorSurname', "Entre 2 y 50 caracteres", e);
        break;
      case !regExLetter.test(this.value.trim()):
        msgError('errorSurname', "Solo caracteres alfabéticos", e);
        break;
      default:
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
        checkedFields();
        break;
    }
  });
  
  $('surname').addEventListener('focus', function(e) {
    cleanError('errorSurname', e);
  });
  

  $('user').addEventListener('blur',async function(e){
    switch (true) {
        case !this.value.trim():
            msgError('errorUsername', "El usuario es obligatorio", e)
            break;
        case this.value.trim().length < 2:
        msgError('errorUsername', "Minimo 2 caracteres",e)
        break
        case this.value.trim().length > 50:
          msgError('errorUsername', "Maximo 50 caracteres",e)
        break
        case !regExLetter.test(this.value.trim()):
            msgError('errorUsername', "Solo caracteres alfabeticos",e)
        break
        case await verifyuserName(this.value.trim()):
        msgError("errorUsername", "El usuario ya se encuentra registrado", e);
        break;
        default:
            this.classList.add('is-valid')
            checkedFields()
            break;
    }
  });

  $('user').addEventListener('focus', function(e) {
    cleanError('errorUsername', e)
  })

  
  $('email').addEventListener('blur',async function(e) {
    const emailInput = this.value.trim();
  
    if (!emailInput) {
      msgError('errorEmail', "El email es obligatorio", e);
      this.classList.remove('is-valid');
      this.classList.add('is-invalid');
    } else if (!regExEmail.test(emailInput)) {
      msgError('errorEmail', "Tiene que ser un email válido", e);
      this.classList.remove('is-valid');
      this.classList.add('is-invalid');
    }else if (await verifyEmail(this.value.trim())) {
      msgError("errorEmail", "El email ya se encuentra registrado", e);
      this.classList.remove('is-valid');
      this.classList.add('is-invalid');    
    } else{
      this.classList.remove('is-invalid');
      this.classList.add('is-valid');
      checkedFields();
    }
  });
  
  $('email').addEventListener('focus', function(e) {
    cleanError('errorEmail', e);
  });
  
  $('password').addEventListener('blur', function(e){
    switch (true) {
      case !this.value.trim():
        msgError('errorPass', "La contraseña es obligatoria", e);
        break;
      case !regExPass.test(this.value.trim()):
        msgError('errorPass', "Debe tener entre 6 y 12 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial ($@!%*?&_-)", e);
        break;
      default:
        this.classList.add('is-valid');
        this.classList.remove('pass-invalid');
        checkedFields();
        break;
    }
  });
  
  $('password').addEventListener('focus', function(e) {
    cleanError('errorPass', e);
    $("msgPassword").hidden = false;
  });
  
  const exRegs = {
    exRegMayu: /[A-Z]/,
    exRegMinu: /[a-z]/,
    exRegNum: /[0-9]/,
    exRegEsp: /[$@!%*?&_-]/,
    exRegMin: /.{6,}/,
    exRegMax: /.{13}/,
  };
  
  const validPassword = (element, exReg, value) => {
    const elementClass = $(element).classList;
    if (!exReg.test(value)) {
      elementClass.add("pass-invalid");
      elementClass.remove("pass-valid");
    } else {
      elementClass.add("pass-valid");
      elementClass.remove("pass-invalid");
    }
  };
  
  const validMaxPassword = (element, exReg, value) => {
    const elementClass = $(element).classList;
    if (!exReg.test(value)) {
      elementClass.add("pass-valid");
      elementClass.remove("pass-invalid");
    } else {
      elementClass.remove("pass-valid");
      elementClass.add("pass-invalid");
    }
  };
  
  $("password").addEventListener("keyup", function() {
    validPassword("mayu", exRegs.exRegMayu, this.value);
    validPassword("minu", exRegs.exRegMinu, this.value);
    validPassword("num", exRegs.exRegNum, this.value);
    validPassword("esp", exRegs.exRegEsp, this.value);
    validPassword("min", exRegs.exRegMin, this.value);
    validMaxPassword("max", exRegs.exRegMax, this.value);
  
    if (this.value === "") {
      $("max").classList.remove("pass-invalid");
    }
  });
  
  $('password2').addEventListener('blur', function(e){
    switch (true) {
        case !this.value.trim():
            msgError('errorPass2', "Confirme la contraseña", e)
            break;

        case this.value.trim() !== $('password').value.trim():
            msgError('errorPass2', "La confirmación no coincide",e)
        break
        default:
            this.classList.add('is-valid')
            checkedFields()
            break;
    }
  });

  $('password2').addEventListener('focus', function(e) {
    cleanError('errorPass2', e)
  })

  $("terms").addEventListener("click", function (e) {
    if ($("terms").checked) {
      error = true;
      $("error-terms").innerHTML = "Debes aceptar las bases y condiciones";
      $("terms").classList.add("is-invalid");
    } else {
      $("error-terms").innerHTML = "";
      $("terms").classList.remove("is-invalid");
    }
  });

  $('formRegister').addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateTerm()) {
      msgError('error-terms', "Debes aceptar las bases y condiciones", { target: $('terms') });
    }
  
    const showRecaptchaErrorMessage = (message) => {
      const errorFormLogin = $("errorFormLogin");
      errorFormLogin.innerHTML = message;
      errorFormLogin.classList.add("text");
    };

    const validateRecaptcha = () => {
  const response = grecaptcha.getResponse();
  if (!response) {
    showRecaptchaErrorMessage("Completa el reCAPTCHA");
    return false;
  } else {
    const errorFormLogin = $("errorFormLogin");
    errorFormLogin.innerHTML = "";
    errorFormLogin.classList.remove("text");
    return true;
  }
};

    if (!validateName()) {
      msgError('errorName', "El nombre es obligatorio", { target: $('name') });
    }
  
    if (!validateSurname()) {
      msgError('errorSurname', "El apellido es obligatorio", { target: $('surname') });
    }
  
    if (!validateUsername()) {
      msgError('errorUsername', "El usuario es obligatorio", { target: $('user') });
    }
  
    if (!validateEmail()) {
      msgError('errorEmail', "El email es obligatorio y debe ser válido", { target: $('email') });
    }
  
    if (!validatePassword()) {
      msgError('errorPass', "La contraseña es obligatoria y debe cumplir los requisitos", { target: $('password') });
    }
  
    if (!validateConfirmPassword()) {
      msgError('errorPass2', "Confirme la contraseña", { target: $('password2') });
    }
  
    if (validateName() && validateSurname() && validateUsername() && validateEmail() && validatePassword() && validateConfirmPassword() && validateRecaptcha() && validateTerm()) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Usuario creado con exito',
        showConfirmButton: false,
        timer: 1500
      })
      this.submit();
    }
  });
  
  const validateName = () => {
    const name = $('name').value.trim();
    return name.length >= 2 && name.length <= 50 && regExLetter.test(name);
  };
  
  const validateSurname = () => {
    const surname = $('surname').value.trim();
    return surname.length >= 2 && surname.length <= 50 && regExLetter.test(surname);
  };
  
  const validateUsername = () => {
    const username = $('user').value.trim();
    return username.length >= 2 && username.length <= 50 && regExLetter.test(username);
  };
  
  const validateEmail = () => {
    const email = $('email').value.trim();
    return email.length > 0;
  };
  
  const validatePassword = () => {
    const password = $('password').value.trim();
    return password.length > 0 && regExPass.test(password);
  };
  
  const validateConfirmPassword = () => {
    const password = $('password').value.trim();
    const confirmPassword = $('password2').value.trim();
    return confirmPassword.length > 0 && confirmPassword === password;
  };

  const validateTerm = () => {
  const term = $("terms");
  return term.checked;
};
  