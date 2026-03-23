/**
 * Database initialization script
 * Run this script to set up the database schema
 */

import { initSchema, query } from './db';

async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    // Insert sample lessons
    await query(`
      INSERT INTO lessons (title, description, category, difficulty, content, experience_reward)
      VALUES
        (
          'Introduction to Study Abroad',
          'Learn the basics of studying abroad and what to expect',
          'general',
          1,
          '{"topics": ["benefits", "preparation", "timeline"]}'::jsonb,
          100
        ),
        (
          'Choosing Your Destination',
          'How to select the right country and university for your goals',
          'planning',
          2,
          '{"topics": ["research", "rankings", "fit"]}'::jsonb,
          150
        ),
        (
          'Application Process Overview',
          'Step-by-step guide to the application process',
          'application',
          2,
          '{"topics": ["documents", "deadlines", "requirements"]}'::jsonb,
          200
        )
      ON CONFLICT DO NOTHING
    `);

    // Insert sample questions
    await query(`
      INSERT INTO questions (lesson_id, question_text, options, correct_answer, explanation)
      VALUES
        (
          1,
          'What are the main benefits of studying abroad?',
          '["Academic growth", "Cultural experience", "Language skills", "All of the above"]'::jsonb,
          3,
          'Studying abroad offers all these benefits and more!'
        ),
        (
          1,
          'When should you start preparing for study abroad?',
          '["1 month before", "6-12 months before", "After acceptance", "Never"]'::jsonb,
          1,
          'It''s best to start 6-12 months in advance to have enough preparation time.'
        )
      `);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}

// Main initialization function
async function main() {
  try {
    console.log('Initializing Gradventure database...');

    // Initialize schema
    await initSchema();

    // Seed with sample data
    await seedDatabase();

    console.log('Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization if this file is executed directly
if (import.meta.main) {
  main();
}
