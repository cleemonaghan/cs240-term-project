/**
 * This file is a union of the grade.js, graderScript.js and
 * mongoInteractions.js files. It is bundled using browserify
 * and saved as the file grade_bundle.js for grade.html to use.
 */

var axios = require("axios");
var student = sessionStorage.getItem("userType") != "grader";

var thisClassName = sessionStorage.getItem("assignment");
var thisStudentID = sessionStorage.getItem("student");
var jsonObject;

loadFile();

//add event listener to the home button
document.querySelector("#homeButton").addEventListener("click", function () {
	window.location.href = "../dashboard";
});

//get the file
async function loadFile() {
	//var file = this.files[0];
	jsonObject = await fetchAssignment(thisClassName, thisStudentID);

	var rawText = jsonObject.text; //new FileReader();

	// Get the element for the code panel
	let code = document.querySelector(".code-text");

	//clear the old file from the screen
	code.replaceChildren([]);
	//clear the old comments from the screen
	document.querySelector(".comment-hub").replaceChildren([]);

	//reader.onload = function (progressEvent) {
	// By lines
	var lines = rawText.split("\n");
	let wordIndex = 0;
	for (var i = 0; i < lines.length; i++) {
		//console.log(lines[i]);
		//create a line for each child
		let line = document.createElement("div");
		let word = document.createElement("span");
		//get the tabbing
		let index = 1;
		while (index - 1 < lines[i].length && lines[i][index - 1] == "\t") {
			index++;
		}
		word.innerHTML = `${i + 1}.`;
		word.id = `line${i + 1}.`;
		word.className = "code-word";
		word.style = `padding-right: ${20 * index}px`;
		line.appendChild(word);
		let arrayOfWords = lines[i].split(" ");
		for (let j = 0; j < arrayOfWords.length; j++) {
			word = document.createElement("div");
			word.innerHTML = arrayOfWords[j].trim() + " ";
			word.className = "code-word";
			word.id = `word-${wordIndex}`;
			wordIndex++;
			line.appendChild(word);
		}

		code.appendChild(line);
	}

	//add all the previous comments to the screen
	uploadPreviousComments(jsonObject.class, jsonObject.studentID);

	//if a grader, add a listener for new comments
	if (!student) {
		//add an event listener the code-panel
		code.addEventListener("mouseup", function () {
			let selection = window.getSelection();
			let startElement = selection.getRangeAt(0).startContainer.parentElement;
			let endElement = selection.getRangeAt(0).endContainer.parentElement;
			if (startElement == endElement) return;
			else {
				let newID = jsonObject.highestID + 1;
				jsonObject.highestID = newID;
				createCommentElement(
					newID,
					startElement,
					endElement,
					"Make new comment here",
					false
				);
			}
		});
	}
	//};
	//reader.readAsText(file);
}

function createCommentElement(
	commentID,
	startElement,
	endElement,
	comment,
	fromDatabase
) {
	// Phase 1: Create the comment element in the comment-hub
	let comment_hub = document.querySelector(".comment-hub");
	//create the comment
	var newComment = document.createElement("div");
	newComment.className = "comment-item";
	newComment.id = commentID;
	//newComment.id = startElement.parentElement.firstChild.innerHTML; //parseInt(this.parentElement.firstChild.innerHTML);
	//create the id for the comment (which holds the line of the error)
	let commentLine = document.createElement("div");
	commentLine.innerHTML = startElement.parentElement.firstChild.innerHTML;
	//create the text area for the comment
	let commentInput = document.createElement("textarea");
	commentInput.innerHTML = comment;
	//if we are a student, make the comment box readonly
	if (student) commentInput.readOnly = true;

	//if we are not a student, add an event listener to the commentInput
	if (!student) {
		commentInput.addEventListener("blur", function () {
			updateCommentInFile(newComment);
		});
	}
	//if we are not a student, create the delete button for the comment
	let commentDelete;
	if (!student) {
		commentDelete = document.createElement("button");
		commentDelete.innerHTML = "&#10005;";
		commentDelete.addEventListener("click", function () {
			this.parentElement.parentElement.removeChild(this.parentElement);
			//remove the underline the text
			traverseCodeWords(startElement, endElement, function (n) {
				n.style = "text-decoration: none";
			});
			deleteCommentFromFile(newComment);
		});
	}
	//add all the components of the comment to the comment element
	newComment.appendChild(commentLine);
	newComment.appendChild(commentInput);
	if (!student) newComment.appendChild(commentDelete);

	//underline the text
	traverseCodeWords(startElement, endElement, function (n) {
		n.style = "text-decoration: underline red";
	});

	//add event listeners to newComment
	newComment.addEventListener("mouseenter", function (event) {
		event.target.className = "comment-item-highlighted";
		document.getElementById(`line${commentLine.innerHTML}`).scrollIntoView({
			behavior: "smooth",
			block: "center",
			inline: "nearest",
		});
		traverseCodeWords(startElement, endElement, function (n) {
			n.style = "background: red";
		});
	});
	newComment.addEventListener("mouseleave", function () {
		this.className = "comment-item";
		traverseCodeWords(startElement, endElement, function (n) {
			n.style = "background: rgb(50, 50, 50)";
			n.style = "text-decoration: underline red";
		});
	});

	// Phase 2: Add the new comment element to the comment-hub (in sorted order)
	let newCommentLine = Number(
		newComment.firstChild.innerHTML.substring(
			0,
			newComment.firstChild.innerHTML.length - 1
		)
	);
	if (
		comment_hub.childNodes.length > 1 &&
		Number(
			comment_hub.lastChild.firstChild.innerHTML.substring(
				0,
				comment_hub.lastChild.firstChild.innerHTML.length - 1
			)
		) > newCommentLine
	) {
		//if there are other children greater than it, find the child to insert before
		let node = comment_hub.firstChild.nextSibling;
		while (
			node != null &&
			Number(
				node.firstChild.innerHTML.substring(
					0,
					node.firstChild.innerHTML.length - 1
				)
			) < newCommentLine
		)
			node = node.nextSibling;

		//insert the new comment into its sorted spot on the comment_hub
		comment_hub.insertBefore(newComment, document.getElementById(node.id));
	} else {
		//otherwise, insert to the front
		comment_hub.appendChild(newComment);
	}

	// Phase 3: Add new comment to the file

	//set the start to the overall index of the startElement
	let start = startElement;
	//set the end to the overall index of the endElement
	let end = endElement;

	if (!fromDatabase) AddCommentToFile(commentID, start, end);
}

function traverseCodeWords(startElement, endElement, func) {
	let node = startElement;
	while (node != endElement) {
		while (node.nextSibling != null && node != endElement) {
			if (node.localName != "span") func(node);
			node = node.nextSibling;
		}
		if (node != endElement) {
			if (node.localName != "span") func(node);
			node = node.parentElement.nextSibling.firstChild;
		}
	}
	if (endElement.localName != "span") func(endElement);
}

async function AddCommentToFile(newID, start, end) {
	//create a json object holding the file, commentId, start, end, and commentText for the new comment

	//create a unique commentId for the comment
	console.log(`adding comment`);
	let commentElement = document.getElementById(newID);

	let newComment = {
		id: newID,
		start: start.id,
		end: end.id,
		comment: commentElement.firstChild.nextSibling.innerHTML,
	};
	jsonObject.comments.push(newComment);
	await updateComments(
		jsonObject.class,
		jsonObject.studentID,
		jsonObject.comments,
		jsonObject.highestID
	);
}
async function updateCommentInFile(commentElement) {
	//update the text in the json object for the comment
	console.log("updating comment");
	let commentID = commentElement.id;
	for (let index = 0; index < jsonObject.comments.length; index++) {
		let current = jsonObject.comments[index];
		if (current.id == commentID) {
			jsonObject.comments[index].comment =
				commentElement.firstChild.nextSibling.value;
			break;
		}
	}
	await updateComments(
		jsonObject.class,
		jsonObject.studentID,
		jsonObject.comments,
		jsonObject.highestID
	);
}

async function deleteCommentFromFile(commentElement) {
	//delete the json object for the comment
	console.log("deleting comment");
	let commentID = commentElement.id;

	let index;
	for (index = 0; index < jsonObject.comments.length; index++) {
		let current = jsonObject.comments[index];
		if (current.id == commentID) {
			break;
		}
	}
	jsonObject.comments.splice(index, 1);
	await updateComments(
		jsonObject.class,
		jsonObject.studentID,
		jsonObject.comments,
		jsonObject.highestID
	);
}

async function uploadPreviousComments(className, studentID) {
	//load the old comments
	let comments = jsonObject.comments;

	for (let index = 0; index < comments.length; index++) {
		let startElement = document.getElementById(comments[index].start);
		let endElement = document.getElementById(comments[index].end);
		if (startElement != null && endElement != null) {
			console.log("Pulling comment from database");
			createCommentElement(
				comments[index].id,
				startElement,
				endElement,
				comments[index].comment,
				true
			);
		}
	}

	//load the old rubric
	jsonToRubric(jsonObject);
}

/*
Rubric ------------------------------------------------------------------------------------------
*/

let children = [];
let maxPoints = 0;
let totalPoints = 0;

//
let studentView = student;
//

Rubric();

function Rubric() {
	//
	let div = document.querySelector(".rubric-hub");

	table = document.createElement("table");
	div.appendChild(table);

	//
	let pointInfoBox = document.createElement("tr");

	let pointMaxBox = document.createElement("td");
	let pointMax = document.createElement("input");
	pointMax.type = "number";
	pointMax.readOnly = studentView;
	pointMax.addEventListener("change", function () {
		maxPoints = parseInt(pointMax.value);
	});

	pointMaxBox.appendChild(pointMax);
	pointInfoBox.appendChild(pointMaxBox);

	let pointTotalBox = document.createElement("td");
	pointInfoBox.appendChild(pointTotalBox);
	pointTotalBox.innerHTML = "Total Points: " + totalPoints;

	//
	if (!studentView) {
		let saveButton = document.createElement("button");
		saveButton.innerHTML = "Save";
		saveButton.addEventListener("click", function () {
			saveRubric(jsonObject);
		});
		pointInfoBox.appendChild(saveButton);
	}
	//

	table.appendChild(pointInfoBox);

	//
	let headers = document.createElement("tr");

	let catAndPtHead = document.createElement("th");
	catAndPtHead.classList.add("pointsBox");
	catAndPtHead.innerHTML = "Category and points";
	headers.appendChild(catAndPtHead);

	let commentsHead = document.createElement("th");
	commentsHead.classList.add("commentsBox");
	commentsHead.innerHTML = "Comments";
	headers.appendChild(commentsHead);

	table.appendChild(headers);

	if (!studentView) {
		let newRowButton = document.createElement("button");
		let newRowButtonHeader = document.createElement("th");
		newRowButtonHeader.classList.add("removeButtonBox");
		newRowButtonHeader.appendChild(newRowButton);
		newRowButton.addEventListener("click", function () {
			newCategory(table, "", 0, 0, "");
		});
		newRowButton.innerHTML = "Add";
		headers.appendChild(newRowButtonHeader);
	}
}

function newCategory(table, cat, pts, max, commentText) {
	let newRow = document.createElement("tr");

	let catAndPt = document.createElement("td");

	// ON INPUT CHANGE MAKE SURE ITS WITHIN MAX/MIN BOUNDS AND NOT EXCEEDING TOTALS

	let category = document.createElement("input");
	category.value = cat;
	category.readOnly = studentView;
	////category.style.gridRowStart = "2";

	let input1 = document.createElement("input");
	input1.type = "number";
	input1.min = "0";
	input1.max = "100";
	input1.readOnly = studentView;
	//input1.style.left = "0%";
	//input1.style.top = "0%";
	input1.value = pts;
	////input1.style.gridRowStart = "1";

	input1.addEventListener("change", function () {
		(function (row, pointsBar) {
			if (parseInt(row.firstChild.firstChild.value) < 0) {
				row.firstChild.firstChild.value = "0";
			}
			totalPoint(pointsBar);
		})(newRow, table.children[0].children[1]);
	});

	let input2 = document.createElement("input");
	input2.type = "number";
	input2.min = "0";
	input2.max = "100";
	input2.readOnly = studentView;
	//input2.style.left = "70%";
	//input2.style.top = "0%";
	input2.value = max;
	////input2.style.gridRowStart = "1";

	input2.addEventListener("change", function () {
		(function (row) {
			normalizeMaxPoints(row);
		})(newRow);
	});

	catAndPt.appendChild(category);
	catAndPt.appendChild(input1);
	catAndPt.appendChild(input2);
	catAndPt.classList.add("pointsBox");

	newRow.appendChild(catAndPt);

	let comments = document.createElement("td");
	let textAr = document.createElement("textarea");
	textAr.value = commentText;
	textAr.readOnly = studentView;
	comments.appendChild(textAr);
	comments.classList.add("commentsBox");

	newRow.appendChild(comments);

	if (!studentView) {
		//let removeBox = document.createElement("td");
		let removeButton = document.createElement("button");
		removeButton.innerHTML = "&#10005;";
		newRow.appendChild(removeButton);
		//removeBox.classList.add("removeButtonBox");

		removeButton.addEventListener("click", function () {
			(function (t, row) {
				moveup(row);
				removeRow(t, row);
			})(table, newRow);
		});
	}
	//newRow.appendChild(removeBox);

	//newRow.style.top = "" + ((thisIndex + 1) * 5) + "%";

	var rowNum = children.length;
	newRow.dataset.rowNum = rowNum;
	children.push(newRow);
	table.appendChild(newRow);
}

// prevent category max point totals from adding up to over the total points
function normalizeMaxPoints(row) {
	var index = parseInt(row.dataset.rowNum);

	// Evaluate the proposed value of this category and make sure there are no violations
	var currentCap = parseInt(row.firstChild.children[2].value);

	if (currentCap < 0 || maxPoints == 0) {
		row.firstChild.children[2].value = 0;
	}

	// The total amount of max points allocated to categories so far
	var totalMaxSoFar = 0;

	for (var i = 0; i < children.length; i++) {
		if (i != index) {
			totalMaxSoFar += parseInt(children[i].firstChild.children[2].value);
		}
	}

	if (currentCap + totalMaxSoFar > maxPoints) {
		row.firstChild.children[2].value = "" + (maxPoints - totalMaxSoFar);
	}
}

// prevent category max point totals from adding up to over the total points
function totalPoint(pointsBox) {
	// The total amount of max points allocated to categories so far
	totalPoints = 0;

	for (var i = 0; i < children.length; i++) {
		totalPoints += parseInt(children[i].firstChild.children[1].value);
	}

	pointsBox.innerHTML = "Total Points: " + totalPoints;
}

function moveup(row) {
	var index = parseInt(row.dataset.rowNum);

	if (index >= children.length) {
		return;
	}

	for (var i = index + 1; i < children.length; i++) {
		children[i].dataset.rowNum = "" + (i - 1);
		//children[i].style.top = "" + ((i) * 5) + "%";
	}
}

function removeRow(table, row) {
	var index = parseInt(row.dataset.rowNum);

	totalPoints -= parseInt(row.firstChild.children[1].value);

	table.firstChild.children[1].innerHTML = "Total Points: " + totalPoints;

	//
	table.removeChild(row);
	children.splice(index, 1);
}

// Converts all comments and relevant data to text for storage
function saveRubric(jsonRubric) {
	var max = maxPoints;

	// Break down children (aka rubric sections) into arrays of important info
	var rubricInfo = [];
	for (var i = 0; i < children.length; i++) {
		// Push an json object that contains the relevant row info
		rubricInfo.push(rowToJson(children[i]));
	}
	//update the rubric in the database
	updateRubric(jsonRubric.class, jsonRubric.studentID, rubricInfo, maxPoints);
}

function rowToJson(row) {
	var subChildren = row.children;

	var pointsBoxDivs = subChildren[0].children;
	var catName = pointsBoxDivs[0].value;
	var pointsGiven = pointsBoxDivs[1].value;
	var maxCatPoints = pointsBoxDivs[2].value;

	var commentsBoxDiv = subChildren[1].children[0];
	var commentText = commentsBoxDiv.value;

	// Push an array that contains the category name, points given,
	//  the max points for that category, and the text in the comment box
	var jsonRow = {
		name: catName,
		points: pointsGiven,
		max: maxCatPoints,
		comments: commentText,
	};
	return jsonRow;
}

// Update the rubric to reflect the state given in a read in text file
function jsonToRubric(jsonRub) {
	var table = document.querySelector(".rubric-hub").firstChild;
	var rubricInfoChildren = table.firstChild.children;

	// Set the max point cap
	rubricInfoChildren[0].firstChild.value = jsonRub.maxPoints;
	maxPoints = jsonRub.maxPoints;

	// Add all the categories again
	var categories = jsonRub.rubric;
	for (var i = 0; i < categories.length; i++) {
		var row = categories[i];
		newCategory(table, row.name, row.points, row.max, row.comments);
	}

	// Total up the points
	totalPoint(rubricInfoChildren[1]);
}

/*
Referencing the database --------------------------------------------------------------
*/
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
