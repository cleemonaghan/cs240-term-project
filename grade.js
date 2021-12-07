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
			let word = document.createElement("div");
			word.innerHTML = `${i + 1}.\t`;
			word.id = `line${i + 1}`;
			word.className = "code-word";
			line.appendChild(word);
			let arrayOfWords = lines[i].split(" ");
			for (let j = 0; j < arrayOfWords.length; j++) {
				word = document.createElement("div");
				word.innerHTML = arrayOfWords[j] + " ";
				word.className = "code-word";
				//add an event listener for each word
				word.addEventListener("click", function () {
					var source = this;
					let comment_hub = document.querySelector(".comment-hub");
					//create the comment
					let newComment = document.createElement("div");
					newComment.className = "comment-item";
					newComment.id = parseInt(this.parentElement.firstChild.innerHTML);
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
					});
					//add all the components of the comment to the comment element
					newComment.appendChild(commentId);
					newComment.appendChild(commentInput);
					newComment.appendChild(commentDelete);

					//add event listeners to newComment
					newComment.addEventListener("mouseenter", function () {
						this.className = "comment-item-highlighted";
						document.getElementById(`line${this.id}`).scrollIntoView({
							behavior: "smooth",
							block: "center",
							inline: "nearest",
						});
						source.style = "color: red";
					});
					newComment.addEventListener("mouseleave", function () {
						this.className = "comment-item";
						source.style = "color: white";
					});

					if (
						comment_hub.hasChildNodes() &&
						Number(comment_hub.lastChild.id) > Number(newComment.id)
					) {
						//if there are other children greater than it, find the child to insert before
						let node = comment_hub.firstChild.nextSibling;
						while (node != null && Number(node.id) < Number(newComment.id)) {
							node = node.nextSibling;
						}
						//insert the new comment into its sorted spot on the comment_hub
						comment_hub.insertBefore(
							newComment,
							document.getElementById(node.id)
						);
					} else {
						//otherwise, insert to the front
						comment_hub.appendChild(newComment);
					}
				});

				line.appendChild(word);
			}

			code.appendChild(line);
		}
	};
	reader.readAsText(file);
};

function showComments() {
	let comments = document.querySelector(".comment-hub");
	let rubric = document.querySelector(".rubric-hub");
	comments.style.display = "block";
	rubric.style.display = "none";
}

function showRubric() {
	let comments = document.querySelector(".comment-hub");
	let rubric = document.querySelector(".rubric-hub");
	comments.style.display = "none";
	rubric.style.display = "block";
}
