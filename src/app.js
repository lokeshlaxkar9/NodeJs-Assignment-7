const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Mario = require("./models/marioChar");
const AppError = require("../AppError");

// Middlewares
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// your code goes here
function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => next(e));
  };
}

app.get(
  "/mario",
  wrapAsync(async (req, res, next) => {
    const marios = await Mario.find({});
    res.status(200).json({
      status: 200,
      response: marios,
    });
  })
);

app.get(
  "/mario/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const mario = await Mario.findById(id);
    if (!mario) {
      throw next(new AppError("Id did not match", 400));
    }
    res.json({
      status: 200,
      response: mario,
    });
  })
);

app.post(
  "/mario",
  wrapAsync(async (req, res, next) => {
    const { name, weight } = req.body;
    if (!name || !weight) {
      throw next(new AppError("Either name or weight is missing", 400));
    }
    const mario = await Mario.create({ name, weight });
    res.status(201).send({
      status: 201,
      response: mario,
    });
  })
);
app.patch(
  "/mario/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const mario = await Mario.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    res.status(201).json({
      status: 201,
      response: mario,
    });
  })
);
app.delete(
  "/mario/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const mario = await Mario.findByIdAndDelete(id);
    res.status(200).json({
      status: 200,
      response: "Character Deleted",
    });
  })
);

app.use((req, res) => {
  res.status(404).json({
    Status: "404",
    Message: "Page Not Found",
  });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Someting Went Wrong" } = err;
  res.status(status).json({ status, message });
});

module.exports = app;
