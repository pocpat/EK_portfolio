import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Projects } from './Projects';

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

describe('Projects Component - PDF Display Tests', () => {

  describe('AWS Tab', () => {
    test('should display AWS PDFs from static data', async () => {
      render(<Projects />);

      // Switch to AWS tab
      const awsTab = screen.getByTestId('nav-link-second');
      fireEvent.click(awsTab);

      // AWS PDFs should be rendered from static data
      await waitFor(() => {
        expect(screen.getByText('S3 Multi-Part Upload')).toBeInTheDocument();
        expect(screen.getByText('Network Security & Analysis')).toBeInTheDocument();
        expect(screen.getByText('S3 MFA Delete')).toBeInTheDocument();
      });
    });

    test('should update PDF viewer when different PDF button is clicked', async () => {
      render(<Projects />);

      const awsTab = screen.getByTestId('nav-link-second');
      fireEvent.click(awsTab);

      // Click on a different PDF button
      const networkButton = screen.getByText('Network Security & Analysis');
      fireEvent.click(networkButton);

      // Verify PDF viewer updates
      await waitFor(() => {
        const viewers = screen.getAllByTestId('pdf-viewer');
        expect(viewers[0]).toHaveTextContent('/AWS-network_security_and_analysis.pdf');
      });
    });
  });

  describe('Azure Tab', () => {
    test('should render Azure tab with PDF content', async () => {
      render(<Projects />);

      // Switch to Azure tab
      const azureTab = screen.getByTestId('nav-link-fourth');
      fireEvent.click(azureTab);

      // Azure PDFs should be rendered from static data
      await waitFor(() => {
        expect(screen.getByText('Cloud Network Security')).toBeInTheDocument();
        expect(screen.getByText('Generative AI')).toBeInTheDocument();
        expect(screen.getByText('MS Fabric')).toBeInTheDocument();
      });
    });
  });

  describe('Tab Navigation', () => {
    test('should start on APP tab by default', () => {
      render(<Projects />);
      expect(screen.getByTestId('tab-container')).toHaveAttribute('data-active-key', 'first');
    });
  });
});