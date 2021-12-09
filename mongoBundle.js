const { MongoClient } = require("mongodb");

// Setup the database client object
const url =
	"mongodb+srv://colinmonaghan:Cleemona6011!@cluster0.kkrcc.mongodb.net/gradebook_code?retryWrites=true&w=majority";
const client = new MongoClient(url);

// The database to use
const dbName = "gradebook_code";

/**
 * This function adds the assignment to the database if it does not already exist
 * in the database. If it does, then it updates the highestID and Comments array for the assignment.
 * @param {json} assignment the assignment to add
 */
async function insertAssignment(assignment) {
	try {
		await client.connect();
		console.log("Connected correctly to server");
		const db = client.db(dbName);

		// Use the collection "people"
		const col = db.collection("assignments");

		//check if the assignment already exists
		query = { class: assignment.class, studentID: assignment.studentID };
		const myDoc = await col.findOne(query);

		if (myDoc == null) {
			// The assignment does not already exist, so insert it
			const p = await col.insertOne(assignment);
			console.log("inserted");
		} else {
			// The assignment exists, so update it
			const p = await col.updateOne(query, {
				$set: {
					highestID: assignment.highestID,
					comments: assignment.comments,
				},
			});
		}
	} catch (err) {
		console.log(err.stack);
	} finally {
		await client.close();
	}
}

async function updateComments(className, studentID, newComments, newHighestId) {
	try {
		await client.connect();
		console.log("Connected correctly to server");
		const db = client.db(dbName);

		// Use the collection "people"
		const col = db.collection("assignments");

		//check if the assignment exists
		query = { class: className, studentID: studentID };
		const myDoc = await col.findOne(query);

		if (myDoc != null) {
			// The assignment exists, so update the comments
			const p = await col.updateOne(query, {
				$set: {
					highestID: newHighestId,
					comments: newComments,
				},
			});
		}
	} catch (err) {
		console.log(err.stack);
	} finally {
		await client.close();
	}
}

async function updateRubric(className, studentID, newRubric) {
	try {
		await client.connect();
		console.log("Connected correctly to server");
		const db = client.db(dbName);

		// Use the collection "people"
		const col = db.collection("assignments");

		//check if the assignment exists
		query = { class: className, studentID: studentID };
		const myDoc = await col.findOne(query);

		if (myDoc != null) {
			// The assignment exists, so update the comments
			const p = await col.updateOne(query, {
				$set: {
					rubric: newRubric,
				},
			});
		}
	} catch (err) {
		console.log(err.stack);
	} finally {
		await client.close();
	}
}

/**
 * This function deletes the assignment to the database if it exists
 * @param {String} className the id of the class
 * @param {String} studentID the id of the student
 */
async function deleteAssignment(className, studentID) {
	try {
		await client.connect();
		console.log("Connected correctly to server");
		const db = client.db(dbName);

		// Use the collection "people"
		const col = db.collection("assignments");
		// Delete one document
		const removedResult = await col.deleteOne({
			class: className,
			studentID: studentID,
		});

		// Print to the console
		//console.log(removedResult);
	} catch (err) {
		console.log(err.stack);
	} finally {
		await client.close();
	}
}

/**
 * This function retrieves the assignment to the database if it exists
 * @param {String} className the id of the class
 * @param {String} studentID the id of the student
 */
async function fetchAssignment(className, studentID) {
	try {
		await client.connect();
		console.log("Connected correctly to server");
		const db = client.db(dbName);

		// Use the collection "people"
		const col = db.collection("assignments");
		// Find one document
		const myDoc = await col.findOne({ class: className, studentID: studentID });
		// Print to the console
		console.log(myDoc);
	} catch (err) {
		console.log(err.stack);
	} finally {
		await client.close();
	}
}

let className = "class1";
let studentID = "student2";

// Construct a document
let assignment = {
	file: "filename.txt",
	class: className,
	studentID: studentID,
	highestID: 1,
	comments: [
		{
			id: 0,
			start: "word-123",
			end: "word-134",
			comment: "Try to avoid doing this",
		},
		{
			id: 1,
			start: "word-110",
			end: "word-112",
			comment: "Avoid this syntax",
		},
	],
	maxPoints: 50,
	rubric: [
		{
			name: "style",
			points: 13,
			max: 15,
			comments:
				"very good though it is good practice to style in css rather than javascript or html.",
		},
	],
};

//insertAssignment(assignment).catch(console.dir);
fetchAssignment(className, studentID).catch(console.dir);
