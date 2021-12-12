var axios = require("axios");

async function insertAssignment(classname, student) {
	await axios.post("http://129.114.104.125:5000/assignments/create", {
		params: {
			class: classname,
			studentID: student,
		},
	});
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

async function updateRubric(classname, student, newRubric, newMaxPoints) {
	await axios.post("http://129.114.104.125:5000/assignments/updateRubric", {
		params: {
			class: classname,
			studentID: student,
			maxPoints: newMaxPoints,
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

//deleteAssignment("class1", "student2");
