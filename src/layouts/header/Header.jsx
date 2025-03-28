"use client";
import React, { useState, useEffect } from "react";
import Qr from "../../component/common/qr/WhatsAppConnect";
import {
  Layout as AntLayout,
  Button,
  Menu,
  Dropdown,
  Space,
  Input,
  Typography,
  Modal,
  Select,
  message,
  Badge,
  Popover,
  Spin,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  BellOutlined,
  MailOutlined,
  SunOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  SettingOutlined,
  SendOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode.react";
import io from "socket.io-client"; // Import Socket.IO client
import AntButton from "../../app/hrdepartment/common/Button";
import API_BASE_URL from "../../../config/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";

// import SearchBar from "@/layouts/employeeHrms/Header/SearchBar";
// import NotificationMailSettings from "@/layouts/employeeHrms/Header/NotificationMailSettings";
// import Profile from "@/layouts/hrms/Header/Profile";
import Profile from "./Profile";
// import Qr from "./Qr";
const { Text } = Typography;
const { Header: AntHeader } = AntLayout;
const { Option } = Select;

const Header = ({ heading, status, func }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("SelectDepartment");
  const [messageType, setMessageType] = useState("SelectType");
  const [userData, setUserData] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]); // State to store leave requests
  const [resourceRequests, setResourceRequests] = useState([]); // State to store resource requests
  const [allNotificationsVisible, setAllNotificationsVisible] = useState(false); // Define allNotificationsVisible state
  const [qrValue, setQrValue] = useState("");
  const [loadingQr, setLoadingQr] = useState(false);
  const [qrstatus, setQrstatus] = useState(false);


  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/hrms/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        router.push("/"); // Redirect to login page
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleChangePassword = () => {
    setTimeout(() => {
      router.push("/hrdepartment/change-password");
    }, 1000);
  };
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    const fetchQRCodeValue = async () => {
      setLoadingQr(true);
      try {
        const response = await axios.get("https://api.gtel.in/wa1/hrms/qr");
        console.log(response.data.qr);
        setQrValue(response.data.qr); // Adjust based on the actual response structure
      } catch (error) {
        console.error("Error fetching QR code value:", error);
      } finally {
        setLoadingQr(false);
      }
    };

    fetchQRCodeValue();
  }, []);

  const sendMessage = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/hrms/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          department: selectedDepartment,
          type: messageType,
          messageContent: messageInput,
        }),
      });
      const data = await response.json();
      setMessageInput("");
      setSelectedDepartment("");
      setMessageType("");
      setModalVisible(false);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleApprove = async (_id, type) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/hrms/${type}s/approve/${_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "approved" }), // Assuming status field is updated to 'approved'
        }
      );
      const data = await response.json();
      console.log("Approved request:", data);
      // Update state or perform other actions as needed
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };

  const handleReject = async (_id, type) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/hrms/${type}s/reject/${_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "rejected" }), // Assuming status field is updated to 'rejected'
        }
      );
      const data = await response.json();
      console.log("Rejected request:", data);
      // Update state or perform other actions as needed
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  useEffect(() => {
    // Fetch leave requests and resource requests when the component mounts
    const fetchRequests = async () => {
      try {
        const leaveResponse = await fetch(`${API_BASE_URL}/hrms/leaves`);
        const leaveData = await leaveResponse.json();
        setLeaveRequests(leaveData);
        console.log(leaveData);
        const resourceResponse = await fetch(
          `${API_BASE_URL}/hrms/resources/submissions`
        );
        const resourceData = await resourceResponse.json();
        console.log("Submission Data", resourceData);
        setResourceRequests(resourceData);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const url = `${API_BASE_URL}/hrms/authdata`;
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          const employeeData = result.data[0];
          const { email, department, basicemployees, role, departmentOfficialNumber } = employeeData;
          console.log("employeeData", employeeData);

          setUserData({
            email,
            departmentOfficialNumber,
            department: department?.name,
            role: role?.name,
            firstName: basicemployees?.firstName,
            lastName: basicemployees?.lastName,
            employeeCode: basicemployees?.employeeCode,
            profileImage: basicemployees?.profileImage,
            uploadFileInfo: basicemployees?.uploadFileInfo[0]?.path
          });
          console.log("lin223 mobile number", userData);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError("Something went wrong");
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const CustomSpin = () => (
    // <div className={styless["custom-spin-container"]}>
    <Image
      src="https://www.gtel.in/wp-content/uploads/2019/07/logo.png"
      alt="Loading"
      // className={`${styless["custom-spin-img"]} ${styless["pulse-animation"]}`}
      width={100} // Set the width of the image
      height={100} // Set the height of the image
    />
  );

  if (loading) return <CustomSpin size="large" />;

  const profileMenuItems = [
    {
      key: "1",
      label: userData?.email || "No email available",
    },
    {
      key: "2",
      label: <Link href="/employee/profile">Profile</Link>,
    },
    {
      key: "3",
      label: <a onClick={handleChangePassword}>Change Password</a>,
    },
    {
      key: "4",
      label: <a onClick={handleLogout}>Logout</a>,
    },
  ];

  const notificationMenuItems = [
    {
      key: "1",
      label: "Notification 1",
    },
    {
      key: "2",
      danger: true,
      label: "Notification 2",
    },
  ];

  const modalContent = (
    <div>
      <Select
        placeholder="Select department"
        style={{ width: "100%", marginBottom: "16px" }}
        onChange={(value) => setSelectedDepartment(value)}
        value={selectedDepartment}
      >
        <Option value="SelectDepartment">Select Department....</Option>
        <Option value="HR">HR Department</Option>
        <Option value="IT">IT Department</Option>
        <Option value="Finance">Finance Department</Option>
      </Select>
      <Select
        placeholder="Select message type"
        style={{ width: "100%", marginBottom: "16px" }}
        onChange={(value) => setMessageType(value)}
        value={messageType}
      >
        <Option value="SelectType">Select Type...</Option>
        <Option value="circular">Circular</Option>
        <Option value="important">Important</Option>
      </Select>
      <Input.TextArea
        rows={4}
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Type your message here..."
        style={{ marginBottom: "16px" }}
      />
      <AntButton type="primary" icon={<SendOutlined />} onClick={sendMessage}>
        Send
      </AntButton>
    </div>
  );

  const items = [
    {
      key: "1",
      label: userData?.email || "No email available", // Display the email
    },
    {
      key: "2",
      label: <Link href="/employee/profile">Profile</Link>,
    },
    {
      key: "3",
      label: <a onClick={handleChangePassword}>Change Password</a>,
    },
    {
      key: "4",
      label: <a onClick={handleLogout}>Logout</a>,
    },
  ];

  return (
    <>
      <Toaster />
      <AntHeader
        style={{
          padding: "0px", background: "#00000", height: "40px", top: 0, width: "100vw",
          color: "white", position: "fixed", zIndex: 1, right: "-15px", left: 0,
        }}
      >

        {/* text-Gigantic  */}
        {!status && (
          <div className="header-logo" style={{ position: "absolute", left: "50px", bottom: "-11px" }}>
            <Text style={{ color: "white", fontSize: "13px", fontWeight: 600 }}>
              GIGANTIC
            </Text>
          </div>
        )}

        {/* text-Gigantic  */}
        {status && (
          <div className="header-logo" style={{ position: "absolute", left: "15px", bottom: "-11px" }}>
            <Text style={{ color: "white", fontSize: "13px", fontWeight: 600 }}>
              GIGANTIC
            </Text>
          </div>
        )}

        <div
          className="header-container"
          style={{ display: "flex", alignItems: "center", justifyContent: "end", height: "100%", padding: "0 20px", gap: "20px" }}
        >
          {/* mailmessage circuler,imp message send to employee  */}
          <div onClick={toggleModal} > <MailOutlined />  </div>

          {/* <WhatsAppOutlined /> */}
          <Qr userData={userData} qrstatus={qrstatus} setQrstatus={setQrstatus} />

          {/* Profile */}
          <Profile userData={userData} profileMenuItems={profileMenuItems} />
        </div>

        {/* menu button */}
        <Button
          onClick={func}
          type="text"
          icon={status ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          // style={{fontSize: "16px",width: 30,height: 30,position: "absolute", top: 2, left: status ? 75 : 200, color: "white",
          style={{
            fontSize: "16px", width: 30, height: 30, position: "absolute", top: 2, left: status ? 75 : 200, color: "white",
          }}
        />
        {/* modal-> mailmessage circuler,imp message send to employee */}
        <Modal
          title="Send Message"
          visible={modalVisible}
          onCancel={toggleModal}
          footer={null}
        >
          {modalContent}
        </Modal>
      </AntHeader>
    </>
  );
};

export default Header;