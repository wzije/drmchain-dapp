import hashlib
import os

basedir = os.path.abspath(os.path.dirname(__file__))

def compute_sha256(file_name, token):
    encoded = token.encode()
    hash_sha256 = hashlib.sha256(encoded)
    with open(file_name, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_sha256.update(chunk)

    return hash_sha256.hexdigest()
