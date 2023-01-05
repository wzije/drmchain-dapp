
import requests


class IPFS:

    __projectId = "2HLQVCRYTp1mvSFjZhErcumtT4C"
    __projectSecret = "185b74165b211e96cfc7b54554ac0360"
    __endpoint = "https://ipfs.infura.io:5001"
    # __endpoint = "https://wzije.infura-ipfs.io/ipfs"

    def upload(self, file) -> str:
        
        files = {
            'file': file,
        }
        
        response = requests.post(
            self.__endpoint + '/api/v0/add',
            files=files,
            auth=(self.__projectId, self.__projectSecret)
        )
        
        body = response.json()
        hash = body['Hash']
        
        return hash
    
    def fetch(self, hash) -> str:
        params = {
            'arg': hash
        }
        
        response = requests.post(
            self.__endpoint + '/api/v0/cat',
            params=params,
            auth=(self.__projectId, self.__projectSecret)
        )
        
        
        return response
