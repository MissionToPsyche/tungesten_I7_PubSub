import json
import os
import base64
import boto3
import requests
from fastcdc import fastcdc_py
import fossil_delta
from hashlib import sha256

s3_client = boto3.client('s3')

def chunkify_and_send(data, document_id, bucket_name, kafka_rest_url, kafka_topic, is_delta=False):
    hashed_chunks = list(fastcdc_py.fastcdc_py(data, 16384, 32768, 65536))
    chunk_objects = []

    for i, chunk in enumerate(hashed_chunks):
        chunk_hash = data.hash
        chunk_key = f"chunks/{chunk_hash}"
        chunk_size = data.length
        # Check if the chunk already exists on S3
        try:
            s3_client.head_object(Bucket=bucket_name, Key=chunk_key)
        except Exception as e:
            # If the chunk does not exist, upload it
            s3_client.put_object(Bucket=bucket_name, Key=chunk_key, Body=chunk.data)

        chunk_object = {
            "sequence": i,
            "s3_key": chunk_key,
            "hash": chunk_hash,
            "size": chunk_size,
            "is_delta": is_delta
        }
        chunk_objects.append(chunk_object)

    message = {
        "document_id": document_id,
        "chunks": chunk_objects
    }
    send_message_to_kafka(kafka_rest_url, kafka_topic, message, document_id)

def fetch_data_from_keys(keys, bucket_name):
    combined_data = bytearray()
    for key in keys:
        resp = s3_client.get_object(Bucket=bucket_name, Key=key)
        chunk_data = resp['Body'].read()
        combined_data.extend(chunk_data)
    return combined_data

def send_message_to_kafka(url, topic, message, key):
    full_url = f"{url}/produce/{topic}"
    # username = os.environ['KAFKA_USERNAME']
    # password = os.environ['KAFKA_PASSWORD']
    username = "b24tZ2F0b3ItMTIxNjQkQSGCr6tbeMgFdILFEIHbxS6q_g46UvM_OwrIU0d7vLM"
    password = "YTljNWExOTctOTdmZS00YWJmLTkwYWItZDliZjNjNDRmMzli"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + base64.b64encode(f"{username}:{password}".encode()).decode()
    }
    response = requests.post(full_url, headers=headers, data=json.dumps({"key": json.dumps(key), "value" : json.dumps(message)}))
    response.raise_for_status()

def calculate_delta(old_data, new_data):
    return fossil_delta.create_delta(old_data, new_data)

def lambda_handler(event, context):
    request_body = json.loads(event['body'])
    document_id = request_body['document_id']
    chunks_keys = request_body['chunks_keys']
    # bucket_name = os.environ['AWS_BUCKET_NAME']
    bucket_name = "pubsubrepochunkstore"
    # kafka_rest_url = os.environ['KAFKA_REST_URL']
    kafka_rest_url = "https://on-gator-12164-us1-rest-kafka.upstash.io"
    kafka_topic = "users"

    combined_data = fetch_data_from_keys(chunks_keys, bucket_name)
    chunkify_and_send(combined_data, document_id, bucket_name, kafka_rest_url, kafka_topic)
    print("done")
    return {
        'statusCode': 200,
        'body': json.dumps('Message sent to Kafka successfully!')
    }

def lambda_handler(event, context):
    request_body = json.loads(event['body'])
    document_id = request_body['document_id']
    old_chunks_keys = request_body['old_chunks_keys']
    new_chunks_keys = request_body['new_chunks_keys']
    bucket_name = "pubsubrepochunkstore"
    kafka_rest_url = "https://on-gator-12164-us1-rest-kafka.upstash.io"
    kafka_topic = "users"

    old_combined_data = fetch_data_from_keys(old_chunks_keys, bucket_name)
    new_combined_data = fetch_data_from_keys(new_chunks_keys, bucket_name)

    delta = calculate_delta(old_combined_data, new_combined_data)
    delta_size = len(delta)

    if delta_size > len(new_combined_data) * 0.5:
        # Chunkify the whole new file
        print("Chunkifying the whole new file")
        chunkify_and_send(new_combined_data, document_id, bucket_name, kafka_rest_url, kafka_topic)
    else:
        # Chunkify the delta
        print("Chunkifying the delta")
        chunkify_and_send(delta, document_id, bucket_name, kafka_rest_url, kafka_topic, is_delta=True)

    return {
        'statusCode': 200,
        'body': json.dumps('Operation completed successfully!')
    }
