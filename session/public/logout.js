function logout() {
	// Unset session variables
	sessionStorage.removeItem("username");
	sessionStorage.removeItem("password");
	sessionStorage.removeItem("userType");

	// Redirect to login
	window.location.href = "http://129.114.104.125:8102/login";
}
