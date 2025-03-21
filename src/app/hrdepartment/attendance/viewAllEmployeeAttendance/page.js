import React, { Suspense } from 'react'
import ViewAllEmployeeAttendance from './ViewAllEmployeeAttendance';

const page = () => {
   return (
        <Suspense fallback={<div>Loading ViewAllEmployeeAttendance...</div>}>
          <ViewAllEmployeeAttendance/>
        </Suspense>
      );
}

export default page