from fastapi import FastAPI
from openai import OpenAI
from dotenv import load_dotenv
import os
from gradio_client import Client, file
import gradio as gr
import requests
import numpy as np
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
import base64
from io import BytesIO
from PIL import Image
from PIL import Image, ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = True


load_dotenv()

api_key = os.getenv("KEY_OAI")
cloudinary_key = os.getenv("CLOUDINARY_KEY")
app = FastAPI()
client = OpenAI(api_key=api_key)


# Configuration
cloudinary.config(
    cloud_name="ds6plgdkx",
    api_key="761511797344284",
    api_secret=cloudinary_key,
    secure=True,
)


@app.get("/")
async def read_root():
    return {"message": "Welcome to the Requiem API"}


# endpoint to get a response for a given prompt
@app.get("/gpt3/")
async def gpt3(prompt: str):
    return client.completions.create(
        model="gpt-3.5-turbo-instruct",
        prompt=prompt,
    )


# endpoint to generate a description of a web element
@app.get("/webElement/")
async def gen_ui_description(img_url: str):
    print(img_url)

    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Describe the following web element.",
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": img_url,
                        },
                    },
                ],
            }
        ],
        max_tokens=200,
    )

    return response.choices[0]


# # endpoint that generates a description of a web page using llava fine-tuned model
@app.get("/llavaft-describe/")
async def gen_llava_ui_description(img_url: str):
    gradio_src = "https://2616fa51c15c9697de.gradio.live"
    client = Client(gradio_src, verbose=True)
    result = client.predict(
        "Describe the user interface in the following website screenshot.",  # str  in 'parameter_3' Textbox component
        img_url,  # filepath  in 'parameter_11' Image component
        # Literal['Crop', 'Resize', 'Pad', 'Default']  in 'Preprocess for non-square image' Radio component
        "Default",
        api_name="/add_text",
    )

    result = client.predict(
        "llava-ftmodel",  # Literal[]  in 'parameter_10' Dropdown component
        # float (numeric value between 0.0 and 1.0) in 'Temperature' Slider component
        0.2,
        # float (numeric value between 0.0 and 1.0) in 'Top P' Slider component
        0.7,
        # float (numeric value between 0 and 1024) in 'Max output tokens' Slider component
        250,
        api_name="/http_bot",
    )
    print(result[0][1])
    return result[0][1]


# endpoint that generates a description of a web page using llava model
@app.get("/llava-describe/")
async def gen_llava_ui_description(img_url: str):
    gradio_src = "https://llava.hliu.cc/"
    client = Client(gradio_src, verbose=True)
    result = client.predict(
        "Describe the following web page:",  # str  in 'parameter_3' Textbox component
        img_url,  # filepath  in 'parameter_11' Image component
        # Literal['Crop', 'Resize', 'Pad', 'Default']  in 'Preprocess for non-square image' Radio component
        "Default",
        api_name="/add_text",
    )

    result = client.predict(
        "llava-v1.6-34b",  # Literal[]  in 'parameter_10' Dropdown component
        # float (numeric value between 0.0 and 1.0) in 'Temperature' Slider component
        0.2,
        # float (numeric value between 0.0 and 1.0) in 'Top P' Slider component
        0.7,
        # float (numeric value between 0 and 1024) in 'Max output tokens' Slider component
        250,
        api_name="/http_bot",
    )
    print(result[0][1])
    return result[0][1]


# endpoint to generate a description of a website screenshot
@app.get("/ui/")
async def gen_ui_description(img_url: str):
    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Describe the user interface in the following website screenshot.",
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": img_url,
                        },
                    },
                ],
            }
        ],
        max_tokens=200,
    )

    return response.choices[0]


# endpoint to compare the GUI/UI description and the design requirements
@app.get("/compare/")
async def compare_ui_description(ui_description: str, design_requirements: str):
    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Review the ui description against the design requirements, noting which are met and which are not. List met requirements first, followed by unmet ones. The text mustn't have formatting.",
                    },
                    {
                        "type": "text",
                        "text": f"UI Description: {ui_description}",
                    },
                    {
                        "type": "text",
                        "text": f"Design Requirements: {design_requirements}",
                    },
                ],
            }
        ],
        max_tokens=300,
    )

    return response.choices[0]
