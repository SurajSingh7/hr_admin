"use client";

import { useState, useEffect } from "react";

const ATTENDANCE_URL = process.env.NEXT_PUBLIC_ATTENDANCE_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AddEmployeeAttendance = () => {
  const [userData, setUserData] = useState({
    name: "",
    employeeCode: "",
  });

  const [formData, setFormData] = useState({
    actualPunchInTime: "",
    userpunchInTime: "",
    actualPunchOutTime: "",
    userPunchOutTime: "",
    deviceId: "",
    shift: "day", // Default to "day" shift
  });

  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const url = `${API_BASE_URL}/hrms/authdata`;
//         const response = await fetch(url, {
//           method: "GET",
//           credentials: "include",
//         });

//         if (response.ok) {
//           const result = await response.json();
//           const employeeData = result.data[0];

//           setUserData({
//             name: employeeData.basicemployees?.firstName + " " + employeeData.basicemployees?.lastName,
//             employeeCode: employeeData.basicemployees?.employeeCode,
//           });

//           setLoading(false);
//         } else {
//           console.error("Failed to fetch user data");
//         }
//       } catch (err) {
//         console.error("Fetch Error:", err);
//       }
//     };

//     fetchDashboardData();
//   }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "radio" ? value : value, // Handle radio button selection
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      ...formData,
      name: userData.name,
      employeeCode: userData.employeeCode,
      userName: userData.name,
      dataManipulatorEmployeeCode: userData.employeeCode,
    };

    try {
      const response = await fetch(`${ATTENDANCE_URL}user/attendance/add-attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert("Attendance added successfully!");
      } else {
        console.error("Failed to add attendance");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Add Employee Attendance</h2>

        {loading ? (
          <p className="text-gray-500">Loading employee data...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="name" value={userData.name} />
            <input type="hidden" name="employeeCode" value={userData.employeeCode} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Actual Punch In</label>
                <input
                  type="datetime-local"
                  name="actualPunchInTime"
                  value={formData.actualPunchInTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">User Punch In</label>
                <input
                  type="datetime-local"
                  name="userpunchInTime"
                  value={formData.userpunchInTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Actual Punch Out</label>
                <input
                  type="datetime-local"
                  name="actualPunchOutTime"
                  value={formData.actualPunchOutTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">User Punch Out</label>
                <input
                  type="datetime-local"
                  name="userPunchOutTime"
                  value={formData.userPunchOutTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Device ID</label>
              <input
                type="text"
                name="deviceId"
                value={formData.deviceId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="shift"
                  value="day"
                  checked={formData.shift === "day"}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Day Shift</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="shift"
                  value="night"
                  checked={formData.shift === "night"}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Night Shift</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:outline-none"
            >
              Submit Attendance
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddEmployeeAttendance;