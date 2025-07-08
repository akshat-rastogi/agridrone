# Agridrone Web App

Agridrone is a modern, responsive web application for precision farming using drones and AI. It provides real-time drone status, crop health insights, feedback collection, and AI-powered crop diagnosis, all with a beautiful UI and dark/light mode support.

## Features

- **Hero Section:** Eye-catching background, tagline, and quick access to feedback and drone budget.
- **Drone Status:** Live health, battery, condition, and location (auto-detected, with alerts for low battery/health).
- **Field Overview:** Cards for crop health, irrigation, pest control, drone images, and action timeline.
- **Drone Scan Images:** HD images of Indian agricultural lands, each with detected issues and suggestions.
- **AI Crop Diagnosis:** Upload crop/drone images for instant AI-powered diagnosis and advice (mocked for demo).
- **Diagnosis Results:** View all diagnosis results in a responsive table (with Excel export) on a dedicated page.
- **Feedback System:** Modal form for submitting feedback (name, email, message, 5-star rating), with backend storage and frontend display.
- **Notification System:** Bell icon with session alerts for drone health, crop issues, and system notifications.
- **Dark/Light Mode:** Toggle in the top left, with theme persistence and full color palette switching.
- **Modern UI:** Green/blue palette, modern fonts, and responsive design for all devices.

## How It Works

- The frontend is a single-page HTML/CSS/JS app (no frameworks required).
- The backend is a plain Node.js server (no Express) for API endpoints.
- All feedback and diagnosis data is stored in local `.jsonl` files.
- The AI diagnosis is simulated (random result) for demo purposes.

## Running Locally

1. **Start the backend server:**
   ```
   node server.js
   ```
   The server runs on `http://localhost:3001` (or your mapped subdomain).

2. **Open `index.html` in your browser.**
   - For custom subdomains, use `/etc/hosts` mapping as described in previous instructions.

3. **API Endpoints:**

### Feedback API
- `POST /api/feedback` — Submit feedback (JSON: `{ name, email, message, rating }`)
- `GET /api/get-feedbacks` — Get all feedbacks (array of feedback objects)

### Diagnosis API
- `POST /api/diagnose-crop` — Submit a base64 image (JSON: `{ image }`), returns `{ diagnosis, advice, confidence, timestamp }`
- `GET /api/get-diagnoses` — Get all diagnosis results as JSON
- `GET /api/diagnoses-csv` — Get all diagnosis results as CSV

## Mock API Structure

- **Feedback:**
  ```json
  {
    "name": "Farmer Name",
    "email": "farmer@email.com",
    "message": "Great service!",
    "rating": 5,
    "timestamp": "2024-06-01T12:34:56.789Z"
  }
  ```
- **Diagnosis:**
  ```json
  {
    "timestamp": "2024-06-01T12:34:56.789Z",
    "diagnosis": "Pest Infestation",
    "advice": "Apply neem-based pesticide and monitor affected area.",
    "confidence": 97
  }
  ```

## Code Comments
- All major functions in `server.js` and the frontend JS are commented to explain their purpose and logic.
- The backend uses helper functions for JSON responses and body parsing.
- The diagnosis endpoint simulates AI by randomly selecting a result.

## Testing
- Frontend tests are provided using Jest and DOM Testing Library (see `__tests__` folder).
- To run tests:
  ```
  npm install
  npm test
  ```

## Running Unit Tests

Unit tests are provided for the feedback and diagnose-crop APIs.

### To run the tests:

1. Make sure the backend server is running:
   ```
   node server.js
   ```
2. In another terminal, run:
   ```
   npm install
   npm test
   ```

All tests are designed to always succeed (the diagnose-crop test accepts any valid response from the mock API).

---

## File Structure
- `index.html` — Main UI and logic
- `results.html` — Diagnosis results table and export
- `server.js` — Node.js backend API
- `feedbacks.jsonl`, `diagnoses.jsonl` — Data storage
- `budget.html` — Drone budget page
- `README.md` — This documentation

## Diagnose Crop Feature

The **AI Crop Issue Diagnosis** feature allows users to upload a crop or drone image and receive an instant, AI-powered diagnosis and advice (mocked for demo).

### How to Use (Frontend)
- Go to the homepage and scroll to the "Drone Scan Images" section.
- In the "AI Crop Issue Diagnosis" card:
  1. Click the file input to select a crop/drone image (JPG/PNG).
  2. Click the "Diagnose Image" button.
  3. The app will display a mock diagnosis, advice, and confidence score below the button.
- All diagnosis results are saved and can be viewed/exported from the "Show All Diagnoses" page.

### API Usage (Backend)
- **POST** `/api/diagnose-crop`
  - **Request body:**
    ```json
    { "image": "<base64-encoded-image>" }
    ```
  - **Response:**
    ```json
    {
      "timestamp": "2024-06-01T12:34:56.789Z",
      "diagnosis": "Pest Infestation",
      "advice": "Apply neem-based pesticide and monitor affected area.",
      "confidence": 97
    }
    ```
- **GET** `/api/get-diagnoses` — Get all diagnosis results as JSON
- **GET** `/api/diagnoses-csv` — Get all diagnosis results as CSV

### Notes
- The backend simulates AI by randomly selecting a diagnosis and advice for demo purposes.
- All diagnosis records are stored in `diagnoses.jsonl` and can be exported as Excel/CSV from the results page.

---

For any questions or improvements, open an issue or contact the developer. 