// Unset session variables
sessionStorage.removeItem("username");
sessionStorage.removeItem("password");
sessionStorage.removeItem("userType");

// Redirect to login
window.location.href = "./login.html";