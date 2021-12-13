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
async function displayGraderPage() {
	//fetch all the student's assignments
	var grader = sessionStorage.getItem("username");
	let graderJson = await fetchgraderAssignments(grader);
	graderJson = graderJson[0];

	//select the container on the page
	let container = document.querySelector(".container");

	//Part 1: add a section to create assignments
	let section = document.createElement("div");
	section.className = "section";
	let title = document.createElement("h1");
	title.innerHTML = "Create New Assignment";
	let tileHolder = document.createElement("div");
	tileHolder.className = "tile-holder";

	//create form for submitting new assignment
	let form = document.createElement("div");
	let label = document.createElement("label");
	label.innerHTML = "Assignment Name";
	let input = document.createElement("input");
	input.type = "text";
	input.id = "assignment_name";
	input.name = "assignment_name";
	label.for = "assignment_name";
	let submit = document.createElement("button");
	submit.value = "Create";

	submit.onclick = async function () {
		let name = document.querySelector("#assignment_name").value;
		let students = graderJson.students;
		for (let i = 0; i < students.length; i++) {
			await insertAssignment(name, grader, students[i], null);
		}
		// Refresh the page
		window.location.reload();
	};
	form.appendChild(label);
	form.appendChild(input);
	form.appendChild(submit);
	tileHolder.appendChild(form);
	section.appendChild(title);
	section.appendChild(tileHolder);
	container.appendChild(section);

	//Part 2: create a section for each assignment
	for (let i = 0; i < graderJson.assignments.length; i++) {
		let assignment = graderJson.assignments[i];
		//create a section for the assignment
		let section = document.createElement("div");
		section.className = "section";
		let title = document.createElement("h1");
		title.innerHTML = assignment;
		let tileHolder = document.createElement("div");
		tileHolder.className = "tile-holder";

		section.appendChild(title);
		section.appendChild(tileHolder);

		//fetch all the student submissions from the database
		let studentWork = await fetchStudentsForClass(assignment);

		//add a tile for each student
		let tileCount = 0;
		for (let i = 0; i < studentWork.length; i++) {
			if (studentWork[i].text != null) {
				tileCount += 1;
				tileHolder.appendChild(
					createTile(
						studentWork[i].studentID,
						studentWork[i].maxPoints,
						studentWork[i].maxPoints,
						studentWork[i].maxPoints != 0
					)
				);
			}
		}
		//if the student has no assignments due, display that to screen
		if (tileCount == 0) {
			//<h2>No assignments due</h2>
			let message = document.createElement("h2");
			message.innerHTML = "No students in the class";
			tileHolder.appendChild(message);
		}
		container.appendChild(section);
	}
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
			// Redirect to grade.html
			//window.location.href = "../grade";
		});
		tile.appendChild(tileScore);
	}

	return tile;
}

async function fetchgraderAssignments(grader) {
	const response = await axios.get(
		`http://129.114.104.125:5000/grader_classes/fetchClasses`,
		{
			params: {
				graderID: grader,
			},
		}
	);
	const json = await response.data;
	return json;
}

async function fetchStudentsForClass(className) {
	const response = await axios.get(
		`http://129.114.104.125:5000/assignments/fetchAll`,
		{
			params: {
				class: className,
			},
		}
	);
	const json = await response.data;
	return json;
}

async function insertAssignment(classname, grader, student, rawText) {
	//check if the assignment has already been created
	const response = await axios.get(`http://129.114.104.125:5000/assignments`, {
		params: {
			class: classname,
			studentID: student,
		},
	});
	const json = await response.data;
	//If the assignment already exists, update it with the new content
	if (response.data != null) {
		await axios.post(
			"http://129.114.104.125:5000/assignments/updateAssignment",
			{
				params: {
					_id: response.data._id,
					class: classname,
					studentID: student,
					graderID: grader,
					text: rawText,
					highestID: 0,
					comments: [],
					maxPoints: 0,
					rows: [],
				},
			}
		);
	} else {
		//if it does not exist, create it
		await axios.post("http://129.114.104.125:5000/assignments/create", {
			params: {
				class: classname,
				studentID: student,
				graderID: grader,
				text: rawText,
				highestID: 0,
				comments: [],
				maxPoints: 0,
				rows: [],
			},
		});
		let assignments = await fetchgraderAssignments(grader);
		assignments.push(classname);
		await axios.post("http://129.114.104.125:5000/grader_classes/addClass", {
			params: {
				graderID: grader,
				assignments: assignments,
			},
		});
	}
}
