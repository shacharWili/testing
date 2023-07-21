

const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");
 


let userMessage;
const API_KEY = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImEzYmRiZmRlZGUzYmFiYjI2NTFhZmNhMjY3OGRkZThjMGIzNWRmNzYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAyOTk4MzkzMTM4NDcwNjAxMDMyIiwiZW1haWwiOiJzaGFjaGFyd2lsaUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IjR4UWFiZ21fbVA3aVgxUVpOUFU0X3ciLCJuYmYiOjE2ODk5NzYyODIsImlhdCI6MTY4OTk3NjU4MiwiZXhwIjoxNjg5OTgwMTgyLCJqdGkiOiI2ZDA5NmM0NmQyY2I3NTgxMjY1NTcwZjNiYWY4YWNiOGRiYmIwMGUzIn0.RjJNVUseTP3hyLFjd_OxY2LS9eeoG7B775J7_WvZqsuY6OZJePW3HFHgmPDa1c8K0b2sIU57rhH0_aS8o_x6a65SL5WZ1oi-8kFsF5F7XxVUDJxG3wBKghX5kn6xUMvxizDdeYSIkMhpdSXKPsIZKyix6PRtkkCmBansb-MJU66--Pa4ZxxT8Vh5HecHflvPFrx2mLNQvTpZxSurslpO_Dd41SFAe9Hu_MhgpBoC68IAO8R0qOycG7hQ3dledlhr5641LjSL2se1KDox0gb3itlsHXI0juCL4hJvXVLQD8QR93ASZBArJmTF86EVAtPUDNR3QV5HsFx4JVMw3qvCqg"
const inputInitHeight = chatInput.scrollHeight;



const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = (className === "outgoing" )? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}



const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;
    
    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        //Display "thinking..." message while waiting for the response
        const incomingChatLI = createChatLi("Thinking...", "incoming");
        console.log(typeof incomingChatLI)
        chatbox.appendChild(incomingChatLI);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLI);
    }, 600)

}


sendChatBtn.addEventListener("click", handleChat);

const generateResponse = (incomingChatLI) => {
    const API_URL = "https://us-central1-lunar-mission-388518.cloudfunctions.net/llm";
    const messageElement = incomingChatLI.querySelector("p");
    const requestOptions = {
        method: "POST",
        // mode: 'no-cors',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Access-Control-Allow-Origin': 'null',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'name': "hello world",
        })
    }

    //Send POST request to API, get respnse
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        // console.log(data[0].generated_text);
        messageElement.textContent = data[0].generated_text;
    }).catch((error) => {
        // console.log("Error: ", error);
        messageElement.classList.add("error");
        messageElement.textContent = ("Error: ", error);
    }).finally(() => {    
        chatbox.scrollTo(0, chatbox.scrollHeight);
        const incomingChatFeedBack = generateFeedback();
        chatbox.appendChild(incomingChatFeedBack) 
    });

}

const getConfluencePages = () => {
  fetch('http://localhost:8080/?message=What%20is%20Wiliot%20pixel?', { mode: 'no-cors'})
  .then(response => response.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const bodyContent = doc.querySelector('body').innerHTML;
    console.log(bodyContent);
  })
  .catch(error => {
    console.log('Error:', error);
  });
}

const generateFeedback = () => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", "incoming");
    let chatContent = `<span class="material-symbols-outlined">smart_toy</span><p>Please Give me FeedBack:</p><button> 👍 </button><button> 👎 </button>`
    chatLi.innerHTML = chatContent;
    // console.log(chatLi)
    console.log(typeof chatLi)
    return chatLi;
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${inputInitHeight.scrollHeight}px`;
});


chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without shift key and the window
    // width is greater than 800px, handle the chat
    if (e.key === "Enter" && !e.shiftkey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});
sendChatBtn.addEventListener("click", handleChat);
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));



getConfluencePages()
