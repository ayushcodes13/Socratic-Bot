$(document).ready(function() {
    // Show cover page
    $('#coverPage').show();
    $('#chatPage').hide();

    // Start button click event
    $('#startButton').click(function() {
        $('#coverPage').hide();
        $('#chatPage').show();
    });

    // Send button click event
    $('#sendBtn').click(function() {
        sendMessage();
    });

    // Clear History button click event
    $('#clearHistoryButton').click(function() {
        $('#chatHistory').empty();
    });

    // Enter key event for sending message
    $('#user_input').keypress(function(event) {
        if (event.which === 13) {
            event.preventDefault(); // Prevent form submission
            sendMessage();
        }
    });

    function sendMessage() {
        const userMessage = $('#user_input').val();
        if (userMessage.trim() === '') {
            $('#user_input').addClass('error');
            setTimeout(() => {
                $('#user_input').removeClass('error');
            }, 500);
            return;
        }
        $('#user_input').val(''); // Clear input field
        appendMessage(userMessage, 'user');
        // Simulating AI response
        setTimeout(() => {
            const aiResponse = "AI response to: " + userMessage; // Replace with actual AI call
            appendMessage(aiResponse, 'ai');
        }, 1000);
    }

    function appendMessage(message, sender) {
        const messageClass = sender === 'user' ? 'user' : 'ai';
        const messageHTML = `<div class="chat-bubble ${messageClass}"><div class="bubble">${message}</div></div>`;
        $('#chatHistory').append(messageHTML);
        $('#chatHistory').scrollTop($('#chatHistory')[0].scrollHeight); // Auto-scroll to the bottom
    }
});
