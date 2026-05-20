<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #0a2463 0%, #1e3f8a 50%, #3e64af 100%);
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
}
</style>