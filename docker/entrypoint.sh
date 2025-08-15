#!/bin/bash

# Change to the home directory of the container
cd /home/container || exit 1

# Set the timezone
export TZ=UTC

# Get the internal IP address
export INTERNAL_IP=$(ip route get 1 | awk '{print $NF; exit}')

# Replace startup variables
PARSED=$(echo -e ${STARTUP} | sed -e 's/{{/${/g' -e 's/}}/}/g')

# Run the main process
eval ${PARSED}

