# U-Ask Chatbot Test Suite

This repository contains automated tests for the U-Ask UAE Government Chatbot using Playwright.

## Features

- End-to-end testing of chatbot functionality
- UI behavior validation
- Response validation for both English and Arabic queries
- Security testing against injection attempts
- Accessibility testing
- Page Object Model implementation
- Comprehensive test data management

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd u-ask-tests
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npm run test:install
```

## Project Structure

```
├── tests/
│   ├── pages/           # Page Object Models
│   ├── data/            # Test data management
│   ├── ui/              # UI-specific tests
│   ├── security/        # Security tests
│   ├── ai/              # AI-specific tests
│   └── chatbot.spec.ts  # Main test file
├── playwright.config.ts # Playwright configuration
└── test-data.json      # Test data
```

## Running Tests

### Basic Commands

- Run all tests:
```bash
npm test
```

- Run tests in headed mode:
```bash
npm run test:headed
```

- Run tests with retries:
```bash
npm run test:retry
```

- Run tests in parallel:
```bash
npm run test:parallel
```

### Specific Test Suites

- UI Behavior Tests:
```bash
npm run test:ui
```

- Security Tests:
```bash
npm run test:security
```

- Accessibility Tests:
```bash
npm run test:accessibility
```

### Debugging

- Run tests in debug mode:
```bash
npm run test:debug
```

- Generate test code:
```bash
npm run test:codegen
```

### Reports

- View test report:
```bash
npm run test:report
```

## Code Quality

- Lint code:
```bash
npm run lint
```

- Fix linting issues:
```bash
npm run lint:fix
```

- Format code:
```bash
npm run format
```

## Best Practices

1. **Page Object Model**
   - All page interactions are encapsulated in the `ChatbotPage` class
   - Selectors are defined as class properties
   - Methods represent user actions

2. **Test Data Management**
   - Test data is managed through `TestDataManager`
   - Supports both English and Arabic queries
   - Includes security test cases

3. **Error Handling**
   - Comprehensive error handling in all test methods
   - Detailed error logging
   - Graceful failure handling

4. **Accessibility**
   - Keyboard navigation testing
   - Loading state verification
   - RTL support for Arabic

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure they pass
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 