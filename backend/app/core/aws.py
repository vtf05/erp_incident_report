import boto3
import json
import os
from datetime import datetime
from botocore.exceptions import ClientError
from app.core.config import settings

class S3Service:
    def __init__(self):
        self.bucket_name = settings.S3_BUCKET_NAME
        self.local_fallback_dir = "data/payload_backups"
        os.makedirs(self.local_fallback_dir, exist_ok=True)
        
        try:
            self.s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION
            )
            self.enabled = True
        except Exception as e:
            print(f"S3 Client initialization failed: {e}. Falling back to local mode.")
            self.enabled = False

    def upload_payload(self, folder: str, filename: str, payload: dict):
        """
        Uploads a JSON payload to a specific folder in S3 or local fallback.
        """
        key = f"{folder}/{filename}.json"

        try:
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=key,
                Body=json.dumps(payload, default=str),
                ContentType='application/json'
            )
            return key
        except ClientError as e:
            print(f"S3 Upload failed: {e}. Saved to local fallback.")
            return f"local://{key}"

    def list_payloads(self, prefix: str = ""):
        """
        Lists all payloads in S3, or local fallback if S3 is unavailable.
        """
        payloads = []
        print(self.bucket_name, prefix)
        
        # 1. Try S3
        if self.enabled:
            try:
                response = self.s3_client.list_objects_v2(
                    Bucket=self.bucket_name,
                    Prefix=prefix
                )
                if 'Contents' in response:
                    for obj in response['Contents']:
                        payloads.append({
                            "key": obj['Key'],
                            "last_modified": obj['LastModified'].isoformat(),
                            "size": obj['Size'],
                            "source": "S3"
                        })
            except ClientError as e:
                print(f"S3 List failed: {e}. Showing local payloads.")

        # 2. Add/Fallback to Local
        local_path = os.path.join(self.local_fallback_dir, prefix)
        if os.path.exists(local_path):
            for root, _, files in os.walk(local_path):
                for file in files:
                    if file.endswith(".json"):
                        rel_dir = os.path.relpath(root, self.local_fallback_dir)
                        key = os.path.join(rel_dir, file).replace("\\", "/")
                        stat = os.stat(os.path.join(root, file))
                        payloads.append({
                            "key": key,
                            "last_modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                            "size": stat.st_size,
                            "source": "Local"
                        })

        return sorted(payloads, key=lambda x: x['last_modified'], reverse=True)

    def get_payload(self, key: str):
        """
        Retrieves a payload from S3 or local fallback.
        """
        # Try local first (faster/fallback)
        local_file = os.path.join(self.local_fallback_dir, key)
        if os.path.exists(local_file):
            with open(local_file, "r") as f:
                return json.load(f)

        if not self.enabled:
            return None

        try:
            response = self.s3_client.get_object(
                Bucket=self.bucket_name,
                Key=key
            )
            return json.loads(response['Body'].read().decode('utf-8'))
        except ClientError:
            return None

s3_service = S3Service()
