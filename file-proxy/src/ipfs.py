
import requests
from src.config import Config


class IPFS:

    __ipfsId = Config.IPFS_ID
    __ipfsSecret = Config.IPFS_SECRET
    __ipfsEndpoint = Config.IPFS_ENDPOINT

    def upload(self, file) -> str:
        
        files = {
            'file': file,
        }
        
        response = requests.post(
            self.__ipfsEndpoint + '/api/v0/add',
            files=files,
            auth=(self.__ipfsId, self.__ipfsSecret)
        )
        
        body = response.json()
        hash = body['Hash']
        
        return hash
    
    def fetch(self, hash) -> str:
        params = {
            'arg': hash
        }
        
        response = requests.post(
            self.__ipfsEndpoint + '/api/v0/cat',
            params=params,
            auth=(self.__ipfsId, self.__ipfsSecret)
        )
        
        
        return response
