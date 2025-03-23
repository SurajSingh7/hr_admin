"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { format, parseISO, formatRelative, intlFormat } from "date-fns"

const LogsPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const employeeCode = searchParams.get("employeeCode") || ""
  const dateParam = searchParams.get("date") || ""

  // Get today's date in YYYY-MM-DD format for the default value
  const today = new Date().toISOString().split("T")[0]
  const [date, setDate] = useState(dateParam || today)
  const [employeeActivity, setEmployeeActivity] = useState([])
  const [rawPunches, setRawPunches] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("punches")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    currentPageTotal: 0,
    totalPages: 0,
    hasPrev: false,
    hasNext: false,
  })

  // Format date for display
  const formatDateTime = (dateTimeStr) => {
    try {
      const date = parseISO(dateTimeStr);

      // Format the date using intlFormat
      const formattedDate = intlFormat(date, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'UTC',
      });

      return formattedDate;
    } catch (error) {
      return dateTimeStr
    }
  }

  useEffect(() => {
    if (employeeCode) {
      fetchEmployeeActivity(employeeCode, date, 1)
      fetchRawPunches(employeeCode, date)
    }
  }, [date])

  const fetchEmployeeActivity = async (empCode, date, page = 1) => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ATTENDANCE_URL}attendance/employee-activity/${empCode}?page=${page}&limit=10`,
      )
      const data = await res.json()
      setEmployeeActivity(data.data)
      setPagination(data.pagination || pagination)
    } catch (error) {
      console.error("Error fetching logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRawPunches = async (empCode, date) => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ATTENDANCE_URL}attendance/fetch-raw-punches?empCode=${empCode}&date=${date}`,
      )
      const data = await res.json()
      setRawPunches(data.data)
    } catch (error) {
      console.error("Error fetching raw punches:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchEmployeeActivity(employeeCode, date, newPage)
    }
  }

  const getActionBadgeColor = (action) => {
    switch (action) {
      case "PUNCHIN":
        return "bg-green-50 text-green-700 border border-green-200"
      case "PUNCHOUT":
        return "bg-red-50 text-red-700 border border-red-200"
      default:
        return "bg-blue-50 text-blue-700 border border-blue-200"
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-gray-300 p-2">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Employee Logs: <span className="text-gray-700 ml-2">{employeeCode}</span>
            </h1>
            <p className="text-gray-500 mt-1">View attendance records and punch details</p>
          </div>

          <div className="flex items-center space-x-2">
            <p className="text-gray-800">Select Date Range: </p>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="border border-gray-300 text-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="w-full">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("punches")}
                  className={`py-3 px-6 font-medium text-sm ${activeTab === "punches"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:border-b"
                    }`}
                >
                  Raw Punches
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`py-3 px-6 font-medium text-sm ${activeTab === "activity"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:border-b"
                    }`}
                >
                  Activity Logs
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "punches" && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-5 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Raw Punches
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Raw punch data for {format(parseISO(date), "MMMM dd, yyyy")}
                  </p>
                </div>
                <div className="p-0">
                  {rawPunches.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No punch records found for this date</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left py-3.5 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Time
                            </th>
                            <th className="text-left py-3.5 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Device
                            </th>
                            <th className="text-left py-3.5 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {rawPunches.map((punch) => (
                            <tr key={punch._id} className="hover:bg-gray-50">
                              <td className="py-4 px-6 text-sm font-medium text-gray-900">
                                {formatDateTime(punch.dateTime)}
                              </td>
                              <td className="py-4 px-6 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                  {punch.deviceId}
                                </div>
                              </td>
                              <td className="py-4 px-6 text-sm text-gray-500">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${punch.status
                                      ? "bg-green-50 text-green-700 border border-green-200"
                                      : "bg-gray-100 text-gray-700 border border-gray-200"
                                    }`}
                                >
                                  {punch.status ? "Processed" : "Raw"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-5 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Employee Activity Logs
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Activity history and system remarks</p>
                </div>
                <div className="p-5">
                  {employeeActivity.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No activity logs found</div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {employeeActivity.map((log) => (
                          <div key={log._id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getActionBadgeColor(log.action)}`}
                                >
                                  {log.action}
                                </span>
                                <span className="ml-2 text-sm text-gray-500">{formatDateTime(log.punchTime)}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                {log.deviceId}
                              </div>
                            </div>
                            <p className="text-sm mt-2 text-gray-700">{log.remarks}</p>
                          </div>
                        ))}
                      </div>

                      {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                          <div className="text-sm text-gray-500">
                            Showing {pagination.currentPageTotal} of {pagination.total} entries
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              className={`inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white ${pagination.hasPrev ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"
                                }`}
                              onClick={() => handlePageChange(pagination.page - 1)}
                              disabled={!pagination.hasPrev}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 19l-7-7 7-7"
                                />
                              </svg>
                              Previous
                            </button>
                            <div className="text-sm text-gray-700">
                              Page {pagination.page} of {pagination.totalPages}
                            </div>
                            <button
                              className={`inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white ${pagination.hasNext ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"
                                }`}
                              onClick={() => handlePageChange(pagination.page + 1)}
                              disabled={!pagination.hasNext}
                            >
                              Next
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LogsPage