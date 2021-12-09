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
let studentID = "student3";

fetchAssignment(className, studentID).catch(console.dir);
