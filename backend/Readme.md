A short description of the backend.

👉These are the following routes that are being used for the Project:

⭐ `/upload_image`

▶️ The `upload_iamge` route handles the operation of taking an image from the user on the front end.


⭐ `/perform-ocr`

▶️ The `/perform_ocr` will perform the operation of Optical Character Recognition on the provided image and display a summary of the text present in the image. 

▶️ We will be implementing the Mistral model for OCR on the image.


⭐ `/ragchat`

▶️ The `/ragchat` route will handle the RAG system that will enable the user to ask questions based on the documents or directories that are uploaded at the frontend. 

▶️ The Large Language Model that is used in the `ragchat/app.py` file is the Cohere Aya Expanse 8 billion model.


⭐ `/summarise`

▶️ The above route is mainly to create a summary of a large section of document that is provided by the user.

▶️ We have implemented the Aya Expanse model consisting of 32 billion parameters to handle summarisation.

▶️ Along with summarisation, since the Aya Model family consists of multi-lingual support, we have also included a feature that is able to handle the translation of text from a base language to a target language. 
