"use client"
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Reset from "@/app/_component/reset";
import CircularIndeterminate from "@/app/_component/CircularIndeterminate"; // Import the CircularProgress component
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading
    const router = useRouter();
    const emailRef = useRef();
    const passwordRef = useRef();
    const loginButtonRef = useRef();

    useEffect(() => {
        localStorage.setItem("isUserLogin", false);
        localStorage.setItem("isAdminLogin", false);
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true); // Show the progress indicator

        try {
            const response = await fetch("https://jomyeakapi.rok-kh.lol/api/v1/reporter/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("reporter_id", data.user_id);
                localStorage.setItem("reporter_name", data.name);
                localStorage.setItem("reporter_image", data.profile_pic);
                localStorage.setItem("isUserLogin", true);

                if (data.role === "admin") {
                    localStorage.setItem("isAdminLogin", true);
                    router.replace("/admin");
                } else {
                    localStorage.setItem("isAdminLogin", false);
                    router.replace("/profile");
                }
            } else {
                toast.error("Login failed. Please try again.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false); // Hide the progress indicator
        }
    };

    const toggleResetPasswordPopup = (e) => {
        e.preventDefault();
        setShowResetPassword(!showResetPassword);
    };

    return (
        <>
        <ToastContainer />
        <div className={`h-screen flex justify-between items-center ${showResetPassword ? "blur-background" : ""}`}>
            <div className='h-full hidden sm:flex md:w-[50%] lg:w-[60%] justify-center items-center bg-gradient-to-br from-teal-400 to-[#00ADB5]-600'>
                <div className='w-[400px]'>
                    <div className='rounded px-20'>
                        <h1 className='text-black text-center text-4xl font-bold mb-5'>Welcome</h1>
                        <Image width={1000} height={1000} src='/school.png' alt='Image' objectFit='cover' />
                    </div>
                </div>
            </div>

            <div className='w-full h-full sm:w-2/5 md:w-[60%] lg:w-2/5 flex justify-center items-center'>
                <div className='w-full'>
                    <form className='rounded px-20'>
                        <h1 className='text-white text-center text-2xl font-bold mb-10'>Login</h1>

                        <div className='mb-10'>
                            <input
                                className='shadow appearance-none border rounded-[10px] border-[#00ADB5] bg-[#222831] w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline'
                                id='email'
                                type='email'
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                ref={emailRef}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") passwordRef.current.focus();
                                }}
                            />
                        </div>

                        <div className='mb-10'>
                            <input
                                className='shadow appearance-none border rounded-[10px] border-[#00ADB5] bg-[#222831] w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline'
                                id='password'
                                type='password'
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                ref={passwordRef}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") loginButtonRef.current.focus();
                                }}
                            />
                        </div>

                        {error && <div className='text-red-500 mb-5'>{error}</div>}

                        <div className='mb-5'>
                            <button
                                className='btn w-full bg-[#00ADB5] text-white font-bold py-2 px-4 rounded-[10px] focus:outline-none focus:shadow-outline flex items-center justify-center'
                                type='button'
                                onClick={handleLogin}
                                ref={loginButtonRef}
                                disabled={loading}
                            >
                                {loading ? <CircularIndeterminate size={30} color="white" /> : "Login"}
                            </button>
                        </div>

                        <div className='md:text-right'>
                            <a
                                className='text-sm text-white hover:text-[#00ADB5] cursor-pointer'
                                onClick={toggleResetPasswordPopup}
                            >
                                Reset Password
                            </a>
                        </div>
                    </form>
                </div>
            </div>

            {showResetPassword && <Reset />}
        </div>
        </>
       
    );
};

export default Login;
