let prevFile;

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

		jsonObject.file = file.name;
    

    //// REPLACE OLD FILE WITH NEW ONE OR CREATE NEW FILE IN DB
    }
}