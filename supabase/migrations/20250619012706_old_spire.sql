/*
  # Create PDFs table for portfolio application

  1. New Tables
    - `pdfs`
      - `id` (uuid, primary key)
      - `title` (text, not null) - The filename of the PDF
      - `file_url` (text, not null) - The URL to access the PDF file
      - `category` (text, not null) - Category like 'Resume', 'AWS', etc.
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `pdfs` table
    - Add policy for public read access since this is a portfolio site

  3. Sample Data
    - Insert sample PDF records for the application to work properly
*/

CREATE TABLE IF NOT EXISTS pdfs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  file_url text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pdfs ENABLE ROW LEVEL SECURITY;

-- Allow public read access for portfolio PDFs
CREATE POLICY "Allow public read access to PDFs"
  ON pdfs
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage PDFs (for future admin functionality)
CREATE POLICY "Allow authenticated users to manage PDFs"
  ON pdfs
  FOR ALL
  TO authenticated
  USING (true);

-- Insert sample data for the application
INSERT INTO pdfs (title, file_url, category) VALUES
  ('EKResume102024.pdf', '/EKResume102024.pdf', 'Resume'),
  ('metroge_vert.pdf', '/metroge_vert.pdf', 'Project'),
  ('SimilarCarsFinder.pdf', '/SimilarCarsFinder.pdf', 'Project'),
  ('ekawstechdoc.pdf', '/ekawstechdoc.pdf', 'AWS'),
  ('AmazonQuickSightProject.pdf', '/AmazonQuickSightProject.pdf', 'AWS'),
  ('AmazonLexChatbotPart1.pdf', '/AmazonLexChatbotPart1.pdf', 'AWS'),
  ('AmazonLexChatbotPart2.pdf', '/AmazonLexChatbotPart2.pdf', 'AWS'),
  ('awsIam.pdf', '/awsIam.pdf', 'AWS');