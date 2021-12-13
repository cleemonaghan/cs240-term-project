const { query } = require("express");
const express = require("express");
var ObjectId = require("mongodb").ObjectId;

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This section will help you validate a user's credentials
recordRoutes.route("/users/validate").get(async function (req, res) {
	//connect to the database
	const dbConnect = dbo.getDb();
	//console.log(req.query);
	const matchDocument = req.query;

	await dbConnect
		.collection("users")
		.findOne(matchDocument, function (err, result) {
			if (err) {
				res.json(null);
			} else {
				res.json(result);
			}
		});
});

// This section will help you validate a user's credentials
recordRoutes.route("/users/add").post(async function (req, res) {
	//connect to the database
	const dbConnect = dbo.getDb();
	const matchDocument = req.body.params;

	dbConnect
		.collection("users")
		.insertOne(matchDocument, function (err, result) {
			if (err) {
				res.status(400).send("Error inserting user!");
			} else {
				console.log(`Added a new user ${result.username}`);
				res.status(204).send();
			}
		});
});

// This section will help you delete a record
recordRoutes.route("/users/delete").delete((req, res) => {
	const dbConnect = dbo.getDb();
	const listingQuery = req.query;

	dbConnect
		.collection("users")
		.deleteOne(listingQuery, function (err, _result) {
			if (err) {
				res
					.status(400)
					.send(`Error deleting listing with id ${listingQuery.username}!`);
			} else {
				console.log("1 user deleted");
				res.status(204).send();
			}
		});
});

// This section will help you get a list of all the assignments
recordRoutes
	.route("/grader_classes/fetchClasses")
	.get(async function (req, res) {
		//connect to the database
		const dbConnect = dbo.getDb();

		const matchDocument = req.query;
		dbConnect
			.collection("grader_classes")
			.find(matchDocument)
			.limit(50)
			.toArray(function (err, result) {
				if (err) {
					res.status(400).send("Error fetching classes!");
				} else {
					res.json(result);
				}
			});
	});

// This section will help you get a list of a specific record.
recordRoutes.route("/assignments").get(async function (req, res) {
	//connect to the database
	const dbConnect = dbo.getDb();
	//console.log(req.query);
	const matchDocument = req.query;

	await dbConnect
		.collection("assignments")
		.findOne(matchDocument, function (err, result) {
			if (err) {
				res.status(400).send("Error fetching assignment!");
			} else {
				//console.log(result);
				res.json(result);
			}
		});
});

// This section will help you get a list of all the assignments
recordRoutes.route("/assignments/fetchAll").get(async function (req, res) {
	//connect to the database
	const dbConnect = dbo.getDb();

	const matchDocument = req.query;
	dbConnect
		.collection("assignments")
		.find(matchDocument)
		.limit(50)
		.toArray(function (err, result) {
			if (err) {
				res.status(400).send("Error fetching assignments!");
			} else {
				res.json(result);
			}
		});
});

// This section will help you create a new record.
recordRoutes.route("/assignments/create").post(function (req, res) {
	const dbConnect = dbo.getDb();
	const matchDocument = req.body.params;

	dbConnect
		.collection("assignments")
		.insertOne(matchDocument, function (err, result) {
			if (err) {
				res.status(400).send("Error inserting matches!");
			} else {
				console.log(`Added a new match with id ${result.insertedId}`);
				res.status(204).send();
			}
		});
});

recordRoutes.route("/assignments/submitAssignment").post(function (req, res) {
	const dbConnect = dbo.getDb();
	const params = req.body.params;

	const listingQuery = {
		class: params.class,
		studentID: params.studentID,
	};
	const updates = {
		$set: {
			text: params.text,
			highestID: params.highestID,
			comments: params.comments,
			maxPoints: params.maxPoints,
			rows: params.rows,
		},
	};

	dbConnect
		.collection("assignments")
		.updateOne(listingQuery, updates, function (err, _result) {
			if (err) {
				res.status(400).send(`Error submitting assignment!`);
			} else {
				console.log("1 document updated");
				res.status(204).send();
			}
		});
});

recordRoutes.route("/assignments/updateAssignment").post(function (req, res) {
	const dbConnect = dbo.getDb();
	const params = req.body.params;
	const listingQuery = {
		_id: new ObjectId(params._id),
		class: params.class,
		studentID: params.studentID,
	};
	const updates = {
		$set: {
			text: params.text,
			highestID: params.highestID,
			comments: params.comments,
			maxPoints: params.maxPoints,
			rows: params.rows,
		},
	};
	dbConnect
		.collection("assignments")
		.updateOne(listingQuery, updates, function (err, _result) {
			if (err) {
				res
					.status(400)
					.send(
						`Error updating likes on listing for student ${listingQuery.studentID}!`
					);
			} else {
				console.log("1 document updated");
				res.status(204).send();
			}
		});
});

// This section will help you update a record by id.
recordRoutes.route("/assignments/updateComments").post(function (req, res) {
	const dbConnect = dbo.getDb();
	const listingQuery = {
		class: req.body.params.class,
		studentID: req.body.params.studentID,
	};
	const updates = {
		$set: {
			highestID: req.body.params.highestID,
			comments: req.body.params.comments,
		},
	};
	dbConnect
		.collection("assignments")
		.updateOne(listingQuery, updates, function (err, _result) {
			if (err) {
				res
					.status(400)
					.send(
						`Error updating likes on listing for student ${listingQuery.studentID}!`
					);
			} else {
				console.log("1 document updated");
				res.status(204).send();
			}
		});
});

// This section will help you update a record by id.
recordRoutes.route("/assignments/updateRubric").post(function (req, res) {
	const dbConnect = dbo.getDb();
	//console.log(req.body);
	const listingQuery = {
		class: req.body.params.class,
		studentID: req.body.params.studentID,
	};
	const updates = {
		$set: {
			maxPoints: req.body.params.maxPoints,
			rubric: req.body.params.rubric,
		},
	};

	//console.log(listingQuery);
	//console.log(updates);
	dbConnect
		.collection("assignments")
		.updateOne(listingQuery, updates, function (err, _result) {
			if (err) {
				res
					.status(400)
					.send(`Error updating for student ${listingQuery.studentID}!`);
			} else {
				console.log("1 document updated");
				res.status(204).send();
			}
		});
});

// This section will help you delete a record
recordRoutes.route("/assignments/delete").delete((req, res) => {
	const dbConnect = dbo.getDb();
	const listingQuery = req.query;

	dbConnect
		.collection("assignments")
		.deleteOne(listingQuery, function (err, _result) {
			if (err) {
				res
					.status(400)
					.send(`Error deleting listing with id ${listingQuery.studentID}!`);
			} else {
				console.log("1 document deleted");
				res.status(204).send();
			}
		});
});

module.exports = recordRoutes;
