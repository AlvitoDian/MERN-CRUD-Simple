import React, { useEffect, useState } from "react";
import axios from "axios";

function CRUD_Content() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: "", nim: "" });
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateStudent, setUpdateStudent] = useState({
    id: null,
    name: "",
    nim: "",
  });
  const [errorMessages, setErrorMessages] = useState({});

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
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const validationErrors = error.response.data.errors.map(
            (validationError) => validationError.msg
          );

          setErrorMessages(validationErrors);
        } else {
          console.error("Error:", error.message);
        }
      });
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
    <div className="ml-10 mr-10 mt-10 ">
      <div className="pb-5 text-center">
        <h1 className="font-bold">Student CRUD</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10">
        <div>
          <div>
            <form onSubmit={handleAddStudent}>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Nama
                </label>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
                  <input
                    type="text"
                    name="name"
                    id="price"
                    className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Name"
                    value={newStudent.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="pb-4">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Nim
                </label>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
                  <input
                    type="number"
                    name="nim"
                    id="price"
                    className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="NIM"
                    value={newStudent.nim}
                    onChange={handleInputChange}
                  />
                </div>
                {errorMessages.length > 0 && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-5">
                    <p>Error : </p>
                    <ul>
                      {errorMessages.map((errorMessage, index) => (
                        <li key={index}>{errorMessage}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="mb-5">
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
        <div>
          <div>
            <table className="table-auto border-collapse border mx-auto">
              <thead>
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">NIM</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td className="p-2 border">{student.name}</td>
                    <td className="p-2 border">{student.nim}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleOpenUpdateModal(student)}
                        className="pr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal container */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* Modal content */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Update Student
                </h3>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={updateStudent.name}
                    onChange={(e) =>
                      setUpdateStudent({
                        ...updateStudent,
                        name: e.target.value,
                      })
                    }
                    className="mt-1 p-2 border rounded-md w-full"
                  />
                </label>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIM:
                  <input
                    type="number"
                    name="nim"
                    value={updateStudent.nim}
                    onChange={(e) =>
                      setUpdateStudent({
                        ...updateStudent,
                        nim: e.target.value,
                      })
                    }
                    className="mt-1 p-2 border rounded-md w-full"
                  />
                </label>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleUpdateStudent}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Update Student
                </button>
                <button
                  onClick={handleCloseUpdateModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CRUD_Content;
