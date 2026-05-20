#include <iostream>
#include <string>
#include <memory>
#include <vector>
#include "../include/nlohmann/json.hpp"

#ifdef _WIN32
#include <winsock2.h>
#include <ws2tcpip.h>
#pragma comment(lib, "Ws2_32.lib")
#else
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <arpa/inet.h>
#endif

using json = nlohmann::json;

// 题目数据
std::vector<json> questions = {
    {
        {"question", "Java中，以下哪个类是所有字节输入流的抽象基类？"},
        {"options", {"OutputStream", "InputStream", "Reader", "Writer"}},
        {"correct", 1},
        {"explanation", "InputStream 是所有字节输入流的抽象基类，OutputStream 是字节输出流基类，Reader/Writer 是字符流基类。"}
    },
    {
        {"question", "BufferedReader的readLine()方法返回什么？"},
        {"options", {"字节", "字符", "字符串", "整数"}},
        {"correct", 2},
        {"explanation", "readLine()方法读取一行文本并返回字符串，到达文件末尾时返回null。"}
    },
    {
        {"question", "Java NIO中，flip()方法的作用是什么？"},
        {"options", {"翻转缓冲区", "切换到读模式", "清空缓冲区", "写入数据"}},
        {"correct", 1},
        {"explanation", "flip()方法将缓冲区从写模式切换到读模式，设置limit=position，position=0。"}
    },
    {
        {"question", "try-with-resources语句的优势是什么？"},
        {"options", {"代码更短", "自动关闭资源", "运行更快", "占用内存更少"}},
        {"correct", 1},
        {"explanation", "try-with-resources会自动关闭实现AutoCloseable接口的资源，即使发生异常也能正确关闭。"}
    },
    {
        {"question", "以下哪个类用于对象序列化？"},
        {"options", {"FileOutputStream", "ObjectOutputStream", "DataOutputStream", "BufferedOutputStream"}},
        {"correct", 1},
        {"explanation", "ObjectOutputStream用于将Java对象序列化并写入输出流。"}
    },
    {
        {"question", "InputStream的read()方法返回-1表示什么？"},
        {"options", {"读取错误", "文件结束", "读取超时", "缓冲区为空"}},
        {"correct", 1},
        {"explanation", "read()方法返回-1表示已到达输入流的末尾。"}
    },
    {
        {"question", "以下哪个流是字符流？"},
        {"options", {"FileInputStream", "BufferedInputStream", "FileReader", "DataOutputStream"}},
        {"correct", 2},
        {"explanation", "FileReader是字符输入流，其他选项都是字节流。"}
    },
    {
        {"question", "Java NIO中，Channel的主要特点是什么？"},
        {"options", {"只能读", "只能写", "双向传输", "只能处理文件"}},
        {"correct", 2},
        {"explanation", "Channel是双向的，可以同时进行读写操作。"}
    },
    {
        {"question", "OutputStreamWriter的作用是什么？"},
        {"options", {"将字节转为字符", "将字符转为字节", "缓冲输出", "序列化对象"}},
        {"correct", 1},
        {"explanation", "OutputStreamWriter是字符流到字节流的桥梁，将字符编码为字节。"}
    },
    {
        {"question", "以下哪个接口用于自动资源管理？"},
        {"options", {"Closeable", "AutoCloseable", "Serializable", "Cloneable"}},
        {"correct", 1},
        {"explanation", "AutoCloseable接口是try-with-resources的基础，Java 7引入。"}
    }
};

std::string getContentType(const std::string& path) {
    if (path.find(".json") != std::string::npos) return "application/json";
    if (path.find(".html") != std::string::npos) return "text/html";
    if (path.find(".css") != std::string::npos) return "text/css";
    if (path.find(".js") != std::string::npos) return "application/javascript";
    return "text/plain";
}

std::string handleRequest(const std::string& request) {
    // 解析请求行
    size_t methodEnd = request.find(' ');
    if (methodEnd == std::string::npos) return "HTTP/1.1 400 Bad Request\r\n\r\n";
    
    std::string method = request.substr(0, methodEnd);
    size_t pathEnd = request.find(' ', methodEnd + 1);
    std::string path = request.substr(methodEnd + 1, pathEnd - methodEnd - 1);
    
    // 处理 API 请求
    if (path == "/api/questions/random") {
        // 解析请求体中的难度参数
        size_t bodyStart = request.find("\r\n\r\n");
        std::string body = "";
        if (bodyStart != std::string::npos) {
            body = request.substr(bodyStart + 4);
        }
        
        int difficulty = 1;
        if (!body.empty()) {
            try {
                json bodyJson = json::parse(body);
                if (bodyJson.contains("difficulty")) {
                    difficulty = bodyJson["difficulty"];
                }
            } catch (...) {}
        }
        
        // 根据难度选择题目
        int startIdx = std::min(difficulty - 1, 5);
        int endIdx = std::min(startIdx + 5, (int)questions.size());
        int idx = startIdx + rand() % (endIdx - startIdx);
        
        json response = questions[idx];
        return "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Methods: POST, GET, OPTIONS\r\nAccess-Control-Allow-Headers: Content-Type\r\n\r\n" + response.dump();
    }
    
    if (path == "/api/questions/all") {
        json response = questions;
        return "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nAccess-Control-Allow-Origin: *\r\n\r\n" + response.dump();
    }
    
    // 处理 OPTIONS 请求（CORS）
    if (method == "OPTIONS") {
        return "HTTP/1.1 200 OK\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Methods: POST, GET, OPTIONS\r\nAccess-Control-Allow-Headers: Content-Type\r\n\r\n";
    }
    
    return "HTTP/1.1 404 Not Found\r\n\r\n";
}

int main() {
    srand(time(nullptr));
    
#ifdef _WIN32
    WSADATA wsaData;
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        std::cerr << "WSAStartup failed!" << std::endl;
        return 1;
    }
#endif
    
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd < 0) {
        std::cerr << "Failed to create socket" << std::endl;
        return 1;
    }
    
    int opt = 1;
#ifdef _WIN32
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, (const char*)&opt, sizeof(opt));
#else
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
#endif
    
    sockaddr_in address;
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(8080);
    
    if (bind(server_fd, (struct sockaddr*)&address, sizeof(address)) < 0) {
        std::cerr << "Bind failed" << std::endl;
        return 1;
    }
    
    if (listen(server_fd, 3) < 0) {
        std::cerr << "Listen failed" << std::endl;
        return 1;
    }
    
    std::cout << "Server listening on http://localhost:8080" << std::endl;
    
    while (true) {
        int addrlen = sizeof(address);
        int new_socket = accept(server_fd, (struct sockaddr*)&address, (socklen_t*)&addrlen);
        if (new_socket < 0) {
            std::cerr << "Accept failed" << std::endl;
            continue;
        }
        
        char buffer[4096] = {0};
        int valread = recv(new_socket, buffer, 4096, 0);
        if (valread < 0) {
            std::cerr << "Recv failed" << std::endl;
            closesocket(new_socket);
            continue;
        }
        
        std::string request(buffer, valread);
        std::string response = handleRequest(request);
        
        send(new_socket, response.c_str(), response.size(), 0);
        closesocket(new_socket);
    }
    
#ifdef _WIN32
    WSACleanup();
#endif
    return 0;
}