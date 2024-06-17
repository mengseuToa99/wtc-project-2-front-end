import { useState, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import { useRouter } from "next/navigation"; // Changed from 'next/navigation'
import Image from "next/image"; // Import Image component from Next.js
import logo from "./../../../public/logo.png";
import Loading from "../(routes)/loading";

const Nav = () => {
    const router = useRouter();
    const [homeClicked, setHomeClicked] = useState(false);
    const [profileClicked, setProfileClicked] = useState(false);
    const [logOutClicked, setLogOutClicked] = useState(false);
    const [isUserLogin, setIsUserLogin] = useState(false);
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        setIsUserLogin(localStorage.getItem("isUserLogin") === "true");
        setIsAdminLogin(localStorage.getItem("isAdminLogin") === "true");
    }, []);

    const clearLocalStorage = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("reporter_id");
        localStorage.removeItem("reporter_name");
    };

    const handleHome = () => {
        if (isAdminLogin) {
            return;
        }
        setHomeClicked(true);
    };

    const handleProfile = () => {
        setProfileClicked(true);
    };

    useEffect(() => {
        if (homeClicked) {
            router.replace("/home");
        } else if (profileClicked) {
            router.replace("/profile");
        } else if (logOutClicked) {
            router.replace("/login");
        }
    }, [homeClicked, profileClicked, logOutClicked, router]);

    const handleLogout = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://jomyeakapi.rok-kh.lol/api/v1/reporter/logout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                console.log("Logout successful");
                clearLocalStorage();
                localStorage.setItem("isUserLogin", false);
                localStorage.setItem("isAdminLogin", false);
                setIsUserLogin(false);
                setIsAdminLogin(false);
                setLogOutClicked(true);
                console.log("logout", isUserLogin);
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("An error occurred during logout:", error);
        }   finally {
            setLoading(false); // Set loading to false after logout operation completes
        }
    };

    return (
        <>
        {loading && <Loading />}
        <div className='flex items-center justify-between p-4 bg-[#222831]'>
            <button onClick={() => handleHome()} className='text-lg font-bold text-[#00ADB5]'>
                <Image src={logo} alt='' width={150} height={150} />
            </button>
            <div className='flex justify-center items-center gap-x-7'>
                {!isAdminLogin && (
                    <div onClick={() => handleProfile()} className='btn bg-[#222831]'>
                        <FaUserAlt />
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className='px-4 py-2 text-white bg-gray-800 border border-green-700 rounded-none hover:underline'
                >
                    Logout
                </button>
            </div>
        </div>
        </>    
    );
};

export default Nav;
