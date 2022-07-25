import React, { useEffect, useState } from "react";

const RetrieveFiles = ({ id, fileIsNotNull }) => {
  const [file, setFile] = useState(null);
  useEffect(() => {
    const fetchFiles = async () => {
      if (fileIsNotNull) {
        const res = await fetch(`http://localhost:5000/api/files/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/zip",
          },
          credentials: "include",
        });
        setFile(res.url);
      } else return;
    };
    fetchFiles();
  }, []);
  return (
    <div>
      {file ? (
        <a href={file}>{file.split("/").pop() + ".zip"}</a>
      ) : (
        <p>No Existing Files...</p>
      )}
    </div>
  );
};

export default RetrieveFiles;
