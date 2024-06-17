import React, { useState } from "react";
import { BsX } from "react-icons/bs";
import CircularIndeterminate from "./CircularIndeterminate";
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css';

const Reset = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(false); 
    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const email = document.getElementById("remail").value;
        const current_password = document.getElementById("cpassword").value;
        const password = document.getElementById("rpassword").value;
        const confirmPassword = document.getElementById("rconfirm-password").value;

        if (password !== confirmPassword) {
            // Handle password mismatch error
            toast.error("Passwords do not match");
            return;
        }

        console.log("Sending request..."); // Log before sending the request

        const response = await fetch("https://jomyeakapi.rok-kh.lol/api/v1/reporter/login/reset", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                current_password: current_password,
                password: password,
                password_confirmation: confirmPassword,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Data:", data); // Log the data
            toast.success("Password reset successfully");
            setLoading(false);
            handleClose();
        } else { 
            console.log('Response received:', response);
            toast.error("Error resetting password");
            setLoading(false);
        }
        setLoading(false);
        
    };

    return (
        <>
        <ToastContainer />
            {isOpen && (
                <div className='fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm'>
                    <div className='bg-[#222831] p-4 rounded-lg w-96'>
                        <div className='text-2xl flex justify-end'>
                            <button onClick={handleClose}>
                                <BsX />
                            </button>
                        </div>
                        <form className='mb-4 '>
                            <div className='mb-4'>
                                <label className='block text-sm font-bold mb-2' htmlFor='remail'>
                                    Email
                                </label>
                                <input
                                    className='shadow appearance-none border text-[#00ADB5] rounded-[10px] border-[#00ADB5] bg-[#222831] w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline mb-2'
                                    id='remail'
                                    type='email'
                                    name='remail'
                                    placeholder=''
                                />
                            </div>

                            <div className='mb-4'>
                                <label className='block text-sm font-bold mb-2' htmlFor='rpassword'>
                                    Current Password
                                </label>
                                <input
                                    className='shadow appearance-none border rounded-[10px] border-[#00ADB5] bg-[#222831] w-full py-2 px-3 text-[#00ADB5] leading-tight focus:outline-none focus:shadow-outline mb-2'
                                    id='cpassword'
                                    type='password'
                                    name='cpassword'
                                    placeholder=''
                                />
                            </div>

                            <div className='mb-4'>
                                <label className='block text-sm font-bold mb-2' htmlFor='rpassword'>
                                    New Password
                                </label>
                                <input
                                    className='shadow appearance-none border rounded-[10px] border-[#00ADB5] bg-[#222831] w-full py-2 px-3 text-[#00ADB5] leading-tight focus:outline-none focus:shadow-outline mb-2'
                                    id='rpassword'
                                    type='password'
                                    name='rpassword'
                                    placeholder=''
                                />
                            </div>

                            <div className='mb-4'>
                                <label className='block text-sm font-bold mb-2' htmlFor='rconfirm-password'>
                                    Confirm Password
                                </label>
                                <input
                                    className='shadow appearance-none border rounded-[10px] border-[#00ADB5] bg-[#222831] w-full py-2 px-3 text-[#00ADB5] leading-tight focus:outline-none focus:shadow-outline mb-2'
                                    id='rconfirm-password'
                                    type='password'
                                    name='rconfirm-password'
                                    placeholder=''
                                />
                            </div>
                            <div className='mb-4'>
                                <button
                                    onClick={handleSubmit}
                                    className='w-full bg-[#00ADB5] text-white font-bold py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline'
                                    type='button'
                                >
                                {loading ? <CircularIndeterminate size={30} color="white" /> : "submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Reset;
