import React, { useState, useEffect } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { FaCamera } from "react-icons/fa";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Image from "next/image";
import defaultProfilePic from "./.././../../public/defaultProfilePic.webp"
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
    const [profileImage, setProfileImage] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [open, setOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ image: null });
    const [reporterId, setReporterId] = useState(null);
    const [token, setToken] = useState(null);
    const [reporterName, setReporterName] = useState(null);
    const [apiUrl, setApiUrl] = useState(null); // State to store apiUrl

    useEffect(() => {
        setProfileImage(localStorage.getItem("reporter_image"));
        setReporterId(localStorage.getItem("reporter_id")); // Set reporterId
        setToken(localStorage.getItem("token")); // Set token
        setReporterName(localStorage.getItem("reporter_name"));
        setApiUrl(`https://jomyeakapi.rok-kh.lol/api/v1/reporter/${reporterId}`); // Set apiUrl
    }, [reporterId]); // Add reporterId to the dependency array

    useEffect(() => {
        if (apiUrl) { // Check if apiUrl is not null
            fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    setProfileData(data);
                })
                .catch((error) => console.error("Error:", error));
        }
    }, [apiUrl]); // Add apiUrl to the dependency array

    const handleIconClick = () => {
        document.getElementById("fileInput").click();
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };

    const handleNameSubmit = (event) => {
        event.preventDefault();
        handleChangeName();
    };

    const handleImageSubmit = async (event) => {
        const file = event.target.files[0];
        setFormData({
            ...formData,
            image: file,
        });

        try {
            const data = new FormData();
            data.append("profile_pic", file);
            data.append("_method", "PATCH"); // Add special parameter

            const response = await fetch(apiUrl, {
                method: "POST", // Change method to POST
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: data,
            });

            if (!response.ok) {
                toast.error("Failed to update profile picture.");
            }

            const newData = await response.json();
            console.log("Response data:", newData); // Log the response data
            setProfileImage(newData.data.profile_pic);
            localStorage.setItem("reporter_image", newData.data.profile_pic);
            toast.success("Profile picture change successfully.");
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        }
    };

    const handleChangeName = async () => {
        try {
            const updatedName = newName.trim();
            if (updatedName !== "") {
                const response = await fetch(apiUrl, {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username: updatedName }),
                });

                if (!response.ok) {
                    toast.error("Failed to update username.");
                }

                localStorage.setItem("reporter_name", updatedName);
                setReporterName(updatedName);
                toast.success("Username change successfully.");
                handleClose();
            } else {
                toast.error("Username cannot be empty.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='container mx-auto px-4 py-8'>
            <ToastContainer />
            <div className='max-w-lg mx-auto bg-[#222831] rounded-lg overflow-hidden'>
                <div className='py-4 px-6 text-center'>
                    <div className='flex flex-col items-center mb-4'>
                        <div
                            className='relative w-[105px] h-[105px] flex items-center justify-center mb-2 cursor-pointer'
                            onClick={handleIconClick}
                        >
                            {profileImage ? (
                            <Image
                            src={profileImage ? profileImage : defaultProfilePic}
                            alt='Reporter Image'
                            width={85}
                            height={85}
                            className='absolute w-full h-full object-cover rounded-full'
                        />
                            ) : (
                                <div className='absolute w-full h-full flex items-center justify-center rounded-full'>
                                    <BsPersonCircle className='text-white' style={{ fontSize: "5rem" }} />
                                </div>
                            )}



                            <div className='absolute w-full h-full flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200'>
                                <FaCamera className='text-white' />
                            </div>
                        </div>
                        <div>
                            <h1 className='text-4xl font-semibold text-[#00ADB5]' onClick={handleClickOpen}>
                                {reporterName}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
            <input
                id='fileInput'
                type='file'
                style={{ position: "absolute", left: "-9999px" }}
                onChange={handleImageSubmit}
            />
            <div className='flex justify-between items-center' style={{ margin: "10px 0" }}></div>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: "form",
                    onSubmit: handleNameSubmit,
                }}
            >
                <DialogTitle>Change Name</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please enter your new name.</DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin='dense'
                        id='name'
                        label='New Name'
                        type='text'
                        fullWidth
                        variant='standard'
                        value={newName}
                        onChange={handleNameChange}
                    />
                    {error && <p className='text-red-500'>{error}</p>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type='submit'>Change</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Profile;
