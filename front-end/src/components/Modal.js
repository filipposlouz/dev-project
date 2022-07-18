import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  outline: 0,
};

const BasicModal = () => {
  const [open, setOpen] = React.useState(true);
  const [dept, setDept] = React.useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setDept(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/setEmployee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      credentials: "include",
      body: JSON.stringify({ dept: dept }),
    }).then((res) => res.json());

    handleClose();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Enter your Department:
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <h4>
              Η επιλογή αυτή γίνεται μόνο μία φορά, οπότε να ελεγχθεί οτι είναι
              σωστή.
            </h4>
            <TextField
              id="standard-basic"
              label="Department"
              variant="standard"
              value={dept}
              onChange={handleChange}
            />
          </Typography>
          <Typography id="modal-modal-footer" sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => handleSubmit(e)}
            >
              Submit
            </Button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

const CheckDept = ({ deptState }) => {
  console.log(deptState);
  return <>{deptState === null ? <BasicModal /> : null}</>;
};

export default CheckDept;
