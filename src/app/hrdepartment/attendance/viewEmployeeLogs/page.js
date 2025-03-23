"use client";
import React, { Suspense } from 'react'
import LogsPage from './ViewEmployeeLogs';
import Loader from '../../common/Loader';
import Layout from '@/layouts/Layout';

const page = () => {
   return (
        <Suspense fallback={<div><Loader/></div>}>
        <Layout>
            <LogsPage/>
        </Layout>
        </Suspense>
      );
}

export default page