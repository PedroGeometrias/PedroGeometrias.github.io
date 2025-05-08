// starting as soon as possible
document.addEventListener('DOMContentLoaded',()=>{
    // fall back in case case window.curlang wasnt created
    function getLang(){
        return window.curLang || 'en';
    }

    // WRITING ANIMATION
    // holds the intervalID
    let bubbleTimer=null;
    // dictates visibility
    const bubble   = document.getElementById('alienBubble');
    // area where that holds the characters
    const txtNode  = bubble.querySelector('.speech-txt');

    // typing function
    function typeBubble(text){
        // cancel any previous request, in case spaming the '?' symbol text will not be corrupted
        if(bubbleTimer) clearInterval(bubbleTimer);
        // bubble appears
        bubble.hidden = false;
        // wiping old text, again in case of spaming '?'
        txtNode.textContent = '';
        // interval's of 45 ms
        let i=0;
        bubbleTimer = setInterval(()=>{
            // txtNode takes character from text
            txtNode.textContent += text[i++];
            // case the string is fully copied, we just stop the timer
            if(i>=text.length){ clearInterval(bubbleTimer); bubbleTimer=null; }
        },45);
    }

    // Handling clicks
    // for each button click
    document.querySelectorAll('.project-help').forEach(btn=>{
        // I'm calling speak function
        function speak(){
            // which takes a message from the data-msg-something attribute
            const msg = btn.getAttribute('data-msg-'+getLang()) || '';
            // sending the message to the bubble method
            typeBubble(msg);
        }
        // call speak and holds the click
        btn.addEventListener('click', e=>{ speak(); e.stopPropagation(); });
        document.addEventListener('languageChanged', speak);
    });
    // closing in case scrolling and clicking
    document.addEventListener('click', ()=> bubble.hidden=true );
    window.addEventListener('scroll', ()=> bubble.hidden=true );
});
