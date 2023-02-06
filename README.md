# DRMChain DApp

<!-- INFORMASI -->

DRMChain DApp adalah contoh aplikasi yang mengimplementasi sistem Perlindungan Hak Cipta Buku Digital (PDF) berbasis blockchain secara sederhana.
<br>

## Fitur

- Katalog Buku
- Memposting Buku
- Detail Informasi Buku
- Detail Infromasi Permintaan dan Penerimaan Buku
- Permintaan Hak Kepemilikan Buku
- Penerimaan Hak Kepemilikian Buku
- Membaca Buku dengan PDF Viewer

<br/>

![Preview](./tmp/preview.png)

<!-- <p align="right">(<a href="#readme-top">back to top</a>)</p> -->
<br>

<!-- TABLE OF CONTENTS -->

## Daftar Isi

<ul>
    <li><a href="#fitur">Fitur</a></li>
    <li><a href="#arsitektur">Arsitektur</a></li>
    <li><a href="#kebutuhan-sistem">Kebutuhan Sistem</a></li>
    <li><a href="#prasyarat">Prasyarat</a></li>
    <li><a href="#instalasi-dan-menjalankan-aplikasi">Instalasi dan Menjalankan Aplikasi</a></li>
</ul>

</br>

<!-- ARCHITECTURE -->

## Arsitektur

Sistem ini terdiri dari dua buah aplikasi, yaitu: Main-App dan File-Proxy. Aplikasi Main-App adalah aplikasi utama yang digunakan untuk berkomunikasi dengan pengguna, melakukan enkripsi/dekripsi, berkomunikasi dengan aplikasi File-Proxy, serta berkomunikasi dengan Smart Contract. Sedangkan Aplikasi File-Proxy adalah aplikasi secara spesifik menangani proses watermark pada file dan berkomunikasi dengan cloud server IPFS.

<br/>

![Arsitektur](./tmp/architecture.png)

<br/>

<!-- requirement -->

## Kebutuhan Sistem

- Main-App
  - Truffle v5.6.2 (core: 5.6.2)
  - Ganache v7.4.4 (GUI)
  - Solidity v0.5.16 (solc-js)
  - Node v18.12.1
  - Npm v8.19.2 / yarn v1.22.19
  - Web3.js v1.7.4
  - Metamask Extension (Google Chrome)
- File-Proxy
  - Python v3.10.6
  - pip v22.2.2
  - Flask v2.2.2
  - virtualenv v20.17.1
  - Infura IPFS

<br/>

<!-- <p align="right">(<a href="#readme-top">back to top</a>)</p> -->

## Getting Started

## Prasyarat (OSX)

1.  Instal node js [download](https://nodejs.org/en/download/)
2.  install ganache gui [Download](https://trufflesuite.com/ganache)
3.  Setelah node js terinstall, install beberapa dependensi lain dengan menjalankan perintah berikut pada terminal:

    ```sh
    # periksa versi node
    node --version

    # install NPM
    npm install npm@8.19.2 -g

    # install Yarn (recommended)
    npm install --global yarn

    # install truffle
    npm install -g truffle

    # periksa versi truffle
    truffle --version
    ```

4.  Install Python3 [download](https://www.python.org/downloads/), atau dapat menggunakan brew (OSX) [instruksi](https://docs.python-guide.org/starting/install3/osx/)
5.  Setelah python3 terinstall, periksa versi python dan pip dengan menjalankan perintah berikut pada terminal:

    ```sh
    # periksa versi python
    python3 --version

    # periksa versi pip
    pip3 --version

    # install venv (optional)
    pip3 install virtualenv
    ```

6.  Clone Projek
7.  Struktur direktori apilkasi

    <img src="./tmp/dir_structure.png" width="225">

<br/>

## Instalasi dan Menjalankan Aplikasi

Selanjutnya jalankan semua aplikasi. Langkah-langkahnya sbb:

<br/>

### **Aplikasi Main-App**

Terdiri dari dua direktori, yaitu `client` dan `truffle`. Direktori `client` adalah aplikasi utama yang berisi fungsi dan UI (reactjs). Sedangkan direktori `truffle` digunakan untuk menulis kode kontrak (solidity) dan deployment ke jaringan ethereum. Berikut tahapan menjalankan aplikasi main-app:

1. Jalankan aplikasi `Ganache` lalu tekan tombol `quick start`. Dengan cara ini, data akan ter-reset apabila aplikasi `Ganache` di restart. Sebaliknya apabila tidak ingin data ter-reset, dapat memilih tombol `new workspace` [instruksi](https://trufflesuite.com/docs/ganache/how-to/workspaces/create-workspaces/).
2. Buka terminal kemudian masuk ke direktori `application > truffle`.

3. Install library

   ```sh
   # menggunakan npm
   npm install

   # menggunakan yarn
   yarn install
   ```

4. sebelum melakukan deploy, sesuaikan dulu variabel konfigurasi pada file `.env`

   ```env
   GANACHE_HOST = 127.0.0.1
   GANACHE_PORT = 7545
   GANACHE_NETWORK_ID = *
   ```

5. Deploy Kotrak

   ```sh
   # deploy kontrak pada jaringan development
   truffle migrate --network development
   ```

   Response ketika proses compile berhasil dilakukan

   ```sh
   > Network name:    'development'
   > Network id:      1337
   > Block gas limit: 6721975 (0x6691b7)

   1_deploy_book_factor.js
   =======================

   Replacing 'BookFactory'
   -----------------------
   > transaction hash:    0x11c47467a77c7a7f6a943e8d6af7a6a40ecbce03e6713cb406cf5066b1424eb5
   > Blocks: 0            Seconds: 0
   > contract address:    0xE851B4b5D81d4b1B69A26796D6C0eDdB67C5Cd78
   > block number:        31
   > block timestamp:     1675415737
   > account:             0x7cd48a55d8918B9B29886dFc6095b7238e2D2F4B
   > balance:             98.80112398
   > gas used:            2961314 (0x2d2fa2)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.05922628 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:          0.05922628 ETH

   Summary
   =======
   > Total deployments:   1
   > Final cost:          0.05922628 ETH
   ```

6. Masuk ke direktori `application > client`.
7. Install library

   ```sh
   # menggunakan npm
   npm install

   # menggunakan yarn
   yarn install
   ```

8. jalankan aplikasi

   ```sh
   # menggunakan npm
   npm run start

   # menggunakan yarn
   yarn start

   # sh file
   ./run.sh
   ```

   Tampilan jika aplikasi berhasil dijalankan

   ```sh
   Compiled successfully!

   You can now view truffle-client in the browser.

   Local:            http://localhost:3000
   On Your Network:  http://192.168.18.119:3000

   Note that the development build is not optimized.
   To create a production build, use yarn build.

   webpack compiled successfully
   Files successfully emitted, waiting for typecheck results...
   Issues checking in progress...
   No issues found.
   ```

9. Sampai disini aplikasi sudah jalan, selanjutnya buka browser (chrome is better) dan masuk ke alamat `http://localhost:3000`

<br/>

### **Aplikasi File-Proxy**

1. buka terminal baru, dan masuk ke direktori file-proxy.
2. install library

   ```sh
   # menggunakan virtual env (optional)
   python3 -m venv venv
   source venv/bin/activate

   # install library
   pip install -r requirements.txt
   ```

3.
