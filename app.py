from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
import os
import logging

app = Flask(__name__)
CORS(app)

# Configure Google Generative 

genai.configure(api_key='AIzaSyBr2llpR5tvIKOXWt21ujRhAh9HeG-UJNM')  # Use the retrieved API key

# Store conversation history
conversation_history = []

def socratic_assistant(prompt):
    try:
        model = genai.GenerativeModel('gemini-1.5-pro')
        response = model.generate_content(prompt)
        
        if response and response.text:
            return response.text
        else:
            return "Sorry, I couldn't generate a response."
    except Exception as e:
        logging.error(f"Error generating content: {e}")
        return "Sorry, there was an error processing your request."

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_response', methods=['POST'])
def get_response():
    global conversation_history
    
    # Get user input
    data = request.json
    user_input = data.get('message')
    
    # Store the user input in conversation history
    conversation_history.append(f"Student: {user_input}")
    
    # Define the topic and create the prompt for the Socratic assistant
    topic = "Sorting algorithms and their importance in computer science."
    prompt = f"As a Socratic tutor, engage the student with questions about {topic}. Always redirect the conversation back to sorting. Encourage deeper thinking."
    
    # Append conversation history to the prompt
    for entry in conversation_history:
        prompt += "\n" + entry
    
    prompt += "\nAI:"

    # Get the assistant's response
    result = socratic_assistant(prompt)
    
    # Store the AI's response in conversation history
    conversation_history.append(f"Assistant: {result}")
    
    # Return the AI's response
    return jsonify({'response': result})

# Vercel requires a handler function
def handler(request):
    return app(request)

if __name__ == "__main__":
    app.run(debug=True)
