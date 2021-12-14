var axios = require("axios");

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
	}
}

async function updateComments(classname, student, newComments, newHighestId) {
	await axios.post("http://129.114.104.125:5000/assignments/updateComments", {
		params: {
			class: classname,
			studentID: student,
			highestID: newHighestId,
			comments: newComments,
		},
	});
}

async function updateRubric(classname, student, newRubric, newMaxPoints, newTotalPoints) {
	await axios.post("http://129.114.104.125:5000/assignments/updateRubric", {
		params: {
			class: classname,
			studentID: student,
			maxPoints: newMaxPoints,
			totalPoints: newTotalPoints,
			rubric: newRubric,
		},
	});
}

/**
 * This function deletes the assignment to the database if it exists
 * @param {String} className the id of the class
 * @param {String} studentID the id of the student
 */
async function deleteAssignment(classname, student) {
	await axios.delete(`http://129.114.104.125:5000/assignments/delete`, {
		params: {
			class: classname,
			studentID: student,
		},
	});
	//const response = await axios.get(`http://localhost:5000/assignments/delete/${className}/${studentID}`);
}

/**
 * This function retrieves the assignment to the database if it exists
 * 1
 * @param {String} className the id of the class
 * @param {String} studentID the id of the student
 */
async function fetchAssignment(classname, student) {
	const response = await axios.get(`http://129.114.104.125:5000/assignments`, {
		params: {
			class: classname,
			studentID: student,
		},
	});
	const json = await response.data;
	console.log("FETCHED");
	console.log(json);
	return json;
}

async function fetchStudentsAssignment(student) {
	const response = await axios.get(
		`http://129.114.104.125:5000/assignments/fetchAll`,
		{
			params: {
				studentID: student,
			},
		}
	);
	const json = await response.data;
	return json;
}

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
/*
insertAssignment(
	"class2",
	"student1",
	"This is all that the student submittted. But now they submitted more!"
);
*/
