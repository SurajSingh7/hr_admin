'use client';

import { useEffect } from 'react';
import { XCircleIcon } from 'lucide-react';

export default function WhatsAppModal({
  onClose,
  startSession,
  status,
  qrCode,
  connected,
  loading,
  setConnected,
}) {
  useEffect(() => {
    console.log('QR Code Updated:', qrCode);
  }, [qrCode]);

  useEffect(() => {
    if (connected) {
      localStorage.setItem('whatsappConnected', 'true');
      setConnected(true);
    }
  }, [connected, setConnected]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-5 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full relative transform transition-all duration-300 top-0 right-0 scale-100 md:-top-[112px] md:-right-20 md:scale-[0.5]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <XCircleIcon className="w-8 h-8" />
        </button>
        {!connected ? (
          <div className="flex flex-col items-center">
            <button
              onClick={startSession}
              className="px-7 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Starting...' : 'Start Session'}
            </button>
            {status && <p className="text-gray-600 text-sm text-center">{status === "QR code not available." ? "" : status}</p>}
            {qrCode && (
              <div className="bg-green-50 border border-gray-200 rounded-md p-1 flex justify-center items-center shadow-sm">
                <pre className="text-[6px] leading-none text-gray-800 whitespace-pre-wrap break-words text-center font-mono">{qrCode}</pre>
              </div>
            )}
          </div>
        ) : (
          <p className="text-green-600 font-bold text-center">Device connected successfully!</p>
        )}
      </div>
    </div>
  );
}













// 'use client';

// import { useEffect } from 'react';
// import { XCircleIcon } from 'lucide-react';

// export default function WhatsAppModal({
//   onClose,
//   startSession,
//   status,
//   qrCode,
//   connected,
//   loading,
//   setQrstatus,
//   qrstatus,
// }) {
//   useEffect(() => {
//     console.log('QR Code Updated:', qrCode);
//   }, [qrCode]);

//   useEffect(() => {
//     if (connected) {
//       setQrstatus(true);
//     }
//   }, [connected, setQrstatus]);

//   return (
//     <div
//       className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-5 p-4 m"
//       onClick={onClose}
//       // role="dialog"
//       // aria-modal="true"
//     >
//       <div
//         // For small screens: centered with full scale.
//         // On medium screens (md:) it applies your original offsets and scale.
//         className="bg-white rounded-lg shadow-xl max-w-md w-full relative transform transition-all duration-300
//                    top-0 right-0 scale-100 md:-top-[112px] md:-right-20 md:scale-[0.5]"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
//           aria-label="Close modal"
//         >
//           <XCircleIcon className="w-8 h-8" />
//         </button>

//         {!connected ? (
//           <div className="flex flex-col items-center">
//             <button
//               onClick={startSession}
//               className="px-7 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50"
//               disabled={loading}
//             >
//               {loading ? 'Starting...' : 'Start Session'}
//             </button>
//             {status && (
//               <p className="text-gray-600 text-sm text-center">
//                 {status === "QR code not available." ? "" : status}
//               </p>
//             )}
//             {qrCode && (
//               <div className="bg-green-50 border border-gray-200 rounded-md p-1 flex justify-center items-center shadow-sm">
//                 <pre className="text-[6px] leading-none text-gray-800 whitespace-pre-wrap break-words text-center font-mono">
//                   {qrCode}
//                 </pre>
//               </div>
//             )}
//           </div>
//         ) : (
//           <p className="text-green-600 font-bold text-center">
//             Device connected successfully!
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }






























// 'use client';

// import { useEffect } from 'react';
// import { XCircleIcon } from 'lucide-react';

// export default function WhatsAppModal({
//   onClose,
//   startSession,
//   status,
//   qrCode,
//   connected,
//   loading,
//   setQrstatus,
//   qrstatus,
// }) {
//   useEffect(() => {
//     console.log('QR Code Updated:', qrCode);
//   }, [qrCode]);

//   useEffect(() => {
//     if (connected) {
//       setQrstatus(true);
//     }
//   }, [connected, setQrstatus]);

//   return (
//     <div
//       className="fixed inset-0 z-50  flex  justify-end bg-black bg-opacity-5 p-4 m"
//       onClick={onClose}
//       role="dialog"
//       aria-modal="true"
//     >
//       <div
//         className="bg-white  rounded-lg shadow-xl max-w-md w-full relative -top-[112px] -right-20  transform transition-all duration-300 scale-[0.5]"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
//           aria-label="Close modal"
//         >
//           <XCircleIcon className="w-8 h-8" />
//         </button>
      
//         {!connected ? (
//           <div className="flex flex-col items-center ">
//             <button
//               onClick={startSession}
//               className="px-7 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50"
//               disabled={loading}
//             >
//               {loading ? 'Starting...' : 'Start Session'}
//             </button>
//             {status && (
//               <p className="text-gray-600 text-sm text-center">
//                 {status === "QR code not available." ? "" : status}
//               </p>
//             )}
//             {qrCode && (
//               <div className="bg-green-50 border border-gray-200 rounded-md p-1 flex justify-center items-center shadow-sm">
//                 <pre className="text-[6px] leading-none text-gray-800 whitespace-pre-wrap break-words text-center font-mono">
//                   {qrCode}
//                 </pre>
//               </div>
//             )}
//           </div>
//         ) : (
//           <p className="text-green-600 font-bold text-center">
//             Device connected successfully!
//           </p>
//         )}
//       </div>
//     </div>

//   );
// }












// 'use client';

// import { useEffect } from 'react';
// import { XCircleIcon } from 'lucide-react';

// export default function WhatsAppModal({
//   onClose,
//   startSession,
//   status,
//   qrCode,
//   connected,
//   loading,
//   setQrstatus,
//   qrstatus,
// }) {
//   useEffect(() => {
//     console.log('QR Code Updated:', qrCode);
//   }, [qrCode]);

//   // When device is connected, set qrstatus to true.
//   useEffect(() => {
//     if (connected) {
//       setQrstatus(true);
//     }
//   }, [connected, setQrstatus]);

//   return (
//     <div
//       // className="fixed inset-0 z-50 flex  justify-end bg-black bg-opacity-50 backdrop-blur-sm p-4"
//       className="fixed inset-0 z-50  flex  justify-end bg-black bg-opacity-5 p-4 m"
//       onClick={onClose}
//       role="dialog"
//       aria-modal="true"
//     >
//       <div
//         className="bg-white  rounded-lg shadow-xl max-w-md w-full relative -top-[112px] -right-20  transform transition-all duration-300 scale-[0.5]"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
//           aria-label="Close modal"
//         >
//           <XCircleIcon className="w-8 h-8" />
//         </button>
      
//         {!connected ? (
//           <div className="flex flex-col items-center ">
//             <button
//               onClick={startSession}
//               className="px-7 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50"
//               disabled={loading}
//             >
//               {loading ? 'Starting...' : 'Start Session'}
//             </button>
//             {status && (
//               <p className="text-gray-600 text-sm text-center">
//                 {status === "QR code not available." ? "" : status}
//               </p>
//             )}
//             {qrCode && (
//               <div className="bg-green-50 border border-gray-200 rounded-md  flex justify-center items-center shadow-sm">
//                 <pre className="text-xs text-gray-800 whitespace-pre-wrap break-words text-center font-mono">
//                   {qrCode}
//                 </pre>
                
//               </div>
//             )}
            
//           </div>
//         ) : (
//           <p className="text-green-600 font-bold text-center">
//             Device connected successfully!
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

















// 'use client';

// import { useEffect } from 'react';
// import { XCircleIcon } from 'lucide-react';

// export default function WhatsAppModal({
//   onClose,
//   startSession,
//   status,
//   qrCode,
//   connected,
//   loading,
//   setQrstatus,
//   qrstatus,
// }) {
//   useEffect(() => {
//     console.log('QR Code Updated:', qrCode);
//   }, [qrCode]);

//   // When device is connected, set qrstatus to true.
//   useEffect(() => {
//     if (connected) {
//       setQrstatus(true);
//     }
//   }, [connected, setQrstatus]);

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
//       onClick={onClose}
//       role="dialog"
//       aria-modal="true"
//     >
//       <div
//         className="bg-white rounded-lg shadow-xl max-w-md w-full relative p-6 transform transition-all duration-300 scale-[0.6]"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
//           aria-label="Close modal"
//         >
//           <XCircleIcon className="w-8 h-8" />
//         </button>

//         {!connected ? (
//           <div className="flex flex-col items-center space-y-4">
//             <button
//               onClick={startSession}
//               className="px-7 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50"
//               disabled={loading}
//             >
//               {loading ? 'Starting...' : 'Start Session'}
//             </button>
//             {status && (
//               <p className="text-gray-600 text-sm text-center">
//                 {status === "QR code not available." ? "QR CODE" : status}
//               </p>
//             )}
//             {qrCode && (
//               <div className="bg-gray-50 border border-gray-200 rounded-md p-4 w-full flex justify-center items-center shadow-sm">
//                 <pre className="text-xs text-gray-800 whitespace-pre-wrap break-words text-center font-mono">
//                   {qrCode}
//                 </pre>
//               </div>
//             )}
//           </div>
//         ) : (
//           <p className="text-green-600 font-bold text-center">
//             Device connected successfully!
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }












