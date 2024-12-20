# VAssist - Multilingual Virtual Assistant 🤖 (v1.1.0)

A lightweight, customizable virtual assistant that supports multiple languages and features a dynamic dialogue system. Built with vanilla JavaScript, this assistant can be easily integrated into any website.

![VAssist Demo](demo.gif)

## ✨ Features

- 🌐 **Multilingual Support**
  - English
  - Swedish (Svenska)
  - Japanese (日本語)
  - Korean (한국어)
  - Chinese (中文)
  - Vietnamese (Tiếng Việt)

- 💬 **Advanced Dialogue System**
  - Deep nested conversation flows
  - Context-aware responses
  - Rich message styling
  - Interactive UI elements
  - Smooth transitions
  - Typing indicators

- 🎨 **Extensive Customization**
  - Multiple theme options (Light/Dark/Custom)
  - Adjustable size and position
  - Message styling variants
  - Custom avatars support
  - Flexible layout options

- 🛠️ **Smart Features**
  - AI capabilities demonstration
  - Automation tools
  - Third-party integrations
  - Context awareness
  - Smart suggestions

## 🚀 Quick Start

1. Include the required files in your HTML:
```html
<link rel="stylesheet" href="src/styles.css">
<script src="src/script.js"></script>
```

2. The assistant will be automatically initialized when the page loads.

## ⚙️ Configuration

### Template Configuration (template.json)
```json
{
  "theme": {
    "primaryColor": "#2196f3",
    "textColor": "#333333",
    "backgroundColor": "#ffffff"
  },
  "layout": {
    "position": "bottom-right",
    "windowWidth": "320px"
  }
}
```

### Dialogue Configuration (dialogue.json)
```json
{
  "languages": {
    "en": {
      "name": "English",
      "welcomeMessage": {
        "text": "👋 Hello! I'm VAssist, your virtual assistant.",
        "style": "greeting"
      },
      "dialogues": {
        "start": {
          "message": {
            "text": "How can I assist you today?",
            "style": "question"
          },
          "options": [
            {
              "id": "customize",
              "text": "Customize VAssist",
              "nextNode": "customize_options"
            }
          ]
        }
      }
    }
  }
}
```

## 🎨 Message Styles

VAssist supports various message styles for different contexts:

- `greeting`: Welcome messages with gradient background
- `question`: General questions and prompts
- `helpful`: Tips and customization options
- `informative`: Feature descriptions and information
- `supportive`: Help and troubleshooting messages
- `success`: Confirmation and success messages
- `tutorial`: Learning and guide content

## 🛠️ Customization

### Adding New Dialogues

1. Create a new dialogue node in `dialogue.json`:
```json
"new_node": {
  "message": {
    "text": "Your message here",
    "style": "style_name"
  },
  "options": [
    {
      "id": "option_id",
      "text": "Option text",
      "response": {
        "text": "Response text",
        "style": "style_name"
      },
      "nextNode": "next_node_name"
    }
  ]
}
```

2. Link to it using `nextNode` from an existing option.

### Adding New Languages

Add a new language section in `dialogue.json`:
```json
"new_lang": {
  "name": "Language Name",
  "welcomeMessage": {
    "text": "Welcome message in new language",
    "style": "greeting"
  },
  "dialogues": {
    // Copy and translate the dialogue structure
  }
}
```

## 📦 Project Structure

```
vassist/
├── src/
│   ├── script.js      # Core assistant functionality
│   └── styles.css     # Styling and animations
├── data/
│   ├── dialogue.json  # Dialogue configurations
│   └── template.json  # Theme and layout settings
├── example.html         # Demo page
└── README.md         # Documentation
```

## 🔄 Version History

### v1.1.0
- Enhanced dialogue system with deeper nesting
- Added new message styles
- Improved customization options
- Added AI features demonstration
- Restructured project files

### v1.0.0
- Initial release
- Multilingual support for 6 languages
- Basic dialogue system
- Theme customization
- Responsive design

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons provided by [Dicebear](https://www.dicebear.com/)
- Inspired by modern chat interfaces

---
Made with ❤️ by ZeroYen
