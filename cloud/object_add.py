import functions_framework
import io
import requests
import json
from google.cloud import storage
import os
import MySQLdb
from dotenv import load_dotenv
import re
import base64
from openai import OpenAI

def encode_image(filelink):
    with open(filelink, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')


# Function to download a blob from Google Cloud Storage
def download_blob(bucket_name, source_blob_name, destination_file_name):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)
    print(f"Blob {source_blob_name} downloaded to {destination_file_name}.")

    
def getGPTclassification(bs64):

    cat_format = {"category": "tools",
                  "name": "chainsaw"}
    cat_list = "Tools & Equipment, Electronics & Gadgets, Entertainment & Media, Sports & Outdoor Gear, Home & Kitchen Appliances, Toys & Games, Arts & Crafts Supplies, Gardening & Landscaping Tools, Health & Wellness Devices, Office & School Supplies."
    OpenAI.api_key = "OPEN_AI_KEY"
    client = OpenAI(
        api_key="OPEN_AI_KEY")

    
    response = client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[
            {
                "role": "system",
                "content": f"you are lookybot, an AI assistant based on gpt-4-vision, an OpenAI model specifically trained on computer vision tasks for a classification app. You will tell me what category the object is a part of and what the object, example hammer and tool. The categories is from this list: "  + cat_list
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

    response2 = client.chat.completions.create(
        model="gpt-4-1106-preview",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": f"You will transform this text into a json format like this {cat_format}, maximum 2 words for the name of item, category is from this list: " + cat_list,
            },
            {
                "role": "user",
                "content": response.choices[0].message.content,
            }
        ],
        max_tokens=300,
    )


    return json.loads(response2.choices[0].message.content)



@functions_framework.cloud_event
def image_input(cloud_event):

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
    print("test 1")
    image_encoded = encode_image(destination_file_name)
    print("test 2")
    result = getGPTclassification(image_encoded)
    print("test 3")

    print(result)
    name = (result["name"])
    category = (result["category"])
    
    


    try:
        
        cursor = connection.cursor()
        query = "UPDATE objects SET name = '" + name +  "' WHERE id = %s"
        cursor.execute(query, (source_blob_name,))
        connection.commit()

        query = "UPDATE objects SET category = '" + category +  "' WHERE id = %s"
        cursor.execute(query, (source_blob_name,))
        connection.commit()
        
    except MySQLdb.Error as e:
        print("MySQL Error:", e)
        

