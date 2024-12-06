import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FileUpload from "./components/twosamplefileupload";
import Ztest from "./components/twosampleztest";

function App() {
  return (
    <Router>
      <div className="flex">
        {/* Left Sidebar */}
        <div
          id="sidebar"
          className="bg-blue-600 text-white p-4"
        >
          <h2 className="text-2xl font-bold mb-6"></h2>
          <div>
            <p className="text-lg mb-4">Statistics</p>
            <p className="text-lg mb-4">Hypothesis Testing</p>
            <p className="text-lg mb-4">Machine Learning</p>
            <p className="text-lg mb-4">Deep Learning</p>
            <p className="text-lg mb-4">Explainable AI</p>
            <p className="text-lg mb-4">Data Visualization</p>
          </div>
        </div>

        {/* Right Content Area */}
        <div
          id="main-content"
          className="w-full p-8"
        >
          <Routes>
            <Route path="/" element={<FileUpload />} />
            <Route path="/ztest" element={<Ztest />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
