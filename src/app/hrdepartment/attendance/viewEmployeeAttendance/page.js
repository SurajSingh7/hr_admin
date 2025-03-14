"use client"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Clock,
  Calendar,
  User,
  Briefcase,
  MapPin,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Sun,
  Moon,
  AlertTriangle,
  Timer,
  BarChart4,
} from "lucide-react"



const ViewEmployeeAttendance = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const employeeId = searchParams.get("id") // Get the employee ID from the URL

  const [employeeData, setEmployeeData] = useState(null)
  const [loading, setLoading] = useState(true);
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [stats, setStats] = useState({
    avgHours: "0",
    onTimePercentage: "0%",
    totalDaysPresent: 0,
    totalDaysAbsent: 0,
  })

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",  // Thu
      day: "2-digit",    // 06
      month: "short",    // Mar
      year: "numeric",   // 2025
      hour: "2-digit",   // 07
      minute: "2-digit", // 17
      second: "2-digit", // 13
      timeZone: "UTC",  // Ensure it's in UTC
      hour12: true,     // 12-hour format with AM/PM
    }).format(date);
  };

  // Format date for display (date only)
  const formatDateOnly = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const fetchAttendanceHistory = async (newPage = 1) => {
    try {
      const employeeCode = searchParams.get("employeeCode");
      const historyUrl = `${process.env.NEXT_PUBLIC_ATTENDANCE_URL}user/attendance/history/${employeeCode}?page=${newPage}&limit=10`;

      const historyResponse = await fetch(historyUrl);
      const historyResult = await historyResponse.json();

      if (historyResult.success) {
        setAttendanceHistory(historyResult.data.map(record => ({
          date: formatDateOnly(record.createdAt),
          punchIn: record.userpunchInTime ? formatDate(record.userpunchInTime) : "Absent",
          punchOut: record.userPunchOutTime ? formatDate(record.userPunchOutTime) : "Absent",
          totalHours: record.totalHours,
          isValid: record.isValidPunch,
        })));

        // Update page and totalPages state
        setPage(newPage);
        setTotalPages(historyResult.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching attendance history:", error);
    }
  };

  const handleView = async (attendanceId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ATTENDANCE_URL}user/attendance/id/${attendanceId}`
      );
      const result = await response.json();

      if (result.success) {
        setEmployeeData(result.data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Error fetching attendance by ID:", error);
    }
  };

  const handleEdit = async (attendanceId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ATTENDANCE_URL}user/attendance/id/${attendanceId}`
      );
      const result = await response.json();

      if (result.success) {
        console.log("Editing Attendance:", result.data);
        // TODO: Open an edit modal with pre-filled data
      }
    } catch (error) {
      console.error("Error fetching attendance by ID:", error);
    }
  };


  // Fetch employee details
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {

        const employeeId = searchParams.get("id");  // This is primary key that we are fetching from the URL
        const employeeCode = searchParams.get("employeeCode");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_ATTENDANCE_URL}user/attendance/id/${employeeId}`,
        )
        const result = await response.json();

        if (result.success) {

          const today = result.data;

          const history = `${process.env.NEXT_PUBLIC_ATTENDANCE_URL}user/attendance/history/${employeeCode}`;
          const historyResponse = await fetch(history);
          const historyResult = await historyResponse.json();

          const stats = result.stats || {};
          if (historyResult.success) {
            setAttendanceHistory(historyResult.data.map(record => ({
              id: record._id,
              date: formatDateOnly(record.createdAt),
              punchIn: record.userpunchInTime ? formatDate(record.userpunchInTime) : "Absent",
              punchOut: record.userPunchOutTime ? formatDate(record.userPunchOutTime) : "Absent",
              totalHours: record.totalHours,
              isValid: record.isValidPunch,
            })));
          }
          if (stats) {
            setStats({
              avgHours: stats.avgWorkingHours,
              onTimePercentage: stats.onTimePercentage,
              totalDaysPresent: stats.daysPresent,
              totalDaysAbsent: stats.daysAbsent,
            })
          }
          setEmployeeData(today)
        } else {
          console.error("Failed to fetch employee details:", result.message)
        }
      } catch (error) {
        console.error("Error fetching employee details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (employeeId) {
      fetchEmployeeDetails()
    }
  }, [employeeId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employee details...</p>
        </div>
      </div>
    )
  }

  if (!employeeData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Found</h2>
          <p className="text-gray-600 mb-6">No employee data found for the provided ID.</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 bg-gray-200 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header with back button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Employee Attendance Details</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Employee Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gray-200">
            <div className="flex items-center">
              <div className="bg-white rounded-full p-5 mr-5">
                <User className="h-8 w-8 text-gray-500" />
              </div>
              <div>
                <h2 className="text-xl font-normal text-black">{employeeData.employeeName || "Employee Name"}</h2>
                <p className=" text-black flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" />
                  {employeeData.employeeCode}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Attendance Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Attendance Status</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {employeeData.isAbsent ? (
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    )}
                    <span className="text-gray-900 font-medium">{employeeData.isAbsent ? "Absent" : "Present"}</span>
                  </div>
                  {employeeData.isHalfDay && (
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Half Day</span>
                  )}
                </div>
              </div>

              {/* Shift Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Shift Type</h3>
                <div className="flex items-center">
                  {employeeData.isDayShift ? (
                    <>
                      <Sun className="h-5 w-5 text-amber-500 mr-2" />
                      <span className="text-gray-900 font-medium">Day Shift</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5 text-indigo-500 mr-2" />
                      <span className="text-gray-900 font-medium">Night Shift</span>
                    </>
                  )}
                </div>
              </div>

              {/* Location/Device */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-900 font-medium">{employeeData.deviceId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Attendance Details */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
              Today's Attendance
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Punch Times */}
              <div>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Punch In Time</h3>
                    {employeeData.hasPunchedIn && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Punched In</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="text-gray-900 font-medium">{formatDate(employeeData.userpunchInTime)}</span>
                  </div>
                  {employeeData.actualPunchInTime &&
                    employeeData.actualPunchInTime !== employeeData.userpunchInTime && (
                      <div className="mt-1 text-xs text-gray-500">
                        <span className="font-medium">Shift Time Start :</span> {formatDate(employeeData.actualPunchInTime)}
                      </div>
                    )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Punch Out Time</h3>
                    {employeeData.hasPunchedOut ? (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Punched Out</span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                        Not Punched Out
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="text-gray-900 font-medium">{formatDate(employeeData.userPunchOutTime)}</span>
                  </div>
                  {employeeData.actualPunchOutTime &&
                    employeeData.actualPunchOutTime !== employeeData.userPunchOutTime && (
                      <div className="mt-1 text-xs text-gray-500">
                        <span className="font-medium">Shift Time End:</span> {formatDate(employeeData.actualPunchOutTime)}
                      </div>
                    )}
                </div>
              </div>

              {/* Work Summary */}
              <div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Work Summary</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Hours</span>
                      <span className="text-gray-900 font-medium">{employeeData.totalHours}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Punch Validity</span>
                      <div>
                        {employeeData.isValidPunch ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Punch In
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Punch Out
                          </span>
                        )}
                      </div>
                    </div>

                    {employeeData.reasonForNotSendingMessage && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Reason</span>
                        <span className="text-gray-900">{employeeData.reasonForNotSendingMessage}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Off Day</span>
                      <span className="text-gray-900 font-medium">{employeeData.isTodayOff ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Stats */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-2">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <BarChart4 className="h-5 w-5 mr-2 text-indigo-600" />
                Monthly Attendance Insights
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h3 className="text-xs font-medium text-indigo-600 uppercase tracking-wider mb-2">
                    Avg. Working Hours
                  </h3>
                  <p className="text-2xl font-bold text-indigo-700">
                    {stats.avgHours} <span className="text-sm font-normal">hrs/day</span>
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-xs font-medium text-green-600 uppercase tracking-wider mb-2">
                    On-Time Percentage
                  </h3>
                  <p className="text-2xl font-bold text-green-700">{stats.onTimePercentage}</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-xs font-medium text-purple-600 uppercase tracking-wider mb-2">Days Present</h3>
                  <p className="text-2xl font-bold text-purple-700">
                    {stats.totalDaysPresent} <span className="text-sm font-normal">days</span>
                  </p>
                </div>

                <div className="bg-amber-50 rounded-lg p-4">
                  <h3 className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-2">Days Absent</h3>
                  <p className="text-2xl font-bold text-amber-700">
                    {stats.totalDaysAbsent} <span className="text-sm font-normal">days</span>
                  </p>
                </div>
              </div>

              {/* Visualization placeholder */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4 h-48 flex items-center justify-center">
                <p className="text-gray-500">Attendance trend visualization would appear here</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  View Full Attendance History
                </button>

                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Download Attendance Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Attendance History */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Timer className="h-5 w-5 mr-2 text-indigo-600" />
              Recent Attendance History
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Punch In
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Punch Out
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Hours
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-sans text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceHistory.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.punchIn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.punchOut}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.totalHours}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.isValid ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Punch Out
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Punch In
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                      <button
                        onClick={() => handleView(record.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium px-2 py-1 border border-blue-600 rounded-md"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleEdit(record._id)}
                        className="text-sm text-green-600 hover:text-green-800 font-medium px-2 py-1 border border-green-600 rounded-md"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between">
            <button
              className={`text-sm font-medium ${page > 1 ? "text-indigo-600 hover:text-indigo-900" : "text-gray-400 cursor-not-allowed"}`}
              onClick={() => fetchAttendanceHistory(page - 1)}
              disabled={page === 1}
            >
              ← Previous
            </button>

            <span className="text-sm font-medium text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              className={`text-sm font-medium ${page < totalPages ? "text-indigo-600 hover:text-indigo-900" : "text-gray-400 cursor-not-allowed"}`}
              onClick={() => fetchAttendanceHistory(page + 1)}
              disabled={page === totalPages}
            >
              Next →
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ViewEmployeeAttendance