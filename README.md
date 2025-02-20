# AI Image Pal - Your Study Companion

📚 **Perfect for Students!**
Transform your learning experience with AI Image Pal - a powerful Chrome extension designed specifically for students. Got a confusing concept in your textbook? A complex diagram in your study material? Or a challenging homework problem? Simply:
1. Screenshot the question or concept
2. Let our AI analyze it
3. Get instant, detailed explanations
4. Keep asking follow-up questions until you fully understand

AI Image Pal combines OCR (Optical Character Recognition) with advanced AI capabilities to create your personal study assistant. Whether you're:
- Stuck on a difficult math problem
- Need clarification on scientific concepts
- Want to understand complex diagrams
- Looking for step-by-step explanations
- Seeking real-world examples

Just capture, ask, and learn! With our chat remembrance feature, you can even continue your learning discussions across study sessions.

---

AI Image Pal is a powerful Chrome extension that combines OCR (Optical Character Recognition) capabilities with AI-powered features to enhance your learning experience. This extension allows you to capture, extract text from images, and engage in meaningful educational discussions directly from your browser.

## 🌟 Features

### 1. Smart Screenshot Capture
- Capture any portion of a webpage with our intuitive selection tool
- Support for full-page screenshots
- Quick capture shortcuts

![Screenshot Tool Demo](https://raw.githubusercontent.com/NithishKumarAmjolu/AI-IMAGE-PAL/refs/heads/main/pics/screenshot.png)
![Screenshot Tool Demo](https://raw.githubusercontent.com/NithishKumarAmjolu/AI-IMAGE-PAL/refs/heads/main/pics/Screenshot%20(42).png)
![Screenshot Tool Demo](https://raw.githubusercontent.com/NithishKumarAmjolu/AI-IMAGE-PAL/refs/heads/main/pics/Screenshot%20(43).png)

### 2. Advanced OCR Capabilities
- Extract text from images with high accuracy
- Support for multiple languages
- Real-time text recognition
- Copy extracted text to clipboard with one click

![OCR Demo](https://raw.githubusercontent.com/NithishKumarAmjolu/AI-IMAGE-PAL/refs/heads/main/pics/1.png)
![OCR Demo](https://raw.githubusercontent.com/NithishKumarAmjolu/AI-IMAGE-PAL/refs/heads/main/pics/ocr.png)

### 3. Chat Remembrance
- Intelligent conversation history tracking
- Contextual chat continuation across sessions
- Smart context understanding from previous interactions
- Personalized responses based on chat history
- Secure local storage of conversation data
- Easy access to past conversations
- Seamless chat restoration when reopening the extension

![Chat History Feature](https://raw.githubusercontent.com/NithishKumarAmjolu/AI-IMAGE-PAL/refs/heads/main/pics/concatenate%20msgs.png)

### 4. AI-Powered Features (Powered by OpenAI)
- Advanced natural language processing using OpenAI's GPT models
- Smart text formatting and cleaning
- Automatic language detection
- Context-aware text extraction
- Intelligent image processing
- Dynamic conversation handling through OpenAI's API
- Real-time AI-powered responses

![AI Features](https://raw.githubusercontent.com/NithishKumarAmjolu/AI-IMAGE-PAL/refs/heads/main/pics/Screenshot%20(45).png)
![AI Features](https://raw.githubusercontent.com/NithishKumarAmjolu/AI-IMAGE-PAL/refs/heads/main/pics/Screenshot%20(44).png)

## 💡 How to Use

### Taking a Screenshot
1. Click the extension icon in your toolbar
2. Select the area you want to capture
3. Use the crop tool to adjust if needed
4. Save or process the image

### Extracting Text
1. Capture an image or upload from your computer
2. Wait for the automatic OCR processing
3. View the extracted text in the results panel
4. Copy, edit, or share the text

### Using Chat Remembrance
1. Start a conversation with the AI
2. Your chat history is automatically saved
3. Return anytime to continue previous conversations
4. Access past interactions through the history panel
5. Continue discussions seamlessly across browser sessions

## 🛠️ Technical Implementation

The extension is built using modern web technologies and follows Chrome Extension Manifest V3 guidelines.

### Architecture
- Background Service Worker for handling core functionality
- Content Scripts for webpage interaction
- AI processing modules for enhanced features
- Local storage management for chat history

```
screenshot-extension/
├── manifest.json
├── background/
│   └── index.js
├── content/
│   ├── ai-functions.js
│   ├── crop.js
│   ├── index.css
│   └── index.js
```

![Architecture Diagram](images/architecture.png)

### Key Components
1. **Background Service Worker** (background/index.js)
   - Manages extension lifecycle
   - Handles browser events
   - Coordinates between components
   - Manages chat history persistence

2. **AI Functions** (content/ai-functions.js)
   - Implements OCR functionality
   - Processes image data
   - Handles text extraction
   - Manages conversation context

3. **UI Components** (content/index.js, content/index.css)
   - User interface elements
   - Screenshot selection tool
   - Results display panel
   - Chat history interface

4. **Image Processing** (content/crop.js)
   - Image manipulation utilities
   - Crop functionality
   - Resolution optimization

## 🔧 Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-image-pal.git
```

2. Set up OpenAI API Key:
   - Sign up for an OpenAI account at [OpenAI Platform](https://platform.openai.com)
   - Generate an API key in your OpenAI dashboard
   - Create a `.env` file in the project root:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
   Note: The extension requires a valid OpenAI API key to function properly as it uses OpenAI's GPT models for AI features and chat functionality.

3. Navigate to Chrome Extensions:
   - Open Chrome
   - Go to `chrome://extensions/`
   - Enable Developer Mode

3. Load the extension:
   - Click "Load unpacked"
   - Select the extension directory

![Dev Setup](images/dev-setup.png)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.


## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for providing the powerful AI capabilities
- Chrome Extensions API
- Contributors and testers

---

Made with ❤️ by [NITHISH KUMAR AMJOLU]
