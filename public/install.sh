#!/bin/bash

# Installation script for Raspberry Pi Kiosk System

echo "Installing Raspberry Pi Kiosk System..."

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install required packages
sudo apt-get install -y chromium-browser xdotool unclutter

# Create autostart directory if it doesn't exist
mkdir -p ~/.config/autostart

# Create autostart desktop file
cat > ~/.config/autostart/kiosk.desktop << EOF
[Desktop Entry]
Type=Application
Name=Kiosk
Exec=/bin/bash /home/pi/kiosk/autostart.sh
X-GNOME-Autostart-enabled=true
EOF

# Make scripts executable
chmod +x /home/pi/kiosk/autostart.sh

echo "Installation complete!"
echo "Please reboot your Raspberry Pi to start the kiosk system."