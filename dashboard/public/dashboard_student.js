/*console.log(sessionStorage.getItem("username"));
console.log(sessionStorage.getItem("password"));
console.log(sessionStorage.getItem("userType"));
*/
var axios = require("axios");

sessionStorage.removeItem("student");
sessionStorage.removeItem("assignment");

// If we are missing any of the data change to login page
if (
	sessionStorage.getItem("username") == null ||
	sessionStorage.getItem("userType") == null
) {
	window.location.replace("../login");
}

if (sessionStorage.getItem("userType") != "grader") {
	//display the student page
	displayStudentPage();
}

async function displayStudentPage() {
	// Display username at top of screen
	document.querySelector("#currentUser").innerHTML =
		sessionStorage.getItem("username") +
		" (" +
		sessionStorage.getItem("userType") +
		")";

	//fetch all the student's assignments
	var student = sessionStorage.getItem("username");
	let assignments = await fetchStudentsAssignment(student);

	// Part 1: Unsubmitted assignments -----------------------------------------
	//select the container on the page
	let container = document.querySelector(".container");

	//create a section for the unsubmitted assignments
	let section = document.createElement("div");
	section.className = "section";
	let title = document.createElement("h1");
	title.innerHTML = "Submit Assignments";
	let tileHolder = document.createElement("div");
	tileHolder.className = "tile-holder";

	section.appendChild(title);
	section.appendChild(tileHolder);

	//check how may unsubmitted assignments they have

	//otherwise, add the assignments they need to submit
	let tileCount = 0;
	for (let i = 0; i < assignments.length; i++) {
		if (assignments[i].text == null) {
			tileCount += 1;
			tileHolder.appendChild(
				createTile(
					assignments[i].class,
					assignments[i].totalPoints,
					assignments[i].maxPoints,
					false
				)
			);
		}
	}
	//if the student has no assignments due, display that to screen
	if (tileCount == 0) {
		//<h2>No assignments due</h2>
		let message = document.createElement("h2");
		message.innerHTML = "No assignments due";
		tileHolder.appendChild(message);
	}
	container.appendChild(section);

	//Part 2: Graded assignments ----------------------------------------
	//select the container on the page
	container = document.querySelector(".container");

	//create a section for the graded assignments
	section = document.createElement("div");
	section.className = "section";
	title = document.createElement("h1");
	title.innerHTML = "Review Assignments";
	tileHolder = document.createElement("div");
	tileHolder.className = "tile-holder";

	section.appendChild(title);
	section.appendChild(tileHolder);

	//otherwise, add the assignments they need to submit
	tileCount = 0;
	for (let i = 0; i < assignments.length; i++) {
		if (assignments[i].text != null && assignments[i].maxPoints != 0) {
			tileCount += 1;
			tileHolder.appendChild(
				createTile(
					assignments[i].class,
					assignments[i].totalPoints,
					assignments[i].maxPoints,
					true
				)
			);
		}
	}

	//if the student has no assignments due, display that to screen
	if (tileCount == 0) {
		//<h2>No assignments due</h2>
		let message = document.createElement("h2");
		message.innerHTML = "No assignments graded yet.";
		tileHolder.appendChild(message);
	}

	container.appendChild(section);

	//Part 3: Ungraded assignments --------------------------------------------
	//select the container on the page
	container = document.querySelector(".container");

	//create a section for the ungraded assignments
	section = document.createElement("div");
	section.className = "section";
	title = document.createElement("h1");
	title.innerHTML = "Assignments Awaiting Review";
	tileHolder = document.createElement("div");
	tileHolder.className = "tile-holder";

	section.appendChild(title);
	section.appendChild(tileHolder);

	//check how may ungraded assignments they have

	//otherwise, add the assignments they need to submit
	tileCount = 0;
	for (let i = 0; i < assignments.length; i++) {
		if (assignments[i].text != null && assignments[i].maxPoints == 0) {
			tileCount += 1;
			tileHolder.appendChild(
				createTile(
					assignments[i].class,
					assignments[i].totalPoints,
					assignments[i].maxPoints,
					false
				)
			);
		}
	}
	//if the student has no assignments due, display that to screen
	if (tileCount == 0) {
		//<h2>No assignments due</h2>
		let message = document.createElement("h2");
		message.innerHTML = "All assignments have been graded.";
		tileHolder.appendChild(message);
	}

	container.appendChild(section);
}

/**
 * This method creates and returns a DOM element
 * representing a tile for an assignment
 *
 * @param {String} name the name of the assignment
 * @param {int} score the score of the assignment
 * @param {int} maxPoints the max score of the assignment
 * @param {boolean} pastDue true if the assignment cannot be submitted anymore
 * @returns A DOM element of a tile
 */
function createTile(name, score, maxPoints, pastDue) {
	//format the divs
	let tile = document.createElement("div");
	tile.className = "tile";
	let tileHeader = document.createElement("div");
	tileHeader.className = "tile-name";
	tileHeader.innerHTML = name;

	tile.appendChild(tileHeader);

	if (pastDue) {
		let tileScore = document.createElement("div");
		tileScore.className = "tile-score";
		tileScore.innerHTML = `${score}/${maxPoints}`;
		//add an event listener for the tile
		tile.addEventListener("click", function () {
			console.log("Clicked on a button.");

			sessionStorage.setItem("student", sessionStorage.getItem("username"));
			sessionStorage.setItem("assignment", name);
			// Redirect to grade.html
			window.location.href = "../grade";
		});
		tile.appendChild(tileScore);
	} else {
		let input = document.createElement("input");
		input.type = "file";
		input.className = "tile-input";
		input.innerHTML = "Submit";
		input.title = " ";
		input.addEventListener("change", function (evt) {
			// upload the assignment to the db
			loadFile(evt, name);
		});
		tile.appendChild(input);
	}

	return tile;
}

//get the file
//document.getElementById("file").onchange =
function loadFile(evt, className) {
	var file = evt.target.files[0];

	var reader = new FileReader();

	reader.onload = async function (progressEvent) {
		// By lines
		var rawText = this.result;
		var student = sessionStorage.getItem("username");
		await submitAssignment(className, student, rawText);

		// Refresh the page
		window.location.reload();
	};
	reader.readAsText(file);
}

async function submitAssignment(classname, student, rawText) {
	await axios.post("http://129.114.104.125:5000/assignments/submitAssignment", {
		params: {
			class: classname,
			studentID: student,
			text: rawText,
			highestID: 0,
			comments: [],
			maxPoints: 0,
			rows: [],
		},
	});
	return "success";
}

async function fetchStudentsAssignment(studentID) {
	const response = await axios.get(
		`http://129.114.104.125:5000/assignments/fetchAll`,
		{
			params: {
				studentID: studentID,
			},
		}
	);
	const json = await response.data;
	return json;
}
