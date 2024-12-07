const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8100', // URL base donde tu app está corriendo
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}', // Patrón para localizar los archivos de prueba
  },
});
