import os
from os.path import join
import src 

from dotenv import load_dotenv

___env_location = join(src.curdir, '../.env')
load_dotenv(___env_location)

class Config:
    APP_HOST = os.getenv("APP_HOST", "127.0.0.1")
    APP_PORT = os.getenv("APP_PORT", "8700")
    APP_DEBUG = os.getenv("APP_PORT", True)
    IPFS_ID  = os.getenv("IPFS_ID", "")
    IPFS_SECRET  = os.getenv("IPFS_SECRET","")
    IPFS_ENDPOINT  = os.getenv("IPFS_ENDPOINT","")