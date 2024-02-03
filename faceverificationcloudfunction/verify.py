import functions_framework
import io
import requests
import fitz
import json
from google.cloud import storage
import os
import MySQLdb
from dotenv import load_dotenv
import re
import face_recognition

def sameface(filepath1,filepath2):
    known_image = face_recognition.load_image_file(filepath1)
    unknown_image = face_recognition.load_image_file(filepath2)

    biden_encoding = face_recognition.face_encodings(known_image)[0]
    unknown_encoding = face_recognition.face_encodings(unknown_image)[0]
    results = face_recognition.compare_faces([biden_encoding], unknown_encoding)

# Function to download a blob from Google Cloud Storage
def download_blob(bucket_name, source_blob_name, destination_file_name):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)
    print(f"Blob {source_blob_name} downloaded to {destination_file_name}.")

def upload_blob(bucket_name, source_file_name, destination_blob_name):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(source_file_name)
    print(f"File {source_file_name} uploaded to {destination_blob_name}.")

@functions_framework.cloud_event
def return_item(cloud_event):
    data = cloud_event.data
    load_dotenv()
    connection = MySQLdb.connect(
        host=os.getenv("DATABASE_HOST"),
        user=os.getenv("DATABASE_USERNAME"),
        passwd=os.getenv("DATABASE_PASSWORD"),
        db=os.getenv("DATABASE"),
        
    )


    bucket_name = data["bucket"]
    source_blob_name = data["name"]
    destination_file_name = "/tmp/my_downloaded_file.pdf"  # Temporary file path
    download_blob(bucket_name, source_blob_name, destination_file_name)
    
    try:

        # Create a cursor to interact with the database
        cursor = connection.cursor()

        # The known cvid value
        known_cvid = source_blob_name  # Replace with the actual cvid value

        # Prepare the SQL query to fetch questionid
        query = "SELECT questions_file FROM users WHERE cv_file = %s"
        
        # Execute the query with the known cvid
        cursor.execute(query, (known_cvid,))
        result = cursor.fetchone()


        query = "SELECT desired_position FROM users WHERE cv_file = %s"
        
        # Execute the query with the known cvid
        cursor.execute(query, (known_cvid,))
        desiredPosition = (cursor.fetchone())[0]

        query = "UPDATE users SET step = 'loading' WHERE cv_file = %s"
        cursor.execute(query, (known_cvid,))
        connection.commit()
        print("SET TO LOADING")

        if result:
            print("Question ID:", result[0])
            output_file_name = f"/tmp/{result}.json"

        

        else:
            print("No record found for cvid:", known_cvid)
            if re.search(r"\.pdf$", source_blob_name):
                new_blob_name = re.sub(r'\.pdf$', '.json', source_blob_name)
                output_file_name = f"/tmp/{new_blob_name}"
            else:
                output_file_name = f"/tmp/{source_blob_name}.json"
        


    except MySQLdb.Error as e:
        print("MySQL Error:", e)
        # Download the file from GCS
        if re.search(r"\.pdf$", source_blob_name):
            new_blob_name = re.sub(r'\.pdf$', '.json', source_blob_name)
            output_file_name = f"/tmp/{new_blob_name}"
        else:
            output_file_name = f"/tmp/{source_blob_name}.json"

    

    # Read and process the PDF file
    text = get_text_from_pdf(destination_file_name)

    inputgpt = "This is my desired position: " + desiredPosition + ". This is my cv: " + text
    output = getQuestionsFromPdf(inputgpt)

    with open(output_file_name, "w") as outfile:
        json.dump(output, outfile)
    
    # Upload the output file to a different bucket
    upload_bucket_name = "pulse-interview-questions"  # Replace with your destination bucket name
    if re.search(r"\.pdf$", source_blob_name):
        new_blob_name = re.sub(r'\.pdf$', '', source_blob_name)
        upload_blob(upload_bucket_name, output_file_name, f"{new_blob_name}")
    else:
        upload_blob(upload_bucket_name, output_file_name, f"{source_blob_name}")
    

    print(f"Output uploaded to bucket {upload_bucket_name}")

    try:
        # Create a cursor to interact with the database
        cursor = connection.cursor()
        # The known cvid value
        known_cvid = source_blob_name  # Replace with the actual cvid value
        # Prepare the SQL query to fetch questionid
        query = "UPDATE users SET step = 'one' WHERE cv_file = %s"
        cursor.execute(query, (known_cvid,))
        connection.commit()
        print("SET TO ONE")

        
    except MySQLdb.Error as e:
        print("MySQL Error:", e)
        

