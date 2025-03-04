# Raspberry Pi Kiosk System

A simple kiosk system for Raspberry Pi that allows you to manage and display URLs in fullscreen mode.

## Features

- Dashboard to manage URLs (add, update, delete)
- Set an active URL to display in kiosk mode
- Schedule automatic start times for URLs
- Virtual keyboard for input forms
- Automatic startup on system boot

## Installation

### Development Setup

1. Clone this repository:
   ```
   git clone <repository-url>
   cd raspberry-pi-kiosk
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

### Raspberry Pi Setup

1. Copy the project to your Raspberry Pi:
   ```
   scp -r raspberry-pi-kiosk pi@<raspberry-pi-ip>:/home/pi/kiosk
   ```

2. SSH into your Raspberry Pi:
   ```
   ssh pi@<raspberry-pi-ip>
   ```

3. Navigate to the project directory:
   ```
   cd /home/pi/kiosk
   ```

4. Install dependencies:
   ```
   npm install
   ```

5. Build the project:
   ```
   npm run build
   ```

6. Run the installation script:
   ```
   bash ./public/install.sh
   ```

7. Reboot your Raspberry Pi:
   ```
   sudo reboot
   ```

## Usage

### Dashboard

Access the dashboard at `http://localhost:5173/` (development) or `http://localhost:4173/` (production).

From the dashboard, you can:
- Add new URLs
- Edit existing URLs
- Delete URLs
- Set an active URL
- Configure automatic start times

### Kiosk Mode

Click the "Launch Kiosk" button on the dashboard to enter kiosk mode.

In kiosk mode:
- The active URL will be displayed in fullscreen
- Move your mouse to show the control bar
- Virtual keyboard will appear automatically when focusing on input fields
- Click "Exit Kiosk" to return to the dashboard

## Automatic Startup

The kiosk system will automatically start on system boot. It will display the last active URL.

## License

MIT