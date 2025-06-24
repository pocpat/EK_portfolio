import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Projects } from './Projects';
import { supabase } from '../supabaseClient';

// Mock the supabase client
jest.mock('../supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            then: jest.fn(),
          })),
        })),
      })),
    })),
  },
}));

// Mock PdfViewer component to avoid PDF rendering issues in tests
jest.mock('./PdfViewer', () => {
  return function MockPdfViewer({ file }) {
    return <div data-testid="pdf-viewer">PDF Viewer: {file}</div>;
  };
});

// Mock react-bootstrap components
jest.mock('react-bootstrap', () => ({
  ...jest.requireActual('react-bootstrap'),
  Tab: {
    Container: ({ children, activeKey }) => (
      <div data-testid="tab-container" data-active-key={activeKey}>
        {children}
      </div>
    ),
    Content: ({ children }) => <div data-testid="tab-content">{children}</div>,
    Pane: ({ children, eventKey }) => (
      <div data-testid={`tab-pane-${eventKey}`}>{children}</div>
    ),
  },
  Nav: {
    Item: ({ children }) => <div data-testid="nav-item">{children}</div>,
    Link: ({ children, eventKey, onSelect }) => (
      <button
        data-testid={`nav-link-${eventKey}`}
        onClick={() => onSelect && onSelect(eventKey)}
      >
        {children}
      </button>
    ),
  },
  Container: ({ children }) => <div data-testid="container">{children}</div>,
  Row: ({ children }) => <div data-testid="row">{children}</div>,
  Col: ({ children }) => <div data-testid="col">{children}</div>,
}));

// Mock TrackVisibility
jest.mock('react-on-screen', () => {
  return function MockTrackVisibility({ children }) {
    return children({ isVisible: true });
  };
});

describe('Projects Component - PDF Fetching Integration Tests', () => {
  let mockSupabaseChain;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create a mock chain for Supabase calls
    mockSupabaseChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
    };
    
    supabase.from.mockReturnValue(mockSupabaseChain);
  });

  describe('Successful PDF Fetching', () => {
    test('should fetch and display AWS PDFs successfully', async () => {
      // Mock successful Supabase response
      const mockPdfData = [
        {
          id: '1',
          title: 'Migration Guide',
          file_url: '/aws-migration.pdf',
          category: 'AWS',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
        {
          id: '2',
          title: 'QuickSight Tutorial',
          file_url: '/aws-quicksight.pdf',
          category: 'AWS',
          created_at: '2024-01-02',
          updated_at: '2024-01-02',
        },
      ];

      mockSupabaseChain.order.mockResolvedValue({
        data: mockPdfData,
        error: null,
      });

      render(<Projects />);

      // Switch to AWS tab to trigger PDF fetching
      const awsTab = screen.getByTestId('nav-link-second');
      fireEvent.click(awsTab);

      // Wait for PDFs to load
      await waitFor(() => {
        expect(screen.getByText('Migration Guide')).toBeInTheDocument();
        expect(screen.getByText('QuickSight Tutorial')).toBeInTheDocument();
      });

      // Verify Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('pdfs');
      expect(mockSupabaseChain.select).toHaveBeenCalledWith('*');
      expect(mockSupabaseChain.eq).toHaveBeenCalledWith('category', 'AWS');
      expect(mockSupabaseChain.order).toHaveBeenCalledWith('title', { ascending: true });

      // Verify PDF viewer shows the first PDF by default
      expect(screen.getByTestId('pdf-viewer')).toHaveTextContent('/aws-migration.pdf');
    });

    test('should update PDF viewer when different PDF button is clicked', async () => {
      const mockPdfData = [
        {
          id: '1',
          title: 'First PDF',
          file_url: '/first.pdf',
          category: 'AWS',
        },
        {
          id: '2',
          title: 'Second PDF',
          file_url: '/second.pdf',
          category: 'AWS',
        },
      ];

      mockSupabaseChain.order.mockResolvedValue({
        data: mockPdfData,
        error: null,
      });

      render(<Projects />);

      // Switch to AWS tab
      const awsTab = screen.getByTestId('nav-link-second');
      fireEvent.click(awsTab);

      // Wait for PDFs to load
      await waitFor(() => {
        expect(screen.getByText('First PDF')).toBeInTheDocument();
      });

      // Click on the second PDF button
      const secondPdfButton = screen.getByText('Second PDF');
      fireEvent.click(secondPdfButton);

      // Verify PDF viewer updates
      await waitFor(() => {
        expect(screen.getByTestId('pdf-viewer')).toHaveTextContent('/second.pdf');
      });
    });
  });

  describe('Empty Results Handling', () => {
    test('should handle empty PDF results gracefully', async () => {
      // Mock empty Supabase response
      mockSupabaseChain.order.mockResolvedValue({
        data: [],
        error: null,
      });

      render(<Projects />);

      // Switch to AWS tab
      const awsTab = screen.getByTestId('nav-link-second');
      fireEvent.click(awsTab);

      // Wait for the loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading AWS documents...')).not.toBeInTheDocument();
      });

      // Should fall back to default PDF
      expect(screen.getByTestId('pdf-viewer')).toHaveTextContent('/ekawstechdoc.pdf');
    });
  });

  describe('Error Handling and Fallback', () => {
    test('should handle Supabase errors and show fallback data', async () => {
      // Mock Supabase error
      const mockError = new Error('Database connection failed');
      mockSupabaseChain.order.mockResolvedValue({
        data: null,
        error: mockError,
      });

      // Spy on console.error to verify error logging
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<Projects />);

      // Switch to AWS tab
      const awsTab = screen.getByTestId('nav-link-second');
      fireEvent.click(awsTab);

      // Wait for error handling to complete
      await waitFor(() => {
        expect(screen.getByText('Failed to load PDF files')).toBeInTheDocument();
        expect(screen.getByText('Using fallback data')).toBeInTheDocument();
      });

      // Verify fallback PDFs are displayed
      expect(screen.getByText('Migration')).toBeInTheDocument();
      expect(screen.getByText('QuickSight')).toBeInTheDocument();
      expect(screen.getByText('ChatBot Part 1')).toBeInTheDocument();

      // Verify error was logged
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching PDF files:', mockError);

      // Verify PDF viewer shows fallback PDF
      expect(screen.getByTestId('pdf-viewer')).toHaveTextContent('/ekawstechdoc.pdf');

      consoleSpy.mockRestore();
    });

    test('should handle network errors gracefully', async () => {
      // Mock network error
      mockSupabaseChain.order.mockRejectedValue(new Error('Network error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<Projects />);

      // Switch to AWS tab
      const awsTab = screen.getByTestId('nav-link-second');
      fireEvent.click(awsTab);

      // Wait for error handling
      await waitFor(() => {
        expect(screen.getByText('Failed to load PDF files')).toBeInTheDocument();
      });

      // Verify fallback data is used
      expect(screen.getByText('Migration')).toBeInTheDocument();
      expect(screen.getByText('Amazon IAM')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('Loading States', () => {
    test('should show loading state while fetching PDFs', async () => {
      // Mock delayed response
      let resolvePromise;
      const delayedPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      mockSupabaseChain.order.mockReturnValue(delayedPromise);

      render(<Projects />);

      // Switch to AWS tab
      const awsTab = screen.getByTestId('nav-link-second');
      fireEvent.click(awsTab);

      // Should show loading state
      expect(screen.getByText('Loading AWS documents...')).toBeInTheDocument();

      // Resolve the promise
      resolvePromise({
        data: [{ id: '1', title: 'Test PDF', file_url: '/test.pdf', category: 'AWS' }],
        error: null,
      });

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading AWS documents...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Tab Navigation', () => {
    test('should not fetch PDFs when not on AWS tab', () => {
      render(<Projects />);

      // Should start on first tab (APP) by default
      expect(screen.getByTestId('tab-container')).toHaveAttribute('data-active-key', 'first');

      // Supabase should not be called yet
      expect(supabase.from).not.toHaveBeenCalled();
    });

    test('should fetch PDFs only when AWS tab is activated', async () => {
      mockSupabaseChain.order.mockResolvedValue({
        data: [],
        error: null,
      });

      render(<Projects />);

      // Initially on APP tab - no Supabase calls
      expect(supabase.from).not.toHaveBeenCalled();

      // Switch to AWS tab
      const awsTab = screen.getByTestId('nav-link-second');
      fireEvent.click(awsTab);

      // Now Supabase should be called
      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('pdfs');
      });
    });
  });

  describe('Data Transformation', () => {
    test('should correctly transform Supabase data to expected format', async () => {
      const mockPdfData = [
        {
          id: '1',
          title: 'AWS Migration Guide.pdf',
          file_url: '/aws-migration-guide.pdf',
          category: 'AWS',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ];

      mockSupabaseChain.order.mockResolvedValue({
        data: mockPdfData,
        error: null,
      });

      render(<Projects />);

      // Switch to AWS tab
      const awsTab = screen.getByTestId('nav-link-second');
      fireEvent.click(awsTab);

      // Wait for data to load and verify transformation
      await waitFor(() => {
        // Title should have .pdf extension removed
        expect(screen.getByText('AWS Migration Guide')).toBeInTheDocument();
      });

      // Verify PDF viewer uses the correct file URL
      expect(screen.getByTestId('pdf-viewer')).toHaveTextContent('/aws-migration-guide.pdf');
    });
  });
});