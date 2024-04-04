cd documentActionsLambda

aws lambda delete-function --function-name uploadHandler

cargo lambda build 

output=$(cargo lambda deploy uploadHandler --iam-role arn:aws:iam::058264179724:role/LambdaVPCAccessCustomPolicy)

arn_value=$(echo $output | grep -o 'arn:aws:lambda:[^ ]*' | head -n 1)

echo $arn_value

state="Pending"

# Loop until state is not "Pending"
while [ "$state" = "Pending" ]; do
    # Fetch the function's state using the AWS CLI
    state=$(aws lambda get-function --function-name "$arn_value" --query 'Configuration.State' --output text)
    
    # Check if the state is still "Pending"
    if [ "$state" = "Pending" ]; then
        echo "Function is still pending. Waiting..."
        # Wait for a bit before checking again
        sleep 10
    else
        echo "Function state is now $state."
    fi
done

env=$(aws lambda update-function-configuration \
    --function-name uploadHandler \
    --environment "Variables={AWS_BUCKET_NAME=pubsubrepochunkstore, KAFKA_REST_URL="https://on-gator-12164-us1-rest-kafka.upstash.io", KAFKA_USERNAME=b24tZ2F0b3ItMTIxNjQkQSGCr6tbeMgFdILFEIHbxS6q_g46UvM_OwrIU0d7vLM, KAFKA_PASSWORD=YTljNWExOTctOTdmZS00YWJmLTkwYWItZDliZjNjNDRmMzli}")


# cargo lambda invoke \
#   --remote \
#   --data-ascii \
#   '{"document_id": "1234567890abcdef", "chunks_keys": ["d.drawio.png"]}' $arn_value