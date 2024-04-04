#!/bin/bash

# Define Docker image name
DOCKER_IMAGE_NAME="lambda-build-env"
cd lambda
# Define your AWS Lambda function zip file name
LAMBDA_ZIP="lambda.zip"

# Build Docker image
echo "Building Docker image for compiling dependencies..."
docker build -t $DOCKER_IMAGE_NAME .

# Create a Docker container from the image and copy the compiled code out
echo "Creating Docker container and compiling dependencies..."
docker run --name lambda-build-container $DOCKER_IMAGE_NAME

# Copy the resulting zip file from the container to the host
echo "Copying compiled Lambda function package to host..."
docker cp lambda-build-container:/$LAMBDA_ZIP .

# Cleanup: Remove the Docker container
echo "Cleaning up..."
docker rm lambda-build-container

echo "Lambda function package is ready: $LAMBDA_ZIP"

l=$(aws lambda update-function-code --function-name documentUploadHandler --zip-file fileb://$LAMBDA_ZIP)

docker rmi -f $DOCKER_IMAGE_NAME

