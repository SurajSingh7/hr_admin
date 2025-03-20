"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { User, Clock, Search} from "lucide-react"
import { ClipLoader } from 'react-spinners';
import Sidebar from "@/layouts/sidebar";
import Layout from "@/layouts/Layout";

export default function Dashboard() {
    const [attendanceData, setAttendanceData] = useState([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [graphPage, setGraphPage] = useState(0);

    const [summary, setSummary] = useState({
        totalEmployees: 0,
        presentEmployeesCount: 0,
        absentEmployeesCount: 0,
        onTimeEmployeesCount: 0,
        lateEmployeesCount: 0,
    });

    const [employees, setEmployees] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [pagination, setPagination] = useState({ currentPage: 0, nextPage: null, prevPage: 1 });
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingGraph, setLoadingGraph] = useState(false);
    const [shiftTimings, setShiftTimings] = useState([]);
    const [activeTab, setActiveTab] = useState("LoggedIn");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedShift, setSelectedShift] = useState("10:00-19:00");
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";

        const date = new Date(dateString);

        return new Intl.DateTimeFormat("en-GB", {
            weekday: "short",  // Thu
            month: "short",    // Mar
            year: "numeric",   // 2025
            hour: "2-digit",   // 07
            minute: "2-digit", // 17
            second: "2-digit", // 13
            timeZone: "UTC",  // Ensure it's in UTC
            hour12: true,     // 12-hour format with AM/PM
        }).format(date);
    };

    // Fetch summary data and format employees
    useEffect(() => {
        const fetchSummaryData = async () => {
            setLoadingSummary(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_ATTENDANCE_URL}user/attendance/dashboard?date=${selectedDate}T10:00:00.000Z`);
                const data = await response.json();

                if (data.success) {
                    // Update summary state
                    setSummary({
                        totalEmployees: data.totalEmployees,
                        presentEmployeesCount: data.presentEmployeesCount,
                        absentEmployeesCount: data.absentEmployeesCount,
                        onTimeEmployeesCount: data.onTimeEmployeesCount,
                        lateEmployeesCount: data.lateEmployeesCount,
                    });

                    // Format and set employees data
                    const formattedEmployees = data.userData.map(emp => ({
                        name: emp.name,
                        empCode: emp.empCode,
                        position: "Employee",
                        status: emp.onTime ? "OnTime" : emp.isLate ? "Late" : "Absent",
                        loginTime: formatDate(emp.userPunchInTime),
                        logoutTime: emp.userPunchOutTime === emp.userPunchInTime ? "PENDING" : formatDate(emp.userPunchOutTime),
                    }));
                    setEmployees(formattedEmployees);
                    setShiftTimings(data.getOnlyShiftTimings || []);
                }
            } catch (error) {
                console.error("Error fetching summary data:", error);
            } finally {
                setLoadingSummary(false);
            }
        };

        fetchSummaryData();
    }, [selectedDate, selectedShift]);

    // Fetch graph data
    useEffect(() => {
        const fetchGraphData = async () => {
            setLoadingGraph(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_ATTENDANCE_URL}user/attendance/dashboard?page=${graphPage}`);
                const data = await response.json();

                if (data.success) {
                    // Format and set graph data
                    const graphFormatted = data.graphData.map(entry => ({
                        name: entry._id.split("-").slice(1).join("-"), // Format date as "MM-DD"
                        onTime: entry.onTimeEmployeesCount,
                        late: entry.lateEmployeesCount,
                    }));
                    setAttendanceData(graphFormatted);
                    setPagination({
                        currentPage: data.pagination.currentPage,
                        prevPage: 1, // Enable only if a previous page exists
                        nextPage: 1, // Enable only if moving back is possible
                    });
                }
            } catch (error) {
                console.error("Error fetching graph data:", error);
            } finally {
                setLoadingGraph(false);
            }
        };

        fetchGraphData();
    }, [graphPage]);

    // Filter employees based on activeTab and searchQuery
    useEffect(() => {
        let filtered = employees;

        // CHANGE: Filter by activeTab
        if (activeTab === "OnTime") {
            filtered = employees.filter(emp => emp.status === "OnTime");
        } else if (activeTab === "Late") {
            filtered = employees.filter(emp => emp.status === "Late");
        } else if (activeTab === "Leave") {
            filtered = employees.filter(emp => emp.status === "Absent");
        }

        // CHANGE: Filter by searchQuery
        if (searchQuery) {
            filtered = filtered.filter(emp =>
                emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.empCode.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredEmployees(filtered);
    }, [activeTab, searchQuery, employees]);

    // Custom Tooltip for Graph
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 text-white p-2 rounded text-xs">
                    <p className="text-center">{`On Time: ${payload[0].value}`}</p>
                    <p className="text-center">{`Late: ${payload[1].value}`}</p>
                </div>
            );
        }
        return null;
    };

    // Handle URL params for date and shift
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        const urlDate = params.get("date") || new Date().toISOString().split("T")[0];
        const urlShift = params.get("shift") || "10:00-19:00";

        setSelectedDate(urlDate);
        setSelectedShift(urlShift);
    }, [searchParams]);

    const updateUrlParams = (date, shift) => {
        const params = new URLSearchParams();
        if (date) params.set("date", date);
        if (shift) params.set("shift", shift);
        router.push(`?${params.toString()}`, { scroll: false }); // Update URL without refreshing
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        updateUrlParams(newDate, selectedShift);
    };

    const handleShiftChange = (e) => {
        const newShift = e.target.value;
        setSelectedShift(newShift);
        updateUrlParams(selectedDate, newShift);
    };

    const handleBarClick = (data) => {
        if (!data || !data.activeLabel) return;

        const clickedDate = `2025-${data.activeLabel.replace(" ", "-")}`;
        setSelectedDate(clickedDate);
        updateUrlParams(clickedDate); // Update URL
    };

    const handlePrevPage = () => {
        if (pagination.prevPage !== null) {
            setGraphPage(pagination.prevPage);
        }
    };

    const handleNextPage = () => {
        if (pagination.nextPage !== null) {
            setGraphPage(pagination.nextPage);
        }
    };

    const handleRedirection = async (url) => {
        setIsLoading(true); 
        try {
            await router.push(url, { scroll: false });
        } catch (error) {
            console.error("Redirection failed:", error);
        } finally {
            setIsLoading(false); 
        }
    };
    
    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto p-4">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Clock className="w-6 h-6 text-gray-600" />
                            <input type="date" value={selectedDate} onChange={handleDateChange} className="border px-3 py-1 rounded-md text-sm text-black" />
                        </div>

                        <div className="flex items-center gap-2">
                            <p className="text-gray-500">Select Shift Time </p>
                            <select value={selectedShift} onChange={handleShiftChange} className="border px-3 py-1 rounded-md text-normal text-black">
                                {shiftTimings.map((shift, index) => (
                                    <option key={index} value={shift}>{shift}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-6 mb-6 text-black bg-gray-200">
                        <p className="text-2xl border-b-2 border-primary p-4 ml-4 font-medium">Dashboard</p>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Charts */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h2 className="text-black font-normal">Attendance Status</h2>
                                    </div>
                                </div>

                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={attendanceData}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                            barGap={0}
                                            barSize={20}
                                            onClick={handleBarClick}
                                        >
                                            <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                                            <YAxis />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="onTime" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="late" fill="#93C5FD" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>

                                    <div className="flex justify-between mt-4">
                                        <button
                                            onClick={handlePrevPage}
                                            disabled={pagination.prevPage === null}
                                            className={`px-4 py-2 rounded-md ${pagination.prevPage === null ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
                                        >
                                            Previous 10 Days
                                        </button>

                                        <button
                                            onClick={handleNextPage}
                                            disabled={pagination.nextPage === null}
                                            className={`px-4 py-2 rounded-md ${pagination.nextPage === null ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
                                        >
                                            Next 10 Days
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-4 mb-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                        <span className="text-black">On time</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                                        <span className="text-black">Late</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Attendance Summary and Employees */}
                        <div className="space-y-6">
                            {/* Attendance Summary */}
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex border-b pb-2">
                                    {["LoggedIn", "OnTime", "Late", "Leave"].map(tab => {
                                        let count = 0;
                                        if (tab === "LoggedIn") {
                                            count = summary.presentEmployeesCount;
                                        } else if (tab === "OnTime") {
                                            count = summary.onTimeEmployeesCount;
                                        } else if (tab === "Late") {
                                            count = summary.lateEmployeesCount;
                                        } else if (tab === "Leave") {
                                            count = summary.absentEmployeesCount;
                                        }

                                        return (
                                            <button
                                                key={tab}
                                                className={`px-4 py-1 text-sm ${activeTab === tab ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
                                                    }`}
                                                onClick={() => setActiveTab(tab)}
                                            >
                                                {tab} ({count || 0}) {/* Ensure count is always a valid number */}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="py-2">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search employees..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-8 pr-4 py-2 border rounded-md text-sm text-black"
                                        />
                                        <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                                    </div>
                                    <div className="flex justify-end mt-1">
                <button
                    onClick={() => handleRedirection("/hrdepartment/attendance/viewAllEmployeeAttendance?page=1&limit=10")}
                    className="text-blue-500 text-xs"
                    disabled={isLoading} // Disable button while loading
                >
                    {isLoading ? (
                        <ClipLoader size={15} color="#3b82f6" />  // Show loading text or spinner
                    ) : (
                        <span>View all employees</span>
                    )}
                </button>
            </div>
                                </div>

                                {/* Total Summary */}
                                <div className="bg-gray-200 rounded-lg p-3 mb-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-xl text-gray-500">Total</p>
                                            <p className="text-2xl text-black font-normal">{summary.totalEmployees}</p>
                                        </div>
                                        <div>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-right">
                                                <button className="text-sm text-black">On-time</button>
                                                <p className="text-xs text-black font-normal">{summary.onTimeEmployeesCount}</p>
                                                <button className="text-sm text-black">Late</button>
                                                <p className="text-xs text-black font-normal">{summary.lateEmployeesCount}</p>
                                                <button className="text-sm text-black">Leave</button>
                                                <p className="text-xs text-black font-normal">{summary.absentEmployeesCount}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Employee List */}
                                <div className="space-y-4">
                                    {filteredEmployees.map((employee, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                                    <User className="h-8 w-8 text-gray-500" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center text-black gap-2">
                                                        <p className="font-medium">{employee.name}</p>
                                                        <div
                                                            className={`w-2 h-2 rounded-full ${employee.status === "Late" ? "bg-yellow-400" : "bg-green-400"}`}
                                                        ></div>
                                                        <span className="text-xs capitalize text-gray-500">{employee.status}</span>
                                                    </div>

                                                    <p className="text-xs text-black">
                                                        <span className="text-black">Login:  </span>
                                                        {employee.loginTime}
                                                    </p>

                                                    <p className="text-xs text-black">Logout:  {employee.logoutTime}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}