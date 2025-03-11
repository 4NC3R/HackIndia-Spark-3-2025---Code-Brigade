import os 
import json
import base64
import numpy as np
from datetime import datetime 
from dotenv import load_dotenv 
from langchain_cohere import ChatCohere, CohereEmbeddings
from langchain_core.prompts import PromptTemplate 
from langchain.chains.question_answering import load_qa_chain 
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader, Docx2txtLoader, TextLoader, CSVLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter 
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA 
from langchain.memory import ConversationBufferMemory 
from pypdf import PdfReader
import sys
from unicodedata import category

memory = ConversationBufferMemory(memory_key="chat_history",
        return_messages=True,
        input_key="query",  
        output_key="result")
api_key = 'sApb7nP6OfEYkQHNUpqprz5Srck5c7ZOtETachC0'
model = ChatCohere(cohere_api_key=api_key, model_name='c4ai-aya-expanse-8b', temperature=0.5)
embeddings = CohereEmbeddings(cohere_api_key=api_key, model='embed-multilingual-v2.0')

def load_and_process(path):
    """
    Loads documents from a directory or a single file.
    """
    documents = []

    # Check if the path is a file or directory
    if os.path.isfile(path):  # If a single file is given
        files = [path]
    elif os.path.isdir(path):  # If a directory is given
        files = [os.path.join(path, file) for file in os.listdir(path)]
    else:
        raise ValueError(f"Invalid file or directory path: {path}")

    # Load each file
    for file_path in files:
        if not os.path.isfile(file_path):
            print(f"Skipping {file_path} - Not a valid file.")
            continue

        try:
            if file_path.endswith(".doc") or file_path.endswith(".docx"):
                loader = Docx2txtLoader(file_path)
            elif file_path.endswith(".pdf"):
                loader = PyPDFLoader(file_path)
                #loader = DirectoryLoader(file_path,glob="*.pdf",show_progress=True,loader_cls=PyPDFLoader)
            elif file_path.endswith(".csv"):
                loader = CSVLoader(file_path)
                #loader = CSVLoader(file_path, csv_args={"delimiter": ",", "quotechar": '"'})
            elif file_path.endswith(".txt") or file_path.endswith(".md"):
                loader = TextLoader(file_path,encoding="utf-8")
                # loader = DirectoryLoader("./new_articles/", glob="./*.txt",   loader_cls=TextLoader)
            else:
                print(f"Skipping {file_path} - Unsupported file format.")
                continue

            documents.extend(loader.load())  # Extract and store content

        except Exception as e:
            print(f"Error loading {file_path}: {str(e)}")  # Catch errors

    if not documents:
        raise ValueError("No valid documents found!")

    return documents

def split_text(documents):
    text_split = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    split_docs = text_split.split(documents)
    return split_docs


def vectordb_info(docs):
    vector_store = Chroma.from_documents(
        docs,
        embedding=embeddings,
        persist_directory='./vector_store',
    )
    return vector_store

def ragchat(vector_store):
    template = """You are an AI-powered Document Search Assistant. Your goal is to assist the user by answering their query based on the provided document context.  

1. Carefully analyze the user’s query and extract relevant information from the provided document.  
2. If the answer is present in the document, provide a **clear, concise, and informative response**.  
3. Include the **document heading** in your response to help the user identify the source of information.  
4. If the document does not contain a relevant answer, politely respond with:  
   *"I'm sorry, but I couldn't find the information in this document. You may refer to other related documents for more details."*  
5. If similar documents exist, suggest them to the user.  
        {context}
        Question: {question}
        Helpful Answer:
"""
    QA_PROMPT = PromptTemplate.from_template(template)
    qa_chain = RetrievalQA.from_chain_type(
        llm = model,
        chain_type='stuff',
        retriever = vector_store.as_retriever(
            search_kwargs={'k': 1}
        ),
        return_source_documents=True,
        chain_type_kwargs={'prompt': QA_PROMPT, 'verbose': True},
        memory=memory 
    )
    return qa_chain

def response(question, qa_chain):
    try:
        result = qa_chain({'query': question})
        response = result['result']
        return response
    except Exception as e:
        return f"An Error has occured: {str(e)}"
    

def ragchat_pipeline(document_sources):
    processed_docs = load_and_process(document_sources)
    vector_store = vectordb_info(processed_docs)
    ragchat_chain = ragchat(vector_store)
    return ragchat_chain

def encode_image(image_path):
    """Encode the image to base64."""
    try:
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    except FileNotFoundError:
        return None
    except Exception as e:
        return None


# Testing this file for functionality
file = "C:/Users/Samuel Mesquita/Downloads/CV-Bu6JGepv.pdf"
ragchat_chain = ragchat_pipeline(file)
new_response = response("What did I ask previously based on the given doc?", ragchat_chain)
print(new_response)
