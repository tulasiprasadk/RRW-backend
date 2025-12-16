import { useState } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const orderId = state?.orderId;
  const [unr, setUnr] = useState("");
  const [file, setFile] = useState(null);
  const [uploadedPath, setUploadedPath] = useState("");

  // ------------------------------
  // Compress Image Before Upload
  // ------------------------------
  const compressImage = async (imageFile) => {
    const options = {
      maxSizeMB: 0.4,        // 400 KB max (you can adjust)
      maxWidthOrHeight: 1280, // Resize to reasonable resolution
      useWebWorker: true
    };

    try {
      const compressed = await imageCompression(imageFile, options);
      console.log(
        "Original Size:",
        (imageFile.size / 1024 / 1024).toFixed(2),
        "MB"
      );
      console.log(
        "Compressed Size:",
        (compressed.size / 1024 / 1024).toFixed(2),
        "MB"
      );
      return compressed;
    } catch (err) {
      console.error("Compression failed:", err);
      return imageFile; // fallback if compression fails
    }
  };

  // ------------------------------
  // Upload Screenshot
  // ------------------------------
  const uploadScreenshot = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    // 1️⃣ Compress image
    const compressed = await compressImage(file);

    // 2️⃣ Create FormData
    const form = new FormData();
    form.append("screenshot", compressed);

    // 3️⃣ Upload
    const res = await axios.post(
      `/api/customer/payment/upload/${orderId}`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );

    setUploadedPath(res.data.file);
    alert("Screenshot uploaded successfully!");
  };

  // ------------------------------
  // Submit UNR
  // ------------------------------
  const submitUNR = async () => {
    if (!unr) {
      alert("Enter UNR");
      return;
    }

    try {
      await axios.put(`/api/orders/${orderId}/unr`, {
        paymentUNR: unr
      });

      // Navigate to thank you page with order details
      navigate("/payment-success", {
        state: {
          orderId: orderId,
          unr: unr,
          screenshot: uploadedPath
        }
      });
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("Failed to submit payment. Please try again.");
    }
  };

  return (
    <div style={{ 
      padding: '40px 20px', 
      maxWidth: '600px', 
      margin: '0 auto',
      background: '#fff',
      minHeight: '80vh'
    }}>
      <h2 style={{ 
        color: '#333', 
        marginBottom: '10px',
        fontSize: '28px'
      }}>
        Upload Payment Screenshot
      </h2>
      
      <p style={{ 
        color: '#666', 
        marginBottom: '30px',
        fontSize: '16px'
      }}>
        Please upload your payment proof and enter the UNR number
      </p>

      <div style={{ 
        background: '#f8f9fa', 
        padding: '25px', 
        borderRadius: '12px',
        marginBottom: '25px'
      }}>
        <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>Step 1: Upload Screenshot</h3>
        
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          style={{
            padding: '10px',
            border: '2px dashed #ddd',
            borderRadius: '8px',
            width: '100%',
            marginBottom: '15px',
            cursor: 'pointer'
          }}
        />

        <button 
          onClick={uploadScreenshot} 
          style={{ 
            padding: '12px 24px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          📤 Upload Screenshot
        </button>

        {uploadedPath && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ color: '#28a745', fontWeight: 'bold', marginBottom: '10px' }}>✅ Screenshot uploaded successfully!</p>
            <img
              src={uploadedPath}
              alt="Payment Proof"
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px',
                border: '2px solid #28a745',
                borderRadius: '8px'
              }}
            />
          </div>
        )}
      </div>

      <div style={{ 
        background: '#f8f9fa', 
        padding: '25px', 
        borderRadius: '12px'
      }}>
        <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>Step 2: Enter UNR</h3>
        
        <input
          type="text"
          placeholder="Enter UNR Number"
          value={unr}
          onChange={(e) => setUnr(e.target.value)}
          style={{ 
            padding: '12px', 
            width: '100%',
            border: '2px solid #ddd',
            borderRadius: '6px',
            fontSize: '16px',
            marginBottom: '15px'
          }}
        />

        <button 
          onClick={submitUNR} 
          style={{ 
            padding: '14px 28px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            width: '100%'
          }}
        >
          ✅ Submit Payment
        </button>
      </div>

      <div style={{ 
        marginTop: '25px', 
        padding: '15px', 
        background: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '8px'
      }}>
        <p style={{ color: '#856404', margin: 0, fontSize: '14px' }}>
          💡 <strong>Tip:</strong> Make sure your UNR number is correct. You will receive confirmation once payment is verified.
        </p>
      </div>
    </div>
  );
}
