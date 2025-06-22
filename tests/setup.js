// Setup para testes Jest
// Configurações globais e mocks necessários

// Mock do console para capturar logs durante os testes
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock do sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock do window.location
delete window.location;
window.location = {
  href: 'https://test.com',
  hostname: 'test.com',
  search: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn()
};

// Mock do window.open
window.open = jest.fn();

// Mock do navigator
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    clipboard: {
      writeText: jest.fn().mockResolvedValue(undefined)
    }
  },
  writable: true
});

// Mock do document.createElement
const originalCreateElement = document.createElement;
document.createElement = jest.fn().mockImplementation((tagName) => {
  const element = originalCreateElement.call(document, tagName);
  
  // Mock específico para elementos script
  if (tagName === 'script') {
    Object.defineProperty(element, 'onload', {
      set: function(fn) {
        this._onload = fn;
        // Simula carregamento bem-sucedido após um pequeno delay
        setTimeout(() => {
          if (this._onload) this._onload();
        }, 10);
      },
      get: function() {
        return this._onload;
      }
    });
    
    Object.defineProperty(element, 'onerror', {
      set: function(fn) {
        this._onerror = fn;
      },
      get: function() {
        return this._onerror;
      }
    });
  }
  
  return element;
});

// Mock do MutationObserver
global.MutationObserver = class MutationObserver {
  constructor(callback) {
    this.callback = callback;
  }
  
  observe() {
    // Mock implementation
  }
  
  disconnect() {
    // Mock implementation
  }
};

// Mock do URLSearchParams
global.URLSearchParams = class URLSearchParams {
  constructor(search) {
    this.params = new Map();
    if (search) {
      const pairs = search.replace('?', '').split('&');
      pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        if (key && value) {
          this.params.set(key, decodeURIComponent(value));
        }
      });
    }
  }
  
  get(key) {
    return this.params.get(key);
  }
  
  set(key, value) {
    this.params.set(key, value);
  }
  
  has(key) {
    return this.params.has(key);
  }
};

// Função helper para simular eventos DOM
global.simulateEvent = (element, eventType, eventData = {}) => {
  const event = new Event(eventType, { bubbles: true });
  Object.assign(event, eventData);
  element.dispatchEvent(event);
};

// Função helper para aguardar promises
global.waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Reset de mocks antes de cada teste
beforeEach(() => {
  jest.clearAllMocks();
  
  // Reset window.location
  window.location.search = '';
  window.location.href = 'https://test.com';
  
  // Reset console mocks
  console.log.mockClear();
  console.error.mockClear();
  console.warn.mockClear();
  console.info.mockClear();
  
  // Reset DOM
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});

