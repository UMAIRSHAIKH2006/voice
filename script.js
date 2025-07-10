let isRecording = false;
let recognition = null;

click_to_convert.addEventListener('click', function() {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
});

function startRecording() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        // Configure recognition settings
        recognition.continuous = true;  // Keep listening continuously
        recognition.interimResults = true;  // Show partial results
        recognition.lang = 'en-US';  // Set language
        recognition.maxAlternatives = 1;
        
        let finalTranscript = '';
        let interimTranscript = '';
        
        recognition.onstart = function() {
            isRecording = true;
            click_to_convert.textContent = 'Stop Recording';
            click_to_convert.style.background = '#dc3545';
            converter_text.placeholder = 'Listening... Speak now!';
        };
        
        recognition.onresult = function(event) {
            interimTranscript = '';
            finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }
            
            // Update textarea with both final and interim results
            converter_text.value = finalTranscript + interimTranscript;
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            stopRecording();
            
            if (event.error === 'not-allowed') {
                alert('Microphone access denied. Please allow microphone access and try again.');
            } else if (event.error === 'no-speech') {
                alert('No speech detected. Please try again.');
            }
        };
        
        recognition.onend = function() {
            if (isRecording) {
                // If recording was stopped unexpectedly, restart it
                recognition.start();
            }
        };
        
        recognition.start();
    } else {
        alert('Speech recognition not supported in this browser. Please use Chrome or Safari.');
    }
}

function stopRecording() {
    if (recognition) {
        isRecording = false;
        recognition.stop();
        click_to_convert.textContent = 'Voice to Text';
        click_to_convert.style.background = '#0ea4da';
        converter_text.placeholder = 'Your speech will appear here...';
    }
}

// Add keyboard shortcut (Space bar) to start/stop recording
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && event.target !== converter_text) {
        event.preventDefault();
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    }
});

// Set initial placeholder text
converter_text.placeholder = 'Click "Voice to Text" to start recording...';
