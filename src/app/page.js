'use client';
import "./main.css";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {

  const [scanImage, setScanImage] = useState(null);
  const [toggleScanDiagnosis, setToggleScanDiagnosis] = useState(false);
  const [toggleBloodDiagnosis, setToggleBloodDiagnosis] = useState(false);
  const [serverResponseStatus, setServerResponseStatus] = useState(false);
  const [serverResponseData, setServerResponseData] = useState(null)
  
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        setScanImage(URL.createObjectURL(file));
    }
  };
  
  const submitForm = async () => {
    const form = document.getElementById('myForm');
    const formData = new FormData(form);

    try {
      const response = await fetch('http://127.0.0.1:8000/data', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setServerResponseData(result);
        setServerResponseStatus(true);
      } else {
        alert('Form submission failed with status:', response.status);
      }
    } catch (error) {
      alert('Error during form submission:', error);
    }
  };

  return (
    <div className="body">

      <div className="header">
        <p className="display-1">ThyroNetV6</p>
        <p className="h4">AI-Powered Thyroid Diagnosis Platform</p>
        <hr/>
      </div>

      <p className="h4">Patient Details</p>
      
      <div className="form">
        <form 
          id="myForm"
          onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}
        >
        <div className="form-floating">
          <input
              type="text"
              name="name"
              id="name"
              className="form-control shadow"
              placeholder="Patient Name"
              required></input>
          <label htmlFor="name">Patient Name</label>
        </div>
        <div className="form-floating">
          <input
              type="number"
              name="age"
              id="age"
              className="form-control shadow"
              placeholder="Age"
              min={1}
              max={120}
              required></input>
          <label htmlFor="age">Age</label>
        </div>
        <div className="form-floating">
          <select
            className="form-select shadow"
            placeholder="Select Gender"
            aria-label="Default select example"
            id="gender"
            name="gender"
            required>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <label htmlFor="gender">Gender</label>
        </div>

        <div className="form-switch">
          <input
              type="checkbox"
              name="toggleScanDiagnosis"
              id="toggleScanDiagnosis"
              className="form-check-input"
              onClick={() => {
                document.getElementById('toggleScanDiagnosis').checked
                  ? setToggleScanDiagnosis(true)
                  : setToggleScanDiagnosis(false);
                setScanImage(null);
              }}
            ></input>
          <label
            htmlFor="toggleScanDiagnosis"
            className="form-check-label"
            >&nbsp; Ultrasound Scan
          </label>

          <br/>

          <input
              type="checkbox"              
              name="toggleBloodDiagnosis"
              id="toggleBloodDiagnosis"
              className="form-check-input"
              onClick={() => {
                document.getElementById('toggleBloodDiagnosis').checked
                  ? setToggleBloodDiagnosis(true)
                  : setToggleBloodDiagnosis(false);
              }}
            ></input>
          <label
            htmlFor="toggleBloodDiagnosis"
            className="form-check-label"
            >&nbsp; Blood Test</label>
          </div>

          {toggleScanDiagnosis && (
          <div>
            <hr/>
            <p className="h5">Ultrasound Scan Image</p>
            <input
              type="file"
              name="scanImage"
              id="scanImage"
              className="form-control shadow"
              accept="image/*"
              onChange={handleImageChange}
              required
            ></input>
            {/* <label htmlFor="scanImage">Ultrasound Scan Image</label> */}
          </div>
          )}

          {scanImage && <img
                          src={scanImage} 
                          alt="Preview"
                          ></img>
          }

          {toggleBloodDiagnosis && (
          <div>
          <hr/>
          <p className="h5">Blood Test Values</p>
          <div className="bloodTestInput row row-cols-2 g-3">
            <div className="form-floating col">
              <input
                type="number"
                name="tsh"
                id="tsh"
                className="form-control form-control shadow"
                placeholder="TSH"
                min={0}
                required
                ></input>
              <label htmlFor="tsh">TSH</label>
            </div>
            <div className="form-floating col">
              <input
                type="number"
                name="freeT4"
                id="freeT4"
                className="form-control form-control shadow"
                placeholder="Free T4"
                min={0}
                required
                ></input>
              <label htmlFor="freeT4">Free T4</label>
            </div>
            <div className="form-floating col">
              <input
                type="number"
                name="freeT3"
                id="freeT3"
                className="form-control form-control shadow"
                placeholder="Free T3"
                min={0}
                required
                ></input>
              <label htmlFor="freeT3">Free T3</label>
            </div>
            <div className="form-floating col">
              <input
                type="number"
                name="totalT4"
                id="totalT4"
                className="form-control form-control shadow"
                placeholder="Total T4"
                min={0}
                required
                ></input>
              <label htmlFor="totalT4">Total T4</label>
            </div>
            <div className="form-floating col">
              <input
                type="number"
                name="antiTpo"
                id="antiTpo"
                className="form-control form-control shadow"
                placeholder="AntiTPO"
                min={0}
                required
                ></input>
              <label htmlFor="antiTpo">AntiTPO</label>
            </div>
            <div className="form-floating col">
              <input
                type="number"
                name="antiTg"
                id="antiTg"
                className="form-control form-control shadow"
                placeholder="AntiTg"
                min={0}
                required
                ></input>
              <label htmlFor="antiTg">AntiTg</label>
            </div>
          </div> 
        </div>
        )}
          <button
            type="submit"
            className="btn btn-primary submitButton"
            >Submit</button>
        </form>
      </div>

      {serverResponseStatus && 
      <div className="testResults">
        <hr/>
        <p className="h5">Test Results</p>

        {serverResponseData.data.scan_result.target ? 
        <div className="testResultWindow shadow">
        <p className="h6">Thyroid Ultrasound Diagnosis</p>
        <p>Predicted Class : <strong>{serverResponseData.data.scan_result.target || ""}</strong></p>

        <ul>
          Confidence Levels :
          <li>TIRADS 1 (Normal) : {serverResponseData.data.scan_result.target_summary["TIRADS1"]}%</li>
          <li>TIRADS 2 (Benign) : {serverResponseData.data.scan_result.target_summary["TIRADS2"]}%</li>
          <li>TIRADS 3 (Probably Benign) : {serverResponseData.data.scan_result.target_summary["TIRADS3"]}%</li>
          <li>TIRADS 4 (Suspicious) : {serverResponseData.data.scan_result.target_summary["TIRADS4"]}%</li>
          <li>TIRADS 5 (Highly Suspicious) : {serverResponseData.data.scan_result.target_summary["TIRADS5"]}%</li>
        </ul>
        </div> : ""
        }

        <br/>
        
        {serverResponseData.data.blood_result.target ?
        <div className="testResultWindow shadow">
        <p className="h6">Thyroid Blood Test Diagnosis</p>
        <p>Blood Results : <strong>{serverResponseData.data.blood_result.target || ""}</strong></p>

        <ul>
          Confidence Levels :
          <li>Normal                         : {serverResponseData.data.blood_result.target_summary["Normal"]}%                          </li>
          <li>Central Hypothyroidism         : {serverResponseData.data.blood_result.target_summary["Central Hypothyroidism"]}%          </li>
          <li>Euthyroid Sick Syndrome        : {serverResponseData.data.blood_result.target_summary["Euthyroid Sick Syndrome"]}%         </li>
          <li>Graves' Disease                : {serverResponseData.data.blood_result.target_summary["Graves' Disease"]}%                 </li>
          <li>Hashimoto's Thyroiditis        : {serverResponseData.data.blood_result.target_summary["Hashimoto's Thyroiditis"]}%         </li>
          <li>Hyperthyroidism                : {serverResponseData.data.blood_result.target_summary["Hyperthyroidism"]}%                 </li>
          <li>Hypothyroidism                 : {serverResponseData.data.blood_result.target_summary["Hypothyroidism"]}%                  </li>
          <li>Iodine-Induced Hyperthyroidism : {serverResponseData.data.blood_result.target_summary["Iodine-Induced Hyperthyroidism"]}%  </li>
          <li>Iodine-Induced Hypothyroidism  : {serverResponseData.data.blood_result.target_summary["Iodine-Induced Hypothyroidism"]}%   </li>
          <li>Postpartum Thyroiditis         : {serverResponseData.data.blood_result.target_summary["Postpartum Thyroiditis"]}%          </li>
          <li>Subclinical Hyperthyroidism    : {serverResponseData.data.blood_result.target_summary["Subclinical Hyperthyroidism"]}%     </li>
          <li>Subclinical Hypothyroidism     : {serverResponseData.data.blood_result.target_summary["Subclinical Hypothyroidism"]}%      </li>
          <li>Thyroid Hormone Resistance     : {serverResponseData.data.blood_result.target_summary["Thyroid Hormone Resistance"]}%      </li>
        </ul>
        </div> : ""
        }
      </div>
      }
      
      <div className="footer">
        <hr/>
        <p>&copy; 2025 &middot; ThyroNetV6</p>
      </div>
    </div>
  );
}