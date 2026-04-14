const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// 🔥 SERVIR LE SITE
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
const FILE = "games.json";

// ========================
// DATABASE
// ========================
function readDB() {
	if (!fs.existsSync(FILE)) return {};
	return JSON.parse(fs.readFileSync(FILE));
}

function writeDB(data) {
	fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// ========================
// API HEARTBEAT
// ========================
app.post("/api/heartbeat", (req, res) => {
	const { placeId, gameName, playerCount, timestamp } = req.body;

	if (!placeId) {
		return res.status(400).send("Missing placeId");
	}

	let db = readDB();

	db[placeId] = {
		placeId,
		gameName,
		playerCount,
		lastSeen: timestamp
	};

	writeDB(db);

	res.json({ success: true });
});

// ========================
// API GET GAMES
// ========================
app.get("/api/games", (req, res) => {
	let db = readDB();
	res.json(Object.values(db));
});

// ========================
// ROOT (sécurité)
// ========================
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

// ========================
app.listen(PORT, () => {
	console.log("Server running on port", PORT);
});