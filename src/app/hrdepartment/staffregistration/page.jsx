'use client'
import EmployeeWizard from '@/app/(webadmin)/user-management/employee-view/page';
import Layout from '../../../layouts/Layout';
import React from 'react';

import { useRouter } from 'next/navigation';
import CustomSpin from '@/component/common/CustomSpin';
import useCheckToken from '@/component/common/hook/useCheckToken';

const EmployeePage = () => {

  const router = useRouter();
  const { loadingToken, unauthorized } = useCheckToken();
  if (unauthorized) {
    router.replace("/");
    return null;
  }
  if (loadingToken) return <CustomSpin />;


  return (
    <Layout>
      <div style={{ padding: "50px" }}>
        <EmployeeWizard />
      </div>
    </Layout>
  );
};

export default EmployeePage;
