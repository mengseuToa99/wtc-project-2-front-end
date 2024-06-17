import React, { useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import CircularIndeterminate from "@/app/_component/CircularIndeterminate";
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify styles

const Feedback = ({ open, onClose, reportId, updateReportStatus }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [loading, setLoading] = useState(false);

  const handleSubFeedback = async () => {
    setLoading(true);
    try {
      const apiUrl = `https://jomyeakapi.rok-kh.lol/api/v1/reports/${reportId}`;
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "deny", feedback: feedbackText }),
      });

      if (response.ok) {
        toast.success('Feedback sent successfully!');
        updateReportStatus(reportId, "deny", feedbackText);  // Update the report status and feedback
      } else {
        toast.error('Feedback not send!');
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Response:", data);
      }

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFeedbackText(''); // Reset the feedback text
    onClose();
  };

  return (
    <>
      <ToastContainer /> {/* Add the ToastContainer */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-[#393E46] p-6 rounded-lg shadow-lg w-[300px] h-[300px]">
            <div className="flex justify-end">
              <button className="text-white w-[25px] h-[25px] flex justify-center hover:bg-[#222831]-600 text-[20px]" onClick={handleClose}>
                <RxCross2 />
              </button>
            </div>
            <h2 className="mt-[-30px] font-[500] text-[12px] mb-4">Feedback</h2>
            <textarea
              className="w-[260px] h-[200px] bg-[#222831] text-[12px] px-4 pt-4"
              placeholder="Enter your feedback here..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            ></textarea>
            <div className="flex justify-end">
              <button className="btn btn-xs text-white w-[50px] h-auto text-[10px] bg-primary mr-[-10px] mt-[10px]" onClick={handleSubFeedback}>
                {loading ? <CircularIndeterminate size={15} color="white" /> : "submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Feedback;

