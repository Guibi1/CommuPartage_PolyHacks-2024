import functions_framework
import io
import requests
import json
from google.cloud import storage
import os
import MySQLdb
from dotenv import load_dotenv
import re
import face_recognition
import base64
from openai import OpenAI


def encode_image(filelink):
    with open(filelink, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def sameface(filepath1,filepath2):
    image_1 = face_recognition.load_image_file(filepath1)
    image_2 = face_recognition.load_image_file(filepath2)

    encoding_1 = face_recognition.face_encodings(image_1)[0]
    encoding_2 = face_recognition.face_encodings(image_2)[0]
    results = face_recognition.compare_faces([encoding_1], encoding_2)
    return results[0]



    
def getGPTclassification(bs64, object_name):

    in_image = {"inimage": True}
    OpenAI.api_key = "OPEN_AI_KEY"
    client = OpenAI(
        api_key="OPEN_AI_KEY")

    
    response = client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[
            {
                "role": "system",
                "content": f"you are lookybot, an AI assistant based on gpt-4-vision, an OpenAI model specifically trained on computer vision tasks for a classification app. You will tell me if a {object_name} is in the following image"
            },
            {
                "role": "user",
                "content": ["This is the object",
                            {"type": "image_url", "image_url": {
                                "url": f"data:image/jpeg;base64,{bs64}"}}
                            ],
            }
        ],
        max_tokens=300,
    )
    print(response.choices[0].message.content)
    response2 = client.chat.completions.create(
        model="gpt-4-1106-preview",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": f"You will transform this text into a json format like this {in_image} with only TRUE or FALSE as input"
            },
            {
                "role": "user",
                "content": response.choices[0].message.content,
            }
        ],
        max_tokens=300,
    )


    return json.loads(response2.choices[0].message.content)

# Function to download a blob from Google Cloud Storage
def download_blob(bucket_name, source_blob_name, destination_file_name):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)
    print(f"Blob {source_blob_name} downloaded to {destination_file_name}.")

    

@functions_framework.cloud_event
def start_transaction(cloud_event):

    load_dotenv()
    

    connection = MySQLdb.connect(
        host=os.getenv("PLANETSCALE_DB_HOST"),
        user=os.getenv("PLANETSCALE_DB_USERNAME"),
        passwd=os.getenv("PLANETSCALE_DB_PASSWORD"),
        db=os.getenv("PLANETSCALE_DB"),
        
    )

    data = cloud_event.data
    
    bucket_name = data["bucket"]
    source_blob_name = data["name"]
    destination_file_name = "/tmp/end_transaction.jpg"  # Temporary file path

    print(bucket_name)
    download_blob(bucket_name, source_blob_name, destination_file_name)
    
    try:

        # Create a cursor to interact with the database
        cursor = connection.cursor()

        # The known cvid value
        transaction_id = source_blob_name  # Replace with the actual cvid value

        # Prepare the SQL query to fetch questionid
        query = "SELECT receiver_id FROM transactions WHERE id = %s"
        
        # Execute the query with the known cvid
        cursor.execute(query, (transaction_id,))
        result = cursor.fetchone()
        blobfetch = result[0]

        # Prepare the SQL query to fetch questionid
        query = "SELECT object_id FROM transactions WHERE id = %s"
        
        # Execute the query with the known cvid
        cursor.execute(query, (transaction_id,))
        result2 = cursor.fetchone()
        obj_id = result2[0]

        # Prepare the SQL query to fetch questionid
        query = "SELECT name FROM objects WHERE id = %s"
        
        # Execute the query with the known cvid
        cursor.execute(query, (obj_id,))
        result3 = cursor.fetchone()
        obj_name = result3[0]

        print(blobfetch)
        if result:
            print("ID:", result[0])
            output_file_name = f"/tmp/lenderphoto.jpg"
        else:
            print("No record found for id:", transaction_id)
            
    except MySQLdb.Error as e:
        print("MySQL Error:", e)

    download_blob("commupartage_user_images" , blobfetch, output_file_name)

    verify_boolean = sameface(output_file_name,destination_file_name)

    image_encoded = encode_image(destination_file_name)

    print(obj_name)
    resultfinal= getGPTclassification(image_encoded,obj_name)
    print(resultfinal)



    try:
        if verify_boolean == True and resultfinal["inimage"]:
            print("LENDER")
            query = "UPDATE transactions SET active = TRUE WHERE id = %s"
            cursor.execute(query, (transaction_id,))
            connection.commit()
        else:
            print("NOT LENDER")


        
    except MySQLdb.Error as e:
        print("MySQL Error:", e)
        

