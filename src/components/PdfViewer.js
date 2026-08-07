import React from "react";
import "../css/App.css";

const PdfViewer = ({ file }) => {
    return (
        <div style={{ height: "64vh", width: "100%", position: "relative" }}>
            <iframe
                src={file}
                title="PDF Viewer"
                style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                }}
            />
        </div>
    );
};

export default PdfViewer;