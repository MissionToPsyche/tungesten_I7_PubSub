import json
import boto3
import hashlib
from hashlib import sha256
from fastcdc.fastcdc_py import fastcdc_py as fastcdc

# Initialize the S3 client
s3_client = boto3.client('s3')

def fetch_and_combine_chunks(bucket_name, chunks_keys):
    """
    Fetches each chunk specified by chunks_keys from S3,
    combines them into a single bytes object, and returns it.
    """
    combined_data = bytearray()
    for key in chunks_keys:
        resp = s3_client.get_object(Bucket=bucket_name, Key=key)
        chunk_data = resp['Body'].read()
        combined_data.extend(chunk_data)
    return bytes(combined_data)

def calculate_hash(data):
    """
    Calculates and returns the SHA-256 hash of the given data.
    """
    return hashlib.sha256(data).hexdigest()

def chunk_and_hash_data(data, min_size=16384, avg_size=32768, max_size=65536):
    """
    Chunks the given data using FastCDC and calculates a hash for each chunk.
    Prints details about each chunk.
    """
    data = bytearray(data)
    print(len(data))
    chunks = fastcdc(data, min_size, avg_size, max_size, True, sha256)
    for i, chunk in enumerate(chunks):
        chunk_data = data[chunk.offset:chunk.offset + chunk.length]
        if chunk.data == chunk_data:
            print(f"Chunk {i} data matches")
        chunk_hash = calculate_hash(chunk_data)
        print(f"Chunk {i}: Offset={chunk.offset}, Length={chunk.length}, Hash={chunk.hash}")

def lambda_handler(event, context):
    # Parse the event body
    request_body = json.loads(event['body'])
    document_id = request_body['document_id']
    chunks_keys = request_body['chunks_keys']
    bucket_name = "pubsubrepochunkstore"

    # Fetch and combine chunks from S3
    combined_file_content = fetch_and_combine_chunks(bucket_name, chunks_keys)

    # Perform FastCDC chunking and hashing on the combined file content
    chunk_and_hash_data(combined_file_content)

    return {
        'statusCode': 200,
        'body': json.dumps('Processed file successfully')
    }

# Example event for testing locally (replace with actual event in production)
if __name__ == "__main__":
    mock_event = {
        "body": json.dumps({
            "document_id": "1234567890abcdef",
            "chunks_keys": [
                "chunks/Assignment_2-Swapnil Mukeshbhai Chadotra.pdf-part-1",
                "chunks/Assignment_2-Swapnil Mukeshbhai Chadotra.pdf-part-2",
                "chunks/Assignment_2-Swapnil Mukeshbhai Chadotra.pdf-part-3",
                "chunks/Assignment_2-Swapnil Mukeshbhai Chadotra.pdf-part-4",
                "chunks/Assignment_2-Swapnil Mukeshbhai Chadotra.pdf-part-5"
            ]
        })
    }
    lambda_handler(mock_event, None)
