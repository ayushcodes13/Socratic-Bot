from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Configure Google Generative AI
genai.configure(api_key='AIzaSyBr2llpR5tvIKOXWt21ujRhAh9HeG-UJNM')

# Store conversation history
conversation_history = []

def socratic_assistant(prompt):
    try:
        model = genai.GenerativeModel('gemini-1.5-pro')
        response = model.generate_content(prompt)
        return response.text if response and response.text else "Sorry, I couldn't generate a response."
    except Exception as e:
        return f"Sorry, there was an error processing your request: {str(e)}"

@app.route('/', methods=['GET'])
def index():
    return "Hello, World!"

@app.route('/get_response', methods=['POST'])
def get_response():
    global conversation_history
    data = request.json
    user_input = data.get('message', '')
    conversation_history.append(f"Student: {user_input}")
    
    topic = "Sorting algorithms and their importance in computer science."
    prompt = f"As a Socratic tutor, engage the student with questions about {topic}. Always redirect the conversation back to sorting. Encourage deeper thinking.\n"
    prompt += "\n".join(conversation_history) + "\nAI:"

    result = socratic_assistant(prompt)
    conversation_history.append(f"Assistant: {result}")
    
    return jsonify({'response': result})

# Vercel requires a handler function
def handler(event, context):
    return app(event, context)