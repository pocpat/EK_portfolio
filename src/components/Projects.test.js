import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Projects } from './Projects';
import { fetchPdfsByCategory } from '../mongoClient';

// Mock the mongoClient
jest.mock('../mongoClient', () => ({
  fetchPdfsByCategory: jest.fn(),
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
  Nav: Object.assign(
    ({ children, className, variant, id, onSelect }) => (
      <div data-testid="nav" className={className} data-variant={variant} id={id}>
        {children}
      </div>
    ),
    {
      Item: ({ children }) => <div data-testid="nav-item">{children}</div>,
      Link: ({ children, eventKey, onSelect }) => (
        <button
          data-testid={`nav-link-${eventKey}`}
          onClick={() => onSelect && onSelect(eventKey)}
        >
          {children}
        </button>
      ),
    }
  ),
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

// Helper: set up the mock for fetchPdfsByCategory based on the category requested
function setupMockForCategory(category, data) {
  fetchPdfsByCategory.mockImplementation((cat) => {
    if (cat === category) {
      return Promise.resolve(data);
    }
    // For other categories, return empty
    return Promise.resolve([]);
  });
}

describe('Projects Component - PDF Fetching Integration Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful PDF Fetching', () => {
    test('should fetch and display AWS PDFs successfully', async () => {
      const mockPdfData = [
        {
          title: 'Migration Guide',
          file_url: '/aws-migration.pdf',
          category: 'AWS',
        },
        {
          title: 'QuickSight Tutorial',
          file_url: '/aws-quicksight.pdf',
          category: 'AWS',
        },
      ];

      setupMockForCategory('AWS', mockPdfData);

      render(<Projects />);

      // Switch to AWS tab to trigger PDF display
      const awsTab = screen.getByTestId('nav-link-second');
      fireEvent.click(awsTab);

      // Wait for PDFs to load
      await waitFor(() => {
        expect(screen.getByText('Migration Guide')).toBeInTheDocument();
        expect(screen.getByText('QuickSight Tutorial')).toBeInTheDocument();
      });

      // Verify mongoClient was called correctly
      expect(fetchPdfsByCategory).toHaveBeenCalledWith('AWS');

      // Verify PDF viewer shows the first PDF by default (use getAllByTestId since both AWS and Azure tabs render viewers)
      const viewers = screen.getAllByTestId('pdf-viewer');
      expect(viewers[0]).toHaveTextContent('/aws-migration.pdf');
    });

    test('should update PDF viewer when different PDF button is clicked', async () => {
      const mockPdfData = [
        {
          title: 'First PDF',
          file_url: '/first.pdf',
          category: 'AWS',
        },
        {
          title: 'Second PDF',
          file_url: '/second.pdf',
          category: 'AWS',
        },
      ];

      setupMockForCategory('AWS', mockPdfData);

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

      // Verify PDF viewer updates (use getAllByTestId since both tabs render viewers)
      await waitFor(() => {
        const viewers = screen.getAllByTestId('pdf-viewer');
        expect(viewers[0]).toHaveTextContent('/second.pdf');
      });
    });
  });

  describe('Empty Results Handling', () => {
    test('should handle empty PDF results gracefully', async () => {
      setupMockForCategory('AWS', []);

      render(<Projects />);

      // Switch to AWS tab
      const awsTab = screen.getByTestId('nav-link-second');
      fireEvent.click(awsTab);

      // Wait for the loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading documents...')).not.toBeInTheDocument();
      });

      // Should show empty message
      expect(screen.getByText('No AWS documents available.')).toBeInTheDocument();
    });
  });

  describe('Error Handling and Fallback', () => {
    test('should handle MongoDB errors and show fallback data for AWS', async () => {
      // Mock AWS to throw
      fetchPdfsByCategory.mockImplementation((cat) => {
        if (cat === 'AWS') {
          return Promise.reject(new Error('Database connection failed'));
        }
        return Promise.resolve([]);
      });

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
      expect(screen.getByText('ChatBot Part 1')).toBeInTheDocument();

      // Verify error was logged
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching AWS PDF files:', expect.any(Error));

      // Verify PDF viewer shows fallback PDF (use getAllByTestId)
      const viewers = screen.getAllByTestId('pdf-viewer');
      expect(viewers[0]).toHaveTextContent('/ekawstechdoc.pdf');

      consoleSpy.mockRestore();
    });

    test('should handle network errors gracefully', async () => {
      fetchPdfsByCategory.mockImplementation((cat) => {
        if (cat === 'AWS') {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve([]);
      });

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
      
      fetchPdfsByCategory.mockImplementation((cat) => {
        if (cat === 'AWS') {
          return delayedPromise;
        }
        return Promise.resolve([]);
      });

      render(<Projects />);

      // Switch to AWS tab
      const awsTab = screen.getByTestId('nav-link-second');
      fireEvent.click(awsTab);

      // Should show loading state (both AWS and Azure tabs show loading)
      const loadingElements = screen.getAllByText('Loading documents...');
      expect(loadingElements.length).toBeGreaterThan(0);

      // Resolve the promise
      resolvePromise([
        { title: 'Test PDF', file_url: '/test.pdf', category: 'AWS' },
      ]);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading documents...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Tab Navigation', () => {
    test('should start on APP tab by default', () => {
      fetchPdfsByCategory.mockResolvedValue([]);

      render(<Projects />);

      // Should start on first tab (APP) by default
      expect(screen.getByTestId('tab-container')).toHaveAttribute('data-active-key', 'first');
    });

    test('should fetch AWS PDFs on mount', async () => {
      fetchPdfsByCategory.mockResolvedValue([]);

      render(<Projects />);

      // AWS PDFs are fetched on mount via useEffect
      await waitFor(() => {
        expect(fetchPdfsByCategory).toHaveBeenCalledWith('AWS');
      });
    });

    test('should fetch Azure PDFs on mount', async () => {
      fetchPdfsByCategory.mockResolvedValue([]);

      render(<Projects />);

      // Azure PDFs are also fetched on mount
      await waitFor(() => {
        expect(fetchPdfsByCategory).toHaveBeenCalledWith('Azure');
      });
    });
  });

  describe('Azure Tab', () => {
    test('should render Azure tab with PDF content', async () => {
      const mockAzureData = [
        {
          title: 'Azure VM Setup',
          file_url: '/azure-vm-setup.pdf',
          category: 'Azure',
        },
      ];

      setupMockForCategory('Azure', mockAzureData);

      render(<Projects />);

      // Switch to Azure tab
      const azureTab = screen.getByTestId('nav-link-fourth');
      fireEvent.click(azureTab);

      // Wait for PDFs to load
      await waitFor(() => {
        expect(screen.getByText('Azure VM Setup')).toBeInTheDocument();
      });
    });

    test('should show coming soon message when Azure has no documents', async () => {
      setupMockForCategory('Azure', []);

      render(<Projects />);

      // Switch to Azure tab
      const azureTab = screen.getByTestId('nav-link-fourth');
      fireEvent.click(azureTab);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Loading documents...')).not.toBeInTheDocument();
      });

      // Should show the coming soon message
      expect(screen.getByText('No Azure documents yet. Coming soon!')).toBeInTheDocument();
    });
  });

  describe('Data Transformation', () => {
    test('should correctly transform MongoDB data to expected format', async () => {
      const mockPdfData = [
        {
          title: 'AWS Migration Guide.pdf',
          file_url: '/aws-migration-guide.pdf',
          category: 'AWS',
        },
      ];

      setupMockForCategory('AWS', mockPdfData);

      render(<Projects />);

      // Switch to AWS tab
      const awsTab = screen.getByTestId('nav-link-second');
      fireEvent.click(awsTab);

      // Wait for data to load and verify transformation
      await waitFor(() => {
        // Title should have .pdf extension removed
        expect(screen.getByText('AWS Migration Guide')).toBeInTheDocument();
      });

      // Verify PDF viewer uses the correct file URL (use getAllByTestId)
      const viewers = screen.getAllByTestId('pdf-viewer');
      expect(viewers[0]).toHaveTextContent('/aws-migration-guide.pdf');
    });
  });
});