'use client'
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Popconfirm, Modal, message, Row, Col } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import Layout from '../../../layouts/Layout';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useCheckToken from '@/component/common/hook/useCheckToken';
import CustomSpin from '@/component/common/CustomSpin';
import API_BASE_URL from '../../../../config/config';

const CreateDepartment = () => {
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([]);
 
  // Fetch departments and handle raw data being an object or array
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/hrms/departments`);
      const rawData = response.data; // Assuming this is where the raw data is being fetched

      // Check if rawData is an object with a data property or an array
      if (Array.isArray(rawData)) {
        setDepartments(rawData);
      } else if (rawData && rawData.data && Array.isArray(rawData.data)) {
        setDepartments(rawData.data);
      } else {
        console.error('Error: rawData is neither an array nor contains an array in "data" property', rawData);
        message.error('Failed to fetch departments');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      message.error('Failed to fetch departments');
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/hrms/departments`, values);
      console.log('Department created:', response.data);
      toast.success("Department created successfully");
      form.resetFields();
      fetchDepartments();
    } catch (error) {
      console.error('Error creating department:', error);
      toast.error("Failed to create department");
    
    }
  };

  const handleDeleteDepartment = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/hrms/departments/${id}`);
      message.success('Department deleted successfully');
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      message.error('Failed to delete department');
    }
  };


  const columns = [
    {
      title: 'Department Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a>{text}</a>
      ),
    },

  //   title: 'Department Name',
  //   dataIndex: 'name',
  //   key: 'name',
  //   render: (text, record) => (
  //     <a onClick={() => showAddEmployeeModal(record)}>{text}</a>
  //   ),
  // },

    // {
    //   title: 'Minimum Employee',
    //   dataIndex: 'minEmployee',
    //   key: 'minEmployee',
    // },
    // {
    //   title: 'Maximum Employee',
    //   dataIndex: 'maxEmployee',
    //   key: 'maxEmployee',
    // },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Popconfirm
          title="Are you sure to delete this department?"
          onConfirm={() => handleDeleteDepartment(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" icon={<DeleteOutlined />} danger />
        </Popconfirm>
      ),
    },
  ];


  // check token part
  const router = useRouter();
  const { loadingToken, unauthorized } = useCheckToken();
  if (unauthorized) {
    router.replace("/");
    return null;
  }
  if (loadingToken) return <CustomSpin/>;







  return (

      <Layout>

      {/* Main layout container to wrap the entire page content */}
      <div style={{ padding: '40px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
        {/* Center the form horizontally */}
        <Row justify="center">
          <Col span={12}>
            {/* Header text for the "Create Department" section */}
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Department</h2>

            {/* Form for creating a department */}
            <Form form={form} onFinish={onFinish} layout="vertical">
              {/* Form item for the department name input */}
              <Form.Item
                label="Department Name"
                name="name"
                rules={[{ required: true, message: 'Please enter department name' }]}
              >
                {/* Input field for entering the department name */}
                <Input />
              </Form.Item>

              {/* Submit button for the form */}
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Create
                </Button>
              </Form.Item>

            </Form>
          </Col>
        </Row>

        {/* Table for displaying the list of departments */}
        <Row justify="center" style={{ marginTop: '40px' }}>
          <Col span={18}>
            <Table columns={columns} dataSource={departments} rowKey="_id" />
          </Col>
        </Row>

      </div>
      </Layout>

  );
};

export default CreateDepartment;