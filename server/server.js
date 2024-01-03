const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dbUri = "<MONGODB_URI>";
const bcrypt = require("bcrypt");
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

const UserModel = require("./models/Users.js");

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(dbUri, mongoose.connectionParams)
  .then(() => {
    console.info("Connected to Database");
  })
  .catch((e) => {
    console.log("Error : ", e);
  });

const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: String,
  nim: Number,
});

const Student = mongoose.model("Student", studentSchema);

//? Connect Port
app.listen(5000, () => {
  console.log("Server started on port 5000");
});

//? Verify User
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json("Token expired");
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) return res.json("Token wrong");
      next();
    });
  }
};

//? Index Page
app.get("/", verifyUser, (req, res) => {
  return res.json("Success");
});

//? Function Registration User
app.post("/register", [
  // Validation
  body("username").notEmpty().withMessage("Username is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, email, password } = req.body;
      // Hash Crypt
      bcrypt.hash(password, 10).then((hash) => {
        UserModel.create({ username, email, password: hash })
          .then((user) => res.json(user))
          .catch((err) => res.json(err));
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
]);

//? Function Login User
app.post("/login", [
  // Validation
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),

  async (req, res) => {
    // Menangani hasil validasi
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      UserModel.findOne({ email: email }).then((user) => {
        if (user) {
          // Hash Crypt
          bcrypt.compare(password, user.password, (err, response) => {
            if (response) {
              const token = jwt.sign({ email: user.email }, "jwt-secret-key", {
                expiresIn: "1d",
              });
              res.cookie("token", token);
              res.json("Success");
            }
            if (err) {
              res.json("Password Incorrect!");
            }
          });
        } else {
          res.json("User no exist");
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
]);

//? Function Show All Data Students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.json({ message: error.message });
  }
});

//? Function Insert Data
app.post("/students", [
  // Validasi input menggunakan express-validator
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("nim")
    .notEmpty()
    .withMessage("NIM is required")
    .isNumeric()
    .withMessage("NIM must be a number"),

  async (req, res) => {
    // Menangani hasil validasi
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Membuat objek Student
    const student = new Student({
      name: req.body.name,
      nim: req.body.nim,
    });

    try {
      // Menyimpan data mahasiswa
      const savedStudent = await student.save();
      res.json(savedStudent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
]);

//? Function Update Data
app.put("/students/:id", async (req, res) => {
  const studentId = req.params.id;
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        $set: {
          name: req.body.name,
          nim: req.body.nim,
        },
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//? Function Delete Data
app.delete("/students/:id", async (req, res) => {
  const studentId = req.params.id;

  try {
    const deletedStudent = await Student.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
