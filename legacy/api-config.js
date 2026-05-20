// DeepSeek API 配置文件
// 请将 YOUR_API_KEY 替换为你的实际 API 密钥

window.DEEPSEEK_CONFIG = {
    API_KEY: 'YOUR_API_KEY',
    BASE_URL: 'https://api.deepseek.com/v1',
    MODEL_NAME: 'deepseek-chat',
    MAX_TOKENS: 4096,
    TEMPERATURE: 0.7,
    TOP_P: 0.95
};

// 预设角色模板
window.SYSTEM_PROMPTS = {
    general: `你是一个专业的 Java 编程助手，擅长 Java I/O、并发编程、设计模式等领域。
请用简洁清晰的语言回答问题，必要时提供代码示例。`,
    
    code: `你是一个专业的 Java 代码生成器。
请根据用户需求生成高质量的 Java 代码，并附带必要的注释说明。`,
    
    question: `你是一个专业的 Java 测验题目生成器。
请根据用户提供的知识点生成高质量的选择题，包含问题、选项、正确答案和详细解释。`,
    
    ioExpert: `你是 Java I/O 领域的专家。
请详细解答用户关于 Java 输入输出机制的问题，包括字节流、字符流、缓冲流、NIO 等知识点。`
};
