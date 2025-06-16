from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
from io import BytesIO  
import json
from mistralai import Mistral
from ragchat.app import ragchat_pipeline, response, encode_image
from summarise.app import summarize_document, translate_text, load_document

api_key = os.environ.get("MISTRAL_API_KEY", "")
client = Mistral(api_key=api_key) if api_key else None

app = Flask(__name__)
# Enable CORS for all routes and domains
CORS(app, resources={r"/*": {"origins": "*"}})


# Route to summarize a document (file or directory)
@app.route("/summarize", methods=["POST"])
def summarize():
    if "file_path" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
        
    file_path = request.files.get("file_path")

    try:
        if file_path:
            file_content = file_path.read()
            temp_file = BytesIO(file_content)  
            summary = summarize_document(load_document(temp_file))    

        return jsonify({"summary": summary})
    except Exception as e:
        print(f"Error in summarize: {str(e)}")
        return jsonify({"error": str(e)}), 500


# Route to translate summarized text
@app.route("/translate", methods=["POST"])
def translate():
    data = request.json
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400
        
    text = data.get("text")
    source_lang = data.get("source_lang")
    target_lang = data.get("target_lang")
    
    if not all([text, source_lang, target_lang]):
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        translated_text = translate_text(text, source_lang, target_lang)
        return jsonify({
            "translated_text": translated_text,
            "source_language": source_lang,
            "target_language": target_lang
        })
    except Exception as e:
        print(f"Error in translate: {str(e)}")
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
    if not client:
        return jsonify({"error": "Mistral API key not configured"}), 500
        
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
        print(f"Error in perform_ocr: {str(e)}")
        return jsonify({"error": f"OCR processing failed: {str(e)}"}), 500


@app.route('/ragchat', methods=["POST"])
def query():
    print("Received ragchat request")
    try:
        # Check if file is uploaded
        ragchat_chain = None
        if "file_path" in request.files and request.files["file_path"]:
            file_path = request.files.get("file_path")
            print(f"Processing file: {file_path.filename}")
            file_content = file_path.read()
            temp_file = BytesIO(file_content)
            print("Creating ragchat pipeline") 
            ragchat_chain = ragchat_pipeline(temp_file) 
        
        # Get query from form
        query = request.form.get("query")
        print(f"Query received: {query}")
        
        if not query:
            return jsonify({'error': 'Query Not Provided'}), 400
            
        if not ragchat_chain:
            return jsonify({'error': 'No document provided and no existing chain available'}), 400
        
        print("Processing response")    
        answer = response(query, ragchat_chain)
        print(f"Answer generated: {answer[:100]}...")
        return jsonify({'answer': answer})
    except Exception as e:
        print(f"Error in ragchat: {str(e)}")
        return jsonify({"error": str(e)}), 500
    

if __name__ == '__main__':
    print("Starting Flask app on port 8888")
    app.run(debug=True, port=8888, host='0.0.0.0')