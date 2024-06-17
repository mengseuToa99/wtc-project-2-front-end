import React, { useState, useEffect, Suspense } from "react";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import { MdOutlineDone } from "react-icons/md";
import Stack from "@mui/material/Stack";
import Feedback from "./feedback";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import { FaTrash } from "react-icons/fa";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import Image from "next/image";
import Face from "./../../../public/face.jpg";
import Variants from "./PostLoading";
import { Box, Typography } from "@mui/material";
import defaultProfilePic from "./.././../../public/defaultProfilePic.webp";
import { FaRegSadTear } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css';

const Posting = ({ complete, permission, selectedStatus }) => {
    const [reports, setReports] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedReportId, setSelectedReportId] = useState(null); // State to hold the selected report id
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const [openDel, setOpenDel] = useState(false);
    const [loading, setLoading] = useState(false);

    const getId = () => {
        return localStorage.getItem("reporter_id");
    };

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                let apiUrl = `https://jomyeakapi.rok-kh.lol/api/v1/reports?page=${currentPage}`;

                if (selectedStatus === "Happened") {
                    apiUrl += "&status=nostatus";
                    setLoading(true);
                } else if (selectedStatus === "Completed") {
                    apiUrl += "&status=complete";
                    setLoading(true);
                } else if (selectedStatus === "Pending") {
                    apiUrl += "&status=pending";
                    setLoading(true);
                } else if (selectedStatus === "Deny") {
                    apiUrl += "&status=deny";
                    setLoading(true);
                }

                const response = await fetch(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                const total = data.meta.total;
                const postsPerPage = data.meta.per_page; // Change this to match the actual number of posts per page

                setReports(data.data); // Assuming the paginated data is under 'data' key

                setTotalPages(Math.ceil(total / postsPerPage));
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchReports();
    }, [selectedStatus, currentPage, token]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedStatus]);

    const handleCompleteClick = async (reportId) => {
        try {
            console.log("Completing report:", reportId);
            const reportIndex = reports.findIndex((report) => report.id === reportId);
            if (reportIndex !== -1) {
                const updatedReports = [...reports];
                updatedReports[reportIndex].status = "complete";

                const apiUrl = `https://jomyeakapi.rok-kh.lol/api/v1/reports/${reportId}`;
                const response = await fetch(apiUrl, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status: "complete" }),
                });

                if (!response.ok) {
                    throw new Error("Failed to update status to complete");
                }

                setReports(updatedReports);
                setSelectedReportId(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handlePermissionClick = async (reportId) => {
        try {
            console.log("Accepting report:", reportId);
            const reportIndex = reports.findIndex((report) => report.id === reportId);
            if (reportIndex !== -1) {
                const apiUrl = `https://jomyeakapi.rok-kh.lol/api/v1/reports/${reportId}`;
                const response = await fetch(apiUrl, {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: "pending" }),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || "Failed to update status to pending");
                }
                const updatedReports = [...reports];
                updatedReports[reportIndex].status = "pending";
                setReports(updatedReports);
                setSelectedReportId(null); // Clear the selected report id

                setCurrentPage(currentPage);
            }
        } catch (error) {
            console.error(error);
            // Handle error gracefully, e.g., display an error message to the user
        }
    };

    const handleDeleteReport = async (reportId) => {
        try {
            const apiUrl = `https://jomyeakapi.rok-kh.lol/api/v1/reports/${reportId}`;
            const response = await fetch(apiUrl, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.success("success deleted");
            }

            if (!response.ok) {
                throw new Error("Failed to delete");
            }

            // Remove the deleted report from the state
            const updatedReports = reports.filter((report) => report.id !== reportId);
            setReports(updatedReports);

            setSelectedReportId(null); // Clear the selected report id
        } catch (error) {
            console.error(error);
        }
    };

    const PaperComponent = (props) => {
        return (
            <Draggable handle='#draggable-dialog-title' cancel={'[class*="MuiDialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
    };

    const handleClickOpen = (reportId) => {
        setSelectedReportId(reportId);
        setOpenDel(true);
    };

    const handleClose = (action) => {
        if (action === "delete") {
            handleDeleteReport(selectedReportId);
        }
        setOpenDel(false);
    };

    const handleOpenFeedback = (reportId) => {
        setSelectedReportId(reportId);
        setIsOpen(true);
        setFeedback(true);
    };

    const handleCloseFeedback = () => {
        setSelectedReportId(null);
        setIsOpen(false);
        setFeedback(false);
    };

    const handleChange = (event, value) => {
        setCurrentPage(value);
    };

    const updateReportStatus = (reportId, status, feedback) => {
        const updatedReports = reports.map((report) => {
            if (report.id === reportId) {
                return { ...report, status, feedback };
            }
            return report;
        });
        setReports(updatedReports);
    };

    return (
        <>
        <ToastContainer />
            {" "}
            <Suspense fallback={<Variants />}>
                {loading ? (
                    <Variants />
                ) : (
                    <div>
                        {reports.length > 0 ? (
                            reports.map((report) => (
                                <div
                                    key={report.id}
                                    className='sm:w-full lg:w-[826px] h-auto bg-[#393E46] rounded-2xl mt-[31px] flex flex-col shadow-xl mb-[30px]'
                                >
                                    <div className='flex flex-row justify-between'>
                                        <section className='ml-[25px] mt-[32px]'>
                                            <div className='flex flex-col'>
                                                {(() => {
                                                    let buttonContent, buttonColor;
                                                    if (report.status === "complete") {
                                                        buttonContent = "Complete";
                                                        buttonColor = "badge badge-success gap-2 mb-[24px]";
                                                    } else if (report.status === "pending") {
                                                        buttonContent = "Pending";
                                                        buttonColor = "badge badge-warning gap-2  mb-[24px]";
                                                    } else if (report.status === "deny") {
                                                        buttonContent = "Deny";
                                                        buttonColor = "badge badge-error gap-2  mb-[24px]";
                                                    }
                                                    return (
                                                        <div className={buttonColor}>
                                                            <svg
                                                                fill='none'
                                                                xmlns='http://www.w3.org/2000/svg'
                                                                viewBox='0 0 24 24'
                                                                className='inline-block w-4 h-4 stroke-current'
                                                            >
                                                                <path
                                                                    strokeLinecap='round'
                                                                    strokeLinejoin='round'
                                                                    strokeWidth='2'
                                                                    d='M6 18L18 6M6 6l12 12'
                                                                ></path>
                                                            </svg>
                                                            {buttonContent}
                                                        </div>
                                                    );
                                                })()}

                                                {report.status === "deny" && (
                                                    <div>
                                                        <p
                                                            className={`w-auto h-auto text-[16px] mr-[70px] font-[400px] text-deny mb-[16px] flex`}
                                                        >
                                                            Feedback: {report.feedback}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <h1 className='text-[20px] font-[700] text-primary'>{report.title}</h1>
                                        </section>
                                    </div>

                                    <section className='ml-[25px] flex items-center justify-between h-[70px]'>
                                        <div className='flex items-center mt-[32px] mb-[16px] '>
                                            <div className='w-[45px] h-[45px] rounded-[50px] flex items-center justify-center bg-black drop-shadow-[0_135px_135px_rgba(0,0,01)]'>
                                                <Image
                                                    src={
                                                        report.anonymous === "1"
                                                            ? Face
                                                            : report.Reporter_Pic || defaultProfilePic
                                                    }
                                                    alt='Reporter Image'
                                                    width={45}
                                                    height={45}
                                                    className='w-[45px] h-[45px] rounded-lg shadow-lg lazyload'
                                                />
                                            </div>

                                            <div className='ml-[24px]'>
                                                <p className='text-[#fff] text-[15px] font-bold'>
                                                    {report.anonymous === "1" ? "Anonymous" : report.Reporter_Name}
                                                </p>
                                                <p className='text-[#fff] text-[10px] font-light mt-[8px] '>
                                                    {report.timeline}
                                                </p>
                                            </div>
                                        </div>

                                        {complete && report.status === "pending" && (
                                            <Stack direction='row' spacing={2} className='mr-[20px]'>
                                                <Button
                                                    variant='contained'
                                                    color='success'
                                                    className={` rounded-[3px] text-[12.54px] mr-[40px]`}
                                                    onClick={() => handleCompleteClick(report.id)}
                                                >
                                                    completed
                                                </Button>
                                            </Stack>
                                        )}

                                        {complete && report.status === "complete" && (
                                            <div>
                                                <p
                                                    className={`w-auto h-auto text-[12.54px] mr-[70px] text-accept font-normal flex`}
                                                >
                                                    The problem is fixed <MdOutlineDone className='ml-[10px]' />
                                                </p>
                                            </div>
                                        )}

                                        {permission && report.status === "nostatus" && (
                                            <Stack direction='row' spacing={2} className='mr-[20px]'>
                                                <Button
                                                    variant='contained'
                                                    color='success'
                                                    className={` rounded-[3px] text-[12.54px] mr-[10px]`}
                                                    onClick={() => handlePermissionClick(report.id)}
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant='contained'
                                                    color='error'
                                                    className={` rounded-[3px] text-[12.54px] mr-[40px]`}
                                                    onClick={() => handleOpenFeedback(report.id)}
                                                >
                                                    Deny
                                                </Button>
                                            </Stack>
                                        )}

                                        {permission && report.status === "pending" && (
                                            <div>
                                                <p
                                                    className={`w-auto h-auto text-[12.54px] mr-[70px] text-accept font-normal flex`}
                                                >
                                                    The report is accepted <FaRegThumbsUp className='ml-[10px]' />
                                                </p>
                                            </div>
                                        )}

                                    </section>

                                    <section className='ml-[25px] mt-[16px]'>
                                        <div className='text-[14px] font-[400px] mt-[8px] sm:w-full lg:w-[757px] flex'>
                                            <p className='text-primary '>Building: {report.building}</p>
                                            <p className='ml-[16px] text-primary '>Floor: {report.floor}</p>
                                            <p className='ml-[16px] text-primary '>Room: {report.room}</p>
                                            <p className='ml-[16px] text-primary '>Type: {report.category_type}</p>
                                            <p className='ml-[16px] text-primary '>Category: {report.category_name}</p>
                                        </div>
                                    </section>

                                    <section className='ml-[25px] mt-[4px]'>
                                        <p className='text-[16px] font-[400px] mt-[8px] sm:w-full lg:w-[757px]'>
                                            {report.description}
                                        </p>
                                    </section>

                                    <section className='flex mt-[28px] justify-center mb-[24px]'>
                                        {report.image && (
                                            <Image
                                                src={report.image}
                                                alt='Report Image'
                                                width={400}
                                                height={400}
                                                loading='lazy'
                                                className='h-[400px] w-[400px] shrink-1 rounded-lg content-center'
                                            />
                                        )}
                                    </section>

                                    {permission && (
                                        <section className='flex justify-end mr-6 mb-10'>
                                            <FaTrash
                                                className='cursor-pointer'
                                                color='#ff0000'
                                                onClick={() => handleClickOpen(report.id)}
                                            />
                                        </section>
                                    )}
                                </div>
                            ))
                        ) : (
                            <Box className='sm:w-full lg:w-[826px] h-[500px] pt-3 flex flex-col justify-center items-center bg-[#393E46] rounded-2xl shadow-xl'>
                                <FaRegSadTear size={50} color='#6F797F' />
                                <Typography variant='h6' color='textSecondary' mt={2}>
                                    No Reports Found
                                </Typography>
                            </Box>
                        )}

                        <Feedback
                            open={feedback}
                            onClose={handleCloseFeedback}
                            reportId={selectedReportId}
                            updateReportStatus={updateReportStatus}
                        />

                        <Dialog open={openDel} PaperComponent={PaperComponent} aria-labelledby='draggable-dialog-title'>
                            <DialogTitle style={{ cursor: "move" }} id='draggable-dialog-title'>
                                Delete Confirmation
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>Are you sure you want to delete this report?</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button autoFocus onClick={() => handleClose("cancel")}>
                                    No
                                </Button>
                                <Button variant='outlined' color='error' onClick={() => handleClose("delete")}>
                                    Yes
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Stack spacing={2} className='mb-[32px] mt-[32px]'>
                            <Pagination
                                count={totalPages}
                                variant='outlined'
                                color='success'
                                shape='rounded'
                                page={currentPage}
                                onChange={handleChange}
                            />
                        </Stack>
                    </div>
                )}
            </Suspense>
        </>
    );
};

export default Posting;
