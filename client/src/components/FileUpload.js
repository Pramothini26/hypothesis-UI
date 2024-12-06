import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [populationMean, setPopulationMean] = useState("");
  const [stdDev, setStdDev] = useState("");
  const [significanceLevel, setSignificanceLevel] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Input validation
    if (!file) {
      alert("Please select a file.");
      return;
    }
    if (!populationMean || isNaN(populationMean)) {
      alert("Please enter a valid population mean.");
      return;
    }
    if (!stdDev || isNaN(stdDev)) {
      alert("Please enter a valid standard deviation.");
      return;
    }
    if (
      !significanceLevel ||
      isNaN(significanceLevel) ||
      significanceLevel <= 0 ||
      significanceLevel >= 1
    ) {
      alert("Please enter a significance level between 0 and 1.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("population_mean", populationMean);
    formData.append("std_dev", stdDev);
    formData.append("significance_level", significanceLevel);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        // Navigate and pass stats to ZTest.js
        navigate("/ztest", { state: { stats: data } });
      } else {
        setError(data.error || "An error occurred.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white rounded-md">
        <h1 className="text-xl font-bold mb-4 text-center">Upload Dataset</h1>

        {/* File Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Upload File:</label>
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            className="block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Population Mean */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Population Mean:</label>
          <input
            type="text"
            value={populationMean}
            onChange={(e) => setPopulationMean(e.target.value)}
            className="block w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter population mean"
          />
        </div>

        {/* Standard Deviation */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Standard Deviation:</label>
          <input
            type="text"
            value={stdDev}
            onChange={(e) => setStdDev(e.target.value)}
            className="block w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter standard deviation"
          />
        </div>

        {/* Significance Level */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Significance Level (e.g., 0.05):</label>
          <input
            type="text"
            value={significanceLevel}
            onChange={(e) => setSignificanceLevel(e.target.value)}
            className="block w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter significance level (between 0 and 1)"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 w-full"
        >
          Submit
        </button>
      </form>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default FileUpload;
