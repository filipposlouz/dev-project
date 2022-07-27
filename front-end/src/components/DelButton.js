import React from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

const DelButton = ({ phoneCallId, rerenderFunction }) => {
  const handleDelete = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `http://localhost:5000/api/admin/delete/${phoneCallId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    ).then((res) => res.json());
    console.log(res);
    rerenderFunction();
  };

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<DeleteIcon />}
        color="error"
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  );
};

export default DelButton;
