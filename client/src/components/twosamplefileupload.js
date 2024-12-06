import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory

const TwosampleFileUpload = () => {
  const [file, setFile] = useState(null);
  const [significanceLevel, setSignificanceLevel] = useState("");
  const [populationMean1, setPopulationMean1] = useState("");
  const [populationMean2, setPopulationMean2] = useState("");
  const [stdDev1, setStdDev1] = useState("");
  const [stdDev2, setStdDev2] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const navigate = useNavigate(); // Use useNavigate hook

  // Handle file change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle form submission
  const handleFileSubmit = async (event) => {
    event.preventDefault();

    // Validate form fields
    if (!file || !significanceLevel || !populationMean1 || !populationMean2 || !stdDev1 || !stdDev2) {
      setErrorMessage("All fields are required.");
      return;
    }

    // Prepare the form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("significance_level", significanceLevel);
    formData.append("population_mean1", populationMean1);
    formData.append("population_mean2", populationMean2);
    formData.append("std_dev1", stdDev1);
    formData.append("std_dev2", stdDev2);

    // Make a POST request to the backend
    try {
      const response = await fetch("http://127.0.0.1:5000/two-sample", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();

        // Navigate to twosampleztest page with the result data
        navigate("/ztest", { state: { result } }); // Use navigate instead of history.push
      } else {
        throw new Error("Error processing the file");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Upload File for Two-Sample Z-Test</h2>
      <form onSubmit={handleFileSubmit}>
        <div>
          <label>Choose File:</label>
          <input type="file" onChange={handleFileChange} accept=".csv" />
        </div>

        <div>
          <label>Significance Level:</label>
          <input
            type="number"
            value={significanceLevel}
            onChange={(e) => setSignificanceLevel(e.target.value)}
            step="0.01"
            min="0.01"
            max="1"
            required
          />
        </div>

        <div>
          <label>Population Mean 1:</label>
          <input
            type="number"
            value={populationMean1}
            onChange={(e) => setPopulationMean1(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Population Mean 2:</label>
          <input
            type="number"
            value={populationMean2}
            onChange={(e) => setPopulationMean2(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Standard Deviation 1:</label>
          <input
            type="number"
            value={stdDev1}
            onChange={(e) => setStdDev1(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Standard Deviation 2:</label>
          <input
            type="number"
            value={stdDev2}
            onChange={(e) => setStdDev2(e.target.value)}
            required
          />
        </div>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default TwosampleFileUpload;
