var axios = require("axios");

// Get the button and add a click listener to it
document.querySelector("button").addEventListener("click", function () {
	login();
});

// Gets the login info provided by the user, checks it with the database to see if they are valid users
//  if it is good, add to session and continue on to dashboard
//  if it is not good, stay on login page and display errors
async function login() {
	console.log("Login script running");

	// Get input fields
	let username = document.querySelector("#username").value;
	let password = document.querySelector("#password").value;

	// Check Database for Valid User/Pwd
	var result = await validateLogin(username, password);

	// If the username or password is bad, display error
	if (result == null) {
		document.querySelector("#passwordError").innerHTML =
			"<font color='red'>Invalid Username or Password.... Please Try Again</font>";
	} else {
		document.querySelector("#passwordError").innerHTML = "";

		// Set session variables
		sessionStorage.setItem("username", result.username);
		sessionStorage.setItem("password", result.password);
		sessionStorage.setItem("userType", result.accountType);

		// Redirect to dashboard
		window.location.href = "../dashboard/dashboard.html";
	}
}

/**
 * This function retrieves the assignment to the database if it exists
 * 1
 * @param {String} className the id of the class
 * @param {String} studentID the id of the student
 */
async function validateLogin(inputUsername, inputPassword) {
	const response = await axios.get(
		`http://129.114.104.125:5000/users/validate`,
		{
			params: {
				username: inputUsername,
				password: inputPassword,
			},
		}
	);
	const json = await response.data;
	return json;
}
