from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import scipy.stats as stats

app = Flask(__name__)
CORS(app)

@app.route('/two-sample', methods=['POST'])
def two_sample_ztest():
    try:
        # Get the data from the request
        file = request.files.get("file")
        population_mean1 = float(request.form.get("population_mean1"))
        population_mean2 = float(request.form.get("population_mean2"))
        std_dev1 = float(request.form.get("std_dev1"))
        std_dev2 = float(request.form.get("std_dev2"))
        significance_level = float(request.form.get("significance_level"))
        is_one_tailed = request.form.get("is_one_tailed") == "true"  # Determine if it's a one-tailed test
        
        # Assume n1 and n2 as sample sizes (can be adjusted as per your dataset)
        n1 = n2 = 30  # Example sample size, adjust as necessary
        
        # Compute Z-statistic
        z_stat = (population_mean1 - population_mean2) / np.sqrt((std_dev1**2 / n1) + (std_dev2**2 / n2))

        # Compute p-value for one-tailed or two-tailed test
        if is_one_tailed:
            p_value = 1 - stats.norm.cdf(z_stat)  # One-tailed test (right tail)
        else:
            p_value = 2 * (1 - stats.norm.cdf(abs(z_stat)))  # Two-tailed test

        # Determine the critical region and conclusion
        if is_one_tailed:
            critical_value = stats.norm.ppf(1 - significance_level)
        else:
            critical_value = stats.norm.ppf(1 - significance_level / 2)

        conclusion = "Reject null hypothesis" if abs(z_stat) > critical_value else "Fail to reject null hypothesis"
        
        # For the sake of clarity, we'll return the sample means and std devs as well
        result = {
            "sample_mean_1": population_mean1,  # Population means are being passed as sample means
            "sample_mean_2": population_mean2,
            "std_dev_1": std_dev1,
            "std_dev_2": std_dev2,
            "z_statistic": z_stat,
            "p_value": p_value,
            "critical_region": critical_value,
            "conclusion": conclusion,
            "is_one_tailed": is_one_tailed
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True)
