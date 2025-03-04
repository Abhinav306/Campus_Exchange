import React, { useState } from "react";
import { MDBCardImage, MDBFile } from "mdb-react-ui-kit";

export default function MultipleImageUploadComponent({ onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  const handleChange = (event) => {
    setSelectedFile(event.target.files);
    onFileSelect(event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="custom-file-input mt-3 mb-3">
      <MDBFile onChange={handleChange} />
      <div className="container mt-2 mx-4">
      {imageSrc && 
      <MDBCardImage
        className="img-fluid border border-info border-3"
        style={{ width: "120px", height: "120px", borderRadius: "5px" }}
        src={imageSrc}
        fluid
      />
}
</div>
    </div>
  );
}
