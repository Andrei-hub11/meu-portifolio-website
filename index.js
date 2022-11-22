const wrapperMenu = document.querySelector(".menu-icon");
const navBar = document.querySelector(".navbar");
const toggleBtn = document.querySelector(".checkbox");
const body = document.getElementsByTagName("body")[0];
const sectionAbout = document.getElementsByClassName("nav-link")[0];
const sectionServices = document.getElementsByClassName("nav-link")[1];
const sectionProjects = document.getElementsByClassName("nav-link")[2];
const sectionContact = document.getElementsByClassName("nav-link")[3];
const toTop = document.getElementsByClassName("icon--arrow")[0];

let darkModeState = false;

wrapperMenu.addEventListener("click", function () {
  wrapperMenu.classList.toggle("open");
  navBar.classList.toggle("openmenu");
});

toggleBtn.addEventListener("change", (e) => {
  const toggleCheck = e.target.checked;
  darkModeState = toggleCheck === true ? "true" : "false";
  setDarkModeLocalStorage(darkModeState);
  setTimeout(() => {
    changeDarkMode(toggleCheck);
  }, 300);
});

const changeDarkMode = (checked) => {
  if (checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    toggleBtn.checked = true;
    darkModeState = checked;
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    darkModeState = checked;
    toggleBtn.checked = false;
  }
};

/* para verificar mudanças no tema do sistema, com o addListener abaixo*/
const usedark = matchMedia("(prefers-color-scheme: dark)");

/* para pegar o tema atual */
const usetheme = matchMedia("(prefers-color-scheme: dark)").matches;

/* const checkingThemePreference = (state) => {
  console.log(state);
  if (state === true) {
    toggleBtn.checked = true;
    darkModeState = state;
    changeDarkMode(true);
  } else {
    darkModeState = state;
    changeDarkMode(false);
  }
}; */

usedark.addListener((evt) => {
  changeDarkMode(evt.matches);
});

changeDarkMode(usetheme);

const setDarkModeLocalStorage = (state) => {
  localStorage.setItem("dark-mode", state);
};

const checkLocalStorage = () => {
  localStorage.getItem("dark-mode") === null
    ? setDarkModeLocalStorage(usetheme)
    : changeDarkMode(localStorage.getItem("dark-mode") == "true");
};

checkLocalStorage();

const BTN_CONTACT = document.getElementsByClassName("btn--contact")[0];
const btntext = document.getElementById("btnText");
const FORM = document.getElementsByClassName("contact__form")[0];
const NAME = document.getElementsByClassName("name")[0];
const EMAIL = document.getElementsByClassName("email")[0];
const CAMPO_MSG = document.getElementsByClassName("input__textarea")[0];
const FORM_SUBSCRIPTION =
  document.getElementsByClassName("subscription__form")[0];
const emailSubscription =
  document.getElementsByClassName("input-subscription")[0];

FORM.addEventListener("submit", (e) => {
  e.preventDefault();
  checkInputs(NAME.value, NAME.id);
  checkInputs(EMAIL.value, EMAIL.id);
  checkInputs(CAMPO_MSG.value, CAMPO_MSG.id);

  const contactControl = document.getElementsByClassName(
    "contact__form-control"
  )[0];
  const emailControl = document.getElementsByClassName(
    "contact__form-control"
  )[1];
  const textareaControl = document.getElementsByClassName(
    "contact__form-control"
  )[2];

  if (
    contactControl.classList.contains("success") &&
    emailControl.classList.contains("success") &&
    textareaControl.classList.contains("success")
  ) {
    shippingAnimation();
  }
});

const checkInputs = (value, el) => {
  const inputValue = value.trim();
  const elValidation = el;

  if (elValidation !== "name" && elValidation !== "email") {
    inputValue === ""
      ? setErrorTextArea(
          CAMPO_MSG,
          "Por favor, digite sua mensagem antes de tentar enviar."
        )
      : setSuccessTextArea(CAMPO_MSG);
  }

  if (elValidation === "name") {
    inputValue === ""
      ? setErrorFor(NAME, "Nome do usuário não pode estar em branco.")
      : setSuccessFor(NAME);
  }

  if (elValidation === "email") {
    if (inputValue === "") {
      setErrorFor(EMAIL, "O campo de email não pode estar em branco");
      return;
    }

    !isEmail(inputValue)
      ? setErrorFor(EMAIL, "Esse email não é válido")
      : setSuccessFor(EMAIL);
  }
};

const setErrorFor = (input, message) => {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");
  const iconSuccess = formControl.querySelector("img");

  iconSuccess.src = "./images/bx-x-circle.svg";
  small.innerText = message;

  formControl.className = "contact__form-control form--data error";
};

const setSuccessFor = (input) => {
  const formControl = input.parentElement;

  const iconSuccess = formControl.querySelector("img");
  iconSuccess.src = "./images/bx-check-circle.svg";

  formControl.className = "contact__form-control form--data success";
};

const setErrorTextArea = (input, message) => {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");

  CAMPO_MSG.style.border = "2px solid #db2820";

  small.innerText = message;

  formControl.className = "contact__form-control textarea--data error";
};

const setSuccessTextArea = (input) => {
  const formControl = input.parentElement;

  CAMPO_MSG.style.border = "none";

  formControl.className = "contact__form-control textarea--data success";
};

FORM_SUBSCRIPTION.addEventListener("submit", (e) => {
  e.preventDefault();
  checkInputsSubscription();
});

const checkInputsSubscription = () => {
  const emailSubscriptionValue = emailSubscription.value.trim();

  if (emailSubscriptionValue === "") {
    setErrorSubscription(emailSubscription, "Email em branco");
  } else if (!isEmail(emailSubscriptionValue)) {
    setErrorSubscription(emailSubscription, "Esse email não é válido");
  } else {
    setSuccessSubscription(emailSubscription);
    setTimeout(() => {
      sendEmail(
        "Andrei",
        emailSubscriptionValue,
        "Alguém inscreveu-se para receber as novidades"
      );
      restartSubscriptionForm();
    }, 1000);
  }
};

const setErrorSubscription = (input, message) => {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");
  const iconSuccess = formControl.querySelector("img");

  iconSuccess.src = "./images/bx-x-circle.svg";
  small.innerText = message;

  formControl.className = "subscription__control subscription--data error";
};

const setSuccessSubscription = (input) => {
  const formControl = input.parentElement;

  const iconSuccess = formControl.querySelector("img");

  iconSuccess.src = "./images/bx-check-circle.svg";
  formControl.className = "subscription__control subscription--data success";
};

const isEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

const shippingAnimation = () => {
  btntext.innerText = "Obrigado";
  BTN_CONTACT.classList.add("active");
  setTimeout(() => {
    sendEmail("Andrei", EMAIL.value, CAMPO_MSG.value);
    restartForm();
    BTN_CONTACT.classList.remove("active");
    btntext.innerText = "Enviar";
    swal({
      title: "Mensagem recebida!",
      text: "Responderei assim que possível.",
      icon: "success",
    });
  }, 2000);
};

const sendEmail = (name, email, msg) => {
  emailjs.send("service_5bnv14j", "template_7b495qg", {
    from_name: email,
    to_name: name,
    message: msg,
  });
};

const restartForm = () => {
  const controlElements = [
    ...document.querySelectorAll(".contact__form-control"),
  ];
  CAMPO_MSG.style.border = "none";
  CAMPO_MSG.value = "";
  NAME.value = "";
  EMAIL.value = "";

  for (let i = 0; i < controlElements.length; i++) {
    if (controlElements[i].classList.contains("success")) {
      controlElements[i].classList.remove("success");
    }
  }
};

const restartSubscriptionForm = () => {
  const controlElements = [
    ...document.querySelectorAll(".subscription__control"),
  ];

  for (let i = 0; i < controlElements.length; i++) {
    if (controlElements[i].classList.contains("success")) {
      controlElements[i].classList.remove("success");
    }
  }

  emailSubscription.value = "";

  setTimeout(() => {
    swal({
      title: "Obrigado por se inscrever!",
      text: "Avisarei sempre que houve novidaes.",
      icon: "success",
    });
  }, 100);
};

sectionAbout.onclick = () => {
  const element = document.querySelector("#aboutId");
  const topPos = element.getBoundingClientRect().top + window.pageYOffset;
  if (navBar.classList.contains("openmenu")) {
    wrapperMenu.classList.remove("open");
    navBar.classList.remove("openmenu");
  }

  window.scrollTo({
    top: topPos,
    behavior: "smooth",
  });
};

sectionServices.onclick = () => {
  const element = document.querySelector("#servicesId");
  const topPos = element.getBoundingClientRect().top + window.pageYOffset;

  if (navBar.classList.contains("openmenu")) {
    wrapperMenu.classList.remove("open");
    navBar.classList.remove("openmenu");
  }

  window.scrollTo({
    top: topPos,
    behavior: "smooth",
  });
};

sectionProjects.onclick = () => {
  const element = document.querySelector("#projectsId");
  const topPos = element.getBoundingClientRect().top + window.pageYOffset;

  if (navBar.classList.contains("openmenu")) {
    wrapperMenu.classList.remove("open");
    navBar.classList.remove("openmenu");
  }

  window.scrollTo({
    top: topPos, // scroll so that the element is at the top of the view
    behavior: "smooth", // smooth scroll
  });

  /* const element = document.querySelector("#projectsId");
  console.log(element);
  const rect = element.getBoundingClientRect(); // get rects(width, height, top, etc)
  const viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );

  window.scroll({
    top: rect.top + rect.height / 2 - viewHeight / 2,
    behavior: "smooth", // smooth scroll
  }); */
};

sectionContact.onclick = () => {
  const element = document.querySelector("#contactId");
  const topPos = element.getBoundingClientRect().top + window.pageYOffset;

  if (navBar.classList.contains("openmenu")) {
    wrapperMenu.classList.remove("open");
    navBar.classList.remove("openmenu");
  }

  window.scrollTo({
    top: topPos,
    behavior: "smooth",
  });
};

let scrollTop = document.querySelector(".scroll-top");

window.addEventListener("scroll", () => {
  scrollTop.classList.toggle("scroll-active", window.scrollY >= 900);
});

document.addEventListener("click", (e) => {
  const isCloset = e.composedPath().includes(toTop);
  if (isCloset) scrolltoHome || scrollTop.click();
});

/* !!Bug a ser resolvido na função abaixo. O botão de rolagem para o topo não funciona quando sobre uma seção com form. Shadow DOM */

const scrolltoHome = () => {
  const element = document.querySelector("#home");
  const topPos = element.getBoundingClientRect().top + window.pageYOffset;

  window.scrollTo({
    top: topPos,
    behavior: "smooth",
  });
};

/* scrollTop.onclick = () => {
  const element = document.querySelector("#home");
  const topPos = element.getBoundingClientRect().top + window.pageYOffset;

  window.scrollTo({
    top: topPos,
    behavior: "smooth",
  });
}; */
