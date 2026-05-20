// AI 对话界面组件

class AIChatPanel {
    constructor() {
        this.panelId = 'aiChatPanel';
        this.chatContainerId = 'chatContainer';
        this.inputId = 'aiInput';
        this.apiKeyInputId = 'apiKeyInput';
        this.roleSelectId = 'roleSelect';
        this.isInitialized = false;
    }

    /**
     * 初始化对话面板
     */
    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        
        this.createPanel();
        this.bindEvents();
        
        // 加载保存的 API 密钥
        const savedKey = window.deepSeekService?.getSavedApiKey?.() || '';
        if (savedKey) {
            document.getElementById(this.apiKeyInputId).value = savedKey;
        }
    }

    /**
     * 创建对话面板 DOM
     */
    createPanel() {
        const panelHTML = `
            <div id="${this.panelId}" class="ai-chat-panel hidden">
                <div class="ai-header">
                    <h2>🤖 DeepSeek AI 助手</h2>
                    <button class="btn-close" onclick="aiChatPanel.close()">✕</button>
                </div>
                
                <div class="api-config">
                    <div class="config-group">
                        <label>API 密钥：</label>
                        <input type="password" id="${this.apiKeyInputId}" placeholder="输入 DeepSeek API 密钥" />
                        <button class="btn-save-key" onclick="aiChatPanel.saveApiKey()">保存</button>
                    </div>
                    <div class="config-group">
                        <label>角色：</label>
                        <select id="${this.roleSelectId}">
                            <option value="general">普通问答</option>
                            <option value="code">代码生成</option>
                            <option value="question">题目生成</option>
                            <option value="ioExpert">Java I/O 专家</option>
                        </select>
                    </div>
                </div>

                <div id="${this.chatContainerId}" class="chat-container">
                    <div class="welcome-message">
                        <div class="avatar bot">🤖</div>
                        <div class="message-content">
                            <p>你好！我是 DeepSeek AI 助手，很高兴为你服务！</p>
                            <p>请先在上方输入你的 API 密钥，然后开始提问。</p>
                        </div>
                    </div>
                </div>

                <div class="input-area">
                    <input 
                        type="text" 
                        id="${this.inputId}" 
                        placeholder="输入问题..." 
                        onkeydown="if(event.keyCode === 13) aiChatPanel.sendMessage()"
                    />
                    <button class="btn-send" onclick="aiChatPanel.sendMessage()">发送</button>
                </div>
            </div>
        `;

        // 添加样式到页面头部
        const styleSheet = `
            <style>
                .ai-chat-panel {
                    position: fixed;
                    right: 20px;
                    bottom: 20px;
                    width: 400px;
                    max-height: 600px;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    z-index: 1000;
                }

                .ai-header {
                    background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
                    color: white;
                    padding: 15px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .ai-header h2 {
                    font-size: 1.2em;
                    margin: 0;
                }

                .btn-close {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1em;
                }

                .btn-close:hover {
                    background: rgba(255,255,255,0.3);
                }

                .api-config {
                    padding: 15px;
                    background: #f8f9fa;
                    border-bottom: 1px solid #e0e0e0;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .config-group {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .config-group label {
                    font-size: 0.9em;
                    color: #666;
                    min-width: 60px;
                }

                .config-group input[type="password"],
                .config-group select {
                    flex: 1;
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 0.9em;
                }

                .btn-save-key {
                    padding: 8px 15px;
                    background: #0066cc;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.85em;
                }

                .btn-save-key:hover {
                    background: #0055aa;
                }

                .chat-container {
                    flex: 1;
                    overflow-y: auto;
                    padding: 15px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .chat-message {
                    display: flex;
                    gap: 10px;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .welcome-message {
                    display: flex;
                    gap: 10px;
                }

                .avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5em;
                    flex-shrink: 0;
                }

                .avatar.user {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .avatar.bot {
                    background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
                    color: white;
                }

                .message-content {
                    flex: 1;
                    padding: 12px 15px;
                    border-radius: 15px;
                    line-height: 1.5;
                }

                .chat-message.user .message-content {
                    background: #e6f0ff;
                    color: #333;
                    margin-left: auto;
                    max-width: 85%;
                }

                .chat-message.bot .message-content {
                    background: #f5f5f5;
                    color: #333;
                    max-width: 90%;
                }

                .message-content code {
                    background: #2d2d2d;
                    color: #a5d8ff;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-family: 'Consolas', monospace;
                    font-size: 0.9em;
                }

                .message-content pre {
                    background: #2d2d2d;
                    color: #a5d8ff;
                    padding: 10px;
                    border-radius: 8px;
                    overflow-x: auto;
                    margin: 10px 0;
                }

                .input-area {
                    display: flex;
                    gap: 10px;
                    padding: 15px;
                    border-top: 1px solid #e0e0e0;
                }

                .input-area input {
                    flex: 1;
                    padding: 12px 15px;
                    border: 1px solid #ddd;
                    border-radius: 25px;
                    font-size: 1em;
                }

                .btn-send {
                    padding: 12px 25px;
                    background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 1em;
                }

                .btn-send:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 3px 10px rgba(0, 102, 204, 0.3);
                }

                .btn-send:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .typing-indicator {
                    display: flex;
                    gap: 5px;
                    padding: 10px;
                }

                .typing-dot {
                    width: 8px;
                    height: 8px;
                    background: #0066cc;
                    border-radius: 50%;
                    animation: typingBounce 1.4s infinite ease-in-out;
                }

                .typing-dot:nth-child(1) { animation-delay: 0s; }
                .typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .typing-dot:nth-child(3) { animation-delay: 0.4s; }

                @keyframes typingBounce {
                    0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
                    40% { transform: scale(1); opacity: 1; }
                }

                .error-message {
                    background: #f8d7da;
                    color: #721c24;
                    padding: 10px;
                    border-radius: 8px;
                    text-align: center;
                }

                .api-status {
                    font-size: 0.8em;
                    margin-left: 10px;
                }

                .api-status.valid {
                    color: #28a745;
                }

                .api-status.invalid {
                    color: #dc3545;
                }

                .hidden {
                    display: none;
                }
            </style>
        `;

        // 添加样式
        document.head.insertAdjacentHTML('beforeend', styleSheet);
        
        // 添加面板到页面
        document.body.insertAdjacentHTML('beforeend', panelHTML);
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 点击页面其他地方关闭面板（如果需要）
    }

    /**
     * 显示面板
     */
    show() {
        this.init();
        document.getElementById(this.panelId).classList.remove('hidden');
    }

    /**
     * 关闭面板
     */
    close() {
        document.getElementById(this.panelId).classList.add('hidden');
    }

    /**
     * 保存 API 密钥
     */
    saveApiKey() {
        const apiKey = document.getElementById(this.apiKeyInputId).value.trim();
        if (apiKey) {
            window.deepSeekService?.setApiKey?.(apiKey);
            alert('API 密钥已保存！');
        } else {
            alert('请输入有效的 API 密钥');
        }
    }

    /**
     * 发送消息
     */
    async sendMessage() {
        const input = document.getElementById(this.inputId);
        const message = input.value.trim();
        
        if (!message) return;
        
        // 检查 API 密钥
        if (!window.deepSeekService?.hasApiKey?.()) {
            alert('请先输入并保存 API 密钥！');
            return;
        }

        const role = document.getElementById(this.roleSelectId).value;
        
        // 添加用户消息到界面
        this.addMessage(message, 'user');
        input.value = '';
        
        // 添加正在输入指示器
        const chatContainer = document.getElementById(this.chatContainerId);
        const typingIndicator = `
            <div class="chat-message bot" id="typingIndicator">
                <div class="avatar bot">🤖</div>
                <div class="message-content">
                    <div class="typing-indicator">
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                    </div>
                </div>
            </div>
        `;
        chatContainer.insertAdjacentHTML('beforeend', typingIndicator);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        try {
            // 调用 API
            const response = await window.deepSeekService.sendMessage(message, role);
            
            // 移除输入指示器
            document.getElementById('typingIndicator').remove();
            
            // 添加 AI 回复到界面
            this.addMessage(response, 'bot');
        } catch (error) {
            // 移除输入指示器
            document.getElementById('typingIndicator').remove();
            
            // 显示错误消息
            this.addMessage(`❌ 发生错误：${error.message}`, 'bot', true);
        }
    }

    /**
     * 添加消息到界面
     * @param {string} content - 消息内容
     * @param {string} sender - user 或 bot
     * @param {boolean} isError - 是否为错误消息
     */
    addMessage(content, sender, isError = false) {
        const chatContainer = document.getElementById(this.chatContainerId);
        
        // 格式化消息内容（处理代码块）
        let formattedContent = content;
        
        // 将 ```java ... ``` 转换为 <pre><code> 标签
        formattedContent = formattedContent.replace(
            /```(\w+)?\n([\s\S]*?)```/g,
            '<pre><code>$2</code></pre>'
        );
        
        // 将 `code` 转换为 <code> 标签
        formattedContent = formattedContent.replace(
            /`([^`]+)`/g,
            '<code>$1</code>'
        );
        
        // 将换行转换为 <br>
        formattedContent = formattedContent.replace(/\n/g, '<br>');

        const messageHTML = `
            <div class="chat-message ${sender} ${isError ? 'error' : ''}">
                <div class="avatar ${sender}">${sender === 'user' ? '👤' : '🤖'}</div>
                <div class="message-content">${formattedContent}</div>
            </div>
        `;

        chatContainer.insertAdjacentHTML('beforeend', messageHTML);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    /**
     * 生成题目
     * @param {string} topic - 主题
     * @param {number} count - 数量
     */
    async generateQuestions(topic, count = 5) {
        if (!window.deepSeekService?.hasApiKey?.()) {
            alert('请先输入并保存 API 密钥！');
            return;
        }

        this.addMessage(`请生成 ${count} 道关于「${topic}」的选择题`, 'user');
        
        try {
            const response = await window.deepSeekService.generateQuestions(topic, count);
            this.addMessage(response, 'bot');
        } catch (error) {
            this.addMessage(`❌ 发生错误：${error.message}`, 'bot', true);
        }
    }
}

// 创建全局实例
window.aiChatPanel = new AIChatPanel();
