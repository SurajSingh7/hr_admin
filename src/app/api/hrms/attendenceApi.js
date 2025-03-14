// api.js
import axios from 'axios';

export const fetchAttendanceData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/noceye/api/v1/attendance`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// NEXT_PUBLIC_API_BASE_URL1/noceye/api/v1/attendance