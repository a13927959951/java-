import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 8080

app.use(cors())
app.use(express.json())

const questions = [
  {
    id: 1,
    level: 1,
    question: 'Java中，以下哪个类是所有字节输入流的抽象基类？',
    options: ['OutputStream', 'InputStream', 'Reader', 'Writer'],
    correct: 1,
    explanation: 'InputStream 是所有字节输入流的抽象基类，OutputStream 是字节输出流基类，Reader/Writer 是字符流基类。'
  },
  {
    id: 2,
    level: 1,
    question: 'InputStream的read()方法返回-1表示什么？',
    options: ['读取错误', '文件结束', '读取超时', '缓冲区为空'],
    correct: 1,
    explanation: 'read()方法返回-1表示已到达输入流的末尾。'
  },
  {
    id: 3,
    level: 2,
    question: 'BufferedReader的readLine()方法返回什么？',
    options: ['字节', '字符', '字符串', '整数'],
    correct: 2,
    explanation: 'readLine()方法读取一行文本并返回字符串，到达文件末尾时返回null。'
  },
  {
    id: 4,
    level: 2,
    question: '以下哪个流是字符流？',
    options: ['FileInputStream', 'BufferedInputStream', 'FileReader', 'DataOutputStream'],
    correct: 2,
    explanation: 'FileReader是字符输入流，其他选项都是字节流。'
  },
  {
    id: 5,
    level: 3,
    question: 'OutputStreamWriter的作用是什么？',
    options: ['将字节转为字符', '将字符转为字节', '缓冲输出', '序列化对象'],
    correct: 1,
    explanation: 'OutputStreamWriter是字符流到字节流的桥梁，将字符编码为字节。'
  },
  {
    id: 6,
    level: 3,
    question: 'try-with-resources语句的优势是什么？',
    options: ['代码更短', '自动关闭资源', '运行更快', '占用内存更少'],
    correct: 1,
    explanation: 'try-with-resources会自动关闭实现AutoCloseable接口的资源，即使发生异常也能正确关闭。'
  },
  {
    id: 7,
    level: 4,
    question: '以下哪个类用于对象序列化？',
    options: ['FileOutputStream', 'ObjectOutputStream', 'DataOutputStream', 'BufferedOutputStream'],
    correct: 1,
    explanation: 'ObjectOutputStream用于将Java对象序列化并写入输出流。'
  },
  {
    id: 8,
    level: 4,
    question: '以下哪个接口用于自动资源管理？',
    options: ['Closeable', 'AutoCloseable', 'Serializable', 'Cloneable'],
    correct: 1,
    explanation: 'AutoCloseable接口是try-with-resources的基础，Java 7引入。'
  },
  {
    id: 9,
    level: 5,
    question: 'Java NIO中，flip()方法的作用是什么？',
    options: ['翻转缓冲区', '切换到读模式', '清空缓冲区', '写入数据'],
    correct: 1,
    explanation: 'flip()方法将缓冲区从写模式切换到读模式，设置limit=position，position=0。'
  },
  {
    id: 10,
    level: 5,
    question: 'Java NIO中，Channel的主要特点是什么？',
    options: ['只能读', '只能写', '双向传输', '只能处理文件'],
    correct: 2,
    explanation: 'Channel是双向的，可以同时进行读写操作。'
  },
  {
    id: 11,
    level: 6,
    question: 'FileReader和InputStreamReader的关系是什么？',
    options: ['没有关系', 'FileReader继承InputStreamReader', 'InputStreamReader继承FileReader', '都是抽象类'],
    correct: 1,
    explanation: 'FileReader继承自InputStreamReader，是读取字符文件的便捷类。'
  },
  {
    id: 12,
    level: 6,
    question: 'BufferedInputStream的默认缓冲区大小是多少？',
    options: ['1024字节', '2048字节', '4096字节', '8192字节'],
    correct: 3,
    explanation: 'BufferedInputStream的默认缓冲区大小为8192字节（8KB）。'
  }
]

// 成就系统数据
const achievements = [
  { id: 1, name: '初次启程', description: '完成第1关', icon: '🌟' },
  { id: 2, name: '流之使者', description: '完成第2关', icon: '🌊' },
  { id: 3, name: '缓冲大师', description: '完成第3关', icon: '⚡' },
  { id: 4, name: '文件掌控者', description: '完成第4关', icon: '📁' },
  { id: 5, name: 'NIO探索者', description: '完成第5关', icon: '🚀' },
  { id: 6, name: '知识达人', description: '通过知识导图测验', icon: '🧠' },
  { id: 7, name: '满分选手', description: '任一关卡满分通关', icon: '💯' },
  { id: 8, name: '无尽勇士', description: '无尽模式连续答对10题', icon: '♾️' },
  { id: 9, name: 'Java I/O大师', description: '通过全部关卡', icon: '👑' },
  { id: 10, name: '终身学习者', description: '累计答对50题', icon: '📚' }
]

app.get('/api/questions/random', (req, res) => {
  const difficulty = parseInt(req.query.difficulty) || 1
  const levelQuestions = questions.filter(q => q.level <= difficulty)
  if (levelQuestions.length === 0) {
    return res.json(questions[Math.floor(Math.random() * questions.length)])
  }
  const question = levelQuestions[Math.floor(Math.random() * levelQuestions.length)]
  res.json(question)
})

app.post('/api/questions/random', (req, res) => {
  const difficulty = (req.body && req.body.difficulty) ? parseInt(req.body.difficulty) : 1
  const levelQuestions = questions.filter(q => q.level <= difficulty)
  if (levelQuestions.length === 0) {
    return res.json(questions[Math.floor(Math.random() * questions.length)])
  }
  const question = levelQuestions[Math.floor(Math.random() * levelQuestions.length)]
  res.json(question)
})

app.get('/api/questions/all', (req, res) => {
  res.json(questions)
})

app.get('/api/questions/level/:level', (req, res) => {
  const level = parseInt(req.params.level)
  const levelQuestions = questions.filter(q => q.level === level)
  res.json(levelQuestions)
})

app.get('/api/achievements', (req, res) => {
  res.json(achievements)
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

const rolePrompts = {
  general: '你是一个专业的 Java 编程助手，擅长解答 Java 输入输出（I/O）相关问题。请用中文回答，保持专业且友好。',
  code: '你是一个 Java 代码生成专家。请根据用户需求生成高质量的 Java 代码，必须包含详细的中文注释。代码要完整、可运行。',
  question: '你是一个 Java 出题专家。请根据用户需求生成 Java I/O 相关的选择题，格式为：题目\nA. 选项1\nB. 选项2\nC. 选项3\nD. 选项4\n正确答案：X\n解析：...',
  ioExpert: '你是 Java I/O 领域的顶级专家。请深入详细地解答关于 Java 输入输出流、NIO、文件操作、序列化、字符编码等问题。用中文回答，举例说明。'
}

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { apiKey, message, role } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({ error: '消息不能为空' })
    }

    if (!apiKey || !apiKey.trim()) {
      return res.json({
        reply: getLocalReply(message, role || 'general')
      })
    }

    const systemPrompt = rolePrompts[role] || rolePrompts.general

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 4096,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`DeepSeek API 错误 (${response.status}): ${errorData}`)
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || '暂无响应'

    res.json({ reply })
  } catch (error) {
    console.error('AI Chat Error:', error.message)
    res.json({
      reply: `❌ AI 服务暂时不可用：${error.message}\n\n请检查 API 密钥是否正确，或稍后重试喵~`
    })
  }
})

function getLocalReply(message, role) {
  const msg = message.toLowerCase()

  if (role === 'code') {
    if (msg.includes('读取文件') || msg.includes('read') || msg.includes('fileinputstream')) {
      return `以下是使用 Java I/O 读取文件的示例代码：

\`\`\`java
import java.io.*;

public class FileReadExample {
    public static void main(String[] args) {
        String filePath = "test.txt";
        
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.err.println("读取文件失败: " + e.getMessage());
        }
    }
}
\`\`\`

🔑 **关键点：**
- 使用 \`try-with-resources\` 自动关闭流
- \`BufferedReader\` 提供 \`readLine()\` 方法逐行读取
- \`FileReader\` 是字符流，适合读取文本文件`
    }

    if (msg.includes('写入文件') || msg.includes('write') || msg.includes('fileoutputstream')) {
      return `以下是使用 Java I/O 写入文件的示例代码：

\`\`\`java
import java.io.*;

public class FileWriteExample {
    public static void main(String[] args) {
        String content = "Hello, Java I/O!\\n这是第二行内容。";
        
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt"))) {
            writer.write(content);
            writer.newLine();
            writer.write("追加的一行。");
            System.out.println("文件写入成功！");
        } catch (IOException e) {
            System.err.println("写入文件失败: " + e.getMessage());
        }
    }
}
\`\`\`

💡 **提示：** \`BufferedWriter\` 的默认缓冲区为 8192 字节，可使用 \`flush()\` 强制刷新。`
    }
  }

  if (msg.includes('字节流') || msg.includes('inputstream') || msg.includes('outputstream')) {
    return `📘 **Java 字节流**是以字节（8位）为单位进行读写的流，适合处理二进制数据（图片、视频等）。

**常用字节流：**
| 类型 | 输入流 | 输出流 |
|------|--------|--------|
| 基础流 | \`InputStream\` | \`OutputStream\` |
| 文件流 | \`FileInputStream\` | \`FileOutputStream\` |
| 缓冲流 | \`BufferedInputStream\` | \`BufferedOutputStream\` |
| 数据流 | \`DataInputStream\` | \`DataOutputStream\` |
| 对象流 | \`ObjectInputStream\` | \`ObjectOutputStream\` |

**核心方法：**
- \`read()\` - 读取一个字节，返回 -1 表示文件结束
- \`write(int b)\` - 写入一个字节
- \`close()\` - 关闭流释放资源`
  }

  if (msg.includes('字符流') || msg.includes('reader') || msg.includes('writer')) {
    return `📘 **Java 字符流**是以字符（16位Unicode）为单位进行读写的流，适合处理文本数据，支持中文等。

**常用字符流：**
| 类型 | 输入流 | 输出流 |
|------|--------|--------|
| 基础流 | \`Reader\` | \`Writer\` |
| 文件流 | \`FileReader\` | \`FileWriter\` |
| 缓冲流 | \`BufferedReader\` | \`BufferedWriter\` |
| 转换流 | \`InputStreamReader\` | \`OutputStreamWriter\` |

🔑 **转换流是关键桥梁：**
- \`InputStreamReader\`：字节 → 字符（解码）
- \`OutputStreamWriter\`：字符 → 字节（编码）`
  }

  if (msg.includes('nio') || msg.includes('channel') || msg.includes('buffer')) {
    return `🚀 **Java NIO（New I/O）**提供非阻塞I/O操作，三大核心组件：

1. **Channel（通道）** - 双向数据传输
   - \`FileChannel\` - 文件通道
   - \`SocketChannel\` - 网络通道

2. **Buffer（缓冲区）** - 数据容器
   - \`flip()\` - 切换到读模式
   - \`clear()\` - 清空缓冲区
   - \`remaining()\` - 剩余元素数量

3. **Selector（选择器）** - 单线程管理多通道，实现高并发`
  }

  if (msg.includes('序列化') || msg.includes('serializable')) {
    return `📦 **Java 序列化**是将对象转换为字节序列的过程，便于存储和传输。

\`\`\`java
import java.io.*;

class Person implements Serializable {
    private static final long serialVersionUID = 1L;
    private String name;
    private transient int age; // 不序列化
    
    // 构造器、getter、setter...
}

// 序列化
try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("person.ser"))) {
    oos.writeObject(new Person("张三", 25));
}

// 反序列化
try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("person.ser"))) {
    Person p = (Person) ois.readObject();
}
\`\`\`

⚠️ \`transient\` 关键字标记的字段不会被序列化。`
  }

  return `你好！我是 Java I/O AI 助手喵~ 🐱

我可以帮你解答以下方面的知识：
- 📥 **字节流**（InputStream/OutputStream）
- 📝 **字符流**（Reader/Writer）
- ⚡ **缓冲流**（BufferedStream）
- 🚀 **NIO**（Channel/Buffer/Selector）
- 📦 **序列化**（ObjectStream）
- 📁 **文件操作**（File/Files）
- 🔒 **try-with-resources** 资源管理

💡 **提示：** 设置 DeepSeek API 密钥后，我可以调用 AI 大模型提供更智能的回答！只需免费注册 DeepSeek 获取密钥即可喵~`
}

app.listen(PORT, () => {
  console.log(`🚀 Java I/O Game Server is running on http://localhost:${PORT}`)
  console.log(`📋 API Endpoints:`)
  console.log(`   GET/POST /api/questions/random  - 随机获取题目`)
  console.log(`   GET /api/questions/all          - 获取所有题目`)
  console.log(`   GET /api/questions/level/:level - 按关卡获取题目`)
  console.log(`   GET /api/achievements           - 获取成就列表`)
  console.log(`   GET /api/health                 - 健康检查`)
})
