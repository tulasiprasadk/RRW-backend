import React, { useState, useRef } from "react";
import "./AdminBulkUpload.css";

export default function AdminBulkUpload() {
  const [csvText, setCsvText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const sampleCSV = `title,variety,subVariety,price,unit,description,categoryId,categoryName
Red Roses Bound,Bound Flowers,Red Roses,500,bundle,Fresh red roses in bundle,1,Flowers
Loose Flowers Mix,Unbound Flowers,Loose Flowers,200,kg,Mixed loose flowers,1,Flowers
Fresh Spinach,Leafy Vegetables,Spinach,40,kg,Fresh organic spinach,3,Vegetables
Fresh Carrots,Root Vegetables,Carrot,60,kg,Fresh carrots,3,Vegetables
Alphonso Mango,Seasonal Fruits,Mango,120,kg,Alphonso mangoes,4,Fruits
Full Cream Milk,Milk,Full Cream,55,liter,Full cream milk,5,Milk Products
Toned Milk,Milk,Toned,45,liter,Toned milk,5,Milk Products`;

  const flowersCSV = `title,variety,subVariety,price,unit,description,categoryId,categoryName
Red Roses Bouquet,Bouquets,Small Bouquet,150,piece,Beautiful small red roses bouquet perfect for gifting,1,Flowers
Red Roses Bouquet,Bouquets,Medium Bouquet,300,piece,Medium red roses bouquet with 12 roses,1,Flowers
Red Roses Bouquet,Bouquets,Large Bouquet,500,piece,Large premium red roses bouquet with 24 roses,1,Flowers
Mixed Flowers Bouquet,Bouquets,Premium Bouquet,800,piece,Premium mixed flowers bouquet with exotic varieties,1,Flowers
Fresh Roses,Bound Flowers,Roses,200,bunch,Fresh red roses in bound bunch,1,Flowers
Marigold Flowers,Bound Flowers,Marigold,100,bunch,Fresh marigold flowers for pooja,1,Flowers
Jasmine Flowers,Bound Flowers,Jasmine,150,bunch,Fragrant jasmine flowers,1,Flowers
Lotus Flowers,Bound Flowers,Lotus,250,bunch,Sacred lotus flowers for temple,1,Flowers
Lily Flowers,Bound Flowers,Lily,300,bunch,Elegant lily flowers,1,Flowers
Loose Rose Petals,Unbound Flowers,Loose Roses,150,kg,Fresh rose petals loose,1,Flowers
Loose Marigold,Unbound Flowers,Loose Marigold,80,kg,Loose marigold flowers by kg,1,Flowers
Loose Jasmine,Unbound Flowers,Loose Jasmine,120,kg,Loose jasmine flowers by weight,1,Flowers
Mixed Loose Flowers,Unbound Flowers,Mixed Flowers,100,kg,Mixed loose flowers for decoration,1,Flowers
Door Decoration Garland,Garlands,Door Garland,200,piece,Colorful door garland,1,Flowers
Wedding Garland,Garlands,Wedding Garland,1500,piece,Premium wedding garland for bride and groom,1,Flowers
Temple Garland,Garlands,Temple Garland,300,piece,Traditional temple garland,1,Flowers
Stage Decoration,Garlands,Stage Decoration,2000,set,Complete stage decoration with garlands,1,Flowers
Daily Flower Delivery,Package Bundles,Daily Delivery,500,subscription,Daily fresh flowers delivered to your doorstep,1,Flowers
Weekly Flower Package,Package Bundles,Weekly Delivery,2000,subscription,Weekly fresh flowers package,1,Flowers
Monthly Flower Package,Package Bundles,Monthly Delivery,6000,subscription,Monthly flowers subscription for home temple,1,Flowers
Festival Flower Package,Package Bundles,Festival Package,5000,package,Special festival flowers package,1,Flowers
Small Pooja Package,Occasion Packages,Small Pooja,1000,package,Flowers for small pooja at home,1,Flowers
Medium Pooja Package,Occasion Packages,Medium Pooja,3000,package,Complete flowers for medium scale pooja,1,Flowers
Grand Pooja Package,Occasion Packages,Grand Pooja,10000,package,Grand pooja flowers package with all varieties,1,Flowers
Wedding Flowers Package,Occasion Packages,Wedding Package,15000,package,Complete wedding flowers decoration package,1,Flowers
House Warming Flowers,Occasion Packages,House Warming,5000,package,House warming pooja flowers package,1,Flowers`;

  const crackersCSV = `title,variety,subVariety,price,unit,description,categoryId,categoryName
Small Sparkles,Sparkles,Small Sparkles,50,box,Small sparkles crackers box,2,Crackers
Medium Sparkles,Sparkles,Medium Sparkles,100,box,Medium size sparkles for kids,2,Crackers
Large Sparkles,Sparkles,Large Sparkles,200,box,Large sparkles with long burn time,2,Crackers
Color Sparkles,Sparkles,Color Sparkles,150,box,Multi-color sparkles for decoration,2,Crackers
Electric Sparkles,Sparkles,Electric Sparkles,250,box,Electric sparkles with bright light,2,Crackers
Atom Bomb,Bombs,Atom Bomb,20,piece,Classic atom bomb crackers,2,Crackers
Hydrogen Bomb,Bombs,Hydrogen Bomb,30,piece,Powerful hydrogen bomb,2,Crackers
Bullet Bomb,Bombs,Bullet Bomb,25,piece,Fast bullet bomb crackers,2,Crackers
Chorsa Bomb,Bombs,Chorsa Bomb,40,packet,Chorsa bomb pack of 10,2,Crackers
Small Rocket,Rockets,Small Rocket,30,piece,Small rocket for kids,2,Crackers
Medium Rocket,Rockets,Medium Rocket,60,piece,Medium rocket with good height,2,Crackers
Big Rocket,Rockets,Big Rocket,100,piece,Big rocket premium quality,2,Crackers
Whistling Rocket,Rockets,Whistling Rocket,80,piece,Whistling rocket with sound,2,Crackers
Single Sound Crackers,Sound Crackers,Single Sound,50,packet,Single sound crackers pack,2,Crackers
Double Sound Crackers,Sound Crackers,Double Sound,80,packet,Double sound crackers pack,2,Crackers
Multi Sound Crackers,Sound Crackers,Multi Sound,150,packet,Multi sound crackers pack,2,Crackers
Lakshmi Crackers,Sound Crackers,Lakshmi Crackers,200,packet,Traditional Lakshmi crackers,2,Crackers
Small Combo Box,Combo Boxes,Small Combo,500,box,Small combo box with variety,2,Crackers
Medium Combo Box,Combo Boxes,Medium Combo,1200,box,Medium combo box for family,2,Crackers
Large Combo Box,Combo Boxes,Large Combo,2500,box,Large combo box with all varieties,2,Crackers
Premium Combo Box,Combo Boxes,Premium Combo,5000,box,Premium combo box deluxe edition,2,Crackers
Family Pack Combo,Combo Boxes,Family Pack,3500,box,Complete family pack for celebrations,2,Crackers
Fountain Crackers,Fancy Crackers,Fountains,40,piece,Colorful fountain crackers,2,Crackers
Chakkar Crackers,Fancy Crackers,Chakkar,50,piece,Ground chakkar spinning crackers,2,Crackers
Flower Pots,Fancy Crackers,Flower Pots,60,piece,Flower pot crackers with colors,2,Crackers
Ground Chakkars,Fancy Crackers,Ground Chakkars,70,piece,Special ground chakkars multi-color,2,Crackers`;

  const loadSample = () => {
    setCsvText(sampleCSV);
  };

  const loadFlowersCSV = () => {
    setCsvText(flowersCSV);
  };

  const loadCrackersCSV = () => {
    setCsvText(crackersCSV);
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvText(event.target.result);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const products = [];

    // Category name to ID mapping
    const categoryMap = {
      'Flowers': 1,
      'Crackers': 2,
      'Vegetables': 3,
      'Fruits': 4,
      'Milk Products': 5,
      'Groceries': 6
    };

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const product = {};
      headers.forEach((header, index) => {
        product[header] = values[index] || '';
      });
      
      // Auto-convert category name to ID if categoryName is provided
      if (product.categoryName && categoryMap[product.categoryName]) {
        product.categoryId = categoryMap[product.categoryName];
      }
      // If categoryId is a name instead of number, convert it
      else if (product.categoryId && categoryMap[product.categoryId]) {
        product.categoryId = categoryMap[product.categoryId];
      }
      // If categoryId is already a number string, convert to integer
      else if (product.categoryId) {
        product.categoryId = parseInt(product.categoryId);
      }
      
      // Convert price to number
      if (product.price) {
        product.price = parseFloat(product.price);
      }
      
      products.push(product);
    }

    return products;
  };

  const handleBulkUpload = async () => {
    if (!csvText.trim()) {
      alert("Please enter CSV data");
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const products = parseCSV(csvText);

      const res = await fetch("/api/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ products }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || "Bulk upload failed");
        setUploading(false);
        return;
      }

      setResult(data);
      alert(`Success! ${data.created} products created, ${data.errors} errors.`);
      
      if (data.errors === 0) {
        setCsvText("");
      }
    } catch (err) {
      console.error(err);
      alert("Server error during bulk upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bulk-upload-container">
      <h1>Bulk Product Upload</h1>
      <p className="bulk-upload-subtitle">
        Upload multiple product templates at once using CSV format
      </p>

      <div className="bulk-upload-actions">
        <button className="admin-button outline" onClick={loadSample}>
          📝 Load Sample CSV
        </button>
        <button className="admin-button success" onClick={loadFlowersCSV}>
          🌸 Load Flowers CSV (26 products)
        </button>
        <button className="admin-button success" onClick={loadCrackersCSV}>
          🎆 Load Crackers CSV (26 products)
        </button>
      </div>

      <div className="bulk-upload-actions" style={{ marginTop: '10px' }}>
        <button className="admin-button primary" onClick={() => downloadCSV(flowersCSV, 'flowers_bulk_upload.csv')}>
          ⬇️ Download Flowers CSV
        </button>
        <button className="admin-button primary" onClick={() => downloadCSV(crackersCSV, 'crackers_bulk_upload.csv')}>
          ⬇️ Download Crackers CSV
        </button>
        <button className="admin-button outline" onClick={() => downloadCSV(sampleCSV, 'sample_template.csv')}>
          ⬇️ Download Sample Template
        </button>
      </div>

      <div className="bulk-upload-form">
        <label>CSV Data (comma-separated)</label>
        <p className="bulk-upload-hint">
          Format: title,variety,subVariety,price,unit,description,categoryId,categoryName<br/>
          <strong>Use Category Names:</strong> Flowers, Crackers, Vegetables, Fruits, Milk Products, Groceries<br/>
          <em>💡 Tip: You can use category name (e.g., "Flowers") in either categoryId or categoryName column - the system will auto-convert!</em>
        </p>
        
        <div style={{ marginBottom: '15px' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button 
            className="admin-button primary"
            onClick={() => fileInputRef.current?.click()}
            style={{ marginRight: '10px' }}
          >
            📁 Choose CSV File
          </button>
          <span style={{ color: '#666', fontSize: '14px' }}>Or paste CSV data below</span>
        </div>
        
        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder="Paste your CSV data here..."
          rows="15"
        />

        <button 
          className="admin-button primary"
          onClick={handleBulkUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Products"}
        </button>
      </div>

      {result && (
        <div className="bulk-upload-result">
          <h3>Upload Result</h3>
          <div className="result-stats">
            <div className="stat success">
              <strong>{result.created}</strong> products created
            </div>
            {result.errors > 0 && (
              <div className="stat error">
                <strong>{result.errors}</strong> errors
              </div>
            )}
          </div>

          {result.errorDetails && result.errorDetails.length > 0 && (
            <div className="error-details">
              <h4>Error Details:</h4>
              <ul>
                {result.errorDetails.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="bulk-upload-instructions">
        <h3>📚 Instructions</h3>
        <ul>
          <li><strong>Header Row:</strong> title,variety,subVariety,price,unit,description,categoryId,categoryName</li>
          <li><strong>✨ Easy Categories:</strong> Just type the category name! Use "Flowers", "Crackers", "Vegetables", "Fruits", "Milk Products", or "Groceries"</li>
          <li><strong>Auto-Conversion:</strong> System automatically converts category names to IDs. No need to remember numbers!</li>
          <li><strong>Separator:</strong> Use comma (,) between columns</li>
          <li><strong>Valid Units:</strong> piece, kg, gram, liter, bunch, bundle, packet, box, set, subscription, package</li>
          <li><strong>Templates:</strong> Products will be created as templates for suppliers to use</li>
        </ul>

        <h4 style={{ marginTop: '20px' }}>🚀 Quick Start:</h4>
        <div style={{ 
          background: '#fff3cd', 
          padding: '15px', 
          borderRadius: '8px',
          border: '2px solid #ffd600',
          marginBottom: '15px'
        }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#333' }}>
            Ready-to-use CSV templates available!
          </p>
          <ol style={{ margin: '0', paddingLeft: '20px' }}>
            <li>Click <strong>"🌸 Load Flowers CSV"</strong> to load 26 flower products</li>
            <li>Or click <strong>"🎆 Load Crackers CSV"</strong> to load 26 cracker products</li>
            <li>Review the data in the text area</li>
            <li>Click <strong>"Upload Products"</strong> button</li>
            <li>Done! All products uploaded instantly</li>
          </ol>
          <p style={{ margin: '10px 0 0 0', fontSize: '13px', color: '#666' }}>
            💡 You can also download these CSV files using the download buttons above and edit them offline.
          </p>
        </div>

        <h4 style={{ marginTop: '20px' }}>📋 Sample CSV Format:</h4>
        <div style={{ 
          background: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '8px', 
          fontFamily: 'monospace',
          fontSize: '13px',
          overflowX: 'auto',
          border: '2px solid #e0e0e0'
        }}>
          <pre style={{ margin: 0 }}>
title,variety,subVariety,price,unit,description,categoryId
Red Roses Bouquet,Bouquets,Small Bouquet,150,piece,Beautiful red roses,1
Marigold Flowers,Bound Flowers,Marigold,100,bunch,Fresh marigold,1
Small Sparkles,Sparkles,Small Sparkles,50,box,Small sparkles box,2
Atom Bomb,Bombs,Atom Bomb,20,piece,Classic atom bomb,2
          </pre>
        </div>
        <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
          💡 <strong>Tip:</strong> Click "Load Sample CSV" button above to copy this format into the textarea, 
          then modify it with your own products.
        </p>
      </div>
    </div>
  );
}
