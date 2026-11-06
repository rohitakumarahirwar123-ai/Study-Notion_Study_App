const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const Category = require('../models/Category');
const Course = require('../models/Course');
const Section = require('../models/Section');
const SubSection = require('../models/SubSection');

const instructorId = new mongoose.Types.ObjectId('6a48a14c9fe91a719f467be5');

const seedCategories = [
  {
    name: 'Web Development',
    description: 'Modern web development courses for building fast, scalable apps.',
    courses: [
      {
        courseName: 'Full-Stack Web Development Bootcamp',
        courseDescription: 'A practical introduction to frontend, backend, and deployment workflows.',
        whatYouWillLearn: 'Build modern web apps, deploy APIs, and work with databases.',
        price: '49',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
        tag: ['React', 'Node.js', 'MongoDB'],
        sections: [
          {
            sectionName: 'Introduction',
            subSections: [
              { title: 'Welcome to the Course', timeDuration: '04:30', description: 'Overview of the bootcamp structure.', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
            ]
          }
        ]
      },
      {
        courseName: 'Next.js Mastery',
        courseDescription: 'Learn server-side rendering, routing, and production-grade Next.js patterns.',
        whatYouWillLearn: 'Create SEO-friendly apps and optimize performance.',
        price: '59',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
        tag: ['Next.js', 'SSR', 'Performance'],
        sections: [
          {
            sectionName: 'Getting Started',
            subSections: [
              { title: 'Install and Run Next.js', timeDuration: '06:00', description: 'Bootstrap your project locally.', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }
            ]
          }
        ]
      },
      {
        courseName: 'React from Zero',
        courseDescription: 'Hands-on React fundamentals with hooks and state management.',
        whatYouWillLearn: 'Create interactive UIs using React and hooks.',
        price: '29',
        thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
        tag: ['React', 'Hooks'],
        sections: [{ sectionName: 'Basics', subSections: [{ title: 'JSX & Components', timeDuration: '05:00', description: 'Intro to JSX and components', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }] }]
      },
      {
        courseName: 'Node.js API Development',
        courseDescription: 'Build RESTful APIs with Express and best practices for production.',
        whatYouWillLearn: 'Design endpoints, handle middleware, and secure APIs.',
        price: '35',
        thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
        tag: ['Node.js', 'Express'],
        sections: [{ sectionName: 'APIs', subSections: [{ title: 'Create Express Routes', timeDuration: '07:30', description: 'Routing and controllers', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }] }]
      },
      {
        courseName: 'Advanced CSS & Tailwind',
        courseDescription: 'Modern CSS patterns and utility-first design with Tailwind.',
        whatYouWillLearn: 'Create responsive layouts and UI components quickly.',
        price: '25',
        thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
        tag: ['CSS', 'Tailwind'],
        sections: [{ sectionName: 'Layout', subSections: [{ title: 'Responsive Design', timeDuration: '06:45', description: 'Media queries and utilities', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }] }]
      },
      {
        courseName: 'TypeScript for JS Devs',
        courseDescription: 'Add type safety to your JavaScript projects with TypeScript.',
        whatYouWillLearn: 'Types, interfaces, generics, and TS tooling.',
        price: '30',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80',
        tag: ['TypeScript', 'JavaScript'],
        sections: [{ sectionName: 'Types', subSections: [{ title: 'Primitive & Complex Types', timeDuration: '05:20', description: 'Type basics', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }] }]
      },
      {
        courseName: 'Frontend Performance Optimization',
        courseDescription: 'Techniques to speed up frontend apps and reduce bundle size.',
        whatYouWillLearn: 'Code splitting, lazy loading, and caching strategies.',
        price: '40',
        thumbnail: 'https://images.unsplash.com/photo-1508385082359-f6f0b0a9f3d7?auto=format&fit=crop&w=900&q=80',
        tag: ['Performance', 'Web'],
        sections: [{ sectionName: 'Optimize', subSections: [{ title: 'Lazy Loading', timeDuration: '04:50', description: 'Reduce initial load', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }] }]
      },
      {
        courseName: 'MERN Ecommerce Project',
        courseDescription: 'Build a complete ecommerce app using MongoDB, Express, React and Node.',
        whatYouWillLearn: 'Implement product listing, cart, and checkout flows.',
        price: '69',
        thumbnail: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=900&q=80',
        tag: ['MERN', 'Ecommerce'],
        sections: [{ sectionName: 'Project', subSections: [{ title: 'Setup & Architecture', timeDuration: '10:00', description: 'Project scaffolding and architecture', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }] }]
      }
    ]
  },
  {
    name: 'Design',
    description: 'Creative courses for UI/UX, product thinking, and visual storytelling.',
    courses: [
      {
        courseName: 'UI/UX Design Essentials',
        courseDescription: 'Design intuitive interfaces with user-centered principles and wireframes.',
        whatYouWillLearn: 'Create user flows, wireframes, and polished design systems.',
        price: '39',
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
        tag: ['UI/UX', 'Figma', 'Design'],
        sections: [{ sectionName: 'Design Foundations', subSections: [{ title: 'Principles of Good UX', timeDuration: '05:45', description: 'Understand user psychology and interaction design.', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }] }]
      },
      {
        courseName: 'Figma for Beginners',
        courseDescription: 'Learn Figma basics to design screens and prototypes quickly.',
        whatYouWillLearn: 'Layouts, components, and prototyping in Figma.',
        price: '19',
        thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
        tag: ['Figma', 'Design'],
        sections: [{ sectionName: 'Figma Intro', subSections: [{ title: 'Frames & Components', timeDuration: '06:10', description: 'Create reusable UI components', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }] }]
      },
      {
        courseName: 'Advanced Prototyping',
        courseDescription: 'Create interactive prototypes and user tests to validate ideas.',
        whatYouWillLearn: 'High-fidelity prototypes and usability testing workflows.',
        price: '29',
        thumbnail: 'https://images.unsplash.com/photo-1543128639-4cb7e6f43e9f?auto=format&fit=crop&w=900&q=80',
        tag: ['Prototyping', 'UX'],
        sections: [{ sectionName: 'Prototype', subSections: [{ title: 'Interactions & Transitions', timeDuration: '05:30', description: 'Add realistic motion', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }] }]
      },
      {
        courseName: 'Design Systems',
        courseDescription: 'Create scalable design systems for teams and products.',
        whatYouWillLearn: 'Tokens, components, and documentation practices.',
        price: '49',
        thumbnail: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=900&q=80',
        tag: ['Design System', 'Figma'],
        sections: [{ sectionName: 'System', subSections: [{ title: 'Tokens & Components', timeDuration: '07:00', description: 'Design tokens and component libraries', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }] }]
      },
      {
        courseName: 'Typography Essentials',
        courseDescription: 'Master typography for readable and beautiful interfaces.',
        whatYouWillLearn: 'Hierarchy, pairing, and responsive type.',
        price: '15',
        thumbnail: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80',
        tag: ['Typography', 'Design'],
        sections: [{ sectionName: 'Type', subSections: [{ title: 'Type Scales', timeDuration: '04:20', description: 'Set up consistent type scales', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }] }]
      },
      {
        courseName: 'Illustration for Interfaces',
        courseDescription: 'Design simple illustrations to enhance visual storytelling.',
        whatYouWillLearn: 'Create assets that match brand tone and usability.',
        price: '22',
        thumbnail: 'https://images.unsplash.com/photo-1526318472351-c75fcf070ee5?auto=format&fit=crop&w=900&q=80',
        tag: ['Illustration', 'Design'],
        sections: [{ sectionName: 'Illustration', subSections: [{ title: 'Vector Basics', timeDuration: '06:00', description: 'Create simple vector illustrations', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }] }]
      },
      {
        courseName: 'Motion Design Basics',
        courseDescription: 'Add motion to interfaces to improve clarity and delight.',
        whatYouWillLearn: 'Micro-interactions, easing, and keyframes.',
        price: '27',
        thumbnail: 'https://images.unsplash.com/photo-1531497865148-1f72e2f7f8b9?auto=format&fit=crop&w=900&q=80',
        tag: ['Motion', 'Animation'],
        sections: [{ sectionName: 'Motion', subSections: [{ title: 'Micro-interactions', timeDuration: '05:10', description: 'Design subtle motion', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }] }]
      },
      {
        courseName: 'Portfolio & Case Studies',
        courseDescription: 'Build an effective portfolio and write case studies that get hired.',
        whatYouWillLearn: 'Structure case studies and showcase work effectively.',
        price: '20',
        thumbnail: 'https://images.unsplash.com/photo-1496317556649-f930d733eea2?auto=format&fit=crop&w=900&q=80',
        tag: ['Portfolio', 'Careers'],
        sections: [{ sectionName: 'Career', subSections: [{ title: 'Crafting Case Studies', timeDuration: '08:00', description: 'Tell story behind projects', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }] }]
      }
    ]
  },
  {
    name: 'Data Science',
    description: 'Courses for analytics, Python, and data-driven decision making.',
    courses: [
      {
        courseName: 'Data Science Foundations',
        courseDescription: 'Learn Python, statistics, and the basics of working with real datasets.',
        whatYouWillLearn: 'Analyze data, build simple models, and communicate insights.',
        price: '45',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
        tag: ['Python', 'Data', 'Analytics'],
        sections: [{ sectionName: 'Data Basics', subSections: [{ title: 'Working with CSV Files', timeDuration: '07:20', description: 'Load and inspect tabular data.', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }] }]
      },
      {
        courseName: 'Python for Data Analysis',
        courseDescription: 'Use Python, NumPy and Pandas to wrangle and analyze data.',
        whatYouWillLearn: 'Data cleaning, aggregation, and basic analysis pipelines.',
        price: '35',
        thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
        tag: ['Python', 'Pandas'],
        sections: [{ sectionName: 'Pandas', subSections: [{ title: 'DataFrames', timeDuration: '06:40', description: 'Manipulate tabular data', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }] }]
      },
      {
        courseName: 'Machine Learning A-Z',
        courseDescription: 'Supervised and unsupervised machine learning fundamentals.',
        whatYouWillLearn: 'Train models, evaluate performance, and avoid overfitting.',
        price: '59',
        thumbnail: 'https://images.unsplash.com/photo-1558888400-1a1d8e6b0b3f?auto=format&fit=crop&w=900&q=80',
        tag: ['ML', 'Scikit-learn'],
        sections: [{ sectionName: 'ML Basics', subSections: [{ title: 'Regression & Classification', timeDuration: '08:00', description: 'Model types and evaluation', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }] }]
      },
      {
        courseName: 'Deep Learning Foundations',
        courseDescription: 'Neural networks, architectures and training basics.',
        whatYouWillLearn: 'Build and train simple neural networks using TensorFlow/PyTorch.',
        price: '69',
        thumbnail: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=900&q=80',
        tag: ['Deep Learning', 'Neural Networks'],
        sections: [{ sectionName: 'NNs', subSections: [{ title: 'Intro to Neural Nets', timeDuration: '09:00', description: 'Forward & backward pass', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }] }]
      },
      {
        courseName: 'SQL for Data',
        courseDescription: 'Query relational data effectively for analysis.',
        whatYouWillLearn: 'Joins, aggregation, window functions, and performance tips.',
        price: '25',
        thumbnail: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&w=900&q=80',
        tag: ['SQL', 'Databases'],
        sections: [{ sectionName: 'Queries', subSections: [{ title: 'Joins & Aggregations', timeDuration: '06:30', description: 'Combine and summarize data', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }] }]
      },
      {
        courseName: 'Data Visualization with Matplotlib',
        courseDescription: 'Create clear charts and dashboards to communicate insights.',
        whatYouWillLearn: 'Plotting basics and design choices for visual clarity.',
        price: '20',
        thumbnail: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=900&q=80',
        tag: ['Visualization', 'Matplotlib'],
        sections: [{ sectionName: 'Charts', subSections: [{ title: 'Line & Bar Charts', timeDuration: '05:15', description: 'Effective charting', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }] }]
      },
      {
        courseName: 'Pandas Mastery',
        courseDescription: 'Advanced Pandas techniques for real-world datasets.',
        whatYouWillLearn: 'Time series, groupby, and performance tips.',
        price: '30',
        thumbnail: 'https://images.unsplash.com/photo-1526378722372-8da7b0a1a3d6?auto=format&fit=crop&w=900&q=80',
        tag: ['Pandas', 'Python'],
        sections: [{ sectionName: 'Advanced', subSections: [{ title: 'GroupBy & Transform', timeDuration: '07:45', description: 'Aggregate and reshape data', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }] }]
      },
      {
        courseName: 'NLP Intro',
        courseDescription: 'Natural Language Processing essentials with practical examples.',
        whatYouWillLearn: 'Text preprocessing, embeddings, and simple models.',
        price: '39',
        thumbnail: 'https://images.unsplash.com/photo-1526378722372-8da7b0a1a3d6?auto=format&fit=crop&w=900&q=80',
        tag: ['NLP', 'Text'],
        sections: [{ sectionName: 'Text', subSections: [{ title: 'Preprocessing', timeDuration: '06:00', description: 'Tokenization & cleaning', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }] }]
      }
    ]
  }
];

async function seedData() {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log('Connected to MongoDB');

  for (const categoryData of seedCategories) {
    const categoryDoc = await Category.findOneAndUpdate(
      { name: categoryData.name },
      {
        $set: {
          name: categoryData.name,
          description: categoryData.description,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    for (const courseData of categoryData.courses) {
      const sectionIds = [];

      for (const sectionData of courseData.sections) {
        const subSectionDocs = await SubSection.create(
          sectionData.subSections.map((subSection) => ({
            title: subSection.title,
            timeDuration: subSection.timeDuration,
            description: subSection.description,
            videoUrl: subSection.videoUrl,
          }))
        );

        const sectionDoc = await Section.create({
          sectionName: sectionData.sectionName,
          subSection: subSectionDocs.map((doc) => doc._id),
        });

        sectionIds.push(sectionDoc._id);
      }

      const courseDoc = await Course.findOneAndUpdate(
        { courseName: courseData.courseName },
        {
          $set: {
            courseName: courseData.courseName,
            courseDescription: courseData.courseDescription,
            instructor: instructorId,
            whatYouWillLearn: courseData.whatYouWillLearn,
            courseContent: sectionIds,
            price: courseData.price,
            thumbnail: courseData.thumbnail,
            tag: courseData.tag,
            category: categoryDoc._id,
            status: 'Published',
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      await Category.findByIdAndUpdate(categoryDoc._id, { $addToSet: { courses: courseDoc._id } });
      console.log(`Inserted/updated course: ${courseDoc.courseName}`);
    }
  }

  console.log('Dummy categories and courses created successfully');
}

seedData()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  });
