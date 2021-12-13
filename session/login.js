// Get the button and add a click listener to it
document.querySelector("button").addEventListener("click", function()
{
    login();
});


// Gets the login info provided by the user, checks it with the database to see if they are valid users
//  if it is good, add to session and continue on to dashboard
//  if it is not good, stay on login page and display errors
function login()
{
    console.log("Login script running");

    // Get input fields
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;


    // Check Database for Valid User/Pwd
    var validUsername = true; ////
    var validPassword = true; ////

    // If the username is bad, display error
    if(!validUsername)
    {
        document.querySelector("#usernameError").innerHTML = "<font color='red'>Invalid Username.... Please Try Again</font>";
    }
    else
    {
        document.querySelector("#usernameError").innerHTML = "";
    }

    // If the password is bad, display error
    if(!validPassword)
    {
        document.querySelector("#passwordError").innerHTML = "<font color='red'>Invalid Password.... Please Try Again</font>";
    }
    else
    {
        document.querySelector("#passwordError").innerHTML = "";
    }

    // If username in password correct, store login info and redirect
    if(validUsername && validPassword)
    {
        // Get user permissions
        let accountType = "student"; ////

        // Set session variables
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("password", password);
        sessionStorage.setItem("userType", accountType);

        // Redirect to dashboard
        window.location.href = "../dashboard/dashboard.html";
    }
}