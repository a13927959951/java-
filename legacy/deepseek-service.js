// DeepSeek API 服务模块

class DeepSeekService {
    constructor() {
        this.apiKey = window.DEEPSEEK_CONFIG?.API_KEY || 'YOUR_API_KEY';
        this.baseUrl = window.DEEPSEEK_CONFIG?.BASE_URL || 'https://api.deepseek.com/v1';
        this.modelName = window.DEEPSEEK_CONFIG?.MODEL_NAME || 'deepseek-chat';
        this.maxTokens = window.DEEPSEEK_CONFIG?.MAX_TOKENS || 4096;
        this.temperature = window.DEEPSEEK_CONFIG?.TEMPERATURE || 0.7;
        this.topP = window.DEEPSEEK_CONFIG?.TOP_P || 0.95;
        this.conversationHistory = [];
    }

    /**
     * 设置 API 密钥
     * @param {string} apiKey 
     */
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem('deepseek_api_key', apiKey);
    }

    /**
     * 获取保存的 API 密钥
     * @returns {string}
     */
    getSavedApiKey() {
        return localStorage.getItem('deepseek_api_key') || '';
    }

    /**
     * 检查 API 密钥是否已设置
     * @returns {boolean}
     */
    hasApiKey() {
        return !!this.apiKey && this.apiKey !== 'YOUR_API_KEY';
    }

    /**
     * 构建请求头
     * @returns {object}
     */
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        };
    }

    /**
     * 发送消息到 DeepSeek API
     * @param {string} message - 用户消息
     * @param {string} role - 角色模板类型 (general/code/question/ioExpert)
     * @returns {Promise<string>}
     */
    async sendMessage(message, role = 'general') {
        if (!this.hasApiKey()) {
            throw new Error('请先设置 DeepSeek API 密钥');
        }

        const prompts = window.SYSTEM_PROMPTS || {};
        const systemPrompt = prompts[role] || prompts.general || `你是一个专业的 Java 编程助手。`;

        // 构建消息历史
        const messages = [
            { role: 'system', content: systemPrompt },
            ...this.conversationHistory.slice(-5), // 保留最近5条对话
            { role: 'user', content: message }
        ];

        const requestBody = {
            model: this.modelName,
            messages: messages,
            max_tokens: this.maxTokens,
            temperature: this.temperature,
            top_p: this.topP,
            stream: false
        };

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(errorData.error?.message || `HTTP error: ${response.status}`);
            }

            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content || '暂无响应';

            // 更新对话历史
            this.conversationHistory.push(
                { role: 'user', content: message },
                { role: 'assistant', content: reply }
            );

            return reply;
        } catch (error) {
            console.error('DeepSeek API 调用失败:', error);
            throw error;
        }
    }

    /**
     * 生成代码
     * @param {string} requirements - 代码需求描述
     * @returns {Promise<string>}
     */
    async generateCode(requirements) {
        return this.sendMessage(requirements, 'code');
    }

    /**
     * 生成测验题目
     * @param {string} topic - 题目主题
     * @param {number} count - 题目数量
     * @returns {Promise<string>}
     */
    async generateQuestions(topic, count = 5) {
        const prompt = `请生成 ${count} 道关于「${topic}」的 Java 选择题，格式如下：

1. 问题内容
A. 选项A
B. 选项B
C. 选项C
D. 选项D
正确答案：[字母]
解析：详细解释

请确保题目覆盖该主题的核心知识点，难度适中。`;

        return this.sendMessage(prompt, 'question');
    }

    /**
     * 生成单道 Java I/O 题目（用于无尽模式）
     * @param {number} difficulty - 难度等级 1-5
     * @returns {Promise<object>} - 返回解析后的题目对象
     */
    async generateSingleQuestion(difficulty = 1) {
        const difficultyMap = {
            1: '入门级，适合初学者',
            2: '基础级，考察基本概念',
            3: '进阶级，考察核心知识点',
            4: '高级，考察综合应用',
            5: '专家级，考察深入理解'
        };

        const topics = [
            'Java 字节流 InputStream OutputStream',
            'Java 字符流 Reader Writer',
            'Java 缓冲流 BufferedReader BufferedWriter',
            'Java 文件操作 File FileInputStream',
            'Java NIO Channel Buffer Selector',
            'Java 序列化 ObjectInputStream ObjectOutputStream',
            'Java try-with-resources 资源管理',
            'Java 字符编码 UTF-8 GBK'
        ];

        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        const prompt = `请生成一道关于「${randomTopic}」的 Java 选择题，难度为${difficultyMap[difficulty]}。

请严格按照以下 JSON 格式输出，不要添加任何额外内容：
{
    "question": "题目内容",
    "options": ["选项A", "选项B", "选项C", "选项D"],
    "correct": 正确答案索引(0-3),
    "explanation": "详细解析"
}

要求：
1. 题目必须是关于 Java I/O 相关知识
2. 选项必须有4个，用A、B、C、D标记
3. 正确答案索引必须是0、1、2、3中的一个
4. 解析要详细解释为什么正确答案是对的，其他选项为什么是错的`;

        try {
            const response = await this.sendMessage(prompt, 'question');
            // 解析 JSON
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const jsonStr = jsonMatch[0];
                return JSON.parse(jsonStr);
            } else {
                // 如果解析失败，返回一个默认题目
                return this.generateFallbackQuestion(difficulty);
            }
        } catch (error) {
            console.error('生成题目失败:', error);
            return this.generateFallbackQuestion(difficulty);
        }
    }

    /**
     * 生成备用题目（当 API 不可用时）
     */
    generateFallbackQuestion(difficulty) {
        const fallbackQuestions = [
            {
                question: "Java中，以下哪个类是所有字节输入流的抽象基类？",
                options: ["OutputStream", "InputStream", "Reader", "Writer"],
                correct: 1,
                explanation: "InputStream 是所有字节输入流的抽象基类，OutputStream 是字节输出流基类，Reader/Writer 是字符流基类。"
            },
            {
                question: "BufferedReader的readLine()方法返回什么？",
                options: ["字节", "字符", "字符串", "整数"],
                correct: 2,
                explanation: "readLine()方法读取一行文本并返回字符串，到达文件末尾时返回null。"
            },
            {
                question: "Java NIO中，flip()方法的作用是什么？",
                options: ["翻转缓冲区", "切换到读模式", "清空缓冲区", "写入数据"],
                correct: 1,
                explanation: "flip()方法将缓冲区从写模式切换到读模式，设置limit=position，position=0。"
            },
            {
                question: "try-with-resources语句的优势是什么？",
                options: ["代码更短", "自动关闭资源", "运行更快", "占用内存更少"],
                correct: 1,
                explanation: "try-with-resources会自动关闭实现AutoCloseable接口的资源，即使发生异常也能正确关闭。"
            },
            {
                question: "以下哪个类用于对象序列化？",
                options: ["FileOutputStream", "ObjectOutputStream", "DataOutputStream", "BufferedOutputStream"],
                correct: 1,
                explanation: "ObjectOutputStream用于将Java对象序列化并写入输出流。"
            }
        ];
        return fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
    }

    /**
     * 清理对话历史
     */
    clearHistory() {
        this.conversationHistory = [];
    }

    /**
     * 获取对话历史
     * @returns {Array}
     */
    getHistory() {
        return [...this.conversationHistory];
    }
}

// 创建全局实例
window.deepSeekService = new DeepSeekService();

// 在初始化时加载保存的 API 密钥
const savedKey = localStorage.getItem('deepseek_api_key');
if (savedKey) {
    window.deepSeekService.setApiKey(savedKey);
}
