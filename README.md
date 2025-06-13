# AskUI Chatbot Test Automation Framework

A comprehensive test automation framework for validating the AskUI chatbot application's functionality, security, and AI capabilities. This framework implements advanced testing strategies using Playwright and TypeScript, with a focus on multi-language support, semantic analysis, and security validation.

## 🌟 Key Features

### 🤖 AI & Language Processing
- **Multi-language Support**: Comprehensive testing for both English and Arabic responses
- **Semantic Similarity Analysis**: Advanced text comparison using TensorFlow.js and Universal Sentence Encoder
- **Hallucination Detection**: Sophisticated tests to identify and prevent AI hallucinations
- **Response Quality Validation**: Ensures consistent and accurate responses across languages

### 🔒 Security & Validation
- **Input Validation**: Comprehensive testing of various input types and edge cases
- **XSS Prevention**: Security measures against cross-site scripting attacks
- **Malicious Input Handling**: Protection against harmful user inputs
- **System Command Injection Prevention**: Security against command injection attempts
- **HTML Formatting Validation**: Ensures safe and proper response formatting

### 🎯 UI & Interaction Testing
- **Automated UI Testing**: Comprehensive UI interaction validation
- **Accessibility Testing**: Ensures the chatbot is accessible to all users
- **Responsive Design Testing**: Validates chatbot behavior across different devices
- **User Flow Validation**: Tests complete user interaction flows

## 🛠️ Technology Stack

### Core Technologies
- **Playwright**: Modern end-to-end testing framework for web applications
- **TypeScript**: Type-safe JavaScript for robust test development
- **TensorFlow.js**: Machine learning library for semantic analysis
- **Universal Sentence Encoder**: Advanced text comparison capabilities

### Development Tools
- **ESLint**: Code quality and style enforcement
- **Prettier**: Code formatting
- **Playwright Test Runner**: Test execution and reporting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher) or yarn (v1.22 or higher)
- TypeScript (v4.5 or higher)
- Git

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/TechieVats/AskUI.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Build the project:
```bash
npm run build
```

## 🏃‍♂️ Running Tests

### Basic Test Execution
```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in debug mode
npm run test:debug
```

### Advanced Test Options
```bash
# Run specific test categories
npm run test:ai        # Run AI-specific tests
npm run test:security  # Run security tests
npm run test:ui        # Run UI tests

# Run tests with specific configuration
npm run test:headed    # Run tests in headed mode
npm run test:parallel  # Run tests in parallel
```

## 📁 Project Structure

```
├── tests/
│   ├── ai/                 # AI-specific tests
│   │   ├── response-validation.spec.ts
│   │   └── hallucination-detection.spec.ts
│   ├── data/              # Test data management
│   │   ├── TestDataManager.ts
│   │   └── test-data.json
│   ├── pages/             # Page object models
│   │   └── ChatbotPage.ts
│   ├── security/          # Security tests
│   │   ├── xss.spec.ts
│   │   └── injection.spec.ts
│   ├── types/             # TypeScript type definitions
│   ├── ui/                # UI interaction tests
│   └── utils/             # Utility functions
│       └── text-similarity.ts
├── playwright.config.ts   # Playwright configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies
```

## 🧪 Test Categories

### Response Validation
- **English Query Testing**: Validates responses to English queries
- **Arabic Query Testing**: Ensures proper handling of Arabic language inputs
- **Semantic Analysis**: Advanced text similarity validation
- **Fallback Handling**: Tests system behavior with invalid inputs
- **Format Validation**: Ensures proper HTML formatting in responses

### Security Testing
- **Input Validation**: Tests various input types and edge cases
- **XSS Prevention**: Validates protection against cross-site scripting
- **Malicious Input**: Tests handling of potentially harmful inputs
- **Command Injection**: Ensures protection against system command injection

### AI Functionality
- **Hallucination Detection**: Identifies and prevents AI hallucinations
- **Multi-language Support**: Validates consistent behavior across languages
- **Semantic Consistency**: Ensures meaning preservation across languages
- **Response Quality**: Validates response accuracy and relevance

## ⚠️ Important Notes

### Test Execution
- Tests include a 60-second wait time for manual reCAPTCHA handling
- Tests run in serial mode to prevent interference
- Some tests require manual intervention for reCAPTCHA verification

### Best Practices
- Always run tests in a clean environment
- Keep test data up to date
- Follow the established naming conventions
- Document any new test cases

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Write clear, descriptive commit messages
- Follow the existing code style
- Add tests for new features
- Update documentation as needed


## 👥 Authors

- **Abhishek Vats** - *Initial work* - [Your GitHub Profile](https://github.com/TechieVats)
