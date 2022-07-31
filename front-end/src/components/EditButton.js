import React, { Fragment, useState } from "react";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import EditModal from "./EditModal";

const EditButton = ({ phoneCall, rerenderFunction, userRole }) => {
  const [showModal, setShowModal] = useState(false);
  const handleClick = () => {
    console.log(phoneCall);
    setShowModal(true);
  };
  return (
    <Fragment>
      {showModal ? (
        <EditModal
          phoneCall={phoneCall}
          setShowModal={setShowModal}
          rerenderFunction={rerenderFunction}
          userRole={userRole}
        />
      ) : (
        ""
      )}
      <Button
        variant="contained"
        startIcon={<EditIcon />}
        onClick={handleClick}
      >
        Edit
      </Button>
    </Fragment>
  );
};

export default EditButton;
