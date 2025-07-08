// Plain Node.js server for feedback and diagnosis API
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const USERS_FILE = path.join(__dirname, 'demo_users.jsonl');
const FEEDBACK_FILE = path.join(__dirname, 'feedbacks.jsonl');
const DIAGNOSES_FILE = path.join(__dirname, 'diagnoses.jsonl');

// Helper: Send JSON response with CORS headers
function sendJson(res, obj, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(obj));
}

// Helper: Parse JSON body from POST requests
function parseBody(req, cb) {
  let data = '';
  req.on('data', chunk => { data += chunk; });
  req.on('end', () => {
    try {
      cb(null, JSON.parse(data));
    } catch (e) {
      cb(e);
    }
  });
}

// Main HTTP server
const server = http.createServer((req, res) => {
  // Handle CORS preflight for all API endpoints
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // --- Demo Booking API (legacy, not used in UI) ---
  if (req.url === '/api/book-demo' && req.method === 'POST') {
    parseBody(req, (err, user) => {
      if (err || !user || !user.name || !user.email) {
        sendJson(res, { error: 'Invalid data' }, 400);
        return;
      }
      user.timestamp = new Date().toISOString();
      fs.appendFile(USERS_FILE, JSON.stringify(user) + '\n', err => {
        if (err) {
          sendJson(res, { error: 'Failed to save' }, 500);
        } else {
          sendJson(res, { success: true });
        }
      });
    });
    return;
  }

  // --- Feedback API ---
  // Save feedback (POST)
  if (req.url === '/api/feedback' && req.method === 'POST') {
    parseBody(req, (err, feedback) => {
      // Validate required fields
      if (err || !feedback || !feedback.name || !feedback.message || !feedback.rating) {
        sendJson(res, { error: 'Invalid data' }, 400);
        return;
      }
      feedback.timestamp = new Date().toISOString();
      // Append feedback as JSON line
      fs.appendFile(FEEDBACK_FILE, JSON.stringify(feedback) + '\n', err => {
        if (err) {
          sendJson(res, { error: 'Failed to save' }, 500);
        } else {
          sendJson(res, { success: true });
        }
      });
    });
    return;
  }
  // Get all feedbacks (GET)
  if (req.url === '/api/get-feedbacks' && req.method === 'GET') {
    fs.readFile(FEEDBACK_FILE, 'utf8', (err, data) => {
      if (err) {
        sendJson(res, []);
        return;
      }
      // Parse each line as a feedback JSON object
      const feedbacks = data.trim().split('\n').filter(Boolean).map(line => {
        try { return JSON.parse(line); } catch { return null; }
      }).filter(Boolean);
      sendJson(res, feedbacks);
    });
    return;
  }

  // --- AI Crop Diagnosis API ---
  // POST /api/diagnose-crop: Accepts base64 image, returns mock diagnosis
  if (req.url === '/api/diagnose-crop' && req.method === 'POST') {
    parseBody(req, (err, body) => {
      if (err || !body || !body.image) {
        sendJson(res, { error: 'Invalid image data' }, 400);
        return;
      }
      // Simulate AI diagnosis (random for demo)
      const diagnoses = [
        { label: 'Pest Infestation', advice: 'Apply neem-based pesticide and monitor affected area.' },
        { label: 'Nutrient Deficiency', advice: 'Apply NPK fertilizer as per soil test recommendations.' },
        { label: 'Water Stress', advice: 'Increase irrigation in the affected zone.' },
        { label: 'Healthy', advice: 'No issues detected. Continue regular monitoring.' }
      ];
      // Pick a random diagnosis for demo
      const result = diagnoses[Math.floor(Math.random() * diagnoses.length)];
      const record = {
        timestamp: new Date().toISOString(),
        diagnosis: result.label,
        advice: result.advice,
        confidence: Math.round(80 + Math.random() * 20),
        // Optionally store a hash or name for the image, not the image itself
      };
      // Store the diagnosis record
      fs.appendFile(DIAGNOSES_FILE, JSON.stringify(record) + '\n', err => {
        if (err) console.error('Failed to save diagnosis:', err);
      });
      sendJson(res, record);
    });
    return;
  }
  // GET /api/get-diagnoses: Return all diagnosis records as JSON
  if (req.url === '/api/get-diagnoses' && req.method === 'GET') {
    fs.readFile(DIAGNOSES_FILE, 'utf8', (err, data) => {
      if (err) {
        sendJson(res, []);
        return;
      }
      const diagnoses = data.trim().split('\n').filter(Boolean).map(line => {
        try { return JSON.parse(line); } catch { return null; }
      }).filter(Boolean);
      sendJson(res, diagnoses);
    });
    return;
  }
  // GET /api/diagnoses-csv: Return all diagnosis records as CSV
  if (req.url === '/api/diagnoses-csv' && req.method === 'GET') {
    fs.readFile(DIAGNOSES_FILE, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(200, { 'Content-Type': 'text/csv', 'Access-Control-Allow-Origin': '*' });
        res.end('timestamp,diagnosis,advice,confidence\n');
        return;
      }
      const diagnoses = data.trim().split('\n').filter(Boolean).map(line => {
        try { return JSON.parse(line); } catch { return null; }
      }).filter(Boolean);
      let csv = 'timestamp,diagnosis,advice,confidence\n';
      diagnoses.forEach(d => {
        csv += `"${d.timestamp}","${d.diagnosis}","${d.advice}",${d.confidence}\n`;
      });
      res.writeHead(200, { 'Content-Type': 'text/csv', 'Access-Control-Allow-Origin': '*' });
      res.end(csv);
    });
    return;
  }

  // --- 404 for all other routes ---
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 