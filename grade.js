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

				line.appendChild(word);
			}

			code.appendChild(line);
		}

		//add an event listener the code-panel
		code.addEventListener("mouseup", createComment);
	};
	reader.readAsText(file);
};

function createComment() {
	let selection = window.getSelection();
	let startElement = selection.getRangeAt(0).startContainer.parentElement;
	let endElement = selection.getRangeAt(0).endContainer.parentElement;
	if (startElement == endElement) return;

	var source = this;
	let comment_hub = document.querySelector(".comment-hub");
	//create the comment
	var newComment = document.createElement("div");
	newComment.className = "comment-item";
	newComment.id = startElement.parentElement.firstChild.innerHTML; //parseInt(this.parentElement.firstChild.innerHTML);
	//create the id for the comment (which holds the line of the error)
	let commentId = document.createElement("div");
	commentId.innerHTML = newComment.id;
	//create the text area for the comment
	let commentInput = document.createElement("textarea");
	//create the delete button for the comment
	let commentDelete = document.createElement("button");
	commentDelete.innerHTML = "&#10005;";
	commentDelete.addEventListener("click", function () {
		this.parentElement.parentElement.removeChild(this.parentElement);
		source.style = "color: white";
		//remove the underline the text
		traverseCodeWords(startElement, endElement, function (n) {
			n.style = "text-decoration: none";
		});
	});
	//add all the components of the comment to the comment element
	newComment.appendChild(commentId);
	newComment.appendChild(commentInput);
	newComment.appendChild(commentDelete);

	//underline the text
	traverseCodeWords(startElement, endElement, function (n) {
		n.style = "text-decoration: underline red";
	});

	//add event listeners to newComment
	newComment.addEventListener("mouseenter", function (event) {
		event.target.className = "comment-item-highlighted";
		document.getElementById(`line${event.target.id}`).scrollIntoView({
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

	if (
		comment_hub.hasChildNodes() &&
		Number(comment_hub.lastChild.id) > Number(newComment.id)
	) {
		//if there are other children greater than it, find the child to insert before
		let node = comment_hub.firstChild;
		while (node != null && Number(node.id) < Number(newComment.id))
			node = node.nextSibling;

		//insert the new comment into its sorted spot on the comment_hub
		comment_hub.insertBefore(newComment, document.getElementById(node.id));
	} else {
		//otherwise, insert to the front
		comment_hub.appendChild(newComment);
	}
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
