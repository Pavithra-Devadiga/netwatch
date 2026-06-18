# NetWatch - WiFi Network Security Scanner

NetWatch is a lightweight, full-stack WiFi Network Scanner designed for Windows. It queries physical network cards using native commands to identify nearby wireless access points, assess security configurations, detect potential threats (like Evil Twin attacks), and display the results in a premium, interactive dashboard.

---

## 📦 Restoring the Project (First-Time Setup)

To keep the ZIP package size manageable, temporary build files and dependency folders were excluded. Follow the steps below to restore the project and run it successfully.

### Step 1: Extract the ZIP

Extract the contents of the `netwatch.zip` file to a folder on your computer.

### Step 2: Install Python Backend Dependencies

Open a terminal in the `backend` folder and run:

```bash
cd backend
pip install -r requirements.txt
```

### Step 3: Install Frontend React Dependencies

Open a terminal in the `frontend` folder and run:

```bash
cd ../frontend
npm install
```

This will download all required React libraries and recreate the `node_modules` folder.

---

## 🚀 How to Run the Project

### 1. Start the Backend (Flask)

In the `backend/` directory, run:

```bash
python app.py
```

The backend server will start at:

```text
http://localhost:5000
```

### 2. Start the Frontend (React)

In the `frontend/` directory, run:

```bash
npm start
```

The React development server will automatically open the application in your browser at:

```text
http://localhost:3000
```

---

## 📂 Project Structure

```text
netwatch/
├── backend/
│   ├── app.py
│   └── requirements.txt
└── frontend/
    ├── src/
    ├── public/
    └── package.json
```

---

## 🔒 Security Threat Logic

| Security Type     | Status  | Threat Score | Description                                                                                              |
| ----------------- | ------- | ------------ | -------------------------------------------------------------------------------------------------------- |
| WEP               | Danger  | 85           | Highly vulnerable to instant cracking.                                                                   |
| OPEN / NONE       | Danger  | 70           | Susceptible to traffic eavesdropping.                                                                    |
| WPA               | Warning | 40           | Outdated standard with known vulnerabilities.                                                            |
| WPA2 / WPA3       | Safe    | 10           | Modern industry-standard security.                                                                       |
| Evil Twin Network | Danger  | 95           | Rogue hotspot using an identical SSID to a secured network and immediately flagged as a critical threat. |

---

## 🛠️ Technology Stack

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript

### Backend

* Python
* Flask
* Flask-CORS

### Networking

* Netsh (Windows Wi-Fi Scanning)
* JSON-based REST API Communication

---

## 📋 Features

* Scan nearby Wi-Fi networks
* Detect security protocols used by networks
* Generate threat scores based on encryption standards
* Identify potentially dangerous open networks
* Detect possible Evil Twin attacks
* Responsive and user-friendly dashboard
* Real-time communication between frontend and backend

---

## 👨‍💻 Author

**Pavithra **
B.Tech Student, University Visvesvaraya College of Engineering (UVCE)
