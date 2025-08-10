// Switch to login form
function showLogin() {
    document.getElementById("registerForm").classList.add("d-none");
    document.getElementById("loginForm").classList.remove("d-none");
}

// Switch to register form
function showRegister() {
    document.getElementById("loginForm").classList.add("d-none");
    document.getElementById("registerForm").classList.remove("d-none");
}

// Password validation
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const passwordMatchMsg = document.getElementById("passwordMatchMsg");

document.getElementById("registrationForm").addEventListener("submit", function(e) {
e.preventDefault();

// Validate first and last name length & uppercase start
const namePattern = /^[A-Z][a-zA-Z]{2,14}$/; // First letter uppercase, total length 3–15
    
if (!namePattern.test(firstNameInput.value)) {
    alert("First name must start with an uppercase letter and be between 3 and 15 letters.");
    return;
}

if (!namePattern.test(lastNameInput.value)) {
    alert("Last name must start with an uppercase letter and be between 3 and 15 letters.");
    return;
}

const password = passwordInput.value;
const confirmPassword = confirmPasswordInput.value;
const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{9,12}$/;

if (!passwordPattern.test(password)) {
    alert("Password must be 9–12 characters, include 1 uppercase letter, 1 number, and 1 special character.");
    return;
}

if (password !== confirmPassword) {
    passwordMatchMsg.classList.remove("d-none");
    return;
} 

else{
        passwordMatchMsg.classList.add("d-none");
}

alert("Registration successful!");

// Reset the form
this.reset();

// Reset icons & input types
document.getElementById("togglePassword").innerHTML = '<i class="fa-solid fa-lock"></i>';
document.getElementById("toggleConfirmPassword").innerHTML = '<i class="fa-solid fa-lock"></i>';
passwordInput.type = "password";
confirmPasswordInput.type = "password";
});


function setupPasswordToggle(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);

    toggle.addEventListener("click", function () {
        if (input.type === "password") {
            input.type = "text";
            toggle.innerHTML = '<i class="fa-solid fa-unlock"></i>';
        } 
        
        else {
            input.type = "password";
            toggle.innerHTML = '<i class="fa-solid fa-lock"></i>';
            }
        });
    }

setupPasswordToggle("password", "togglePassword");
setupPasswordToggle("confirmPassword", "toggleConfirmPassword");

// Check password match in real-time
    
confirmPasswordInput.addEventListener("input", function() {
    if (passwordInput.value !== confirmPasswordInput.value) {
        passwordMatchMsg.classList.remove("d-none");
    } 
    
    else {
            passwordMatchMsg.classList.add("d-none");
        }
});

// Login form submit
document.getElementById("loginFormElement").addEventListener("submit", function(e) {
    e.preventDefault();
});