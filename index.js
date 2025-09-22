const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("views"));

const DATA_FILE = "data.json";

// Baca data dari file
function readData() {
  const raw = fs.readFileSync(DATA_FILE);
  return JSON.parse(raw);
}

// Simpan data ke file
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// API GET semua user
app.get("/api/users", (req, res) => {
  const data = readData();
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(data, null, 2)); // <- pakai indentasi 2 spasi
});

// API tambah user
app.post("/api/users", (req, res) => {
  const data = readData();
  const name = req.body.name;
  if (name && !data.vip_users.includes(name)) {
    data.vip_users.push(name);
    saveData(data);
  }
  res.json(data);
});

// API update user
app.put("/api/users/:oldName", (req, res) => {
  const data = readData();
  const { oldName } = req.params;
  const { name: newName } = req.body;
  const idx = data.vip_users.indexOf(oldName);
  if (idx !== -1) {
    data.vip_users[idx] = newName;
    saveData(data);
  }
  res.json(data);
});

// API hapus user
app.delete("/api/users/:name", (req, res) => {
  const data = readData();
  const { name } = req.params;
  data.vip_users = data.vip_users.filter(u => u !== name);
  saveData(data);
  res.json(data);
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
