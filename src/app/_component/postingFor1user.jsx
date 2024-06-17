import React, { useState, useEffect, useCallback, Suspense } from "react";
import { FaTrash } from "react-icons/fa";
import { Box, Typography } from "@mui/material";
import { FaRegSadTear } from "react-icons/fa";
import {
    Stack,
    Button,
    Pagination,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
} from "@mui/material";
import Variants from "./PostLoading";
import Draggable from "react-draggable";
import Image from "next/image";
import Face from "./../../../public/face.jpg";
import defaultProfilePic from "./.././../../public/defaultProfilePic.webp";

const Posting = ({ complete, permission, selectedStatus }) => {
    const getToken = useCallback(() => localStorage.getItem("token"), []);
    const getId = useCallback(() => localStorage.getItem("reporter_id"), []);
    const [loading, setLoading] = useState(false);
    const [reporterId, setReporterId] = useState(getId());
    const [reports, setReports] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [openDialogId, setOpenDialogId] = useState(null); // Manage dialog state for each report

    const fetchReports = useCallback(async () => {
        try {
            const token = getToken();
            const reporter_id = getId();

            if (!reporter_id) {
                console.error("User ID not found.");
                return;
            }

            console.log("Reporter ID:", reporter_id);

            let apiUrl = `https://jomyeakapi.rok-kh.lol/api/v1/reports?page=${currentPage}&reporter_id=${reporter_id}`;
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

            setTimeout(() => {
                setLoading(false);
            }, 1500);

            const response = await fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to fetch data");

            const data = await response.json();
            setReports(data.data || []); // Ensure reports is an array
            setTotalPages(data.last_page || 1); // Ensure totalPages is a number
        } catch (error) {
            console.error(error);
        }
    }, [getToken, getId, selectedStatus, currentPage]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports, reporterId, currentPage]);

    const handleDeleteReport = async (reportId) => {
        try {
            const apiUrl = `https://jomyeakapi.rok-kh.lol/api/v1/reports/${reportId}`;
            const response = await fetch(apiUrl, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            if (!response.ok) throw new Error("Failed to delete report");

            setReports((prevReports) => prevReports.filter((report) => report.id !== reportId));
        } catch (error) {
            console.error(error);
        }
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const renderReportStatusBadge = (status) => {
        let badgeClass, badgeText;
        if (status === "complete") {
            badgeClass = "badge badge-success gap-2 mb-[24px]";
            badgeText = "Complete";
        } else if (status === "pending") {
            badgeClass = "badge badge-warning gap-2 mb-[24px]";
            badgeText = "Pending";
        } else if (status === "deny") {
            badgeClass = "badge badge-error gap-2 mb-[24px]";
            badgeText = "Deny";
        }
        return (
            <div className={badgeClass}>
                <svg
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    className='inline-block w-4 h-4 stroke-current'
                >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
                </svg>
                {badgeText}
            </div>
        );
    };

    return (
        <>
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
                                        <section className='mx-[25px] mt-[32px] w-full'>
                                            <div className='flex justify-between'>
                                                {renderReportStatusBadge(report.status)}
                                                <FaTrash
                                                    className='cursor-pointer'
                                                    color='#6F797F'
                                                    onClick={() => setOpenDialogId(report.id)}
                                                />
                                                <Dialog
                                                    open={openDialogId === report.id}
                                                    onClose={() => setOpenDialogId(null)}
                                                    PaperComponent={(props) => (
                                                        <Draggable
                                                            handle='#draggable-dialog-title'
                                                            cancel={'[class*="MuiDialogContent-root"]'}
                                                        >
                                                            <Paper {...props} />
                                                        </Draggable>
                                                    )}
                                                    aria-labelledby='draggable-dialog-title'
                                                >
                                                    <DialogTitle style={{ cursor: "move" }} id='draggable-dialog-title'>
                                                        Delete Confirmation
                                                    </DialogTitle>
                                                    <DialogContent>
                                                        <DialogContentText>
                                                            Are you sure you want to delete this report?
                                                        </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button autoFocus onClick={() => setOpenDialogId(null)}>
                                                            No
                                                        </Button>
                                                        <Button
                                                            variant='outlined'
                                                            color='error'
                                                            onClick={() => {
                                                                setOpenDialogId(null);
                                                                handleDeleteReport(report.id);
                                                            }}
                                                        >
                                                            Yes
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </div>
                                            {report.status === "deny" && (
                                                <div>
                                                    <p className='w-auto h-auto text-[16px] mr-[70px] font-[400px] text-deny mb-[16px] flex'>
                                                        Feedback: {report.feedback}
                                                    </p>
                                                </div>
                                            )}
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
                                    </section>
                                    <section className='ml-[25px] mt-[24px]'>
                                        <p className='text-[16px] font-[400px] mt-[8px] w-full'>{report.description}</p>
                                    </section>
                                    <section className='flex mt-[28px] justify-center mb-[24px]'>
                                        {report.image && (
                                            <Image
                                            src={report.image}
                                            alt='Report Image'
                                            width={400}
                                            height={400}
                                            loading='lazy'
                                            className='h-[400px] w-[350px] shrink-1 rounded-lg content-center'
                                        />
                                        )}
                                    </section>
                                </div>
                            ))
                        ) : (
                            <Box className='sm:w-full lg:w-[826px] h-full flex flex-col justify-center items-center bg-[#393E46] rounded-2xl mt-[31px] shadow-xl mb-[30px]'>
                                <FaRegSadTear size={50} color='#6F797F' />
                                <Typography variant='h6' color='textSecondary' mt={2}>
                                    No Reports Found
                                </Typography>
                            </Box>
                        )}
                        <Stack spacing={2} className='mb-[32px] mt-[32px]'>
                            <Pagination
                                count={totalPages}
                                variant='outlined'
                                color='success'
                                shape='rounded'
                                page={currentPage}
                                onChange={handlePageChange}
                            />
                        </Stack>
                    </div>
                )}
            </Suspense>
        </>
    );
};

export default Posting;