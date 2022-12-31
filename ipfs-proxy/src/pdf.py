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

    def __merge(self, input_pdf, watermark):
        output_pdf = PyPDF2.PdfWriter()

        # watermark first page
        for index in list(range(0, len(input_pdf.pages))):
            content_page = input_pdf.pages[index]
            mediabox = content_page.mediabox
            if (index == 0):
                content_page.merge_page(watermark)
                content_page.mediabox = mediabox
            output_pdf.add_page(content_page)

        # open output file
        output_doc = os.path.join(self.tmpdir, f"output-{uuid.uuid4()}.pdf")
        output_file = open(output_doc, 'wb')

        output_pdf.write(output_file)
        output_file.close()
        return output_doc

    # def encrypt_and_upload(self, metadata, file) -> str:

    #     # prepare and modify watermark file
    #     watermark = self.__generate_qrcode(metadata)

    #     # prepare input file / original file
    #     input_file = self.__storeOriginalDoc(file)
    #     input_pdf = PyPDF2.PdfReader(input_file)

    #     # prepare output file
    #     output_pdf = PyPDF2.PdfWriter()

    #     # watermark first page
    #     for index in list(range(0, len(input_pdf.pages))):
    #         content_page = input_pdf.pages[index]
    #         mediabox = content_page.mediabox
    #         if (index == 0):
    #             content_page.merge_page(watermark)
    #             content_page.mediabox = mediabox
    #         output_pdf.add_page(content_page)

    #     # open output file
    #     output_doc = os.path.join(self.tmpdir, f"output-{uuid.uuid4()}.pdf")
    #     output_file = open(output_doc, 'wb')
    #     output_pdf.write(output_file)

    #     # generate & encrypt
    #     output_token = util.compute_sha256(output_doc, metadata)
    #     output_pdf.encrypt(output_token)

    #     encrypted_doc = os.path.join(self.tmpdir, f"encrypted-{uuid.uuid4()}.pdf")

    #     with open(encrypted_doc, "wb") as file:
    #         output_pdf.write(file)

    #     # upload to ipfs
    #     with open(encrypted_doc, "rb") as file:
    #         fs = ipfs.IPFS()
    #         hash_file = fs.upload(file)

    #     input_file.close()
    #     output_file.close()

    #     self.___clearExistingFiles()

    #     return (hash_file, output_token)

    # def download_encrypted(self, hash_file, token):

    #     self.___clearExistingFiles()

    #     fs = ipfs.IPFS()
    #     response = fs.fetch(hash_file)

    #     save_path = os.path.join(self.tmpdir, f"response-encrypted-{uuid.uuid4()}.pdf")
    #     with open(save_path, 'wb') as file:
    #         file.write(response.content)

    #     file = open(save_path, 'rb')
    #     pdf = PyPDF2.PdfReader(file)
    #     if pdf.is_encrypted:
    #         pdf.decrypt(token)

    #     writer = PyPDF2.PdfWriter()
    #     for page in pdf.pages:
    #         writer.add_page(page)

    #     decrypted_path = os.path.join(self.tmpdir, f"response-decrypted-{uuid.uuid4()}.pdf")
    #     with open(decrypted_path, "wb") as f:
    #         writer.write(f)

    #     return decrypted_path

    def watermark_and_upload(self, metadata, file) -> str:

        # get watermark pdf
        watermark_path = self.__generate_qrcode(metadata)
        watermark_file = open(watermark_path, 'rb')
        watermark_pdf = PyPDF2.PdfReader(watermark_file)
        watermark_page = watermark_pdf.pages[0]
        watermark_page_scale = PyPDF2.Transformation().scale(sx=0.2, sy=0.2)
        watermark_page.add_transformation(watermark_page_scale)

        # get input pdf
        input_path = self.__store_input(file)
        input_file = open(input_path, 'rb')
        input_pdf = PyPDF2.PdfReader(input_file)

        # write output pdf
        output_pdf = PyPDF2.PdfWriter()

        for index in list(range(0, len(input_pdf.pages))):
            content_page = input_pdf.pages[index]
            mediabox = content_page.mediabox
            if (index == 0):
                content_page.merge_page(watermark_page)
                content_page.mediabox = mediabox
            output_pdf.add_page(content_page)

        output_doc = os.path.join(self.tmpdir, f"output-{uuid.uuid4()}.pdf")
        with open(output_doc, 'wb') as output_file:
            output_pdf.write(output_file)

        watermark_file.close()
        input_file.close()

        # upload to ipfs
        with open(output_doc, 'rb') as file:
            fs = IPFS()
            hash_file = fs.upload(file)

        # clear store files
        self.___clearExistingFiles()

        return hash_file

    def get_file(self, hash_file: str):

        # fetch file from ipfs
        fs = IPFS()
        response = fs.fetch(hash_file)

        return response.text

    def ___clearExistingFiles(self):
        for file_name in os.listdir(self.tmpdir):
            file = os.path.join(self.tmpdir, file_name)
            if os.path.isfile(file):
                print('Deleting file:', file)
                os.remove(file)
