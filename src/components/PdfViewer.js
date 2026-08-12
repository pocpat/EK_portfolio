import React from "react";
import "../css/App.css";

const PdfViewer = ({ file }) => {
    if (!file) {
        return (
            <div style={{ height: "64vh", width: "100%", position: "relative" }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "#888",
                    fontSize: "1.1rem",
                }}>
                    Select a document to view
                </div>
            </div>
        );
    }
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