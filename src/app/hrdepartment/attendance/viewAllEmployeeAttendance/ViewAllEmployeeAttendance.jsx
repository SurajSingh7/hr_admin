"use client";
import { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Calendar, Clock, Filter, RefreshCw, Search, User } from 'lucide-react';
import Layout from "@/layouts/Layout";

const ViewAllEmployeeAttendance = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [attendanceData, setAttendanceData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleViewEmployee = (employeeCode, id) => {
    router.push(`/hrdepartment/attendance/viewEmployeeAttendance?id=${id}&employeeCode=${employeeCode}`);
  };

  // Filters State
  const initialFilters = useMemo(() => ({
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
    isDayShift: "",
    isNightShift: "",
  }), []);

  const [filters, setFilters] = useState(initialFilters);
  const [inputValues, setInputValues] = useState({
    employeeCode: "",
    deviceId: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // Records per page

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch attendance data
  const fetchAttendanceData = useCallback(async (currentFilters, page) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page || 1,
        limit,
        ...Object.fromEntries(
          Object.entries(currentFilters).filter(([_, v]) => v !== "")
        )
      });

      // Update URL only if filters are applied
      if (query.toString() !== searchParams.toString()) {
        router.push(query.toString() ? `?${query}` : '?', { scroll: false });
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_ATTENDANCE_URL}user/attendance?${query}`);
      const result = await response.json();

      if (result.success) {
        setAttendanceData(result.data);
        setPagination(result.pagination);
        setCurrentPage(Number(page) || 1);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [limit, router, searchParams]);

  // Debounced API call
  const debouncedFetch = useMemo(
    () => debounce(fetchAttendanceData, 500),
    [fetchAttendanceData]
  );

  // Handle filter change
  const handleFilterChange = (e) => {
    let { name, value } = e.target;

    if (name === "shiftType") {
      value = value === "day" ? { isDayShift: "true" } : value === "night" ? { isNightShift: "true" } : {};
    }

    setFilters(prev => {
      const newFilters = { ...prev, [name]: value };
      setCurrentPage(1);
      debouncedFetch(newFilters, 1);
      return newFilters;
    });
  };

  // Handle search input change
  const handleSearchInput = (e) => {
    const { name, value } = e.target;
    setInputValues(prev => ({ ...prev, [name]: value }));
  };

  // Handle search submit (on Enter key press)
  const handleSearchSubmit = (field) => {
    setFilters(prev => {
      const newFilters = { ...prev, [field]: inputValues[field] };
      fetchAttendanceData(newFilters, 1);
      return newFilters;
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters(initialFilters);
    setInputValues({ employeeCode: "", deviceId: "" });
    setCurrentPage(1);
    fetchAttendanceData(initialFilters, 1);
  };

  // Initial load handling
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 0) {
      setFilters(prev => ({
        ...initialFilters,
        ...params
      }));
      fetchAttendanceData(params, params.page || 1);
    }
    else {
      fetchAttendanceData(initialFilters, 1);
    }
  }, [searchParams, initialFilters]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toUTCString();
  };

  // Calculate total pages for pagination
  const totalPages = pagination.totalPages || 1;

  // Handle page number click
  const handlePageClick = (page) => {
    setCurrentPage(page);

    // Update URL with the new page
    const query = new URLSearchParams({
      ...filters,
      page,
      limit,
    });

    router.push(`?${query.toString()}`, { scroll: false });

    // Fetch data for the new page
    fetchAttendanceData(filters, page);
  };
  const handleLogsView = async(employeeCode, date) =>{
    try{
      if (!employeeCode || !date) return;
      router.push(`/hrdepartment/attendance/viewEmployeeLogs?employeeCode=${employeeCode}&date=${encodeURIComponent(date)}`);
    }
    catch(error){
      console.error(`An error occurred while redirecting to logs : ${error}`);
    }
  }
  
  const handleDelete = async(attendanceId) =>{
    try{
  
    }
    catch(error){
        
    }
  }

  return (

   <Layout>
      <div className="flex  bg-gray-50">
  
        {/* Sidebar Filters */}
        {sidebarVisible && (
          <div className="font-sans w-80 bg-white shadow-md overflow-y-auto h-full border-r border-gray-200 relative">
            <button
              onClick={() => setSidebarVisible(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              aria-label="Hide filters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <Filter className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
              </div>

              <div className="space-y-4 text-black">
                {/* Punch Status */}
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
                    name="shiftType"
                    onChange={handleFilterChange}
                    value={filters.shiftType}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  >
                    <option value="">Shift Type</option>
                    <option value="day">Day Shift</option>
                    <option value="night">Night Shift</option>
                  </select>
                </div>

                {/* Employee Information */}
                {/* <div className="space-y-2">
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
                </div> */}

                {/* Device ID */}
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

                {/* Date Range */}
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
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      name="endDate"
                      value={filters.endDate}
                      onChange={handleFilterChange}
                      className="w-full pl-10 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => fetchAttendanceData(filters, currentPage)}
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
        )}

        {/* Main Content */}
        <div className={`${sidebarVisible ? "flex-1" : "w-full"} overflow-auto p-6`}>
          <div className="bg-white rounded-lg shadow-md p-6 font-sans">
            <div className="flex justify-between">
                
                <div>
                  <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                      <Clock className="h-6 w-6 mr-2 text-indigo-600" />
                      Employee Attendance
                  </h1>
                </div>

                {/* Employee Search */}
                <div className="space-y-2 flex justify-center items-center gap-4 ">
                  <div className="relative ">
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
                  <div className="">
                      <button
                      onClick={() => setSidebarVisible(!sidebarVisible)}
                      className="  bg-indigo-600  mb-2 text-white p-2 rounded-r-md shadow-md  hover:bg-indigo-700 transition-colors"
                      aria-label="Show filters"
                      >
                      <Filter className="h-5  w-5 " />
                      </button>
                    </div>
                </div>
            </div>
          
            {/* Attendance Table */}
            <div className="overflow-x-auto font-sans">
              <table className="min-w-full divide-y divide-gray-200 font-sans bg-gray">
                <thead className="bg-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-sans text-black uppercase tracking-wider">
                      Employee Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-sans text-black uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-sans text-black uppercase tracking-wider">
                      Punch In
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-sans text-black uppercase tracking-wider">
                      Punch Out
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-sans text-black uppercase tracking-wider">
                      Total Hours
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-sans text-black uppercase tracking-wider">
                      Valid Punch
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-sans text-black uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 font-sans">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900">
                          {employee.employeeName || "Unknown Employee"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.employeeCode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(employee.userpunchInTime).replace(' GMT', '')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {/* {formatDate(employee.userPunchOutTime)} */}
                          {formatDate(employee.userPunchOutTime).replace(' GMT', '')}

                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {/* {employee.totalHours || "N/A"} */}
                          {employee.totalHours ? employee.totalHours.replace(" hours", "h").replace(" minutes", "m") : "N/A"}

                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {employee.isValidPunch ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Punch Out
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Punch In
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                          {/* Action Button */}
                          <button
                            onClick={() => toggleDropdown(employee._id)}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>

                          {/* Dropdown Menu */}
                          {dropdownOpen === employee._id && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                              <div className="py-1 font-bold">
                                <button
                                  onClick={() => {
                                    handleViewEmployee(employee.employeeCode, employee._id)
                                    setDropdownOpen(null)
                                  }}
                                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => {
                                    setDropdownOpen(null)
                                  }}
                                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={()=>{
                                    setDropdownOpen(null)
                                    handleLogsView(employee.employeeCode,employee.userPunchOutTime )
                                  }}
                                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                  Logs
                                </button>
                                <button
                                  onClick={()=>{
                                    setDropdownOpen(null)
                                    handleDelete(employee.employeeCode,employee._id)
                                  }}
                                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                  Soft Delete
                                </button>
                              </div>
                            </div>
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
                    onClick={() => {
                      const newPage = Math.max(1, currentPage - 1);
                      setCurrentPage(newPage);
                      fetchAttendanceData(filters, newPage);
                    }}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${currentPage === 1 ? "text-gray-300" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      const newPage = Math.min(totalPages, currentPage + 1);
                      setCurrentPage(newPage);
                      fetchAttendanceData(filters, newPage);
                    }}
                    disabled={currentPage === totalPages}
                    className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${currentPage === totalPages ? "text-gray-300" : "text-gray-700 hover:bg-gray-50"}`}
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
                          {" "}
                          of <span className="font-medium">{pagination.totalRecords}</span> total
                        </>
                      )}
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${currentPage === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          }`}
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {/* Limited Page numbers with dynamic range */}
                      {(() => {
                        const pageNumbers = [];
                        const maxVisiblePages = 5;

                        if (totalPages <= maxVisiblePages) {
                          // Show all pages if total pages are small
                          for (let i = 1; i <= totalPages; i++) {
                            pageNumbers.push(i);
                          }
                        } else {
                          let startPage = Math.max(1, currentPage - 2);
                          let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                          if (startPage > 1) {
                            pageNumbers.push(1);
                            if (startPage > 2) pageNumbers.push("ellipsis-start");
                          }

                          for (let i = startPage; i <= endPage; i++) {
                            pageNumbers.push(i);
                          }

                          if (endPage < totalPages) {
                            if (endPage < totalPages - 1) pageNumbers.push("ellipsis-end");
                            pageNumbers.push(totalPages);
                          }
                        }
                        return pageNumbers.map((page, index) => {
                          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                            return (
                              <span
                                key={`ellipsis-${index}`}
                                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700"
                              >
                                ...
                              </span>
                            );
                          }

                          return (
                            <button
                              key={page}
                              onClick={() => handlePageClick(page)}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === page
                                ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                }`}
                            >
                              {page}
                            </button>
                          );
                        });
                      })()
                      }

                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${currentPage === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          }`}
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                            clipRule="evenodd"
                          />
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
   </Layout>
   
  )
}

export default ViewAllEmployeeAttendance;