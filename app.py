import google.generativeai as genai
from flask import Flask, render_template, request, jsonify
import os

# Configure Google Generative AI
genai.configure(api_key="AIzaSyBr2llpR5tvIKOXWt21ujRhAh9HeG-UJNM")

# Create a Flask app
app = Flask(__name__)

# Store conversation history
conversation_history = []

def socratic_assistant(prompt):
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt)
    
    if response and response.text:
        return response.text
    else:
        return "Sorry, I couldn't generate a response."

@app.route('/')
def index():
    return render_template('index.html')  # Render index.html from templates folder

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

if __name__ == "__main__":
    app.run(debug=True)
