var student = false;

//var className = "class1";
//var studentID = "student1";
var jsonObject;
/*
var jsonObject = {
	file: "filename.cmt",
	class: "class1",
	studentID: "student1",
	highestID: 1,
	comments: [
		{
			id: 0,
			start: "word-1",
			end: "word-10",
			comment: "Bad code here",
		},
		{
			id: 1,
			start: "word-107",
			end: "word-110",
			comment: "Bad code here again",
		},
	],
	maxPoints: 50,
	rows: [
		{
			name: "style",
			points: 13,
			max: 15,
			comments:
				"very good though it is good practice to style in css rather than javascript or html.",
		},
		{
			name: "efficency",
			points: 5,
			max: 6,
			comments: "nice job!.",
		},
		{
			name: "extra credit",
			points: 10,
			max: 0,
			comments: "went to the presentation.",
		},
	],
};
*/

//get the file
document.getElementById("file").onchange = function () {
	var file = this.files[0];

	var reader = new FileReader();

	// Get the element for the code panel
	let code = document.querySelector(".code-text");

	//clear the old file from the screen
	code.replaceChildren([]);
	//clear the old comments from the screen
	document.querySelector(".comment-hub").replaceChildren([]);

	reader.onload = function (progressEvent) {
		// By lines
		var lines = this.result.split("\n");
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
		uploadPreviousComments("class1", "student3");

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
	};
	reader.readAsText(file);
};

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
	console.log(jsonObject.comments);
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
	console.log(`fetching from server ${className}, ${studentID}`);
	jsonObject = await fetchAssignment(className, studentID);

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
