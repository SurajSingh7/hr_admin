'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { FaWhatsapp } from 'react-icons/fa';
import WhatsAppModal from './WhatsAppModal';


const API_BASE_URL =process.env.NEXT_PUBLIC_API_WHATSAPP_URL;
let socket;

export default function WhatsAppConnect({ userData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [connected, setConnected] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('whatsappConnected') === 'true' : false
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket = io(API_BASE_URL);

    socket.on("connect", () => {
      console.log("Socket connected with id:", socket.id);
    });

    socket.on("qr-code", (qr) => {
      setQrCode(qr);
    });

    socket.on("connected", (message) => {
      setStatus(message);
      setQrCode(null);
      setConnected(true);
      localStorage.setItem('whatsappConnected', 'true');
    });

    // Listen for disconnection from WhatsApp (e.g., logged out from mobile)
    socket.on("force-logout", (message) => {
      // console.log("WhatsApp session disconnected:", message);
      setStatus("Disconnected from WhatsApp.");
      setConnected(false);
      localStorage.setItem('whatsappConnected', 'false');
    });

    socket.on("force-logout", () => {
      console.log("Socket disconnected");
      setConnected(false);
      localStorage.setItem('whatsappConnected', 'false');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const startSession = async () => {
    if (!socket) {
      setStatus("Waiting for socket connection...");
      return;
    }

    setLoading(true);
    setStatus("Starting session, please wait...");

    try {
      const sessionId = socket.id;
      const devicePhone = userData?.departmentOfficialNumber;

      const response = await fetch(`${API_BASE_URL}/api/external/connect-external-device`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, role: "HR-Department", devicePhone }),
        credentials: "include"
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Session started. Please scan the QR code below with your authenticator app.");
        if (data.qrCode) {
          setQrCode(data.qrCode);
        } else {
          setStatus("QR code not available.");
        }
      } else {
        setStatus(`Error: ${data.error || data.message}`);
      }
    } catch (error) {
      console.error("Error starting session:", error);
      setStatus("Failed to start session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={!connected ? () => setIsOpen(true) : null}
        disabled={connected}
        className={`w-5 h-5 text-white rounded-full flex items-center justify-center shadow-lg transition-colors ${
          connected ? 'bg-green-500 cursor-not-allowed' : 'bg-red-500'
        }`}
      >
        <FaWhatsapp className="w-4 h-4" />
      </button>

      {isOpen && (
        <WhatsAppModal
          onClose={() => setIsOpen(false)}
          startSession={startSession}
          status={status}
          qrCode={qrCode}
          connected={connected}
          loading={loading}
          setConnected={setConnected}
        />
      )}
    </div>
  );
};

