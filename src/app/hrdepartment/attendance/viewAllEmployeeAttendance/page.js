import React, { Suspense } from 'react'
import ViewAllEmployeeAttendance from './ViewAllEmployeeAttendance';
import Loader from '../../common/Loader';
const page = () => {
   return (
        <Suspense fallback={<div><Loader/></div>}>
          <ViewAllEmployeeAttendance/>
        </Suspense>
      );
}

export default page