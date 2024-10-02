$(document).ready(function() {
    // Transition from cover page to chat page
    $('#startButton').click(function() {
        $('#coverPage').fadeOut(400, function() {
            $('#chatPage').fadeIn(400);
            addMessage('ai', 'What do you know about Sorting?');
        });
    });

    // Event listener for send button and Enter key press
    $('#sendBtn').click(function() {
        if (!$('#sendBtn').prop('disabled')) { // Check if button is not disabled
            sendMessage();
        }
    });

    $('#user_input').keypress(function(e) {
        if (e.which === 13 && !$('#sendBtn').prop('disabled')) { // Check if input is enabled
            sendMessage();
        }
    });

    // Clear history event listener
    $('#clearHistoryButton').click(function() {
        clearHistory();
    });

    function sendMessage() {
        const user_input = $('#user_input').val().trim();
        if (user_input === '') return;

        addMessage('user', user_input);
        showLoader();

        // Disable input and send button while processing the AI response
        $('#user_input').prop('disabled', true);
        $('#sendBtn').prop('disabled', true);

        // Check for errors in input
        const errorResponse = checkForErrors(user_input);
        if (errorResponse) {
            hideLoader();
            addMessage('ai', errorResponse);
            $('#user_input').val(''); // Clear input field
            return;
        }

        // Make the AJAX request to get AI response
        $.ajax({
            type: 'POST',
            url: '/get_response',
            contentType: 'application/json',
            data: JSON.stringify({ message: user_input }),
            success: function(response) {
                hideLoader();
                addMessage('ai', response.response, true); // Typewriter effect

                // Re-enable input and send button only after AI has finished typing the response
            },
            error: function() {
                hideLoader();
                addMessage('ai', "Sorry, there was an error processing your request.");

                // Re-enable input and send button even in case of an error
                $('#user_input').prop('disabled', false);
                $('#sendBtn').prop('disabled', false);
            }
        });

        $('#user_input').val(''); // Clear input field after sending
    }

    // Function to check for common user input errors
    function checkForErrors(input) {
        if (input.includes('undefined')) {
            $('#user_input').addClass('error');
            setTimeout(() => $('#user_input').removeClass('error'), 500); // Shake animation
            return "It seems you're trying to access a variable that hasn't been defined.";
        }

        if (input.includes('syntax error')) {
            return "There seems to be a syntax error in your code. Check for missing semicolons or mismatched brackets.";
        }

        return null; // No error found
    }

    // Function to add message bubbles to the chat
    function addMessage(sender, message, isLive = false) {
        const bubble = $('<div class="chat-bubble ' + sender + '"><div class="bubble ' + sender + '"></div></div>');
        $('#chatHistory').append(bubble);

        if (isLive && sender === 'ai') {
            typeText(bubble.find('.bubble'), message, 0); // Use typewriter effect for AI responses
        } else {
            bubble.find('.bubble').text(message);
            reEnableInput(); // Re-enable input if no typewriter effect is used
        }

        $('#chatHistory').scrollTop($('#chatHistory')[0].scrollHeight); // Scroll to bottom
    }

    // Function to handle live text typing effect for AI responses
    function typeText(element, message, index) {
        if (index < message.length) {
            element.append(message[index]);
            setTimeout(function() {
                typeText(element, message, index + 1);
            }, 50); // Adjust speed by changing this value (50ms per character)
        } else {
            // Re-enable input and send button after the full response is typed
            reEnableInput();
        }
    }

    // Function to re-enable input and send button after AI response is complete
    function reEnableInput() {
        $('#user_input').prop('disabled', false);
        $('#sendBtn').prop('disabled', false);
    }

    // Function to show loader while AI is generating a response
    function showLoader() {
        $('#sparkLoader').show();
    }

    // Function to hide loader after AI finishes response
    function hideLoader() {
        $('#sparkLoader').hide();
    }

    // Function to clear chat history
    function clearHistory() {
        $('#chatHistory').empty(); // Clears the chat history container
    }
});