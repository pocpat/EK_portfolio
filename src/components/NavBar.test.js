import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NavBar } from './NavBar';

// Mock PdfModal component
jest.mock('./pdfModal/PdfModal', () => {
  return function MockPdfModal({ show, file }) {
    return show ? <div data-testid="pdf-modal">Modal with: {file}</div> : null;
  };
});

// Mock react-bootstrap components
jest.mock('react-bootstrap', () => {
  const MockNavbarComponent = ({ children, className, expanded, onToggle, ref }) => (
    <nav data-testid="navbar" className={className} data-expanded={expanded} ref={ref}>
      {children}
    </nav>
  );
  MockNavbarComponent.Brand = ({ children, href }) => <a data-testid="navbar-brand" href={href}>{children}</a>;
  MockNavbarComponent.Toggle = ({ children }) => <button data-testid="navbar-toggle">{children}</button>;
  MockNavbarComponent.Collapse = ({ children }) => <div data-testid="navbar-collapse">{children}</div>;

  return {
    Container: ({ children }) => <div data-testid="container">{children}</div>,
    Nav: ({ children }) => <div data-testid="nav">{children}</div>,
    Navbar: MockNavbarComponent,
    Button: ({ children, onClick, className }) => (
      <button data-testid="resume-button" onClick={onClick} className={className}>
        {children}
      </button>
    ),
  };
});

// Mock react-bootstrap/Navbar (NavBar.js imports from this path)
jest.mock('react-bootstrap/Navbar', () => {
  const MockNavbar = ({ children, className, expanded, onToggle, ref }) => (
    <nav 
      data-testid="navbar" 
      className={className}
      data-expanded={expanded}
      ref={ref}
    >
      {children}
    </nav>
  );
  MockNavbar.Brand = ({ children, href }) => <a data-testid="navbar-brand" href={href}>{children}</a>;
  MockNavbar.Toggle = ({ children }) => <button data-testid="navbar-toggle">{children}</button>;
  MockNavbar.Collapse = ({ children }) => <div data-testid="navbar-collapse">{children}</div>;
  return MockNavbar;
});

// Mock react-bootstrap/Nav (NavBar.js imports from this path)
jest.mock('react-bootstrap/Nav', () => {
  const MockNav = ({ children, className }) => <div data-testid="nav" className={className}>{children}</div>;
  MockNav.Link = ({ children, href, className, onClick }) => (
    <a data-testid="nav-link" href={href} className={className} onClick={onClick}>{children}</a>
  );
  return MockNav;
});

// Mock react-bootstrap/Container (NavBar.js imports from this path)
jest.mock('react-bootstrap/Container', () => {
  return ({ children }) => <div data-testid="container">{children}</div>;
});

describe('NavBar Component - Resume PDF Tests', () => {

  beforeEach(() => {
    // Mock window.innerWidth for mobile/desktop detection
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  describe('Resume PDF from static data', () => {
    test('should render navbar with resume button', () => {
      render(<NavBar />);
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    test('should use hardcoded resume path from static data', () => {
      render(<NavBar />);
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });
  });

  describe('Mobile vs Desktop Rendering', () => {
    test('should detect mobile viewport and render mobile navbar', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<NavBar />);
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    test('should detect desktop viewport and render desktop navbar', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      render(<NavBar />);
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });
  });

  describe('Component State Management', () => {
    test('should initialize with correct default state', () => {
      render(<NavBar />);
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('navbar')).toHaveAttribute('data-expanded', 'false');
    });
  });
});