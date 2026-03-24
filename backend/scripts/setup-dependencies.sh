#!/bin/bash
set -e

echo "==== Setting up system dependencies ===="

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Detected Linux. Installing ffmpeg..."
    
    # Check if ffmpeg is already installed
    if ! command -v ffmpeg &> /dev/null; then
        if command -v apt-get &> /dev/null; then
            echo "Using apt-get..."
            apt-get update -qq
            apt-get install -y -qq ffmpeg
        elif command -v yum &> /dev/null; then
            echo "Using yum..."
            yum install -y ffmpeg
        else
            echo "WARNING: Could not detect package manager. Install ffmpeg manually."
            exit 1
        fi
    else
        echo "✓ ffmpeg already installed: $(ffmpeg -version | head -n1)"
    fi
    
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Detected macOS. Installing ffmpeg..."
    if ! command -v ffmpeg &> /dev/null; then
        if command -v brew &> /dev/null; then
            brew install ffmpeg
        else
            echo "WARNING: Homebrew not found. Install ffmpeg manually: brew install ffmpeg"
            exit 1
        fi
    else
        echo "✓ ffmpeg already installed: $(ffmpeg -version | head -n1)"
    fi
else
    echo "WARNING: Unsupported OS ($OSTYPE). Install ffmpeg manually."
    exit 1
fi

echo "==== Verifying ffmpeg installation ===="
ffmpeg -version | head -n1

echo "==== Setup complete ===="
