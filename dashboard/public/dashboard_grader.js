/*console.log(sessionStorage.getItem("username"));
console.log(sessionStorage.getItem("password"));
console.log(sessionStorage.getItem("userType"));
*/
var axios = require("axios");

// If we are missing any of the data change to login page
if (
	sessionStorage.getItem("username") == null ||
	sessionStorage.getItem("userType") == null
) {
	window.location.replace("../login");
}

if (sessionStorage.getItem("userType") == "grader") {
	//display the grader page
	displayGraderPage();
}
function displayGraderPage() {}

async function fetchgraderAssignment(grader) {
	const response = await axios.get(
		`http://129.114.104.125:5000/assignments/fetchAll`,
		{
			params: {
				graderID: grader,
			},
		}
	);
	const json = await response.data;
	return json;
}
