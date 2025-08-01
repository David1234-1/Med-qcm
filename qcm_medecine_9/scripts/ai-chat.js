// Gestionnaire de chat IA pour QCM Médecine 9
class AIChatManager {
  constructor() {
    this.conversations = [];
    this.currentConversation = null;
    this.isTyping = false;
  }

  async init() {
    this.container = document.getElementById('ai-chat-page');
    if (!this.container) return;

    this.render();
    this.loadConversations();
  }

  render() {
    this.container.innerHTML = `
      <div class="ai-chat-container">
        <div class="ai-chat-header">
          <h2>Assistant IA</h2>
          <p>Posez vos questions à l'IA qui analyse vos cours pour vous répondre</p>
        </div>

        <div class="ai-chat-interface">
          <div class="conversations-sidebar" id="conversations-sidebar">
            <div class="sidebar-header">
              <h3>Conversations</h3>
              <button class="btn btn-primary" onclick="aiChatManager.startNewConversation()">
                <i class="fas fa-plus"></i> Nouvelle
              </button>
            </div>
            <div class="conversations-list" id="conversations-list"></div>
          </div>

          <div class="chat-main" id="chat-main">
            <div class="chat-welcome" id="chat-welcome">
              <div class="welcome-content">
                <i class="fas fa-robot"></i>
                <h3>Bienvenue dans l'Assistant IA</h3>
                <p>Je suis votre assistant personnel pour vos études de médecine. Posez-moi n'importe quelle question sur vos cours, et je vous répondrai en me basant sur vos documents importés.</p>
                <div class="example-questions">
                  <h4>Exemples de questions :</h4>
                  <ul>
                    <li>"Explique-moi le système cardiovasculaire"</li>
                    <li>"Quelles sont les principales fonctions du foie ?"</li>
                    <li>"Génère un QCM sur l'anatomie du cerveau"</li>
                    <li>"Crée des flashcards sur la physiologie respiratoire"</li>
                  </ul>
                </div>
                <button class="btn btn-primary" onclick="aiChatManager.startNewConversation()">
                  <i class="fas fa-comments"></i> Commencer une conversation
                </button>
              </div>
            </div>

            <div class="chat-interface" id="chat-interface" style="display: none;">
              <div class="chat-header">
                <h3 id="conversation-title">Nouvelle conversation</h3>
                <div class="chat-actions">
                  <button class="btn btn-secondary" onclick="aiChatManager.renameConversation()">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-error" onclick="aiChatManager.deleteConversation()">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div class="chat-messages" id="chat-messages">
                <div class="messages-container" id="messages-container"></div>
              </div>

              <div class="chat-input-area">
                <div class="input-container">
                  <textarea 
                    id="message-input" 
                    placeholder="Posez votre question..."
                    rows="1"
                    onkeydown="aiChatManager.handleKeyPress(event)"
                  ></textarea>
                  <button 
                    class="btn btn-primary send-btn" 
                    onclick="aiChatManager.sendMessage()"
                    disabled
                  >
                    <i class="fas fa-paper-plane"></i>
                  </button>
                </div>
                <div class="input-suggestions">
                  <button class="suggestion-btn" onclick="aiChatManager.useSuggestion('Explique-moi le système cardiovasculaire')">
                    Système cardiovasculaire
                  </button>
                  <button class="suggestion-btn" onclick="aiChatManager.useSuggestion('Génère un QCM sur l\'anatomie')">
                    QCM Anatomie
                  </button>
                  <button class="suggestion-btn" onclick="aiChatManager.useSuggestion('Crée des flashcards sur la physiologie')">
                    Flashcards Physio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.initChatEvents();
  }

  initChatEvents() {
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.querySelector('.send-btn');

    // Auto-resize textarea
    messageInput.addEventListener('input', () => {
      messageInput.style.height = 'auto';
      messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
      
      // Enable/disable send button
      sendBtn.disabled = !messageInput.value.trim();
    });

    // Focus on input when chat interface is shown
    messageInput.addEventListener('focus', () => {
      messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
    });
  }

  async loadConversations() {
    try {
      const userData = await window.QCMMedicineApp.getUserData();
      this.conversations = userData?.conversations || [];
      this.renderConversationsList();
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
    }
  }

  renderConversationsList() {
    const conversationsList = document.getElementById('conversations-list');
    
    if (this.conversations.length === 0) {
      conversationsList.innerHTML = `
        <div class="no-conversations">
          <p>Aucune conversation</p>
          <button class="btn btn-primary" onclick="aiChatManager.startNewConversation()">
            Commencer
          </button>
        </div>
      `;
      return;
    }

    conversationsList.innerHTML = this.conversations.map(conv => `
      <div class="conversation-item ${this.currentConversation?.id === conv.id ? 'active' : ''}" 
           onclick="aiChatManager.loadConversation('${conv.id}')">
        <div class="conversation-info">
          <h4>${conv.title}</h4>
          <p>${conv.messages.length} messages</p>
        </div>
        <div class="conversation-date">
          ${new Date(conv.createdAt).toLocaleDateString()}
        </div>
      </div>
    `).join('');
  }

  startNewConversation() {
    const conversation = {
      id: this.generateId(),
      title: 'Nouvelle conversation',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.conversations.unshift(conversation);
    this.currentConversation = conversation;
    
    this.saveConversations();
    this.renderConversationsList();
    this.showChatInterface();
    this.displayMessages();
  }

  async loadConversation(conversationId) {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    this.currentConversation = conversation;
    this.renderConversationsList();
    this.showChatInterface();
    this.displayMessages();
  }

  showChatInterface() {
    document.getElementById('chat-welcome').style.display = 'none';
    document.getElementById('chat-interface').style.display = 'flex';
    
    const title = document.getElementById('conversation-title');
    title.textContent = this.currentConversation.title;
    
    // Focus on input
    setTimeout(() => {
      document.getElementById('message-input').focus();
    }, 100);
  }

  displayMessages() {
    const container = document.getElementById('messages-container');
    
    if (this.currentConversation.messages.length === 0) {
      container.innerHTML = `
        <div class="empty-chat">
          <i class="fas fa-comments"></i>
          <p>Commencez la conversation en posant votre première question</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.currentConversation.messages.map(message => `
      <div class="message ${message.role}">
        <div class="message-avatar">
          ${message.role === 'user' ? 
            '<i class="fas fa-user"></i>' : 
            '<i class="fas fa-robot"></i>'
          }
        </div>
        <div class="message-content">
          <div class="message-text">${this.formatMessage(message.content)}</div>
          <div class="message-time">
            ${new Date(message.timestamp).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    `).join('');

    this.scrollToBottom();
  }

  formatMessage(content) {
    // Convertir les retours à la ligne en <br>
    return content.replace(/\n/g, '<br>');
  }

  async sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (!message || this.isTyping) return;

    // Ajouter le message utilisateur
    this.addMessage('user', message);
    input.value = '';
    input.style.height = 'auto';
    document.querySelector('.send-btn').disabled = true;

    // Simuler la réponse de l'IA
    this.isTyping = true;
    this.showTypingIndicator();
    
    try {
      const response = await this.getAIResponse(message);
      this.hideTypingIndicator();
      this.addMessage('assistant', response);
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage('assistant', 'Désolé, je n\'ai pas pu traiter votre demande. Veuillez réessayer.');
    }

    this.isTyping = false;
  }

  addMessage(role, content) {
    const message = {
      role: role,
      content: content,
      timestamp: new Date().toISOString()
    };

    this.currentConversation.messages.push(message);
    this.currentConversation.updatedAt = new Date().toISOString();
    
    this.saveConversations();
    this.displayMessages();
  }

  showTypingIndicator() {
    const container = document.getElementById('messages-container');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant typing';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-robot"></i>
      </div>
      <div class="message-content">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    container.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  async getAIResponse(message) {
    // Simuler un délai de réponse
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Utiliser le service IA pour générer une réponse
    try {
      const userData = await window.QCMMedicineApp.getUserData();
      const documents = userData?.documents || [];
      
      // Créer un contexte à partir des documents
      const context = documents.map(doc => doc.content).join('\n\n');
      
      const response = await window.QCMMedicineApp.aiService.answerQuestion(message, context, this.currentConversation.title);
      return response;
    } catch (error) {
      console.error('Erreur lors de la génération de la réponse IA:', error);
      return this.getFallbackResponse(message);
    }
  }

  getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('qcm') || lowerMessage.includes('question')) {
      return `Je peux vous aider à générer des QCM ! Voici quelques questions d'exemple sur l'anatomie :

1. **Quelle est la fonction principale du cœur ?**
   - A) Pomper le sang
   - B) Filtrer le sang
   - C) Stocker le sang
   - D) Produire le sang

2. **Combien d'os y a-t-il dans le corps humain adulte ?**
   - A) 156
   - B) 206
   - C) 256
   - D) 306

Voulez-vous que je génère plus de questions sur un sujet spécifique ?`;
    }
    
    if (lowerMessage.includes('flashcard') || lowerMessage.includes('carte')) {
      return `Voici quelques exemples de flashcards que je peux créer :

**Question :** Qu'est-ce que l'anatomie ?
**Réponse :** L'étude de la structure et de l'organisation du corps humain.

**Question :** Quelles sont les 4 cavités du cœur ?
**Réponse :** Oreillette droite, oreillette gauche, ventricule droit, ventricule gauche.

**Question :** Quel est le plus grand organe du corps humain ?
**Réponse :** La peau, avec une surface d'environ 2 m².

Souhaitez-vous des flashcards sur un sujet particulier ?`;
    }
    
    if (lowerMessage.includes('anatomie') || lowerMessage.includes('cœur') || lowerMessage.includes('cerveau')) {
      return `Je peux vous expliquer l'anatomie ! Voici quelques points clés :

**Le système cardiovasculaire :**
- Le cœur est un muscle creux qui pompe le sang
- Il a 4 cavités : 2 oreillettes et 2 ventricules
- Le sang circule dans les artères et les veines

**Le cerveau :**
- Centre de contrôle du système nerveux
- Composé de matière grise et blanche
- Divisé en plusieurs lobes avec des fonctions spécifiques

Avez-vous des questions plus précises sur un aspect particulier ?`;
    }
    
    return `Merci pour votre question ! Je suis votre assistant IA spécialisé en médecine. 

Je peux vous aider avec :
- **Explications médicales** : Anatomie, physiologie, pathologie
- **Génération de QCM** : Questions à choix multiples
- **Création de flashcards** : Cartes de révision
- **Résumés** : Synthèses de cours

N'hésitez pas à me poser des questions spécifiques sur vos cours ou à me demander de générer du contenu de révision !`;
  }

  handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  useSuggestion(suggestion) {
    const input = document.getElementById('message-input');
    input.value = suggestion;
    input.focus();
    input.dispatchEvent(new Event('input'));
  }

  async renameConversation() {
    if (!this.currentConversation) return;

    const newTitle = prompt('Nouveau nom de la conversation :', this.currentConversation.title);
    if (newTitle && newTitle.trim()) {
      this.currentConversation.title = newTitle.trim();
      this.currentConversation.updatedAt = new Date().toISOString();
      
      this.saveConversations();
      this.renderConversationsList();
      
      const title = document.getElementById('conversation-title');
      title.textContent = this.currentConversation.title;
    }
  }

  async deleteConversation() {
    if (!this.currentConversation) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
      this.conversations = this.conversations.filter(c => c.id !== this.currentConversation.id);
      this.saveConversations();
      this.renderConversationsList();
      
      this.currentConversation = null;
      document.getElementById('chat-welcome').style.display = 'block';
      document.getElementById('chat-interface').style.display = 'none';
    }
  }

  async saveConversations() {
    try {
      const userData = await window.QCMMedicineApp.getUserData() || {};
      userData.conversations = this.conversations;
      await window.QCMMedicineApp.saveUserData(userData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des conversations:', error);
    }
  }

  scrollToBottom() {
    const container = document.getElementById('messages-container');
    container.scrollTop = container.scrollHeight;
  }

  generateId() {
    return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

// Rendre le gestionnaire global
window.aiChatManager = new AIChatManager();