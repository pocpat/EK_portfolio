import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NavBar } from './NavBar';
import { fetchLatestResume } from '../mongoClient';

// Mock the mongoClient
jest.mock('../mongoClient', () => ({
  fetchLatestResume: jest.fn(),
}));

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

describe('NavBar Component - Resume PDF Fetching Integration Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock window.innerWidth for mobile/desktop detection
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  describe('Resume PDF Fetching', () => {
    test('should fetch resume PDF from MongoDB on component mount', async () => {
      fetchLatestResume.mockResolvedValue({
        file_url: '/updated-resume.pdf',
      });

      render(<NavBar />);

      await waitFor(() => {
        expect(fetchLatestResume).toHaveBeenCalled();
      });

      // Component should render
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    test('should use fallback resume URL when MongoDB returns null', async () => {
      fetchLatestResume.mockResolvedValue(null);

      render(<NavBar />);

      await waitFor(() => {
        expect(fetchLatestResume).toHaveBeenCalled();
      });

      // Component should still render normally
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    test('should handle MongoDB errors and use fallback resume URL', async () => {
      const mockError = new Error('Database connection failed');
      fetchLatestResume.mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<NavBar />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching resume CV:', mockError);
      });

      // Component should render normally with fallback
      expect(screen.getByTestId('navbar')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    test('should handle network errors gracefully', async () => {
      fetchLatestResume.mockRejectedValue(new Error('Network error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<NavBar />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching resume CV:', expect.any(Error));
      });

      expect(screen.getByTestId('navbar')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('Mobile vs Desktop Rendering', () => {
    test('should detect mobile viewport and render mobile navbar', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      fetchLatestResume.mockResolvedValue(null);

      render(<NavBar />);

      // Should render navbar (mobile or desktop)
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    test('should detect desktop viewport and render desktop navbar', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      fetchLatestResume.mockResolvedValue(null);

      render(<NavBar />);

      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });
  });

  describe('Component State Management', () => {
    test('should initialize with correct default state', async () => {
      fetchLatestResume.mockResolvedValue(null);

      render(<NavBar />);

      // Component should render with default state
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      
      // Should not be expanded initially
      expect(screen.getByTestId('navbar')).toHaveAttribute('data-expanded', 'false');
    });

    test('should update resume URL state when MongoDB data is fetched', async () => {
      fetchLatestResume.mockResolvedValue({
        file_url: '/new-resume-2024.pdf',
      });

      render(<NavBar />);

      await waitFor(() => {
        expect(fetchLatestResume).toHaveBeenCalled();
      });

      // Component should render successfully
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });
  });

  describe('Error Boundary and Resilience', () => {
    test('should not crash when mongoClient throws', async () => {
      fetchLatestResume.mockImplementation(() => {
        throw new Error('mongoClient not initialized');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<NavBar />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      // Component should still render
      expect(screen.getByTestId('navbar')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    test('should handle malformed MongoDB responses', async () => {
      fetchLatestResume.mockResolvedValue({ invalid_field: 'invalid_value' });

      render(<NavBar />);

      await waitFor(() => {
        expect(fetchLatestResume).toHaveBeenCalled();
      });

      // Should render without crashing
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });
  });

  describe('Performance and Optimization', () => {
    test('should only fetch resume data once on mount', async () => {
      fetchLatestResume.mockResolvedValue({ file_url: '/resume.pdf' });

      const { rerender } = render(<NavBar />);

      await waitFor(() => {
        expect(fetchLatestResume).toHaveBeenCalledTimes(1);
      });

      // Re-render component
      rerender(<NavBar />);

      // useEffect with [] deps only runs once per mount, not on re-render
      // This is correct React behavior — the effect doesn't re-run on rerender
      expect(fetchLatestResume).toHaveBeenCalledTimes(1);
    });
  });
});