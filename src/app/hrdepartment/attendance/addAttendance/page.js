"use client";
import React, { Suspense } from 'react'
import Loader from '../../common/Loader';
import Layout from '@/layouts/Layout';
import AddEmployeeAttendance from './AddEmployeeAttendance';

const page = () => {
   return (
        <Suspense fallback={<div><Loader/></div>}>
        <Layout>
            <AddEmployeeAttendance/>
        </Layout>
        </Suspense>
      );
}

export default page