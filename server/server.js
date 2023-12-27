const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbUri = "<MongoDB_URI>";
app.use(cors());
app.use(bodyParser.json());

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

// Connect Port
app.listen(5000, () => {
  console.log("Server started on port 5000");
});

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.json({ message: error.message });
  }
});

// Function Insert Data
app.post("/students", async (req, res) => {
  const student = new Student({
    name: req.body.name,
    nim: req.body.nim,
  });

  try {
    const savedStudent = await student.save();
    res.json(savedStudent);
  } catch (error) {
    res.json({ message: error.message });
  }
});

// Function Edit Data
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

// Function Delete Data
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
