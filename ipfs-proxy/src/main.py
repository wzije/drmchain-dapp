from flask import request, jsonify
from src import app
from src.pdf import PDF

# Note: anggap semua sukses, error biarlah

@app.route("/")
def hello_world():
    return "<p>File Proxy!</p>"


@app.route("/upload", methods=['POST'])
def watermark():
    metadata = request.form['metadata']
    file = request.files['document']

    pdf = PDF()
    hash_file = pdf.watermark_and_upload(metadata, file)

    return jsonify(hash=hash_file)

# apapun yang dilakukan, nampaknya file tidak bisa jika tidak di ekspose pada pengguna,
# solusinya (sementara) :
# 1. percaya pada owner karena dia sudah beli
# 2. lacak pemilik terakhir file ini
# 3. pastikan pengguna asli dengan watermark (ini masih bisa di improve)
# 4. semua prosedur diluar sistem dapat diserahkan kepada penegak hukum (masih bisa diimprove dengan membuat fitur pelaporan)
# 5. poin 4 dapat dilakukan dengan melacak melalui blockchain

@app.route("/get", methods=['POST'])
def get_file():
    hash_file = request.get_json()['hash']

    pdf = PDF()
    path = pdf.get_file(hash_file)
    return path
    # return send_file(path,
    #                  mimetype='application/pdf',
    #                  download_name=f"export.pdf")
