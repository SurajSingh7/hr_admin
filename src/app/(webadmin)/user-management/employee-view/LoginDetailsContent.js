import React, { useState } from "react";
import { Row, Col, Form, Input, Select } from "antd";

const { Option } = Select;

const LoginDetailsContent = ({ departments, roles }) => {
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const selectedRole = roles.find((role) => role._id === selectedRoleId)?.name;

  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Username" name="username">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter Password" }]}
          >
            <Input.Password placeholder="Enter your password..." />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter Email" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[{ required: true, message: "Please confirm Password" }]}
          >
            <Input.Password placeholder="Confirm your password..." />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: "Please select your department!" }]}
          >
            <Select placeholder="Select a department">
              {departments.map((department) => (
                <Option key={department._id} value={department._id}>
                  {department.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select your role!" }]}
          >
            <Select
              placeholder="Select a role"
              onChange={(value) => setSelectedRoleId(value)} // Store Role ID
            >
              {roles.map((role) => (
                <Option key={role._id} value={role._id}>
                  {role.name} {/* Display Name, Send ID */}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* Department Official Number (Visible only for HR Manager) */}
      {selectedRole === "Hr Manager" && (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="departmentOfficialNumber"
              label="Dep. Official Number"
              rules={[
                { required: true, message: "Please enter Department Official Number!" },
                { pattern: /^[0-9]{10}$/, message: "Must be exactly 10 digits!" }
              ]}
            >
              <Input
                placeholder="Enter official number"
                maxLength={10}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault(); // Prevent non-numeric input
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      )}
    </>
  );
};

export default LoginDetailsContent;

