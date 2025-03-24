"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

const ATTENDANCE_URL = process.env.NEXT_PUBLIC_ATTENDANCE_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AddEmployeeAttendance = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [userData, setUserData] = useState({
    name: "",
    employeeCode: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    personEmployeeCode: "",
    actualPunchInTime: "",
    userpunchInTime: "",
    actualPunchOutTime: "",
    userPunchOutTime: "",
    deviceId: "",
    isDayShift: true,
    isNightShift: false,
    shift: "day",
  });

  const [loading, setLoading] = useState(true);

  const getTimeZoneOffset = () => {
    return new Date().getTimezoneOffset();
  };
  
  const adjustUTCToLocal = (utcTime) => {
    if (!utcTime) return ""; 
    const date = new Date(utcTime);
    date.setMinutes(date.getMinutes() + getTimeZoneOffset()); // ADD the offset
    return date;
  };

  // Function to convert API datetime to datetime-local format
  const convertToDatetimeLocalFormat = (dateString, isEditing = false) => {
    if (!dateString) return ""; // Handle empty or invalid dates

    let date  = new Date(dateString);
    if (isEditing) {
      date = adjustUTCToLocal(date);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user data
        const url = `${API_BASE_URL}/hrms/authdata`;
        const response = await fetch(url, { method: "GET", credentials: "include" });

        if (response.ok) {
          const result = await response.json();
          const employeeData = result.data[0];

          setUserData({
            name: `${employeeData.basicemployees?.firstName} ${employeeData.basicemployees?.lastName}`,
            employeeCode: employeeData.basicemployees?.employeeCode,
          });

          setLoading(false);
        } else {
          toast.error("Failed to fetch user data!");
        }

        // Fetch attendance data if editing
        if (id) {
          const attendanceUrl = `${ATTENDANCE_URL}user/attendance/id/${id}`;
          const attendanceResponse = await fetch(attendanceUrl, { method: "GET" });

          if (attendanceResponse.ok) {
            const attendanceResult = await attendanceResponse.json();
            const attendanceData = attendanceResult.data;

            // Prefill the form with fetched attendance data
            setFormData({
              name: attendanceData.employeeName,
              personEmployeeCode: attendanceData.employeeCode,
              actualPunchInTime: convertToDatetimeLocalFormat(attendanceData.actualPunchInTime, true),
              userpunchInTime: convertToDatetimeLocalFormat(attendanceData.userpunchInTime, true),
              actualPunchOutTime: convertToDatetimeLocalFormat(attendanceData.actualPunchOutTime, true),
              userPunchOutTime: convertToDatetimeLocalFormat(attendanceData.userPunchOutTime, true),
              deviceId: attendanceData.deviceId,
              isDayShift: attendanceData.isDayShift,
              isNightShift: attendanceData.isNightShift,
              shift: attendanceData.isDayShift ? "day" : "night",
            });
          } else {
            toast.error("Failed to fetch attendance data!");
          }
        }

        setLoading(false);
      } catch (err) {
        toast.error("Error fetching data: " + err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [id]);

  // Function to convert 12-hour time to 24-hour format
  const convertTo24HourFormat = (timeString) => {
    if (!timeString) return "";
    const [date, time] = timeString.split("T");
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours, 10);

    // Check if the time is in PM and not 12:00 PM
    if (timeString.includes("PM") && hour !== 12) {
      hour += 12;
    }

    // Check if the time is in AM and 12:00 AM (midnight)
    if (timeString.includes("AM") && hour === 12) {
      hour = 0;
    }

    return `${date}T${String(hour).padStart(2, "0")}:${minutes}`;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "datetime-local") {
      // Convert the time to 24-hour format before updating the state
      const formattedTime = convertTo24HourFormat(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formattedTime,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        isDayShift: name === "shift" ? value === "day" : prev.isDayShift,
        isNightShift: name === "shift" ? value === "night" : prev.isNightShift,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      ...formData,
      actualPunchInTime: formData.actualPunchInTime,
      userpunchInTime: formData.userpunchInTime,
      actualPunchOutTime: formData.actualPunchOutTime,
      userPunchOutTime: formData.userPunchOutTime,
      employeeCode: formData.personEmployeeCode,
      userName: userData.name,
      dataManipulatorEmployeeCode: userData.employeeCode,
    };

    try {
      let apiUrl = `${ATTENDANCE_URL}user/attendance/add-attendance`;
      let method = "POST";
      let successMessage = "Attendance Added Successfully!"

      if(id){
        apiUrl =`${ATTENDANCE_URL}user/attendance/update-attendance/${id}`;
        method ="PUT";
        successMessage = "Attendance Updated Successfully!"
        const isConfirmed = window.confirm("Are you sure you want to update this record?");
        if (!isConfirmed) return; 
      }
      console.log('requested-data', requestData);
      const response = await fetch(apiUrl, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(successMessage);

        // Clear form after successful submission
        setFormData({
          name: "",
          personEmployeeCode: "",
          actualPunchInTime: "",
          userpunchInTime: "",
          actualPunchOutTime: "",
          userPunchOutTime: "",
          deviceId: "",
          isDayShift: true,
          isNightShift: false,
          shift: "day",
        });
        // setTimeout (()=>{
        //   router.push("/hrdepartment/attendance/viewAllEmployeeAttendance?page=1&limit=10")
        // },1500);
      } else {
        toast.error(result.message || "Failed to add attendance!");
      }
    } catch (error) {
      toast.error("Error submitting attendance: " + error.message);
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
                <label className="block text-gray-700 text-sm font-medium mb-2">Employee Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg" />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Employee Code</label>
                <input type="text" name="personEmployeeCode" value={formData.personEmployeeCode} onChange={handleChange} required className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["actualPunchInTime", "userpunchInTime", "actualPunchOutTime", "userPunchOutTime"].map((field, index) => (
                <div key={index}>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  <input type="datetime-local" name={field} value={formData[field]} onChange={handleChange} required className="w-full px-4 py-2 border text-gray-700  border-gray-300 rounded-lg" />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Device ID</label>
              <input type="text" name="deviceId" value={formData.deviceId} onChange={handleChange} required className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg" />
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2">
                <input type="radio" name="shift" value="day" checked={formData.shift === "day"} onChange={handleChange} className="w-5 h-5 text-blue-600 border-gray-300 rounded" />
                <span className="text-gray-700">Day Shift</span>
              </label>

              <label className="flex items-center space-x-2">
                <input type="radio" name="shift" value="night" checked={formData.shift === "night"} onChange={handleChange} className="w-5 h-5 text-blue-600 border-gray-300 rounded" />
                <span className="text-gray-700">Night Shift</span>
              </label>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700">
              Submit Attendance
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddEmployeeAttendance;