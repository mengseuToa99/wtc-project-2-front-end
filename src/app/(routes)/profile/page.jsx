"use client";

import React, { useState, useEffect, Suspense, useLayoutEffect } from "react";
import PostButton from "@/app/_component/postButton";
import Profile from "@/app/_component/profile";
import Status from "@/app/_component/status";
import PostingFor1User from "@/app/_component/postingFor1user";
import Nav from "@/app/_component/nav";
import Variants from "@/app/_component/PostLoading";
import { useRouter } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const ProfilePage = () => {
    const router = useRouter();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("Happened");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const isAuth = localStorage.getItem("isUserLogin");
            // const savedStatus = localStorage.getItem("selectedStatus");

            if (!isAuth || isAuth === "false") {
                router.replace("/login");
            } else {
                // if (savedStatus) {
                //     setSelectedStatus(savedStatus);
                // }
                setLoading(false);
            }
        }
    }, [router]);

    const handleSelectStatus = (status) => {
        setSelectedStatus(status);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Nav />
            <Profile />
            <div className='flex flex-col bg-[#222831] h-screen p-3'>
                <div className='flex flex-col md:flex-row space-x-0 md:space-x-[20px] justify-center bg-[#222831]'>
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
                                <PostButton />
                                <Status selectedStatus={selectedStatus} onSelectStatus={handleSelectStatus} />
                            </div>
                        </Dialog>
                    </div>
                    <div className='hidden md:flex flex-col space-y-[20px]'>
                        <PostButton />
                        <Status selectedStatus={selectedStatus} onSelectStatus={handleSelectStatus} />
                    </div>
                    <Suspense fallback={<Variants />}>
                        {loading ? <Variants /> : <PostingFor1User selectedStatus={selectedStatus} />}
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
