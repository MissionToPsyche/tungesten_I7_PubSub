import './ViewPDF.css';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

function ViewPDF() {//view pdf controller to show the contents

    const [pdfFile, setPDFFile] = useState(null)
    const [viewPdf, setViewPdf] = useState(null)

    //testing done for this page no further error found
    const fileType = ['application/pdf']
    //to handle the change of the file and reading the file
    const handleChange = (e) => {
        let selectedFile = e.target.files[0]
        if (selectedFile) {
            if (selectedFile && fileType.includes(selectedFile.type)) {
                let reader = new FileReader()
                reader.readAsDataURL(selectedFile)
                reader.onloadend = (e) => {
                    setPDFFile(e.target.result)
                }
            }
            else {
                setPDFFile(null)
            }
        }
        else {
            console.log("please select file")
        }
    }
    //here it is handling the submission of the document and have document in the editor
    const handleSubmit = (e) => {
        e.preventDefault()
        if (pdfFile !== null) {
            setViewPdf(pdfFile)
        }
        else {
            setViewPdf(null)
        }
    }
    const newplugin = [defaultLayoutPlugin()];

    return ( //form to submit pdf to view and its container to show the pdf
        <div className="container">
            <form onSubmit={handleSubmit}>
                <input type='file' className="form-control" onChange={handleChange} />
                <button type='submit' className="btn btn-success" >View PDF</button>
            </form>
            <h2>View PDF</h2>
            <div className='pdf-container'>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                    {viewPdf && <>
                        <Viewer fileUrl={viewPdf} plugins={newplugin} />
                    </>}
                    {!viewPdf && <>No PDF</>}
                </Worker>


            </div>
        </div>
    );
}



export default ViewPDF;
