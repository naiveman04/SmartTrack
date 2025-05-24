# SmartTrack - RFID Attendance System

## Overview  
**SmartTrack** is an RFID-based attendance system developed during the Credenz'24 Hackathon to automate attendance tracking. Built with an ESP8266 microcontroller and NXP MFRC522 RFID reader, it logs attendance using 13.56 MHz MIFARE cards, integrates with **Firebase** for real-time data storage, and provides a web interface for administrators to monitor records efficiently.

## Features  
- 📷 **RFID Scanning**: Uses **NXP MFRC522** to scan MIFARE cards for quick attendance logging.  
- 🔥 **Real-Time Data Sync**: Integrates with **Firebase** to store and update attendance records instantly.  
- 📋 **Attendance Monitoring**: Displays attendance logs with timestamps for easy tracking.  
- 🌐 **Web-Based Interface**: A simple front-end built with **HTML, CSS, and JavaScript** for admin access.  

## Pages  
The **SmartTrack** web application consists of two main pages:  
1. **Landing Page** – Introduces the system and provides a login option for administrators.  
2. **Attendance Dashboard** – Displays real-time attendance logs with timestamps and user details.  

## Technologies Used  
- **Languages**: C++, JavaScript, HTML, CSS  
- **Hardware**: ESP32, NXP MFRC522 RFID Reader, 13.56 MHz MIFARE 1K Cards  
- **Backend & Database**: Node.js, Firebase  
- **Tools**: Arduino IDE, VS Code  

## How It Works  
1. **Scan RFID Card**: Users scan their MIFARE card using the **NXP MFRC522** reader connected to the ESP8266.  
2. **Data Transmission**: The ESP8266 sends the scanned data to a **Node.js** server via Wi-Fi.  
3. **Real-Time Storage**: The server pushes the data to **Firebase** for instant updates.  
4. **Display Logs**: The web interface fetches and displays attendance records with timestamps.  
5. **Admin Access**: Admins can view and manage logs through the Attendance Dashboard.

## Hardware Photos
<p align = "center">
     <img src="https://github.com/user-attachments/assets/31341480-97fc-46fa-a379-b454344510f7">
     <img src="https://github.com/user-attachments/assets/b652c81a-0b47-4657-9317-06e82db6e444">
     <img src="https://github.com/user-attachments/assets/92c67dc6-8ac3-4580-99f6-348389cdc776">
     <img src="https://github.com/user-attachments/assets/10b6f022-f9ad-41fd-9224-59027093209a">
</p>

## Login credentials for viewing the site:
### https://campus-check.vercel.app/
 - Username: vedantnarawadkar@gmail.com
 - Password: vedant

## Installation & Setup  
### Prerequisites  
- Arduino IDE  
- Node.js  
- npm (Node package manager)  

### Steps  
1. Clone the repository:  
   ```bash  
   git clone https://github.com/your-username/smarttrack.git  
   cd smarttrack  
2. Install dependencies:  
   ```bash  
   npm install  
3. Upload firmware to ESP8266:  
   - Open the `.ino` file in Arduino IDE, configure the Wi-Fi credentials, and upload to the ESP8266.  
4. Run the application:  
   ```bash  
   node server.js  

## Future Enhancements  
- 📡 **Offline Data Support:** Add local storage to handle Wi-Fi disruptions.  
- 🔋 **Battery Optimization:** Improve power management for prolonged use.  
- 🔎 **Search Functionality:** Enable filtering and searching of attendance logs.  
- 📱 **Mobile App Integration:** Develop a mobile app for on-the-go access.
