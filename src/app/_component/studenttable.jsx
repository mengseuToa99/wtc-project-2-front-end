import React, { useState, useEffect, Fragment } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Draggable from "react-draggable";
import Paper from "@mui/material/Paper";
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css';

const StudentTable = () => {
    const [data, setData] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = `https://jomyeakapi.rok-kh.lol/api/v1/reporters/stats`;
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
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [token]);

    const handleAddMultiStudent = async (event) => {
        try {
            const formData = new FormData();
            formData.append("reporters", event.target.files[0]);

            const response = await fetch("https://jomyeakapi.rok-kh.lol/api/v1/reporter/addMultiStu", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to create reporters");
            }

            const newReporters = await response.json();

            // Update the state with the new reporters
            setData((prevData) => [...prevData, ...newReporters.data]);
            alert("Creation success");

            console.log("New Reporters:", newReporters);
        } catch (error) {
            console.error("Add Students Error:", error);
            alert("Creation Failed");
        }
    };

    const handleDelete = async (id) => {
        try {
            console.log(id);
            const apiUrl = `https://jomyeakapi.rok-kh.lol/api/v1/reporter/${id}`;
            const response = await fetch(apiUrl, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });


            if (!response.ok) {
                toast.error("Failed to delete reporter");
                return;
            }

            setData((prevData) => prevData.filter((item) => item.id !== id));
            toast.success('Successful deleted');
        } catch (error) {
            console.error(error);
        }
    };

    const FormDialog = () => {
        const [open, setOpen] = useState(false);
        const [openDel, setOpenDel] = useState(false);
        const [deleteUserId, setDeleteUserId] = useState(null);

        const handleClickOpen = (type, id = null) => {
            if (type === "add") {
                setOpen(true);
            } else if (type === "delete") {
                setOpenDel(true);
                setDeleteUserId(id);
            }
        };

        const handleClose = (type) => {
            if (type === "add") {
                setOpen(false);
            } else if (type === "delete") {
                setOpenDel(false);
            }
        };

        function PaperComponent(props) {
            return (
                <Draggable handle='#draggable-dialog-title' cancel={'[class*="MuiDialogContent-root"]'}>
                    <Paper {...props} />
                </Draggable>
            );
        }

        return (
            <>
            <ToastContainer />
            <div>
                <div className='mt-[24px] mb-[24px]'>
                    <input
                        type='button'
                        value='Add'
                        className='btn rounded-[4px]'
                        onClick={() => handleClickOpen("add")}
                    />
                    <input
                        type='file'
                        id='hiddenFileInput'
                        style={{ display: "none" }}
                        onChange={handleAddMultiStudent}
                    />

                    <input
                        type='button'
                        value='Import'
                        className='btn ml-[16px] rounded-[4px]'
                        onClick={() => document.getElementById("hiddenFileInput").click()}
                    />
                </div>
                <div className='overflow-x-auto mb-[28px]'>
                    <table className='table table-zebra'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Total Report</th>
                                <th>Total Accept</th>
                                <th>Total Deny</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, i) => (
                                <tr key={item.id}>
                                    <td>{i ++}</td>
                                    <td>{item.username}</td>
                                    <td>{item.email}</td>
                                    <td>{item.role}</td>
                                    <td>{item.total_reports || 0}</td>
                                    <td>{item.accepted_reports || 0}</td>
                                    <td>{item.denied_reports || 0}</td>
                                    <td>
                                        <Button
                                            className='px-4 py-1 font-semibold text-[12px] text-white bg-red-500 rounded hover:bg-red-600'
                                            onClick={() => handleClickOpen("delete", item.id)}
                                            color='error'
                                            variant='contained'
                                            title='Delete'
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Dialog
                    open={open}
                    PaperProps={{
                        style: {
                            backgroundColor: "#393E46",
                        },
                        component: "form",
                        onSubmit: async (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);

                            const response = await fetch("https://jomyeakapi.rok-kh.lol/api/v1/reporter/addStu", {
                                method: "POST",
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                                body: formData,
                            });

                            if (!response.ok) {
                                toast.error("Created Failed");

                                // throw new Error("Failed to create reporter");
                            } else {
                                
                                const newReporter = await response.json();
                                
                                setData((prevData) => [...prevData, newReporter.reporter]);
                                alert("User is created");

                            }

                            handleClose("add");
                        },
                    }}
                >
                    <DialogTitle sx={{ color: "#00ADB5" }}>Add User</DialogTitle>

                    <DialogContent>
                    <DialogContentText sx={{ color: "white" }}>Enter user&apos;s role and email</DialogContentText>
                        <div className='form-control'>
                            <label className='label cursor-pointer'>
                                <span className='label-text' style={{ color: "white" }}>
                                    Admin
                                </span>
                                <input
                                    type='radio'
                                    name='role'
                                    className='radio checked:bg-red-500'
                                    value='admin'
                                    defaultChecked
                                />
                            </label>
                        </div>
                        <div className='form-control'>
                            <label className='label cursor-pointer'>
                                <span className='label-text' style={{ color: "white" }}>
                                    Student
                                </span>
                                <input
                                    type='radio'
                                    name='role'
                                    className='radio checked:bg-blue-500'
                                    value='user'
                                    defaultChecked
                                />
                            </label>
                        </div>
                        <TextField
                            autoFocus
                            required
                            margin='dense'
                            id='name'
                            name='email'
                            label='Email Address'
                            type='email'
                            fullWidth
                            variant='standard'
                            InputLabelProps={{
                                style: { color: "white" },
                            }}
                            InputProps={{
                                style: { color: "white" },
                            }}
                            sx={{ marginTop: "1em" }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleClose("add")} sx={{ color: "white" }}>
                            Cancel
                        </Button>
                        <Button type='submit' sx={{ color: "white" }}>
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openDel} PaperComponent={PaperComponent} aria-labelledby='draggable-dialog-title'>
                    <DialogTitle style={{ cursor: "move" }} id='draggable-dialog-title'>
                        Delete Confirmation
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>Are you sure you want to delete this user account ?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={() => handleClose("delete")}>
                            No
                        </Button>
                        <Button
                            variant='outlined'
                            color='error'
                            onClick={() => {
                                handleClose("delete");
                                handleDelete(deleteUserId);
                            }}
                        >
                            yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            </>
           
        );
    };

    return <FormDialog />;
};

export default StudentTable;
