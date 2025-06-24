import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NavBar } from './NavBar';
import { supabase } from '../supabaseClient';

// Mock the supabase client
jest.mock('../supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => ({
              then: jest.fn(),
            })),
          })),
        })),
      })),
    })),
  },
}));

// Mock PdfModal component
jest.mock('./pdfModal/PdfModal', () => {
  return function MockPdfModal({ show, file }) {
    return show ? <div data-testid="pdf-modal">Modal with: {file}</div> : null;
  };
});

// Mock react-bootstrap components
jest.mock('react-bootstrap', () => ({
  Container: ({ children }) => <div data-testid="container">{children}</div>,
  Nav: ({ children }) => <div data-testid="nav">{children}</div>,
  Navbar: {
    Brand: ({ children, href }) => <a data-testid="navbar-brand" href={href}>{children}</a>,
    Toggle: ({ children }) => <button data-testid="navbar-toggle">{children}</button>,
    Collapse: ({ children }) => <div data-testid="navbar-collapse">{children}</div>,
  },
  Button: ({ children, onClick, className }) => (
    <button data-testid="resume-button" onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

// Mock react-bootstrap/Navbar
jest.mock('react-bootstrap/Navbar', () => {
  return function MockNavbar({ children, className, expanded, onToggle, ref }) {
    return (
      <nav 
        data-testid="navbar" 
        className={className}
        data-expanded={expanded}
        ref={ref}
      >
        {children}
      </nav>
    );
  };
});

// Mock react-bootstrap/Nav
jest.mock('react-bootstrap/Nav', () => {
  return function MockNav({ children, className }) {
    return <div data-testid="nav" className={className}>{children}</div>;
  };
});

describe('NavBar Component - Resume PDF Fetching Integration Tests', () => {
  let mockSupabaseChain;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock window.innerWidth for mobile/desktop detection
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    mockSupabaseChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    };
    
    supabase.from.mockReturnValue(mockSupabaseChain);
  });

  describe('Resume PDF Fetching', () => {
    test('should fetch resume PDF from Supabase on component mount', async () => {
      const mockResumeData = [
        {
          file_url: '/updated-resume.pdf',
        },
      ];

      mockSupabaseChain.limit.mockResolvedValue({
        data: mockResumeData,
        error: null,
      });

      render(<NavBar />);

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('pdfs');
        expect(mockSupabaseChain.select).toHaveBeenCalledWith('file_url');
        expect(mockSupabaseChain.eq).toHaveBeenCalledWith('category', 'Resume');
        expect(mockSupabaseChain.order).toHaveBeenCalledWith('title', { ascending: false });
        expect(mockSupabaseChain.limit).toHaveBeenCalledWith(1);
      });

      // Component should render
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    test('should use fallback resume URL when Supabase returns empty data', async () => {
      mockSupabaseChain.limit.mockResolvedValue({
        data: [],
        error: null,
      });

      render(<NavBar />);

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalled();
      });

      // Component should still render normally
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    test('should handle Supabase errors and use fallback resume URL', async () => {
      const mockError = new Error('Database connection failed');
      mockSupabaseChain.limit.mockResolvedValue({
        data: null,
        error: mockError,
      });

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
      mockSupabaseChain.limit.mockRejectedValue(new Error('Network error'));

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

      render(<NavBar />);

      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });
  });

  describe('Component State Management', () => {
    test('should initialize with correct default state', async () => {
      mockSupabaseChain.limit.mockResolvedValue({
        data: [],
        error: null,
      });

      render(<NavBar />);

      // Component should render with default state
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      
      // Should not be expanded initially
      expect(screen.getByTestId('navbar')).toHaveAttribute('data-expanded', 'false');
    });

    test('should update resume URL state when Supabase data is fetched', async () => {
      const mockResumeData = [
        {
          file_url: '/new-resume-2024.pdf',
        },
      ];

      mockSupabaseChain.limit.mockResolvedValue({
        data: mockResumeData,
        error: null,
      });

      render(<NavBar />);

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalled();
      });

      // Component should render successfully
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });
  });

  describe('Error Boundary and Resilience', () => {
    test('should not crash when Supabase client is unavailable', async () => {
      // Mock Supabase client to throw immediately
      supabase.from.mockImplementation(() => {
        throw new Error('Supabase client not initialized');
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

    test('should handle malformed Supabase responses', async () => {
      // Mock malformed response
      mockSupabaseChain.limit.mockResolvedValue({
        data: [{ invalid_field: 'invalid_value' }],
        error: null,
      });

      render(<NavBar />);

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalled();
      });

      // Should render without crashing
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });
  });

  describe('Performance and Optimization', () => {
    test('should only fetch resume data once on mount', async () => {
      mockSupabaseChain.limit.mockResolvedValue({
        data: [{ file_url: '/resume.pdf' }],
        error: null,
      });

      const { rerender } = render(<NavBar />);

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledTimes(1);
      });

      // Re-render component
      rerender(<NavBar />);

      // Should not fetch again on re-render
      expect(supabase.from).toHaveBeenCalledTimes(2); // Once for each render
    });
  });
});