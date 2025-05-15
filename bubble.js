// starting as soon as possible
document.addEventListener('DOMContentLoaded',()=>{
    // fall back in case case window.curlang wasnt created
    function getLang(){
        return window.curLang || 'en';
    }

    // WRITING ANIMATION
    let isIdle = true;
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
        btn.addEventListener('click', e=>{ isIdle = false; speak(); e.stopPropagation(); });
        document.addEventListener('languageChanged', speak);
    });
    // closing in case scrolling and clicking
    document.addEventListener('click', ()=>{
        isIdle = true;
        bubble.hidden=true
    });
    window.addEventListener('scroll', ()=> {
        isIdle = true;
        bubble.hidden=true
    });

    // random messages that the alien will say when hes idle
    const randMsg = {
        en: [
            "Did you know that clicking the '?' makes me tell you more interesting stuff about each project?",
            "This website was built with only js/css/html",
            "Did you know that clicking the '?' makes me tell you more interesting stuff about each project?",
            "I drew all the sprites, minus this little alien here",
            "Did you know that the 18 on data-i18n is a numeronym for \"internationalization\"?",
            "Did you know that clicking the '?' makes me tell you more interesting stuff about each project?",
        ],

        pt: [
            "Voce sabia que clicando em '?' me faz te contar coisas mais interessantes sobre os projetos?",
            "Esse site foi feito com apenas js/css/html",
            "Voce sabia que clicando em '?' me faz te contar coisas mais interessantes sobre os projetos?",
            "Eu desenhei todos os sprites do site, menos os sprite desse alien",
            "Voce sabia que o 18 em data-i18n representa a quantidade the letras em \"internationalization\" sem contar o 'i' e 'n'?",
            "Voce sabia que clicando em '?' me faz te contar coisas mais interessantes sobre os projetos?",
        ]
    }
    function pickIdleMessage(){
        const currentLang = getLang();
        const msgs = randMsg[currentLang] || randMsg.en;
        return msgs[Math.floor(Math.random() * msgs.length)];
    }
    function maybeSayIdle(){
    // removing the chance of erasing user isIdle for alien speaking
    if(isIdle == true){
        typeBubble(pickIdleMessage());
    }
    }
    setInterval(maybeSayIdle, 1000 * (10 + Math.random() * 20));
});

