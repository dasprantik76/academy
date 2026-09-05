// Vercel Serverless Function: /api/data.js
// Multi-Tenant MongoDB Partitioned SaaS API for Academy Platform

import { getDatabase } from './lib/mongodb.js';

const COLLECTIONS = {
  PROFILE: 'profile',
  COURSES: 'courses',
  STUDENTS: 'students',
  AUTH_TOKEN: 'auth_token'
};

const COURSE_SEED_VERSION = 2;

// Default seed profiles for multi-tenant academies
const DEFAULT_TENANTS = {
  'dasprantik76@gmail.com': {
    ownerEmail: 'dasprantik76@gmail.com',
    academyName: 'Diganta Computer Centre',
    ownerName: 'Prantik Das',
    email: 'swarupkhan1@gmail.com',
    phone: '9733894742',
    secondaryPhone: '9733894742',
    whatsapp: '9733894742',
    slug: 'prantik',
    category: 'Computer Science & Information Technology',
    about: 'Premier professional computer and software training academy offering certified courses.'
  },
  'poulami.13thmay@gmail.com': {
    ownerEmail: 'poulami.13thmay@gmail.com',
    academyName: 'Poulami Dance Academy',
    ownerName: 'Poulami',
    email: 'poulami.13thmay@gmail.com',
    phone: '9876543211',
    slug: 'poulami',
    category: 'Performing Arts & Classical Dance',
    about: 'Dedicated institute for Classical Dance, Bharatanatyam, Kathak, and Contemporary Dance training.'
  }
};

// Default sample courses for new academies
const DEFAULT_COURSES_BY_TENANT = {
  'dasprantik76@gmail.com': [
    {
      id: 'CRS-101',
      title: 'Diploma in Computer Applications (DCA)',
      duration: '6 Months',
      description: 'Comprehensive fundamentals of computer operations, MS Office suite, Internet basics, and database concepts.',
      ownerEmail: 'dasprantik76@gmail.com'
    },
    {
      id: 'CRS-102',
      title: 'Full Stack Web Development',
      duration: '1 Year',
      description: 'Modern front-end and back-end web development with HTML5, CSS3, JavaScript, Node.js, and Databases.',
      ownerEmail: 'dasprantik76@gmail.com'
    },
    {
      id: 'CRS-103',
      title: 'Post Graduate Diploma in Computer Applications (PGDCA)',
      duration: '1 Year',
      description: 'Advanced programming concepts, system architecture, database administration, and project implementation.',
      ownerEmail: 'dasprantik76@gmail.com'
    },
    {
      id: 'CRS-104',
      title: 'Certificate in Office Automation',
      duration: '3 Months',
      description: 'Practical training in Word, Excel, PowerPoint, email, document formatting, and everyday office productivity.',
      ownerEmail: 'dasprantik76@gmail.com'
    },
    {
      id: 'CRS-105',
      title: 'Tally Prime with GST',
      duration: '4 Months',
      description: 'Learn computerized accounting, inventory management, GST invoicing, taxation reports, and payroll using Tally Prime.',
      ownerEmail: 'dasprantik76@gmail.com'
    },
    {
      id: 'CRS-106',
      title: 'Graphic Design Fundamentals',
      duration: '6 Months',
      description: 'Build creative design skills through typography, image editing, branding, social media graphics, and print layouts.',
      ownerEmail: 'dasprantik76@gmail.com'
    }
  ],
  'poulami.13thmay@gmail.com': [
    {
      id: 'CRS-201',
      title: 'Classical Bharatanatyam (Foundation & Advanced)',
      duration: '1 Year',
      description: 'Traditional Margam repertoire, Adavus, Mudras, rhythmic Abhinaya, and stage performance mastery.',
      ownerEmail: 'poulami.13thmay@gmail.com'
    },
    {
      id: 'CRS-202',
      title: 'Kathak Dance Certification',
      duration: '6 Months',
      description: 'Tatkar footwork, Chakkars, Thaat, Tukras, and expressive storytelling through rhythm.',
      ownerEmail: 'poulami.13thmay@gmail.com'
    },
    {
      id: 'CRS-203',
      title: 'Contemporary & Creative Movement',
      duration: '6 Months',
      description: 'Fluid choreography, body alignment, contemporary expression, and stage performance techniques.',
      ownerEmail: 'poulami.13thmay@gmail.com'
    },
    {
      id: 'CRS-204',
      title: 'Rabindra Nritya',
      duration: '6 Months',
      description: 'Learn expressive movement, musical interpretation, and choreography based on the works of Rabindranath Tagore.',
      ownerEmail: 'poulami.13thmay@gmail.com'
    },
    {
      id: 'CRS-205',
      title: 'Creative Dance for Children',
      duration: '6 Months',
      description: 'An engaging foundation program that develops rhythm, coordination, expression, confidence, and stage presence.',
      ownerEmail: 'poulami.13thmay@gmail.com'
    },
    {
      id: 'CRS-206',
      title: 'Dance Performance Workshop',
      duration: '3 Months',
      description: 'Focused training in choreography, musicality, stagecraft, group coordination, and live performance preparation.',
      ownerEmail: 'poulami.13thmay@gmail.com'
    }
  ]
};

export default async function handler(req, res) {
  // Universal CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check if MongoDB environment is configured
  if (!process.env.MONGODB_URI) {
    return res.status(200).json({
      success: false,
      isConfigured: false,
      message: 'MONGODB_URI is not configured. The frontend is operating in local fallback mode.'
    });
  }

  let db;
  try {
    db = await getDatabase();
  } catch (dbErr) {
    console.error('[MongoDB Connection Error]:', dbErr);
    return res.status(500).json({
      success: false,
      error: 'Database connection failed',
      message: dbErr.message
    });
  }

  // Helper to resolve tenant email from request
  async function resolveOwnerEmail(queryEmail, querySlug, reqHost) {
    let email = (queryEmail || '').toLowerCase().trim();
    let slug = (querySlug || '').toLowerCase().trim();

    // Check host header for custom subdomains (e.g. prantik.prantikphotography.com)
    if (!slug && reqHost) {
      const parts = reqHost.toLowerCase().split('.');
      if (parts.length >= 3) {
        const sub = parts[0];
        if (sub !== 'www' && sub !== 'academy' && sub !== 'app') {
          slug = sub;
        }
      }
    }

    if (!email && slug) {
      if (slug === 'prantik' || slug === 'dasprantik76@gmail.com') {
        email = 'dasprantik76@gmail.com';
      } else if (slug === 'poulami' || slug === 'poulami.13thmay@gmail.com') {
        email = 'poulami.13thmay@gmail.com';
      } else {
        const profileDoc = await db.collection(COLLECTIONS.PROFILE).findOne({ slug }, { projection: { _id: 0 } });
        if (profileDoc && profileDoc.ownerEmail) {
          email = profileDoc.ownerEmail;
        } else {
          // Explicit unknown slug requested that is not registered
          return null;
        }
      }
    }

    // Default tenant fallback only when bare domain accessed with no specific subdomain/slug
    if (!email && !slug) {
      email = 'dasprantik76@gmail.com';
    }
    return email;
  }

  // --------------------------------------------------------------------------
  // GET: Fetch Academy Data for Specific Tenant
  // --------------------------------------------------------------------------
  if (req.method === 'GET') {
    try {
      const requestedSlug = req.query.academy || req.headers.host?.split('.')[0] || '';
      const ownerEmail = await resolveOwnerEmail(req.query.ownerEmail, req.query.academy, req.headers.host);

      if (!ownerEmail) {
        return res.status(404).json({
          success: false,
          notFound: true,
          slug: requestedSlug,
          message: `404 Not Found: The academy "${requestedSlug}" has not been registered or claimed yet.`
        });
      }

      let [profileDoc, coursesList, studentsList, authTokenDoc] = await Promise.all([
        db.collection(COLLECTIONS.PROFILE).findOne({ ownerEmail }, { projection: { _id: 0 } }),
        db.collection(COLLECTIONS.COURSES).find({ ownerEmail }, { projection: { _id: 0 } }).toArray(),
        db.collection(COLLECTIONS.STUDENTS).find({ ownerEmail }, { projection: { _id: 0 } }).sort({ _id: -1 }).toArray(),
        db.collection(COLLECTIONS.AUTH_TOKEN).findOne({ ownerEmail }, { projection: { _id: 0 } })
      ]);

      // Auto-seed profile if this is a default tenant and profile doesn't exist yet
      if (!profileDoc && DEFAULT_TENANTS[ownerEmail]) {
        profileDoc = DEFAULT_TENANTS[ownerEmail];
        await db.collection(COLLECTIONS.PROFILE).updateOne(
          { ownerEmail },
          { $set: profileDoc },
          { upsert: true }
        );
      }

      // This deployment is dedicated to Diganta Computer Centre. Keep the
      // public-facing identity canonical even when an older personalised
      // profile is already present in MongoDB.
      if (ownerEmail === 'dasprantik76@gmail.com') {
        const canonicalProfile = DEFAULT_TENANTS[ownerEmail];
        const needsCanonicalProfile = Object.entries(canonicalProfile)
          .some(([key, value]) => profileDoc?.[key] !== value);

        if (needsCanonicalProfile) {
          profileDoc = { ...(profileDoc || {}), ...canonicalProfile };
          await db.collection(COLLECTIONS.PROFILE).updateOne(
            { ownerEmail },
            { $set: canonicalProfile },
            { upsert: true }
          );
        }
      }

      // Seed the six starter courses once. The profile marker prevents courses
      // intentionally deleted in the Admin Portal from being recreated later.
      if (DEFAULT_COURSES_BY_TENANT[ownerEmail] && profileDoc?.courseSeedVersion !== COURSE_SEED_VERSION) {
        const starterCourses = DEFAULT_COURSES_BY_TENANT[ownerEmail];
        const existingIds = new Set((coursesList || []).map(course => course.id));
        const missingCourses = starterCourses.filter(course => !existingIds.has(course.id));

        if (missingCourses.length > 0) {
          await db.collection(COLLECTIONS.COURSES).insertMany(missingCourses);
          coursesList = await db.collection(COLLECTIONS.COURSES)
            .find({ ownerEmail }, { projection: { _id: 0 } })
            .toArray();
        }

        await db.collection(COLLECTIONS.PROFILE).updateOne(
          { ownerEmail },
          { $set: { courseSeedVersion: COURSE_SEED_VERSION } },
          { upsert: true }
        );
        profileDoc = { ...(profileDoc || {}), courseSeedVersion: COURSE_SEED_VERSION };
      }

      return res.status(200).json({
        success: true,
        isConfigured: true,
        tenant: {
          ownerEmail,
          slug: profileDoc?.slug || (ownerEmail.includes('poulami') ? 'poulami' : 'prantik')
        },
        data: {
          profile: profileDoc || null,
          courses: Array.isArray(coursesList) ? coursesList : [],
          students: Array.isArray(studentsList) ? studentsList : [],
          authToken: authTokenDoc || null
        }
      });
    } catch (error) {
      console.error('[API GET Error]:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve data from MongoDB',
        message: error.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // POST: Mutate Academy Data for Specific Tenant
  // --------------------------------------------------------------------------
  if (req.method === 'POST') {
    try {
      const { action, payload } = req.body || {};

      if (!action) {
        return res.status(400).json({ success: false, error: 'Missing action parameter' });
      }

      const ownerEmail = await resolveOwnerEmail(payload?.ownerEmail, payload?.academySlug);

      switch (action) {
        // 1. Save Academy Profile
        case 'save_profile': {
          if (!payload?.profile) {
            return res.status(400).json({ success: false, error: 'Missing profile in payload' });
          }
          const updatedProfile = { ...payload.profile, ownerEmail };
          await db.collection(COLLECTIONS.PROFILE).updateOne(
            { ownerEmail },
            { $set: updatedProfile },
            { upsert: true }
          );
          return res.status(200).json({ success: true, profile: updatedProfile });
        }

        // 2. Save All Courses
        case 'save_courses': {
          const courses = Array.isArray(payload?.courses) ? payload.courses : [];
          const taggedCourses = courses.map(c => ({ ...c, ownerEmail }));
          await db.collection(COLLECTIONS.COURSES).deleteMany({ ownerEmail });
          if (taggedCourses.length > 0) {
            await db.collection(COLLECTIONS.COURSES).insertMany(taggedCourses);
          }
          return res.status(200).json({ success: true, courses: taggedCourses });
        }

        // 3. Add or Update a Single Course
        case 'add_course': {
          const course = payload?.course;
          if (!course || !course.id) {
            return res.status(400).json({ success: false, error: 'Invalid course payload' });
          }
          const taggedCourse = { ...course, ownerEmail };
          await db.collection(COLLECTIONS.COURSES).updateOne(
            { id: course.id, ownerEmail },
            { $set: taggedCourse },
            { upsert: true }
          );
          const updatedCourses = await db.collection(COLLECTIONS.COURSES).find({ ownerEmail }, { projection: { _id: 0 } }).toArray();
          return res.status(200).json({ success: true, courses: updatedCourses });
        }

        // 4. Delete Course
        case 'delete_course': {
          const courseId = payload?.courseId;
          if (!courseId) {
            return res.status(400).json({ success: false, error: 'Missing courseId' });
          }
          await db.collection(COLLECTIONS.COURSES).deleteOne({ id: courseId, ownerEmail });
          const updatedCourses = await db.collection(COLLECTIONS.COURSES).find({ ownerEmail }, { projection: { _id: 0 } }).toArray();
          return res.status(200).json({ success: true, courses: updatedCourses });
        }

        // 5. Save All Students
        case 'save_students': {
          const students = Array.isArray(payload?.students) ? payload.students : [];
          const taggedStudents = students.map(s => ({ ...s, ownerEmail }));
          await db.collection(COLLECTIONS.STUDENTS).deleteMany({ ownerEmail });
          if (taggedStudents.length > 0) {
            await db.collection(COLLECTIONS.STUDENTS).insertMany(taggedStudents);
          }
          return res.status(200).json({ success: true, students: taggedStudents });
        }

        // 6. Add New Student Registration (From Public Site)
        case 'add_student': {
          const student = payload?.student;
          const studentName = student?.name || student?.fullName;
          if (!student || !studentName || !student?.phone) {
            return res.status(400).json({ success: false, error: 'Invalid student registration payload' });
          }
          const normalizedStudent = {
            ...student,
            name: studentName,
            fullName: studentName,
            ownerEmail
          };
          await db.collection(COLLECTIONS.STUDENTS).insertOne(normalizedStudent);
          return res.status(200).json({ success: true, student: normalizedStudent });
        }

        // 7. Update Single Student (From Admin Portal)
        case 'update_student': {
          const { studentId, updatedData } = payload || {};
          if (!studentId || !updatedData) {
            return res.status(400).json({ success: false, error: 'Missing studentId or updatedData' });
          }
          const result = await db.collection(COLLECTIONS.STUDENTS).updateOne(
            { id: studentId, ownerEmail },
            { $set: updatedData }
          );
          if (result.matchedCount > 0) {
            const updatedStudent = await db.collection(COLLECTIONS.STUDENTS).findOne({ id: studentId, ownerEmail }, { projection: { _id: 0 } });
            return res.status(200).json({ success: true, student: updatedStudent });
          }
          return res.status(404).json({ success: false, error: 'Student not found' });
        }

        // 8. Bulk Update Students (e.g. Mark as Completed)
        case 'bulk_update_students': {
          const { studentIds, updateFields } = payload || {};
          if (!Array.isArray(studentIds) || !updateFields) {
            return res.status(400).json({ success: false, error: 'Invalid bulk update payload' });
          }
          const result = await db.collection(COLLECTIONS.STUDENTS).updateMany(
            { id: { $in: studentIds }, ownerEmail },
            { $set: updateFields }
          );
          return res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
        }

        // 9. Delete Student
        case 'delete_student': {
          const studentId = payload?.studentId;
          if (!studentId) {
            return res.status(400).json({ success: false, error: 'Missing studentId' });
          }
          await db.collection(COLLECTIONS.STUDENTS).deleteOne({ id: studentId, ownerEmail });
          return res.status(200).json({ success: true, studentId });
        }

        // 10. Save Authentication Token (6-Digit OTP)
        case 'save_auth_token': {
          const token = payload?.token;
          if (!token || !token.code) {
            return res.status(400).json({ success: false, error: 'Invalid token payload' });
          }
          const taggedToken = { ...token, ownerEmail };
          await db.collection(COLLECTIONS.AUTH_TOKEN).updateOne(
            { ownerEmail },
            { $set: taggedToken },
            { upsert: true }
          );
          return res.status(200).json({ success: true, token: taggedToken });
        }

        // 11. Clear All Data (For specific owner only)
        case 'clear_all': {
          await Promise.all([
            db.collection(COLLECTIONS.COURSES).deleteMany({ ownerEmail }),
            db.collection(COLLECTIONS.STUDENTS).deleteMany({ ownerEmail })
          ]);
          return res.status(200).json({ success: true, message: `All student and course records cleared for ${ownerEmail}` });
        }

        default:
          return res.status(400).json({ success: false, error: `Unknown action: ${action}` });
      }
    } catch (error) {
      console.error('[API POST Error]:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to process mutation in MongoDB',
        message: error.message
      });
    }
  }

  return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
}
