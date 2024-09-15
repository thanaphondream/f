import React, { useState } from 'react';
import axios from 'axios';

const GenerateReceiptButton = ({ orderId }) => {
  const [pdfUrl, setPdfUrl] = useState('');

  const generateReceipt = async () => {
    try {
      const response = await axios.post(`http://localhost:8889/admin/generateReceipt/${orderId}`);
      setPdfUrl(response.data.filePath);
    } catch (error) {
      console.error('Error generating receipt:', error);
    }
  };

  return (
    <div>
      <button onClick={generateReceipt}>Generate Receipt</button>
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          width="100%"
          height="600px"
          title="PDF Viewer"
        >
          Your browser does not support PDFs. <a href={pdfUrl}>Download the PDF</a>.
        </iframe>
      )}

      
    </div>
  );
};

export default GenerateReceiptButton;
