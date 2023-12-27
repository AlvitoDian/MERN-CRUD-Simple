import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: "", nim: "" });
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateStudent, setUpdateStudent] = useState({
    id: null,
    name: "",
    nim: "",
  });

  useEffect(() => {
    // Fetch students on component mount
    axios
      .get("http://localhost:5000/students")
      .then((response) => setStudents(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleInputChange = (e) => {
    setNewStudent({
      ...newStudent,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddStudent = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/students", newStudent)
      .then((response) => {
        setStudents([...students, response.data]);
        setNewStudent({ name: "", nim: "" }); // Reset form after successful addition
      })
      .catch((error) => console.error(error));
  };

  const handleOpenUpdateModal = (student) => {
    setUpdateStudent({ id: student._id, name: student.name, nim: student.nim });
    setUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setUpdateModalOpen(false);
  };

  const handleUpdateStudent = () => {
    // Make an API call to update the student
    axios
      .put(`http://localhost:5000/students/${updateStudent.id}`, {
        name: updateStudent.name,
        nim: updateStudent.nim,
      })
      .then((response) => {
        // Update the local state with the updated data
        const updatedStudents = students.map((student) =>
          student._id === updateStudent.id ? response.data : student
        );
        setStudents(updatedStudents);
        handleCloseUpdateModal();
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteStudent = (studentId) => {
    // Show a confirmation dialog
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (isConfirmed) {
      // Make an API call to delete the student
      axios
        .delete(`http://localhost:5000/students/${studentId}`)
        .then(() => {
          // Remove the deleted student from the local state
          const updatedStudents = students.filter(
            (student) => student._id !== studentId
          );
          setStudents(updatedStudents);
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <div>
      <h1>Student CRUD</h1>
      <div>
        <h2>Add Student</h2>
        <form onSubmit={handleAddStudent}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={newStudent.name}
              onChange={handleInputChange}
            />
          </label>
          <label>
            NIM:
            <input
              type="number"
              name="nim"
              value={newStudent.nim}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Add Student</button>
        </form>
      </div>
      <div>
        <h2>Students</h2>
        <ul>
          {students.map((student) => (
            <li key={student._id}>
              {student.name} - {student.nim}
              <button onClick={() => handleOpenUpdateModal(student)}>
                Update
              </button>
              <button onClick={() => handleDeleteStudent(student._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      {isUpdateModalOpen && (
        <div className="modal">
          <h2>Update Student</h2>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={updateStudent.name}
              onChange={(e) =>
                setUpdateStudent({ ...updateStudent, name: e.target.value })
              }
            />
          </label>
          <label>
            NIM:
            <input
              type="number"
              name="nim"
              value={updateStudent.nim}
              onChange={(e) =>
                setUpdateStudent({ ...updateStudent, nim: e.target.value })
              }
            />
          </label>
          <button onClick={handleUpdateStudent}>Update Student</button>
          <button onClick={handleCloseUpdateModal}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default App;
