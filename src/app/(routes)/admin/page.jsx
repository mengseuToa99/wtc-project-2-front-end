"use client";
import React, { useState, Suspense, useEffect, useLayoutEffect } from "react";
import HomeHeading from "@/app/_component/homeHeading";
import Posting from "@/app/_component/posting";
import Status from "@/app/_component/status";
import Nav from "@/app/_component/nav";
import { useRouter } from "next/navigation";
import Dashboard from "@/app/_component/dashboard";
import Variants from "@/app/_component/PostLoading";
import Studenttable from "@/app/_component/studenttable";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AddCategory from "@/app/_component/AddCategory";

const Page = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("Happened");
    const [buttonPermission, setButtonPermission] = useState(false);
    const [buttonComplete, setButtonComplete] = useState(false);
    const [isDashboardTab, setIsDashboardTab] = useState(false);
    const [isAddStudentTab, setIsAddStudentTab] = useState(false);
    const [isReportCardTab, setIsReportCardTab] = useState(true);
    const [isCategory, setIsCategory] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        const userLoginStatus = localStorage.getItem("isAdminLogin");
        setIsAuth(userLoginStatus);
    
        if (!userLoginStatus || userLoginStatus === "false") {
            router.replace("/login");
        }
    }, [router]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const handleSelectStatus = (status) => {
        setSelectedStatus(status);
        if (status === "Happened") {
            setButtonPermission(true);
            setButtonComplete(false);
            setIsReportCardTab(true);
            setIsAddStudentTab(false);
            setIsDashboardTab(false);

        } else if (status === "Pending") {
            setButtonPermission(false);
            setButtonComplete(true);
            setIsReportCardTab(true);
            setIsAddStudentTab(false);
            setIsDashboardTab(false);

        } else {
            setIsAddStudentTab(false);
            setIsDashboardTab(false);
            setButtonComplete(false);
            setButtonPermission(true);
            setIsReportCardTab(true);
        }
    };

    const handleDashboardClick = () => {
        setIsDashboardTab(true);
        setIsAddStudentTab(false);
        setIsReportCardTab(false);
        setIsCategory(false);
        setSelectedStatus("Dashboard");
    };

    const handleAddStudentClick = () => {
        setIsAddStudentTab(true);
        setIsReportCardTab(false);
        setIsDashboardTab(false);
        setIsCategory(false);
        setSelectedStatus("Add Student");
    };

    const handleCategory = () => {
        setIsCategory(true);
        setIsAddStudentTab(false);
        setIsReportCardTab(false);
        setIsDashboardTab(false);
        setSelectedStatus("Add Category");
    };


    return (
        <div className='flex flex-col bg-[#222831] h-full'>
            <Nav />
            <HomeHeading title={selectedStatus} className='p-3'/>
            <div className='flex flex-col md:flex-row space-x-0 md:space-x-[20px] justify-center bg-[#222831] h-full p-3'>
                <div className='flex flex-col space-y-[20px] md:hidden'>
                    <button
                        onClick={handleClickOpen}
                        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-200'
                    >
                        Filter
                    </button>
                    <Dialog
                        fullScreen={fullScreen}
                        open={open}
                        onClose={handleClose}
                        aria-labelledby='responsive-dialog-title'
                        PaperProps={{
                            style: {
                                backgroundColor: "rgba(34, 40, 49, 0.5)",
                            },
                        }}
                    >
                        <DialogTitle id='responsive-dialog-title' className='flex justify-end'>
                            <IconButton edge='end' color='inherit' onClick={handleClose} aria-label='close'>
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <div className='flex flex-col space-y-[20px] justify-center items-center'>
                            <div className='space-y-[10px]'>
                                <button
                                    className={`btn w-[190px] h-[45px] ${
                                        isDashboardTab ? "bg-primary text-[#222831]" : "bg-background text-light"
                                    } hover:bg-primary hover:text-background rounded-[3px] text-[15px] font-semibold flex items-center justify-center mt-[31px]`}
                                    onClick={handleDashboardClick}
                                >
                                    Dashboard
                                </button>
                                <button
                                    className={`btn w-[190px] h-[45px] ${
                                        isAddStudentTab ? "bg-primary text-[#222831]" : "bg-background text-light"
                                    } hover:bg-primary hover:text-background rounded-[3px] text-[15px] font-semibold flex items-center justify-center mt-[31px]`}
                                    onClick={handleAddStudentClick}
                                >
                                    Add Student
                                </button>
                            </div>
                            <Status selectedStatus={selectedStatus} onSelectStatus={handleSelectStatus} />
                        </div>
                    </Dialog>
                </div>

                <div className='hidden md:flex flex-col space-y-[20px]'>
                    <div className='space-y-[10px]'>
                        <button
                            className={`btn w-[190px] h-[45px] ${
                                isDashboardTab ? "bg-primary text-[#222831]" : "bg-background text-light"
                            } hover:bg-primary hover:text-background rounded-[3px] text-[15px] font-semibold flex items-center justify-center mt-[31px]`}
                            onClick={handleDashboardClick}
                        >
                            Dashboard
                        </button>
                        <button
                            className={`btn w-[190px] h-[45px] ${
                                isAddStudentTab ? "bg-primary text-[#222831]" : "bg-background text-light"
                            } hover:bg-primary hover:text-background rounded-[3px] text-[15px] font-semibold flex items-center justify-center mt-[31px]`}
                            onClick={handleAddStudentClick}
                        >
                            Add Student
                        </button>
                        <button
                            className={`btn w-[190px] h-[45px] ${
                                isCategory ? "bg-primary text-[#222831]" : "bg-background text-light"
                            } hover:bg-primary hover:text-background rounded-[3px] text-[15px] font-semibold flex items-center justify-center mt-[31px]`}
                            onClick={handleCategory}
                        >
                            Add Category
                        </button>
                    </div>
                    <Status selectedStatus={selectedStatus} onSelectStatus={handleSelectStatus} />
                </div>
                {isReportCardTab && !isAddStudentTab && !isDashboardTab && (
                    <Suspense fallback={<Variants />}>
                        {loading ? (
                            <Variants />
                        ) : (
                            <Posting
                                complete={buttonComplete}
                                permission={buttonPermission}
                                selectedStatus={selectedStatus}
                            />
                        )}
                    </Suspense>
                )}
                {!isReportCardTab && isAddStudentTab && !isDashboardTab && !isCategory && <Studenttable />}
                {!isReportCardTab && !isAddStudentTab && isDashboardTab && !isCategory && <Dashboard />}
                {!isReportCardTab && !isAddStudentTab && !isDashboardTab && isCategory && <AddCategory />}
            </div>
        </div>
    );
};

export default Page;
