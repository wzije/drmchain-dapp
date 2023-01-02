import React, { useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import {
  toolbarPlugin,
  ToolbarSlot,
  TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar";
const workerUrl = require("pdfjs-dist/build/pdf.worker.entry");

const PDFViewer = (props: any) => {
  const toolbarPluginInstance = toolbarPlugin();
  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;
  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    Download: () => <></>,
    SwitchTheme: () => <></>,
    Print: () => <></>,
    Open: () => <></>,
    ShowSearchPopover: () => <></>,
  });

  return (
    <Worker workerUrl={workerUrl}>
      <div
        className="shadow"
        style={{ height: "600px", background: "#f4f4f4" }}
      >
        <>
          <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
          <Viewer
            fileUrl={`${props.documentFile}`}
            theme="light"
            plugins={[toolbarPluginInstance]}
          />
        </>
      </div>
    </Worker>
  );
};

export default PDFViewer;
