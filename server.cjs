require("dotenv").config();
const bcrypt = require("bcrypt");
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing. Check your .env file.");
}
function verifyToken(req, res, next) {
const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access denied. Token is required."
    });
  }
const token = authHeader.split(" ")[1];
  try {
  const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token."
    });
  }
}
const app = express();
app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Stuti@1607",
  database: "wanderly_db"
});
db.connect((err) => {
  if (err) {
    console.log("MySQL connection failed:", err);
    return;
  }
  console.log("MySQL connected successfully!");
});


app.get("/", (req, res) => {
  res.send("Wanderly backend is running!");
});
app.get("/users", (req, res) => {
  db.query("SELECT id, name, email, password FROM users", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});



app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `;
    db.query(
      sql,
      [name, email, hashedPassword],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
          id: result.insertId,
          name,
          email,
          message: "User registered successfully"
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Password processing failed."
    });
  }
});



app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = `
    SELECT id, name, email, password
    FROM users
    WHERE email = ?
  `;
  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }
    try {
      const user = results[0];
      const passwordMatches = await bcrypt.compare(
        password,
        user.password
      );
      if (!passwordMatches) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email
        },
        JWT_SECRET,
        { expiresIn: "30m" }
      );
      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token: token
      });
    } catch (error) {
      res.status(500).json({
        message: "Login failed."
      });
    }
  });
});


app.get("/trips", verifyToken, (req, res) => {
  db.query(
    "SELECT * FROM trips WHERE userId = ?",
    [req.user.id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      results.forEach((trip) => {
        try {
          trip.itinerary = JSON.parse(trip.itinerary || "[]");
        } catch {
          trip.itinerary = [];
        }
      });
      res.json(results);
    }
  );
});


app.post("/trips", verifyToken, (req, res) => {
  const {
    destination,
    title,
    startDate,
    endDate,
    travelers,
    itinerary,
    notes
  } = req.body;
  const userId = req.user.id;
  const itineraryText = JSON.stringify(itinerary || []);
  const sql = `
    INSERT INTO trips
    (userId, destination, title, startDate, endDate, travelers, itinerary, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [
      userId,
      destination,
      title,
      startDate,
      endDate,
      travelers,
      itineraryText,
      notes
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        id: result.insertId,
        userId,
        destination,
        title,
        startDate,
        endDate,
        travelers,
        itinerary: itinerary || [],
        notes
      });
    }
  );
});


app.patch("/trips/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const {
    title,
    startDate,
    endDate,
    travelers,
    itinerary,
    notes
  } = req.body;
  const userId = req.user.id;
  const itineraryText = JSON.stringify(itinerary || []);
  const sql = `
    UPDATE trips
    SET title = ?,
        startDate = ?,
        endDate = ?,
        travelers = ?,
        itinerary = ?,
        notes = ?
    WHERE id = ? AND userId = ?
  `;
  db.query(
    sql,
    [
      title,
      startDate,
      endDate,
      travelers,
      itineraryText,
      notes,
      id,
      userId
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Trip not found or you do not have permission to edit it."
        });
      }
      const getUpdatedTrip = `
        SELECT *
        FROM trips
        WHERE id = ? AND userId = ?
      `;
      db.query(getUpdatedTrip, [id, userId], (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        const updatedTrip = results[0];
        try {
          updatedTrip.itinerary = JSON.parse(updatedTrip.itinerary || "[]");
        } catch {
          updatedTrip.itinerary = [];
        }
        res.json(updatedTrip);
      });
    }
  );
});



app.delete("/trips/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  db.query(
    "DELETE FROM trips WHERE id = ? AND userId = ?",
    [id, userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Trip not found or you do not have permission to delete it."
        });
      }
      res.json({
        message: "Trip deleted successfully!"
      });
    }
  );
});


app.get("/savedPlaces", verifyToken, (req, res) => {
  const userId = req.user.id;
  db.query(
    "SELECT * FROM savedPlaces WHERE userId = ?",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});


app.post("/savedPlaces", verifyToken, (req, res) => {
  const { destination } = req.body;
  const userId = req.user.id;
  const sql = `
    INSERT INTO savedPlaces (userId, destination)
    VALUES (?, ?)
  `;
  db.query(sql, [userId, destination], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      id: result.insertId,
      userId,
      destination
    });
  });
});


app.delete("/savedPlaces/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  db.query(
    "DELETE FROM savedPlaces WHERE id = ? AND userId = ?",
    [id, userId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Saved place deleted successfully!" });
    }
  );
});


app.listen(3000, () => {
  console.log("Wanderly backend running on http://localhost:3000");
});