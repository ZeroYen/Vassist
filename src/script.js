class VirtualAssistant {
  constructor(config = {}) {
    this.widget = null;
    this.button = null;
    this.window = null;
    this.messagesContainer = null;
    this.closeButton = null;
    this.currentNode = 'start';
    this.isOpen = false;
    this.isTyping = false;
    this.currentLanguage = 'en';
    this.languages = null;
    this.template = null;
    
    // Get the script path to load resources relative to it
    this.basePath = this.getBasePath();
    
    this.init();
  }

  getBasePath() {
    const scripts = document.getElementsByTagName('script');
    for (const script of scripts) {
      if (script.src.includes('script.js')) {
        const src = script.src;
        return src.substring(0, src.lastIndexOf('/') + 1);
      }
    }
    return window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
  }

  async init() {
    try {
      await Promise.all([
        this.loadLanguageData(),
        this.loadTemplate()
      ]);
      this.createWidget();
      this.applyStyles();
      this.startLanguageSelection();
      this.setupEventListeners();
    } catch (error) {
      console.error('VirtualAssistant initialization failed:', error);
    }
  }

  async loadLanguageData() {
    try {
      const response = await fetch(this.basePath.replace('/src/', '/data/') + 'dialogue.json');
      if (!response.ok) {
        throw new Error('Failed to load dialogue data');
      }
      const data = await response.json();
      this.languages = data.languages;
    } catch (error) {
      console.error('Error loading language data:', error);
      // Provide fallback data
      this.languages = {
        "en": {
          "name": "English",
          "welcomeMessage": {
            "text": "👋 Hi there! I'm your virtual assistant.",
            "style": "greeting"
          },
          "dialogues": {
            "language_select": {
              "message": {
                "text": "Please select your preferred language:",
                "style": "question"
              },
              "options": [
                {"id": "en", "text": "English", "nextNode": "start"},
                {"id": "sv", "text": "Svenska", "nextNode": "start"},
                {"id": "ja", "text": "日本語", "nextNode": "start"},
                {"id": "ko", "text": "한국어", "nextNode": "start"},
                {"id": "zh", "text": "中文", "nextNode": "start"},
                {"id": "vi", "text": "Tiếng Việt", "nextNode": "start"}
              ]
            },
            "start": {
              "message": {
                "text": "How can I help you today?",
                "style": "question"
              },
              "options": [
                {
                  "id": "help",
                  "text": "I need help",
                  "response": {
                    "text": "I'd be happy to help! What kind of assistance do you need?",
                    "style": "helpful"
                  },
                  "nextNode": "help_options"
                },
                {
                  "id": "info",
                  "text": "Tell me more about your services",
                  "response": {
                    "text": "We offer a wide range of services tailored to your needs!",
                    "style": "informative"
                  },
                  "nextNode": "services"
                }
              ]
            }
          }
        }
      };
    }
  }

  async loadTemplate() {
    try {
      const response = await fetch(this.basePath.replace('/src/', '/data/') + 'template.json');
      if (!response.ok) {
        throw new Error('Failed to load template data');
      }
      this.template = await response.json();
    } catch (error) {
      console.error('Error loading template:', error);
      // Use default template if loading fails
      this.template = {
        theme: {
          primaryColor: "#2196f3",
          textColor: "#333333",
          backgroundColor: "#ffffff",
          buttonColor: "#2196f3",
          buttonTextColor: "#ffffff",
          fontFamily: "Segoe UI, sans-serif",
          fontSize: "14px",
          borderRadius: "50%",
          icon: '💬',
          avatar: ''
        },
        layout: {
          buttonSize: "60px",
          windowWidth: "320px",
          windowHeight: "480px",
          position: "bottom-right",
          margin: "20px"
        },
        animations: {
          duration: "0.3s",
          type: "ease-out"
        }
      };
    }
  }

  applyStyles() {
    if (!this.template) return;

    const { theme, layout, animations } = this.template;
    const style = document.documentElement.style;

    // Apply theme variables
    style.setProperty('--vassist-primary-color', theme.primaryColor);
    style.setProperty('--vassist-text-color', theme.textColor);
    style.setProperty('--vassist-bg-color', theme.backgroundColor);
    style.setProperty('--vassist-font-family', theme.fontFamily);
    style.setProperty('--vassist-font-size', theme.fontSize);

    // Apply layout variables
    style.setProperty('--vassist-button-size', layout.buttonSize);
    style.setProperty('--vassist-window-width', layout.windowWidth);
    style.setProperty('--vassist-window-height', layout.windowHeight);
    style.setProperty('--vassist-margin', layout.margin);

    // Apply animation variables
    style.setProperty('--vassist-animation-duration', animations.duration);
    style.setProperty('--vassist-animation-type', animations.type);
  }

  createWidget() {
    // Create main widget container
    this.widget = document.createElement('div');
    this.widget.className = `vassist-widget ${this.template?.layout?.position || 'bottom-right'}`;
    
    // Create chat button
    this.button = document.createElement('button');
    this.button.className = 'vassist-button';
    this.button.innerHTML = this.template?.theme?.icon || '💬';
    
    // Create chat window
    this.window = document.createElement('div');
    this.window.className = 'vassist-window';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'vassist-header';
    
    const avatar = document.createElement('div');
    avatar.className = 'vassist-avatar';
    if (this.template?.theme?.avatar) {
      avatar.innerHTML = `<img src="${this.template.theme.avatar}" alt="Assistant">`;
    } else {
      avatar.innerHTML = '🤖';
    }
    
    const title = document.createElement('span');
    title.textContent = 'Virtual Assistant';
    
    this.closeButton = document.createElement('button');
    this.closeButton.className = 'vassist-close';
    this.closeButton.innerHTML = '×';
    
    header.appendChild(avatar);
    header.appendChild(title);
    header.appendChild(this.closeButton);
    
    // Create messages container
    this.messagesContainer = document.createElement('div');
    this.messagesContainer.className = 'vassist-messages';
    
    // Assemble the chat window
    this.window.appendChild(header);
    this.window.appendChild(this.messagesContainer);
    
    // Add everything to the widget
    this.widget.appendChild(this.window);
    this.widget.appendChild(this.button);
    
    // Add widget to page
    document.body.appendChild(this.widget);
  }

  startLanguageSelection() {
    if (!this.languages || !this.languages[this.currentLanguage]) {
      console.error('Language data not loaded properly');
      return;
    }

    const welcome = this.languages[this.currentLanguage].welcomeMessage;
    this.addAssistantMessage(welcome.text);

    const langSelectNode = this.languages[this.currentLanguage].dialogues.language_select;
    this.addAssistantMessage(langSelectNode.message.text);
    
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'vassist-options';
    this.renderOptions(langSelectNode.options, optionsContainer, (option) => {
      this.setLanguage(option.id);
    });
    this.messagesContainer.appendChild(optionsContainer);
  }

  setLanguage(lang) {
    if (this.languages[lang]) {
      this.currentLanguage = lang;
      this.clearMessages();
      this.addWelcomeMessage();
      this.showStartDialogue();
    }
  }

  addWelcomeMessage() {
    const welcome = this.languages[this.currentLanguage].welcomeMessage;
    this.addAssistantMessage(welcome.text);
  }

  showStartDialogue() {
    const startNode = this.languages[this.currentLanguage].dialogues.start;
    this.addAssistantMessage(startNode.message.text);
    
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'vassist-options';
    this.renderOptions(startNode.options, optionsContainer, (option) => {
      this.addUserMessage(option.text);
      this.showTypingIndicator();
      
      setTimeout(() => {
        this.hideTypingIndicator();
        if (option.response) {
          this.addAssistantMessage(option.response.text);
        }
        
        if (option.nextNode) {
          const nextNode = this.languages[this.currentLanguage].dialogues[option.nextNode];
          if (nextNode) {
            setTimeout(() => {
              this.addAssistantMessage(nextNode.message.text);
              if (nextNode.options && nextNode.options.length > 0) {
                const nextOptionsContainer = document.createElement('div');
                nextOptionsContainer.className = 'vassist-options';
                this.renderOptions(nextNode.options, nextOptionsContainer, (nextOption) => {
                  this.handleOptionSelection(nextOption);
                });
                this.messagesContainer.appendChild(nextOptionsContainer);
              }
            }, 500);
          }
        }
      }, 1000);
    });
    this.messagesContainer.appendChild(optionsContainer);
  }

  handleOptionSelection(option) {
    this.addUserMessage(option.text);
    this.showTypingIndicator();
    
    setTimeout(() => {
      this.hideTypingIndicator();
      if (option.response) {
        this.addAssistantMessage(option.response.text);
      }
      
      if (option.nextNode) {
        const nextNode = this.languages[this.currentLanguage].dialogues[option.nextNode];
        if (nextNode) {
          setTimeout(() => {
            this.addAssistantMessage(nextNode.message.text);
            if (nextNode.options && nextNode.options.length > 0) {
              const nextOptionsContainer = document.createElement('div');
              nextOptionsContainer.className = 'vassist-options';
              this.renderOptions(nextNode.options, nextOptionsContainer, (nextOption) => {
                this.handleOptionSelection(nextOption);  // Recursively handle next options
              });
              this.messagesContainer.appendChild(nextOptionsContainer);
            }
          }, 500);
        }
      }
    }, 1000);
  }

  addAssistantMessage(text) {
    const messageGroup = document.createElement('div');
    messageGroup.className = 'vassist-message-group assistant';
    
    const message = document.createElement('div');
    message.className = 'vassist-message assistant';
    message.textContent = text;
    
    messageGroup.appendChild(message);
    this.messagesContainer.appendChild(messageGroup);
    this.scrollToBottom();
  }

  addUserMessage(text) {
    const messageGroup = document.createElement('div');
    messageGroup.className = 'vassist-message-group user';
    
    const message = document.createElement('div');
    message.className = 'vassist-message user';
    message.textContent = text;
    
    messageGroup.appendChild(message);
    this.messagesContainer.appendChild(messageGroup);
    this.scrollToBottom();
  }

  renderOptions(options, container, callback) {
    if (!options || !container) return;
    
    options.forEach(opt => {
      const button = document.createElement('button');
      button.className = 'vassist-option';
      button.textContent = opt.text;
      
      button.addEventListener('click', () => {
        // Remove only the current and following option containers
        const allOptions = Array.from(this.messagesContainer.querySelectorAll('.vassist-options'));
        const currentIndex = allOptions.indexOf(container);
        if (currentIndex !== -1) {
          allOptions.slice(currentIndex).forEach(opt => opt.remove());
        }
        
        if (callback) {
          callback(opt);
        }
      });
      
      container.appendChild(button);
    });
  }

  showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'vassist-message-group assistant';
    indicator.innerHTML = '<div class="vassist-message assistant vassist-typing">...</div>';
    this.messagesContainer.appendChild(indicator);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const typingIndicator = this.messagesContainer.querySelector('.vassist-typing');
    if (typingIndicator) {
      typingIndicator.closest('.vassist-message-group').remove();
    }
  }

  clearMessages() {
    this.messagesContainer.innerHTML = '';
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.window.style.opacity = '1';
    this.window.style.transform = 'translateY(0) scale(1)';
    this.window.style.pointerEvents = 'auto';
  }

  close() {
    this.isOpen = false;
    this.window.style.opacity = '0';
    this.window.style.transform = 'translateY(20px) scale(0.95)';
    this.window.style.pointerEvents = 'none';
  }

  setupEventListeners() {
    this.button.addEventListener('click', () => this.toggle());
    this.closeButton.addEventListener('click', () => this.close());
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}

// Initialize the assistant when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.virtualAssistant = new VirtualAssistant();
});