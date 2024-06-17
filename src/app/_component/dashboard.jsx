"use client";

import React, { useState, useEffect } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { FaUser } from "react-icons/fa";
import { TbReport } from "react-icons/tb";
import { GoThumbsup } from "react-icons/go";
import { GoThumbsdown } from "react-icons/go";
import { IoCheckmark } from "react-icons/io5";

const Page = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getToken = () => {
        return localStorage.getItem("token");
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getToken();

                const apiUrl = `https://jomyeakapi.rok-kh.lol/api/v1/stats`;
                const response = await fetch(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const result = await response.json();
                setData(result);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const seriesName = Object.entries(data["total category"]).map(([category, value]) => ({
        value: value, // Use value associated with the category
        label: category, // Use category as the label
    }));

    const seriesCategory = Object.entries(data["total category type"]).map(([category, value]) => ({
        value: value, // Use value associated with the category
        label: category, // Use category as the label
    }));

    const series = [
        {
            innerRadius: 10,
            outerRadius: 110,
            id: "series-1",
            data: seriesName,
        },
        {
            innerRadius: 140,
            outerRadius: 160,
            id: "series-2",
            data: seriesCategory,
        },
    ];

    return (
        <div className="flex flex-col bg-[#222831] items-center">
            <div className="w-full max-w-[899px] h-auto bg-background mt-[31px] rounded-[3px] mb-[50px]">
                <div className="flex flex-wrap justify-around">
                    <button className="w-[150px] h-[170px] border-[#3c86e1] mt-[45px] ml-[8px] rounded-[4px] shadow-2xl bg-[#474d54]">
                        <div className="flex justify-center">
                            <div className="text-[#152841] text-[20px] rounded-full p-1 bg-[#3c86e1]">
                                <FaUser />
                            </div>
                        </div>
                        <div className="font-[600] text-[65px]">{data.total_users}</div>
                        <div className="font-[400] text-[15px]">Total User</div>
                    </button>

                    <button className="w-[150px] h-[170px] border-[#c945be] shadow-2xl mt-[45px] ml-[8px] rounded-[4px] bg-[#474d54]">
                        <div className="flex justify-center">
                            <div className="text-[#54194f] text-[20px] rounded-full p-1 bg-[#c945be]">
                                <TbReport />
                            </div>
                        </div>
                        <div className="font-[600] text-[65px]">{data.total_reports}</div>
                        <div className="font-[400] text-[12px]">Total Reported</div>
                    </button>

                    <button className="w-[150px] h-[170px] border-[#3efa29] mt-[45px] ml-[8px] shadow-2xl rounded-[4px] bg-[#474d54]">
                        <div className="flex justify-center">
                            <div className="text-[#124718] text-[20px] rounded-full p-1 bg-[#3efa29]">
                                <GoThumbsup />
                            </div>
                        </div>
                        <div className="font-[600] text-[65px]">{data.accepted_reports}</div>
                        <div className="font-[400] text-[15px]">Total Accepted</div>
                    </button>

                    <button className="w-[150px] h-[170px] mt-[45px] ml-[8px] rounded-[4px] shadow-2xl bg-[#474d54]">
                        <div className="flex justify-center">
                            <div className="text-[#581b1b] text-[20px] rounded-full p-1 bg-[#f02e2e]">
                                <GoThumbsdown />
                            </div>
                        </div>
                        <div className="font-[600] text-[65px]">{data.denied_reports}</div>
                        <div className="font-[400] text-[15px]">Total Deny</div>
                    </button>

                    <button className="w-[150px] h-[170px] mt-[45px] ml-[8px] rounded-[4px] shadow-2xl bg-[#474d54]">
                        <div className="flex justify-center">
                            <div className="text-[#1b4214] text-[20px] rounded-full p-1 bg-[#3BAA28]">
                                <IoCheckmark />
                            </div>
                        </div>
                        <div className="font-[600] text-[65px]">{data.completed_reports}</div>
                        <div className="font-[400] text-[15px]">Total Completed</div>
                    </button>
                </div>

                <div className="w-full max-w-[900px] flex flex-col items-center justify-center">
                    <div className="mt-[60px] h-[450px]">
                        <h1 className="text-center">Type of category</h1>
                        <PieChart
                            series={series}
                            width={900}
                            height={400}
                            slotProps={{
                                legend: { hidden: false },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
