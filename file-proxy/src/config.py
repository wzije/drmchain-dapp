import os
from os.path import join
import src 

from dotenv import load_dotenv

___env_location = join(src.curdir, '../.env')
load_dotenv(___env_location)

class Config:
    IPFS_ID  = os.getenv("IPFS_ID")
    IPFS_SECRET  = os.getenv("IPFS_SECRET")
    IPFS_ENDPOINT  = os.getenv("IPFS_ENDPOINT")