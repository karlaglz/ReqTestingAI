from gradio_client import Client

client = Client("https://d9af722fe4417dd286.gradio.live/", verbose=True)
# client.view_api()
result = client.predict(
    "Describe the following web page:",  # str  in 'parameter_3' Textbox component
    "https://i.ibb.co/s6h1qqn/Captura-de-pantalla-2024-06-11-a-las-13-38-41.png",  # filepath  in 'parameter_11' Image component
    "Default",  # Literal['Crop', 'Resize', 'Pad', 'Default']  in 'Preprocess for non-square image' Radio component
    api_name="/add_text",
)
# print(result)

result = client.predict(
    "llava-v1.5-13b",  # Literal[]  in 'parameter_10' Dropdown component
    0.2,  # float (numeric value between 0.0 and 1.0) in 'Temperature' Slider component
    0.7,  # float (numeric value between 0.0 and 1.0) in 'Top P' Slider component
    250,  # float (numeric value between 0 and 1024) in 'Max output tokens' Slider component
    api_name="/http_bot",
)
print(result)
