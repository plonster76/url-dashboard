#!/bin/bash

# This script is used to start the kiosk system on Raspberry Pi boot

# Wait for network connection
sleep 10

# Start Chromium in kiosk mode
chromium-browser --kiosk --disable-restore-session-state --noerrdialogs --disable-infobars --no-first-run http://localhost:5173

# If you're using a production build, use this instead:
# chromium-browser --kiosk --disable-restore-session-state --noerrdialogs --disable-infobars --no-first-run http://localhost:4173