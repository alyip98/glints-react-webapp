const express = require("express");
const fs = require("fs");
const sqlite = require("sqlite3");

// const filebuffer = fs.readFileSync("db/hours.sqlite3");

const db = new sqlite.Database("db/hours.sqlite3");

const app = express();

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

const COLUMNS = ['restaurant_name', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
app.get("/api/restaurants", (req, res) => {
  const param = req.query.q;

  if (!param) {
    res.json({
      error: "Missing required parameter `q`"
    });
    return;
  }

  // WARNING: Not for production use! The following statement
  // is not protected against SQL injections.
  const r = db.all(
    `
    select * from entries
    where restaurant_name like ?
    limit 100
  `, [`%${param}%`],
    (err, rows) => {
      err ? res.json(err) : res.json(rows);
    }
  );
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});


db.all(`SELECT restaurant_name FROM entries WHERE restaurant_name like ? LIMIT 1`, ['%hugh%'], (err, rows) => {
  console.log(err, rows);
});
