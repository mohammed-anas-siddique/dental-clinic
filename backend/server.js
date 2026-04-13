/**
 * Express server for handling appointment form submissions.
 * No SMTP: appointments are stored locally in backend/appointments.json
 */
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files from ../frontend
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));
app.get('/', (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));

const DATA_FILE = path.join(__dirname, 'appointments.json');

// POST /send-appointment - receives form data and saves locally
app.post('/send-appointment', async (req, res) => {
  const { name, email, phone, date, time, message } = req.body;

  // Basic server-side validation
  if (!name || !email || !phone || !date || !time) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  const entry = {
    id: Date.now(),
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone).trim(),
    date: String(date),
    time: String(time),
    message: String(message || ''),
    receivedAt: new Date().toISOString(),
  };

  try {
    let arr = [];
    if (fsSync.existsSync(DATA_FILE)) {
      const content = await fs.readFile(DATA_FILE, 'utf8');
      try {
        arr = JSON.parse(content) || [];
      } catch (e) {
        console.error('Invalid JSON in appointments file, creating a new list and backing up the old file.');
        const backup = DATA_FILE + '.bak.' + Date.now();
        await fs.rename(DATA_FILE, backup);
        arr = [];
      }
    }
    arr.push(entry);
    await fs.writeFile(DATA_FILE, JSON.stringify(arr, null, 2), 'utf8');
    console.log('Saved appointment', entry.id);
    return res.json({ success: true, message: 'Appointment saved locally.' });
  } catch (err) {
    console.error('Error saving appointment:', err);
    return res.status(500).json({ success: false, message: 'Failed to save appointment.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
