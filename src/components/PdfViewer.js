import React, { useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import "../css/App.css";
const PdfViewer = ({ file }) => {
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const { GoToNextPage, GoToPreviousPage } = pageNavigationPluginInstance;

    return (
        <div style={{ height: '750px', position: 'relative' }}>
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                <Viewer fileUrl={file} plugins={[pageNavigationPluginInstance]} />
            </Worker>
            <div style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)' }}>
                <GoToPreviousPage />
            </div>
            <div style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }}>
                <GoToNextPage />
            </div>
        </div>
    );
};

export default PdfViewer;