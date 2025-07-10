click_to_convert.addEventListener('click',function(){
    var speach = true;
    window.speachRecognition = window.webkitSpeechRecognition;
    const recognition = new speachRecognition();
    recognition.interimResults = true;

    recognition.addEventListener('result', e=>{
        const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)

        converter_text.innerHTML = transcript;
    })


    if(speach == true){
        recognition.start();
    }
})



