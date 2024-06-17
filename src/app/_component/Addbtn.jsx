import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Draggable from "react-draggable";
import Paper from "@mui/material/Paper";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

const AddBtn = ({ btnName, btnTittle, btnValue, token, setData, handleSubmit }) => {
    const FormDialog = () => {
        const [open, setOpen] = useState(false);
        const [type, setType] = useState("");

        const handleClickOpen = () => {
            setOpen(true);
        };

        const handleClose = () => {
            setOpen(false);
        };

        const PaperComponent = (props) => {
            return (
                <Draggable handle='#draggable-dialog-title' cancel={'[class*="MuiDialogContent-root"]'}>
                    <Paper {...props} />
                </Draggable>
            );
        };

        const handleFormSubmit = (event) => {
            event.preventDefault();
            handleSubmit(type);
            handleClose();
        };

        return (
            <div>
                <div className='mt-[24px] mb-[24px]'>
                    <button type='button' className='btn rounded-[4px]' onClick={handleClickOpen}>
                        {btnName === "+" ? <PlaylistAddIcon /> : btnName}
                    </button>
                </div>

                <Dialog
                open={open}
                PaperComponent={PaperComponent}
                PaperProps={{
                    style: {
                        backgroundColor: "#393E46",
                        color: "#E8E8E8",
                    },
                }}
                onClose={handleClose}
            >
                <DialogTitle style={{ color: "#E8E8E8" }} id="draggable-dialog-title">{btnTittle}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin='dense'
                        id='name'
                        name='text'
                        label={btnValue}
                        type='text'
                        fullWidth
                        variant='standard'
                        InputLabelProps={{ style: { color: "white" } }}
                        InputProps={{ style: { color: "white" } }}
                        value={type} // Use 'type' state variable here
                        onChange={(e) => setType(e.target.value)} // Update 'type' state variable here
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} style={{ color: "white" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleFormSubmit} style={{ color: "white" }}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
            </div>
        );
    };

    return <FormDialog />;
};

export default AddBtn;
