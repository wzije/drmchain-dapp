import base64
from io import BytesIO
import os
import qrcode
import PyPDF2
from PIL import Image
import uuid

from src.ipfs import IPFS


class PDF:

    basedir = os.path.abspath(os.path.dirname(__file__))
    tmpdir = os.path.join(basedir, "../tmp")

    def __store_input(self, file):
        file_path = os.path.join(self.tmpdir, f"original-{uuid.uuid4()}.pdf")
        file.save(file_path)
        return file_path

    def __generate_qrcode(self, metadata):
        watermark_path = os.path.join(
            self.tmpdir, f"watermark-{uuid.uuid4()}.pdf")
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(metadata)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        type(img)
        converted = img.convert('RGB')
        converted.save(watermark_path)

        return watermark_path

    def watermark_and_upload(self, metadata, file) -> str:

        # generate qrcode dari data dan disimpan dalam format pdf
        watermark_path = self.__generate_qrcode(metadata)

        # membuka dan mengekstrak watermark file
        watermark_file = open(watermark_path, 'rb')
        watermark_pdf = PyPDF2.PdfReader(watermark_file)
        watermark_page = watermark_pdf.pages[0]
        watermark_page_scale = PyPDF2.Transformation().scale(sx=0.2, sy=0.2)
        watermark_page.add_transformation(watermark_page_scale)

        # menyimpan file pdf utama dari client
        input_path = self.__store_input(file)
        # membuka dan membaca file utama
        input_file = open(input_path, 'rb')
        input_pdf = PyPDF2.PdfReader(input_file)

        # mempersiapkan pembuatan file pdf baru
        output_pdf = PyPDF2.PdfWriter()

        # proses ekstraksi dan penggabungan watermark ke file utama
        for index in list(range(0, len(input_pdf.pages))):
            content_page = input_pdf.pages[index]
            mediabox = content_page.mediabox
            if (index == 0):
                content_page.merge_page(watermark_page)
                content_page.mediabox = mediabox
            output_pdf.add_page(content_page)

        # mempersiapkan path hasil penggabungan file
        output_doc = os.path.join(self.tmpdir, f"output-{uuid.uuid4()}.pdf")
        # menyimpan hasil penggabungan dokumen ke alamat penyimpanan
        with open(output_doc, 'wb') as output_file:
            output_pdf.write(output_file)

        # stop dan bersihkan memori yang digunakan dalam proses pengolahan file
        watermark_file.close()
        input_file.close()

        # mengunggah file hasil gabungan ke cloud storage IFFS (infura)
        with open(output_doc, 'rb') as file:
            cloud = IPFS()
            hash_file = cloud.upload(file)

        # bersihkan file dalam storage
        self.___clearExistingFiles()

        # mengembalikan data hash_file dari ipfs
        return hash_file

    def get_file(self, hash_file: str):

        # fetch file from ipfs
        fs = IPFS()
        response = fs.fetch(hash_file)

        return response.content

    def ___clearExistingFiles(self):
        for file_name in os.listdir(self.tmpdir):
            file = os.path.join(self.tmpdir, file_name)
            if os.path.isfile(file):
                print('Deleting file:', file)
                os.remove(file)
