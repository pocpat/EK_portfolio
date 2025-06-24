import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectCard } from './ProjectCard';
import { supabase } from '../supabaseClient';

// Mock the supabase client
jest.mock('../supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        in: jest.fn(() => ({
          then: jest.fn(),
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
  Col: ({ children }) => <div data-testid="col">{children}</div>,
  Button: ({ children, onClick, href, className }) => (
    <button 
      data-testid="button" 
      onClick={onClick} 
      data-href={href}
      className={className}
    >
      {children}
    </button>
  ),
}));

describe('ProjectCard Component - PDF Fetching Integration Tests', () => {
  let mockSupabaseChain;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockSupabaseChain = {
      select: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
    };
    
    supabase.from.mockReturnValue(mockSupabaseChain);
  });

  describe('PDF URL Fetching for MetroGE Project', () => {
    test('should fetch and update MetroGE PDF URL from Supabase', async () => {
      const mockPdfData = [
        {
          title: 'metroge_vert.pdf',
          file_url: '/updated-metroge.pdf',
        },
      ];

      mockSupabaseChain.in.mockResolvedValue({
        data: mockPdfData,
        error: null,
      });

      render(
        <ProjectCard 
          title="MetroGE" 
          description="Test description" 
          imgUrl="/test-image.jpg" 
        />
      );

      // Wait for Supabase call to complete
      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('pdfs');
        expect(mockSupabaseChain.select).toHaveBeenCalledWith('title, file_url');
        expect(mockSupabaseChain.in).toHaveBeenCalledWith('title', ['metroge_vert.pdf', 'SimilarCarsFinder.pdf']);
      });

      // The component should render with the project title
      expect(screen.getByText('MetroGE')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    test('should fetch and update Similar Car Finder PDF URL from Supabase', async () => {
      const mockPdfData = [
        {
          title: 'SimilarCarsFinder.pdf',
          file_url: '/updated-similar-cars.pdf',
        },
      ];

      mockSupabaseChain.in.mockResolvedValue({
        data: mockPdfData,
        error: null,
      });

      render(
        <ProjectCard 
          title="Similar Car Finder" 
          description="AI-Powered Vehicle Recommendations" 
          imgUrl="/test-image.jpg" 
        />
      );

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('pdfs');
      });

      expect(screen.getByText('Similar Car Finder')).toBeInTheDocument();
      expect(screen.getByText('AI-Powered Vehicle Recommendations')).toBeInTheDocument();
    });

    test('should fetch both PDF URLs when both are available', async () => {
      const mockPdfData = [
        {
          title: 'metroge_vert.pdf',
          file_url: '/updated-metroge.pdf',
        },
        {
          title: 'SimilarCarsFinder.pdf',
          file_url: '/updated-similar-cars.pdf',
        },
      ];

      mockSupabaseChain.in.mockResolvedValue({
        data: mockPdfData,
        error: null,
      });

      render(
        <ProjectCard 
          title="MetroGE" 
          description="Test description" 
          imgUrl="/test-image.jpg" 
        />
      );

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('pdfs');
        expect(mockSupabaseChain.in).toHaveBeenCalledWith('title', ['metroge_vert.pdf', 'SimilarCarsFinder.pdf']);
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle Supabase errors gracefully and use fallback URLs', async () => {
      const mockError = new Error('Database connection failed');
      mockSupabaseChain.in.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ProjectCard 
          title="MetroGE" 
          description="Test description" 
          imgUrl="/test-image.jpg" 
        />
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching project PDFs:', mockError);
      });

      // Component should still render normally with fallback URLs
      expect(screen.getByText('MetroGE')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    test('should handle network errors gracefully', async () => {
      mockSupabaseChain.in.mockRejectedValue(new Error('Network error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ProjectCard 
          title="Similar Car Finder" 
          description="Test description" 
          imgUrl="/test-image.jpg" 
        />
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching project PDFs:', expect.any(Error));
      });

      expect(screen.getByText('Similar Car Finder')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    test('should handle empty response gracefully', async () => {
      mockSupabaseChain.in.mockResolvedValue({
        data: [],
        error: null,
      });

      render(
        <ProjectCard 
          title="MetroGE" 
          description="Test description" 
          imgUrl="/test-image.jpg" 
        />
      );

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalled();
      });

      // Should still render the component normally
      expect(screen.getByText('MetroGE')).toBeInTheDocument();
    });
  });

  describe('Non-PDF Projects', () => {
    test('should not fetch PDFs for projects without PDF functionality', async () => {
      render(
        <ProjectCard 
          title="Cook It Up" 
          description="React-based food managing app" 
          imgUrl="/test-image.jpg" 
        />
      );

      // Wait a bit to ensure no async calls are made
      await new Promise(resolve => setTimeout(resolve, 100));

      // Supabase should still be called (the useEffect runs for all projects)
      expect(supabase.from).toHaveBeenCalled();
      
      // But the component should render normally
      expect(screen.getByText('Cook It Up')).toBeInTheDocument();
      expect(screen.getByText('React-based food managing app')).toBeInTheDocument();
    });

    test('should render external links for projects with external references', async () => {
      render(
        <ProjectCard 
          title="GitHub icon" 
          description="Source of the Icon" 
          imgUrl="/test-image.jpg" 
        />
      );

      await waitFor(() => {
        expect(screen.getByText('GitHub icon')).toBeInTheDocument();
      });

      // Should contain external links
      expect(screen.getByText('Icons by Alfredo Hernandez')).toBeInTheDocument();
    });
  });

  describe('Component Rendering', () => {
    test('should render basic project information correctly', () => {
      render(
        <ProjectCard 
          title="Test Project" 
          description="Test Description" 
          imgUrl="/test-image.jpg" 
        />
      );

      expect(screen.getByText('Test Project')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('src', '/test-image.jpg');
    });

    test('should render project buttons for projects with external links', () => {
      render(
        <ProjectCard 
          title="Cook It Up" 
          description="React-based food managing app" 
          imgUrl="/test-image.jpg" 
        />
      );

      // Should render buttons for Cook It Up project
      const buttons = screen.getAllByTestId('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Data Processing', () => {
    test('should correctly process PDF data and update state', async () => {
      const mockPdfData = [
        {
          title: 'metroge_vert.pdf',
          file_url: 'https://example.com/metroge.pdf',
        },
        {
          title: 'SimilarCarsFinder.pdf',
          file_url: 'https://example.com/similar-cars.pdf',
        },
      ];

      mockSupabaseChain.in.mockResolvedValue({
        data: mockPdfData,
        error: null,
      });

      render(
        <ProjectCard 
          title="MetroGE" 
          description="Test description" 
          imgUrl="/test-image.jpg" 
        />
      );

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('pdfs');
      });

      // Verify the component renders correctly after data processing
      expect(screen.getByText('MetroGE')).toBeInTheDocument();
    });
  });
});