const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const PORT = 3000;
const FILE = "games.json";

// lire base
function readDB() {
	if (!fs.existsSync(FILE)) return {};
	return JSON.parse(fs.readFileSync(FILE));
}

// écrire base
function writeDB(data) {
	fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// ========================
// HEARTBEAT
// ========================
app.post("/api/heartbeat", (req, res) => {
	const { placeId, gameName, playerCount, timestamp } = req.body;

	if (!placeId) return res.status(400).send("Missing placeId");

	let db = readDB();

	db[placeId] = {
		placeId,
		gameName,
		playerCount,
		lastSeen: timestamp
	};

	writeDB(db);

	res.send({ success: true });
});

// ========================
// GET GAMES
// ========================
app.get("/api/games", (req, res) => {
	let db = readDB();
	res.json(Object.values(db));
});

app.listen(PORT, () => {
	console.log("Server running on port", PORT);
});