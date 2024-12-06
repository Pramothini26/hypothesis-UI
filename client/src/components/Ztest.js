import React from "react";
import { useLocation } from "react-router-dom";
import Plot from "react-plotly.js";

function ZTest() {
  const location = useLocation();
  const { stats } = location.state || {};  // Destructure the data passed from FileUpload

  if (!stats) {
    return <p>Loading...</p>;
  }

  const { z_score, critical_value, sample_mean, population_mean, significance_level } = stats;

  // Generate bell curve data (standard normal distribution)
  const generateBellCurveData = () => {
    const dataPoints = [];
    const range = 4; // Range for standard deviations
    const step = 0.1; // Granularity of points
    
    for (let i = -range; i <= range; i += step) {
      const y = (1 / (Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow(i, 2)); // Gaussian function
      dataPoints.push({ x: i, y });
    }

    return dataPoints;
  };

  const bellCurveData = generateBellCurveData();

  const xValues = bellCurveData.map(point => point.x);
  const yValues = bellCurveData.map(point => point.y);

  const criticalRegionX = [-critical_value, critical_value];
  const criticalRegionY = [0, 0];

 
  const plotData = [
    {
      type: "scatter",
      mode: "lines",
      name: "Bell Curve",
      x: xValues,
      y: yValues,
      fill: "tozeroy",
      fillcolor: "rgba(0, 123, 255, 0.2)",
      line: { color: "rgba(0, 123, 255, 1)", width: 2 },
    },
    {
      type: "scatter",
      mode: "markers",
      name: "Z-Score",
      x: [z_score],
      y: [0],
      marker: { color: "red", size: 10 },
    },
    {
      type: "scatter",
      mode: "markers",
      name: "Region where null hypothesis is accepted",
      x: [...criticalRegionX, ...criticalRegionX],
      y: [...criticalRegionY, ...criticalRegionY],
      line: { color: "green", width: 3 },
      marker: { color: "green", size: 8 },
    }
  ];

  // Layout for the Plotly chart
  const layout = {
    title: "Z-Test Bell Curve",
    xaxis: {
      title: "Z-Score",
    },
    yaxis: {
      title: "Probability Density",
      rangemode: "tozero",
    },
    shapes: [
      // Add shading for the critical region
      {
        type: "rect",
        x0: -critical_value,
        x1: critical_value,
        y0: 0,
        y1: Math.max(...yValues),
        fillcolor: "rgba(0, 255, 0, 0.3)",
        line: {
          width: 0,
        },
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-6">
      <div className="w-full max-w-md p-6 bg-white rounded-md ">
        <h1 className="text-xl font-bold mb-4 text-center">Z-Test Results</h1>

        <div className="mb-4">
          <p><strong>Sample Mean:</strong> {sample_mean}</p>
          <p><strong>Population Mean:</strong> {population_mean}</p>
          <p><strong>Z-Score (from Z-table):</strong> {critical_value}</p>
          <p><strong>Calculated Z-Score:</strong> {z_score}</p>
          <p>
            <strong>Result:</strong>{" "}
            <span
                style={{
                color: stats.result === "Reject Null Hypothesis" ? "red" : "green",
                fontWeight: "bold",
                }}
                >
                {stats.result}
            </span>
        </p>``

        </div>

        <div className="mb-4">
          <h2 className="text-lg font-bold">Bell Curve and Critical Region</h2>
          <Plot
            data={plotData}
            layout={layout}
            config={{ responsive: true }}
          />
        </div>
      </div>
    </div>
  );
}

export default ZTest;
