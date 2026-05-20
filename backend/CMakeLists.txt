cmake_minimum_required(VERSION 3.10)

project(java-io-game-server)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

include_directories(include)

add_executable(game-server src/main.cpp)

if(WIN32)
    target_link_libraries(game-server ws2_32)
endif()

install(TARGETS game-server DESTINATION bin)