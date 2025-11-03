'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
// Redirect to the proper jobs list page
const EmployeeJobsPage: React.FC = () => {
  const router = useRouter();
  React.useEffect(() => {
    router.replace('/employee/jobs/list');
  }, [router]);
  return null;
};

export default EmployeeJobsPage;

