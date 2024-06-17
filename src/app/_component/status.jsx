import React, { useState, useEffect } from "react";

const Status = ({ selectedStatus, onSelectStatus }) => {
  const [buttonPermission, setButtonPermission] = useState(false);
  const [buttonComplete, setButtonComplete] = useState(false);



  const handleClick = (status) => {
    onSelectStatus(status);

    if (status === "Pending") {
      setButtonPermission(true);
      setButtonComplete(false);
    } else if (status === "Completed") {
      setButtonPermission(false);
      setButtonComplete(true);
    } else {
      setButtonComplete(false);
      setButtonPermission(false);
    }
  };

  useEffect(() => {
    if (selectedStatus === "Pending") {
      setButtonPermission(true);
    } else {
      setButtonPermission(false);
    }
  }, [selectedStatus]);

  return (
    <div className="space-y-[16px] sticky top-[5rem] ">
      <h1 className="text-[20px] font-bold text-white"># Status</h1>

      <div className="space-y-[12px]">
        <div
          onClick={() => handleClick("Happened")}
          className={`${
            selectedStatus === "Happened"
              ? "bg-primary text-background"
              : "bg-background text-light"
          } btn w-[190px] h-[45px] rounded-[3px] text-[15px] font-semibold flex items-center hover:bg-primary hover:text-background`}
        >
          <span className="ml-[10px]">Happened</span>
        </div> 

        <div
          onClick={() => handleClick("Deny")}
          className={`${
            selectedStatus === "Deny"
              ? "bg-primary text-background"
              : "bg-background text-light"
          } btn w-[190px] h-[45px] rounded-[3px] text-[15px] font-semibold flex items-center hover:bg-primary hover:text-background`}
        >
          <span className="ml-[10px]">Deny</span>
        </div>

        <div
          onClick={() => handleClick("Pending")}
          className={` ${
            selectedStatus === "Pending"
              ? "bg-primary text-background"
              : "bg-background text-light"
          } btn w-[190px] h-[45px] rounded-[3px] text-[15px] font-semibold flex items-center hover:bg-primary hover:text-background`}
        >
          <span className="ml-[10px]">Pending</span>
        </div>

        <div
          onClick={() => handleClick("Completed")}
          className={`${
            selectedStatus === "Completed"
              ? "bg-primary text-background"
              : "bg-background text-light"
          } btn w-[190px] h-[45px] rounded-[3px] text-[15px] font-semibold flex items-center hover:bg-primary hover:text-background`}
        >
          <span className="ml-[10px]">Completed</span>
        </div>
      </div>
    </div>
  );
};

export default Status;