import React, { Suspense } from 'react'
import ViewAllEmployeeAttendance from './viewAllEmployeeAttendance';

const page = () => {
   return (
        <Suspense fallback={<div>Loading ViewAllEmployeeAttendance...</div>}>
          <ViewAllEmployeeAttendance/>
        </Suspense>
      );
}

export default page