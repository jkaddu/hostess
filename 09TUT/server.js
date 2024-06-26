const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;

// Custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built in middleware to handle urlencoded data aka form data
app.use(express.urlencoded({ extended: false }));

// built in middkesware for json
app.use(express.json());

// serve static files aka applies the css,image or images and text
app.use("/", express.static(path.join(__dirname, "/public")));

// ROUTES
app.use("/", require("./routes/root"));
app.use("/employees", require("./routes/api/employees"));

// Catch all for all for pages that don't exist
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("Not Found");
  }
});
// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
