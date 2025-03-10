from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
from io import BytesIO  
from flask import request, jsonify
import json
from mistralai import Mistral

from ragchat.app import ragchat_pipeline, response, encode_image
from summarise.app import summarize_document, translate_text, load_document


app = Flask(__name__)
CORS(app)


# Route to summarize a document (file or directory)
@app.route("/summarize", methods=["POST"])
def summarize():
    file_path = request.files.get("file_path")

    try:
        if file_path:
            file_content = file_path.read()
            temp_file = BytesIO(file_content)  
            summary = summarize_document(load_document(temp_file))    

        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route to translate summarized text
@app.route("/translate", methods=["POST"])
def translate():
    data = request.json
    text = data.get("text")
    source_lang = data.get("source_lang")
    target_lang = data.get("target_lang")

    try:
        translated_text = translate_text(text, source_lang, target_lang)
        return jsonify({
            "translated_text": translated_text,
            "source_language": source_lang,
            "target_language": target_lang
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


UPLOAD_FOLDER = "data"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload-image", methods=["POST"])
def upload_image():
    """Route to handle image uploads from React frontend."""
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    return jsonify({"message": "Image uploaded successfully!", "file_path": file_path})

@app.route("/perform-ocr", methods=["POST"])
def perform_ocr():
    """Route to process OCR using Mistral API."""
    data = request.get_json()
    image_path = data.get("image_path")

    if not image_path or not os.path.exists(image_path):
        return jsonify({"error": "Invalid or missing image path"}), 400

    base64_image = encode_image(image_path)
    if not base64_image:
        return jsonify({"error": "Failed to encode image"}), 500

    try:
        ocr_response = client.ocr.process(
            model="mistral-ocr-latest",
            document={
                "type": "image_url",
                "image_url": f"data:image/jpeg;base64,{base64_image}"
            }
        )
        return jsonify({"message": "OCR processed successfully!", "ocr_result": ocr_response})
    except Exception as e:
        return jsonify({"error": f"OCR processing failed: {str(e)}"}), 500


@app.route('/ragchat', methods=['POST'])
def query():
    try:
        data = request.json
        query = data.get('query')
        if not query:
            return jsonify({'error': 'Query Not Provided'}), 400
        answer = response(query, ragchat_chain)
        return jsonify({'answer': answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

if __name__ == '__main__':
    app.run(debug=True, port=8888)
    

