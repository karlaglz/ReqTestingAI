# Requiem-API

This is the API for the Requiem project.

Steps to run this project:
- Install Python 3.0 or higher
- Install all the dependencies using the following command:
```bash
pip install -r requirements.txt
```
- Create a .env file in the root directory and add the following variables:
```bash
KEY_OAI = "Key for the Open AI API"
```
- Go to the API directory "/API" 
- Run the server using Uvicorn:
```bash
python -m uvicorn main:app --reload
```

For Mac/Linux:
```bash
uvicorn main:app --reload
```
