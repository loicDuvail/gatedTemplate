const submitButton = document.getElementById("submit-button");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const form = document.getElementById("login-form");
submitButton.onclick = login;

//used to avoid calling login() multiple time before fetch resolves or rejects
let debouncer = false;

async function login() {
   if (debouncer) return;
   debouncer = true;

   const emailOrUsername = emailInput.value;
   const password = passwordInput.value;

   fetch("/login", {
      method: "post",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailOrUsername, password }),
   })
      .then((response) => response.json())
      .then((data) => {
         //once fetch responds, set debouncer as false to enable calling login() again
         debouncer = false;

         if (data.error)
            return alert("authentification failed"), console.error(data.error);
         if (data.admin) return window.location.replace("/admin/adminPage");

         if (data.ok) {
            alert("you are now logged in");
            window.location.replace("/");
         }
      });
}

form.addEventListener("keydown", (key) => {
   if (key.code == "Enter") login();
});

//-----------password visibility------------//

const eyeContainer = document.getElementById("eye-container");
const closedEye = document.getElementById("closed-eye");
const openedEye = document.getElementById("opened-eye");

let toggle = false;

eyeContainer.onclick = () => {
   toggle = !toggle;
   if (toggle) {
      closedEye.style.display = "none";
      openedEye.style.display = "block";
      passwordInput.type = "text";
   } else {
      closedEye.style.display = "block";
      openedEye.style.display = "none";
      passwordInput.type = "password";
   }
};
