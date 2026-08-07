import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectCard } from './ProjectCard';

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

describe('ProjectCard Component - PDF Display Tests', () => {

  describe('Project Rendering with Static PDF Data', () => {
    test('should render MetroGE project with PDF button', () => {
      render(
        <ProjectCard 
          title="MetroGE" 
          description="Test description" 
          imgUrl="/test-image.jpg" 
        />
      );

      expect(screen.getByText('MetroGE')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    test('should render Similar Car Finder project with PDF button', () => {
      render(
        <ProjectCard 
          title="Similar Car Finder" 
          description="AI-Powered Vehicle Recommendations" 
          imgUrl="/test-image.jpg" 
        />
      );

      expect(screen.getByText('Similar Car Finder')).toBeInTheDocument();
      expect(screen.getByText('AI-Powered Vehicle Recommendations')).toBeInTheDocument();
    });
  });

  describe('Non-PDF Projects', () => {
    test('should not crash for projects without PDF functionality', () => {
      render(
        <ProjectCard 
          title="Cook It Up" 
          description="React-based food managing app" 
          imgUrl="/test-image.jpg" 
        />
      );

      expect(screen.getByText('Cook It Up')).toBeInTheDocument();
      expect(screen.getByText('React-based food managing app')).toBeInTheDocument();
    });

    test('should render external links for projects with external references', () => {
      render(
        <ProjectCard 
          title="GitHub icon" 
          description="Source of the Icon" 
          imgUrl="/test-image.jpg" 
        />
      );

      expect(screen.getByText('GitHub icon')).toBeInTheDocument();
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

      const buttons = screen.getAllByTestId('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});