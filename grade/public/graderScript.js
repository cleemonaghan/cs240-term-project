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

	console.log(div);

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
			console.log(children);
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

	console.log("Normalizing point cap of " + index);

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

	console.log("" + children.length + " >= " + index + " ?");

	if (index >= children.length) {
		return;
	}

	for (var i = index + 1; i < children.length; i++) {
		console.log("Moving up child " + i);
		children[i].dataset.rowNum = "" + (i - 1);
		//children[i].style.top = "" + ((i) * 5) + "%";
	}
}

function removeRow(table, row) {
	var index = parseInt(row.dataset.rowNum);

	console.log("Removing child " + index);

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
	updateRubric(jsonRubric.class, jsonRubric.studentID, rubricInfo, maxPoints, totalPoints);
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
	////console.log(rubricInfoChildren[1]);
	totalPoint(rubricInfoChildren[1]);
}
