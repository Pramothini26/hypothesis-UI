from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from scipy import stats
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Read the uploaded file into a DataFrame
        df = pd.read_csv(file)

        # Check if the DataFrame contains any numeric columns
        numeric_columns = df.select_dtypes(include=[np.number]).columns

        if len(numeric_columns) == 0:
            return jsonify({"error": "No numeric data found in the file."}), 400
        
        # Use the first numeric column for the z-test (can be adjusted as needed)
        data_column = numeric_columns[0]
        data = df[data_column].dropna()  # Drop any NaN values

        # Assuming the user provides population mean and std deviation
        population_mean = float(request.form['population_mean'])
        std_dev = float(request.form['std_dev'])

        # Perform the one-sample z-test
        sample_mean = data.mean()
        sample_size = len(data)
        standard_error = std_dev / np.sqrt(sample_size)
        z_score = (sample_mean - population_mean) / standard_error

        # Get the critical value for the significance level (two-tailed test)
        significance_level = float(request.form['significance_level'])
        critical_value = stats.norm.ppf(1 - significance_level / 2)

        # Determine whether the null hypothesis is rejected
        if abs(z_score) > critical_value:
            result = "Reject null hypothesis"
        else:
            result = "Fail to reject null hypothesis"

        # Return the z-test result
        return jsonify({
            "z_score": z_score,
            "critical_value": critical_value,
            "result": result,
            "sample_mean": sample_mean,
            "population_mean": population_mean
        })
    
    except Exception as e:
        return jsonify({"error": f"Error processing the file: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
