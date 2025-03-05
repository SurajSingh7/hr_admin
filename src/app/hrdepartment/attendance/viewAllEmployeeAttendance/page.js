"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Calendar, Clock, Filter, RefreshCw, Search, User } from 'lucide-react';

const AttendancePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [attendanceData, setAttendanceData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    hasPunchedIn: searchParams.get("hasPunchedIn") || "",
    hasPunchedOut: searchParams.get("hasPunchedOut") || "",
    isValidPunch: searchParams.get("isValidPunch") || "",
    isHalfDay: searchParams.get("isHalfDay") || "",
    isAbsent: searchParams.get("isAbsent") || "",
    deviceId: searchParams.get("deviceId") || "",
    today: searchParams.get("today") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    employeeCode: searchParams.get("employeeCode") || "",
    isNightShift: searchParams.get("isNightShift") || "",
    isDayShift: searchParams.get("isDayShift") || "",
  });

  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const limit = 10; // Records per page

  const fetchAttendanceData = useCallback(async () => {
    setLoading(true);
    try {
      let query = new URLSearchParams({
        page: currentPage,
        limit,
        ...filters,
      });

      // Update URL with current filters & page
      router.push(`?${query.toString()}`, { scroll: false });

      const response = await fetch(`${process.env.NEXT_PUBLIC_ATTENDANCE_URL}user/attendance?${query}`);
      const result = await response.json();

      if (result.success) {
        setAttendanceData(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [currentPage, filters, router]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  // Handle Filter Change
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Reset Filters
  const resetFilters = () => {
    setFilters({
      hasPunchedIn: "",
      hasPunchedOut: "",
      isValidPunch: "",
      isHalfDay: "",
      isAbsent: "",
      deviceId: "",
      today: "",
      startDate: "",
      endDate: "",
      employeeCode: "",
      isNightShift: "",
      isDayShift: "",
    });
    setCurrentPage(1);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toUTCString();
  };

  // Calculate total pages for pagination
  const totalPages = pagination.totalPages || 1;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Filters */}
      <div className="w-80 bg-white shadow-md overflow-y-auto h-full border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Filter className="h-5 w-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Punch Status</label>
              <select 
                name="hasPunchedIn" 
                onChange={handleFilterChange} 
                value={filters.hasPunchedIn} 
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="">Has Punched In?</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="space-y-2">
              <select 
                name="hasPunchedOut" 
                onChange={handleFilterChange} 
                value={filters.hasPunchedOut} 
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="">Has Punched Out?</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Attendance Status</label>
              <select 
                name="isAbsent" 
                onChange={handleFilterChange} 
                value={filters.isAbsent} 
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="">Is Absent?</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="space-y-2">
              <select 
                name="isHalfDay" 
                onChange={handleFilterChange} 
                value={filters.isHalfDay} 
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="">Is Half Day?</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="space-y-2">
              <select 
                name="isValidPunch" 
                onChange={handleFilterChange} 
                value={filters.isValidPunch} 
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="">Valid Punch?</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Shift Type</label>
              <select 
                name="isNightShift" 
                onChange={handleFilterChange} 
                value={filters.isNightShift} 
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="">Night Shift?</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="space-y-2">
              <select 
                name="isDayShift" 
                onChange={handleFilterChange} 
                value={filters.isDayShift} 
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="">Day Shift?</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Employee Information</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  name="employeeCode" 
                  placeholder="Employee Code" 
                  value={filters.employeeCode} 
                  onChange={handleFilterChange} 
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  name="deviceId" 
                  placeholder="Device ID" 
                  value={filters.deviceId} 
                  onChange={handleFilterChange} 
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date Range</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input 
                  type="date" 
                  name="startDate" 
                  value={filters.startDate} 
                  onChange={handleFilterChange} 
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Start Date"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input 
                  type="date" 
                  name="endDate" 
                  value={filters.endDate} 
                  onChange={handleFilterChange} 
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="End Date"
                />
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <button 
                onClick={fetchAttendanceData} 
                className="w-full flex justify-center items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </button>
              
              <button 
                onClick={resetFilters} 
                className="w-full flex justify-center items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <Clock className="h-6 w-6 mr-2 text-indigo-600" />
            Employee Attendance
          </h1>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Punch In
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Punch Out
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Hours
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valid Punch
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Loading attendance data...</p>
                    </td>
                  </tr>
                ) : attendanceData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  attendanceData.map((employee) => (
                    <tr key={employee._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {employee.employeeName || "Unknown Employee"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.employeeCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(employee.userpunchInTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(employee.userPunchOutTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.totalHours || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {employee.isValidPunch ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            ✓ Valid
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            ✗ Invalid
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && attendanceData.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                    currentPage === 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                    currentPage === totalPages ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{attendanceData.length}</span> results
                    {pagination.totalRecords && (
                      <>
                        {' '}of <span className="font-medium">{pagination.totalRecords}</span> total
                      </>
                    )}
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                        currentPage === 1 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Page numbers */}
                    {[...Array(totalPages).keys()].map((page) => (
                      <button
                        key={page + 1}
                        onClick={() => setCurrentPage(page + 1)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === page + 1
                            ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {page + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                        currentPage === totalPages 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;