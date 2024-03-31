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
    hashed_chunks = list(fastcdc_py.fastcdc_py(data, 16384, 32768, 65536, True, sha256))
    chunk_objects = []

    for i, chunk in enumerate(hashed_chunks):
        chunk_hash = chunk.hash
        chunk_key = f"chunks/{chunk_hash}"
        chunk_size = chunk.length
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
