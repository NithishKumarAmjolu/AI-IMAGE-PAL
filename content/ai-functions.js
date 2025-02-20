const apiKey = "";
let conversationHistory = [];

async function ocr(base64Image) {
    console.log("Starting OCR process...");
    
    const payload = {
        model: "chatgpt-4o-latest",
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: "Extract the text. I do not need any explanation." },
                    {
                        type: "image_url",
                        image_url: {
                            url: base64Image,
                            detail: "high"
                        }
                    },
                ],
            },
        ],
        
    };

    try {
        console.log("Sending request to OpenAI...");
        console.log("Payload:", JSON.stringify(payload, null, 2));

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("OpenAI Response:", data);

        if (data.error) {
            throw new Error(data.error.message || 'OpenAI API Error');
        }

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response format from OpenAI');
        }

        console.log("📝 OCR Result:", data.choices[0].message.content);
        return data.choices[0].message.content;
    } catch (error) {
        console.error("❌ OCR Error:", error);
        return `Error performing OCR: ${error.message}`;
    }
}

async function analyzeImageWithGPT4o(userMessage, base64Image) {
    console.log("Starting image analysis...");
    
    // If the conversation is empty, start by storing the image with user's first question
    if (conversationHistory.length === 0) {
        conversationHistory.push({
            role: "user",
            content: [
                { type: "text", text: userMessage }, // Store user's first question
                {
                    type: "image_url",
                    image_url: {
                        url: base64Image,
                        detail: "high"
                    }
                },
            ],
        });
    } else {
        // For subsequent messages, just append the user's question
        conversationHistory.push({
            role: "user",
            content: [{ type: "text", text: userMessage }]
        });
    }

    const payload = {
        model: "chatgpt-4o-latest",
        messages: conversationHistory, // Send full conversation history
    };

    try {
        console.log("Sending request to OpenAI...");
        console.log("Payload:", JSON.stringify(payload, null, 2));

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("OpenAI Response:", data);

        if (data.error) {
            throw new Error(data.error.message || 'OpenAI API Error');
        }

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response format from OpenAI');
        }

        const botResponse = data.choices[0].message.content;

        // Store AI's response in the conversation history
        conversationHistory.push({
            role: "assistant",
            content: [{ type: "text", text: botResponse }]
        });

        console.log("🤖 GPT-4o:", botResponse);
        return botResponse;
    } catch (error) {
        console.error("❌ Error:", error);
        return `Error processing request: ${error.message}`;
    }
}
function formatResponse(response) {
    // Convert headers (# Heading) → <h1>, <h2>, <h3>, etc.
    response = response.replace(/^### (.*$)/gm, '<h3>$1</h3>') // H3
                       .replace(/^## (.*$)/gm, '<h2>$1</h2>')   // H2
                       .replace(/^# (.*$)/gm, '<h1>$1</h1>');   // H1

    // Convert bullet points (- item or * item) → <ul><li>...</li></ul>
    response = response.replace(/^- (.*$)/gm, '<ul><li>$1</li></ul>')
                       .replace(/^\* (.*$)/gm, '<ul><li>$1</li></ul>');

    // Convert numbered lists (1. item) → <ol><li>...</li></ol>
    response = response.replace(/^\d+\.\s(.*$)/gm, '<ol><li>$1</li></ol>');

    // Convert Python code blocks → <pre><code class="language-python">...</code></pre>
    response = response.replace(/```python([\s\S]*?)```/g, '<pre><code class="language-python">$1</code></pre>');

    // Convert other code blocks → <pre><code>...</code></pre>
    response = response.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Convert inline code `code` → <code>code</code>
    response = response.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert bold **bold** → <strong>bold</strong>
    response = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert italic *italic* → <em>italic</em>
    response = response.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Preserve line breaks by converting newlines to <br>
    response = response.replace(/\n/g, '<br>');

    return response;
}


function resetChat() {
    conversationHistory = [];
    console.log("🔄 Chat has been reset!");
}
function createOCRResultUI(ocrText) {
    const ocrDiv = document.createElement("div");
    ocrDiv.style.position = "fixed";
    ocrDiv.style.bottom = "20px";
    ocrDiv.style.right = "20px";
    ocrDiv.style.width = "400px";
    ocrDiv.style.maxHeight = "300px";
    ocrDiv.style.background = "white";
    ocrDiv.style.border = "1px solid #ccc";
    ocrDiv.style.padding = "15px";
    ocrDiv.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    ocrDiv.style.zIndex = "9999";
    ocrDiv.style.borderRadius = "8px";
    ocrDiv.style.overflowY = "auto";
    ocrDiv.style.color = "black";
    ocrDiv.style.display = "flex";
    ocrDiv.style.flexDirection = "column";
    ocrDiv.style.alignItems = "flex-start";

    const ocrTextArea = document.createElement("p");
    ocrTextArea.textContent = ocrText;
    ocrTextArea.style.whiteSpace = "pre-wrap"; // Preserve line breaks
    ocrTextArea.style.wordWrap = "break-word";
    ocrTextArea.style.flex = "1";
    
    // Copy button
    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy";
    copyButton.style.alignSelf = "flex-end";
    copyButton.style.marginTop = "10px";
    copyButton.style.padding = "5px 10px";
    copyButton.style.borderRadius = "4px";
    copyButton.style.border = "none";
    copyButton.style.backgroundColor = "#28a745";
    copyButton.style.color = "white";
    copyButton.style.cursor = "pointer";

    copyButton.onclick = function () {
        navigator.clipboard.writeText(ocrText).then(() => {
            alert("Copied to clipboard!");
        }).catch(err => {
            console.error("Copy failed", err);
        });
    };

    // Close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "✖";
    closeButton.style.position = "absolute";
    closeButton.style.right = "10px";
    closeButton.style.top = "10px";
    closeButton.style.border = "none";
    closeButton.style.background = "none";
    closeButton.style.fontSize = "16px";
    closeButton.style.cursor = "pointer";

    closeButton.onclick = function () {
        document.body.removeChild(ocrDiv);
    };

    ocrDiv.appendChild(closeButton);
    ocrDiv.appendChild(ocrTextArea);
    ocrDiv.appendChild(copyButton);
    document.body.appendChild(ocrDiv);
}

function createFloatingUI(base64Image) {
    const floatDiv = document.createElement("div");
    floatDiv.style.position = "fixed";
    floatDiv.style.bottom = "20px";
    floatDiv.style.right = "20px";
    floatDiv.style.background = "white";
    floatDiv.style.border = "1px solid #ccc";
    floatDiv.style.padding = "60px";
    floatDiv.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    floatDiv.style.zIndex = "9999";
    floatDiv.style.borderRadius = "8px";

    function styleButton(button) {
        button.style.width = "100px";
        button.style.padding = "10px";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.border = "0";
        button.style.backgroundColor = "#9999ff";
        button.style.boxShadow = "rgb(0 0 0 / 5%) 0 0 8px";
        button.style.letterSpacing = "1.5px";
        button.style.textTransform = "uppercase";
        button.style.fontSize = "15px";
        button.style.transition = "all 0.5s ease";
        
        button.onmouseover = function () {
            button.style.letterSpacing = "3px";
            button.style.backgroundColor = "hsl(261deg 80% 48%)";
            button.style.color = "hsl(0, 0%, 100%)";
            button.style.boxShadow = "rgb(93 24 220) 0px 7px 29px 0px";
        };
        
        button.onmouseleave = function () {
            button.style.letterSpacing = "1.5px";
            button.style.backgroundColor = "#9999ff";
            button.style.color = "black";
            button.style.boxShadow = "rgb(0 0 0 / 5%) 0 0 8px";
        };
        
        button.onmousedown = function () {
            button.style.transform = "translateY(10px)";
            button.style.transition = "100ms";
        };
        
        button.onmouseup = function () {
            button.style.transform = "translateY(0)";
        };
    }

    const ocrButton = document.createElement("button");
    ocrButton.textContent = "TEXT";
    styleButton(ocrButton);
    ocrButton.style.marginRight = "30px";


    // ocrButton.onclick = async function () {
    //     document.body.removeChild(floatDiv);
    //     const ocrResult = await ocr(base64Image);
    //     alert(ocrResult);
    // };

    ocrButton.onclick = async function () {
        document.body.removeChild(floatDiv);
        const ocrResult = await ocr(base64Image);
        createOCRResultUI(ocrResult); // 🆕 Call the new function
    };

    const chatButton = document.createElement("button");
    chatButton.textContent = "PROMPT";
    styleButton(chatButton);
    chatButton.onclick = function () {
        document.body.removeChild(floatDiv);
        createChatbotUI(base64Image);
    };

    floatDiv.appendChild(ocrButton);
    floatDiv.appendChild(chatButton);
    document.body.appendChild(floatDiv);
}
function createChatbotUI(base64Image) {
    const chatDiv = document.createElement("div");
    chatDiv.style.position = "fixed";
    chatDiv.style.bottom = "20px";
    chatDiv.style.right = "20px";
    chatDiv.style.color = "black";
    chatDiv.style.width = Math.min(window.innerWidth * 0.9, 450) + "px";
    chatDiv.style.height = Math.min(window.innerHeight * 0.9, 850) + "px";
    chatDiv.style.background = "white";
    chatDiv.style.border = "1px solid #ccc";
    chatDiv.style.padding = "10px";
    chatDiv.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    chatDiv.style.zIndex = "9999";
    chatDiv.style.borderRadius = "8px";
    chatDiv.style.display = "flex";
    chatDiv.style.flexDirection = "column";

    const chatLog = document.createElement("div");
    chatLog.style.flex = "1";
    chatLog.style.overflowY = "auto";
    chatLog.style.marginBottom = "10px";
    chatLog.style.padding = "10px";
    chatLog.style.border = "1px solid #eee";
    chatLog.style.borderRadius = "4px";
    chatDiv.appendChild(chatLog);

    const inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.placeholder = "Ask about the image...";
    inputBox.style.width = "70%";
    inputBox.style.marginRight = "5px";
    inputBox.style.backgroundColor = "black";
    inputBox.style.padding = "5px";
    inputBox.style.borderRadius = "4px";
    inputBox.style.color = "white";
    inputBox.style.border = "1px solid #ccc";

    const sendButton = document.createElement("button");
    sendButton.textContent = "Send";
    sendButton.style.padding = "5px 10px";
    sendButton.style.borderRadius = "4px";
    sendButton.style.border = "none";
    sendButton.style.backgroundColor = "#007bff";
    sendButton.style.color = "white";
    sendButton.style.cursor = "pointer";
    
    sendButton.onclick = async function () {
        const userMessage = inputBox.value.trim();
        if (userMessage) {
            chatLog.innerHTML += `<p style='color: black;'><strong>👦🏻 You:</strong> ${userMessage}</p>`;
            chatLog.scrollTop = chatLog.scrollHeight;
            inputBox.value = "";
            
            const response = await analyzeImageWithGPT4o(userMessage, base64Image);
            // chatLog.innerHTML += `<p style='color: black;'><strong>🤖 AI:</strong> ${response}</p>`;
            // chatLog.innerHTML += `<p style='color: black;'><strong>🤖 AI:</strong> ${botResponse}</p>`;
            chatLog.innerHTML += `<p style='color: black;'><strong>🤖 AI:</strong> ${formatResponse(response)}</p>`;

            chatLog.scrollTop = chatLog.scrollHeight;
        }
    }; 
    
const resetButton = document.createElement("button");
    resetButton.textContent = "Reset";
    resetButton.style.padding = "5px 10px";
    resetButton.style.borderRadius = "4px";
    resetButton.style.border = "none";
    resetButton.style.backgroundColor = "#dc3545";
    resetButton.style.color = "white";
    resetButton.style.cursor = "pointer";
    resetButton.style.marginLeft = "5px";
    
    resetButton.onclick = function () {
        resetChat();
        chatLog.innerHTML = "";
    };

    const closeButton = document.createElement("button");
    closeButton.textContent = "✖";
    closeButton.style.position = "absolute";
    closeButton.style.right = "10px";
    closeButton.style.top = "10px";
    closeButton.style.border = "none";
    closeButton.style.background = "none";
    closeButton.style.fontSize = "16px";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = function () {
        document.body.removeChild(chatDiv);
    };

    const inputContainer = document.createElement("div");
    inputContainer.style.display = "flex";
    inputContainer.style.gap = "5px";
    inputContainer.style.padding = "10px";
    inputContainer.appendChild(inputBox);
    inputContainer.appendChild(sendButton);
    inputContainer.appendChild(resetButton);
    
    chatDiv.appendChild(inputContainer);
    chatDiv.appendChild(closeButton);
    
    document.body.appendChild(chatDiv);

    // Focus input box
    inputBox.focus();

    // Handle enter key
    inputBox.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
}

window.createFloatingUI = createFloatingUI;
