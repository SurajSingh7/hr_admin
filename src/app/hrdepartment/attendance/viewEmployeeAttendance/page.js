import React, { Suspense } from 'react'
import ViewEmployeeAttendance from './viewEmployeeAttendance';


const page = () => {
   return (
        <Suspense fallback={<div>Loading ViewEmployeeAttenda...</div>}>
          <ViewEmployeeAttendance/>
        </Suspense>
      );
}

export default page;