"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import CircularIndeterminate from "@/app/_component/CircularIndeterminate";
import Loading from "../loading";

const ReportPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [id, setId] = useState(null);
    const [loadingback, setLoadingback] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        setId(localStorage.getItem("reporter_id"));
        setToken(localStorage.getItem("token"));
    }, [router]);

    const [Clicked, setClicked] = useState(false);
    const [openFail, setOpenFail] = useState(false);
    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState({
        reporter_id: null,
        status: "nostatus",
        title: null,
        description: null,
        building: null,
        floor: null, // Set default to 0, since it's an integer
        room: null, // Set default to 0, since it's an integer
        anonymous: 0,
        image: null,
        like: 0,
        feedback: null,
        category: null,
        type: null,
    });

    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            reporter_id: id,
        }));
    }, [id]);

    const handletypeChange = (e) => {
        setSelectedType(e.target.value);

        setFormData((prevFormData) => ({
            ...prevFormData,
            type: e.target.value,
        }));
    };

    const handlefloorChange = (e) => {
        setSelectedRoom(e.target.value);
    };

    const handleClicked = () => {
        setTimeout(() => {
            setLoadingback(true);
            setClicked(true);
        }, 1000); // 1000 milliseconds = 1 second
    };

    useEffect(() => {
        if (Clicked) router.replace("/home");
    }, [Clicked, router]);

    const [types, setTypes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://jomyeakapi.rok-kh.lol/api/v1/types-with-categories", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                setTypes(data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        if (token) {
            fetchData();
        }
    }, [token]);

    const toTitle = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const getCategoryOptions = () => {
        if (!selectedType || !types) {
            return [];
        }

        const type = types.find((type) => type.type === selectedType);
        return type ? type.categories.map((category) => category.name) : [];
    };

    const roomOptions = {
        0: ["1", "2", "3", "5", "6"],
        1: ["101", "102", "103", "105", "106"],
        2: ["201", "202", "203", "205", "206"],
        3: ["301", "302", "303", "305", "306"],
        4: ["401", "402", "403", "405", "406"],
        5: ["501", "502", "503", "505", "506"],
        6: ["601", "602", "603", "605", "606"],
    };

    const getRoomOptions = () => {
        return roomOptions[selectedRoom] || [];
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update floor and room as integers
        const newValue = name === "floor" || name === "room" ? parseInt(value, 10) : value;

        setFormData({
            ...formData,
            [name]: newValue,
        });
    };

    const handleCheckboxChange = (e) => {
        const { checked } = e.target;

        if (checked) {
            setFormData({
                ...formData,
                anonymous: 1,
            });
        } else {
            setFormData({
                ...formData,
                anonymous: 0,
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            image: file,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Check if Building, Floor, and Room are filled out
        if (!formData.building || formData.floor === "Floor" || !formData.room || !formData.category) {
            alert("Please fill out the Category.");
            setOpenFail(true);
            setLoading(false);
            setOpen(false);
            return;
        } else if (!formData.title) {
            alert("Please fill out the Title.");
            setOpenFail(true);
            setLoading(false);
            setOpen(false);
            return;
        } else if (!formData.description) {
            alert("Please fill out the Description.");
            setOpenFail(true);
            setLoading(false);
            setOpen(false);
            return;
        }

        console.log("Submitting form data:", formData);

        // Create a FormData object from our form data
        const data = new FormData();
        for (const key in formData) {
            if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        }

        try {
            const response = await fetch("https://jomyeakapi.rok-kh.lol/api/v1/reports", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: data,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error response from server: ${errorData}`);
            }

            setOpen(true);
            setOpenFail(false);
            const json = await response.json();

            console.log("Report submitted successfully!");
            console.log("Response data:", json);
            setClicked(true);
            setLoading(false);

            // Add any additional logic here, such as redirecting or showing a success message
        } catch (error) {
            console.error("Failed to submit report:", error);
            setOpenFail(true);
            setLoading(false);
            // Add any error handling logic here, such as showing an error message
        }
    };

    return (
        <>
            {loadingback && <Loading />}
            <div className='flex flex-col items-center justify-center sm:h-full lg:h-screen'>
                <Collapse in={open}>
                    <Alert
                        action={
                            <IconButton
                                aria-label='close'
                                color='inherit'
                                size='small'
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                <CloseIcon fontSize='inherit' />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        Report submitted successfully!
                    </Alert>
                </Collapse>

                <Collapse in={openFail}>
                    <Alert
                        severity='error'
                        action={
                            <IconButton
                                aria-label='close'
                                color='inherit'
                                size='small'
                                onClick={() => {
                                    setOpenFail(false);
                                }}
                            >
                                <CloseIcon fontSize='inherit' />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        Report submission failed!
                    </Alert>
                </Collapse>

                <div className='lg:w-[1000px] flex items-start mb-[20px]'>
                    <h1 className='text-max font-bold items-start'>Make A Report</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='bg-background sm:w-full sm:h-full lg:w-[1000px] lg:h-[620px] flex flex-col justify-evenly p-4 mb-4'>
                        <div>
                            <label className='text-min font-[600]'>Category</label>
                            <div className='flex flex-col lg:flex-row lg:space-x-[15px] sm:mb-[15px] mt-[15px] space-y-[15px] lg:space-y-0 justify-center items-center '>
                                <select
                                    id='building'
                                    name='building'
                                    className='w-full rounded-3 focus:outline-none bg-[#222831] h-[40px] px-3'
                                    value={formData.building}
                                    onChange={handleChange}
                                >
                                    <option value=''>Building</option>
                                    <option value='A'>A</option>
                                    <option value='B'>B</option>
                                    <option value='D'>D</option>
                                    <option value='F'>E</option>
                                    <option value='T'>T</option>
                                    <option value='STEM'>STEM</option>
                                    <option value='Library'>Library</option>
                                    {/* Add more options as needed */}
                                </select>

                                <select
                                    id='floor'
                                    name='floor'
                                    placeholder='Floor'
                                    className='w-full rounded-3 focus:outline-none bg-[#222831] h-[40px] px-3'
                                    value={formData.floor}
                                    onChange={(event) => {
                                        handleChange(event);
                                        handlefloorChange(event);
                                    }}
                                >
                                    <option value=''>Floor</option>
                                    <option value={0}>0</option>
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                    <option value={6}>6</option>
                                    {/* Add more options as needed */}
                                </select>

                                <select
                                    id='room'
                                    name='room'
                                    placeholder='Room'
                                    className='w-full rounded-3 focus:outline-none bg-[#222831] h-[40px] px-3'
                                    value={formData.room}
                                    onChange={handleChange}
                                >
                                    <option value=''>Room</option>
                                    {getRoomOptions().map((option) => (
                                        <option key={option} value={option.toLowerCase()}>
                                            {option}
                                        </option>
                                    ))}
                                    <option value='bathroom'>Bathroom</option>
                                    {/* Add more options as needed */}
                                </select>

                                <select
                                    id='type'
                                    name='type'
                                    value={formData.type}
                                    className='w-full rounded-3 focus:outline-none bg-[#222831] h-[40px] px-3'
                                    onChange={(e) => handletypeChange(e)}
                                >
                                    <option value=''>Type</option>
                                    {types.map((type) => (
                                        <option key={type.id} value={type.type}>
                                            {toTitle(type.type)}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    id='category'
                                    name='category'
                                    className='w-full rounded-3 focus:outline-none bg-[#222831] h-[40px] px-3'
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value=''>Category</option>
                                    {getCategoryOptions().map((option) => (
                                        <option key={option} value={option.toLowerCase()}>
                                            {toTitle(option)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className='text-min font-[600]' htmlFor='title'>
                                Title
                            </label>
                            <br />
                            <input
                                type='text'
                                name='title'
                                id='title'
                                placeholder='Report Title'
                                className='w-full h-[40px] rounded-[3px] bg-[#222831] focus:outline-none px-3 mt-[15px]'
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className='text-min font-[600]' htmlFor='description'>
                                Description
                            </label>
                            <br />
                            <textarea
                                name='description'
                                id='description'
                                placeholder='Report Description'
                                className='w-full h-[150px] mt-[15px] rounded-[3px] bg-[#222831] focus:outline-none px-3 py-3 resize-none'
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div>
                            <label className='text-min font-[600]' htmlFor='image'>
                                Upload file
                            </label>
                            <input
                                className='block file-input file-input-bordered file-input-accent w-full  mt-[15px] text-sm text-gray-900 border border-gray-300 rounded-[3px] cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-[#222831] dark:border-gray-600 dark:placeholder-gray-400'
                                id='image'
                                type='file'
                                name='image'
                                onChange={handleImageChange}
                            />
                        </div>

                        <div className='flex mt-[15px]'>
                            <input
                                type='checkbox'
                                id='anonymous'
                                name='anonymous'
                                className='checkbox checkbox-accent'
                                defaultChecked
                                checked={formData.anonymous}
                                onChange={handleCheckboxChange}
                            />
                            <label className='text-[15px] ml-[15px] font-[500]' htmlFor='anonymous'>
                                Anonymous
                            </label>
                        </div>

                        <div className='flex justify-between mt-[15px]'>
                            <button
                                type='button'
                                onClick={() => handleClicked()}
                                className='btn text-[white] w-[115px] h-[45px] bg-second-primary rounded-[3px]'
                            >
                                Back
                            </button>
                            <button
                                disabled={loading}
                                type='submit'
                                className='btn text-[white] w-[115px] h-[45px] bg-second-primary rounded-[3px]'
                            >
                                {loading ? <CircularIndeterminate size={18} color='inherit' /> : "Post"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ReportPage;
