console.log(sessionStorage.getItem("username"));
console.log(sessionStorage.getItem("password"));
console.log(sessionStorage.getItem("userType"));

// Get user session data
var username = sessionStorage.getItem("username");
var password = sessionStorage.getItem("password");
var userType = sessionStorage.getItem("userType");

// If we are missing any of the data change to login page
if(username == "" || username == "" || userType == "")
{
    window.location.replace("../session/login.html");
}