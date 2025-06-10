#!/bin/bash
echo "Setting up Tech Icons Collection..."
echo

echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies. Make sure Node.js is installed."
    exit 1
fi

echo
echo "Generating preview..."
node generate-preview.js

if [ $? -ne 0 ]; then
    echo "Error: Failed to generate preview."
    exit 1
fi

echo
echo "Setup completed successfully!"
echo "You can now open preview.html in your browser to see all icons."
