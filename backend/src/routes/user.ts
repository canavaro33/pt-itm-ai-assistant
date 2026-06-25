import { Router, Response } from 'express';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import prisma from '../lib/prisma';
import { authenticateJWT } from './auth';

const router = Router();

// All routes require JWT authentication
router.use(authenticateJWT);

// Multer config for avatar uploads
const avatarDir = path.join(__dirname, '../../public/uploads/avatars');
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, avatarDir),
  filename: (req: any, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar-${req.user.id}-${Date.now()}${ext}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// GET /api/user/certifications
router.get('/certifications', async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const employee = await prisma.employee.findUnique({
      where: { id: userId },
      select: { certifications: true },
    });

    if (!employee) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // certifications is stored as JSON, parse it
    const certifications = employee.certifications
      ? (typeof employee.certifications === 'string'
        ? JSON.parse(employee.certifications)
        : employee.certifications)
      : [];

    res.json({ certifications });
  } catch (error) {
    console.error('❌ Get certifications error:', error);
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
});

// GET /api/user/work-location
router.get('/work-location', async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const employee = await prisma.employee.findUnique({
      where: { id: userId },
      select: {
        siteName: true,
        department: true,
        shiftSchedule: true,
      },
    });

    if (!employee) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      workLocation: {
        siteName: employee.siteName,
        department: employee.department,
        shiftSchedule: employee.shiftSchedule,
      },
    });
  } catch (error) {
    console.error('❌ Get work location error:', error);
    res.status(500).json({ error: 'Failed to fetch work location' });
  }
});

// PUT /api/user/change-password
router.put('/change-password', async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current password and new password are required' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters' });
      return;
    }

    // Get user with password hash
    const employee = await prisma.employee.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!employee) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Validate current password
    const isMatch = await bcrypt.compare(currentPassword, employee.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Current password is incorrect' });
      return;
    }

    // Hash new password
    const saltRounds = 10;
    const newHash = await bcrypt.hash(newPassword, saltRounds);

    // Update in DB
    await prisma.employee.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('❌ Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// GET /api/user/notification-preferences
router.get('/notification-preferences', async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const employee = await prisma.employee.findUnique({
      where: { id: userId },
      select: { emailAlerts: true, pushNotifications: true },
    });

    if (!employee) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      emailAlerts: employee.emailAlerts,
      pushNotifications: employee.pushNotifications,
    });
  } catch (error) {
    console.error('❌ Get notification preferences error:', error);
    res.status(500).json({ error: 'Failed to fetch notification preferences' });
  }
});

// PUT /api/user/notification-preferences
router.put('/notification-preferences', async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { emailAlerts, pushNotifications } = req.body;

    if (typeof emailAlerts !== 'boolean' && typeof pushNotifications !== 'boolean') {
      res.status(400).json({ error: 'At least one boolean preference is required' });
      return;
    }

    const updateData: Record<string, boolean> = {};
    if (typeof emailAlerts === 'boolean') updateData.emailAlerts = emailAlerts;
    if (typeof pushNotifications === 'boolean') updateData.pushNotifications = pushNotifications;

    const employee = await prisma.employee.update({
      where: { id: userId },
      data: updateData,
      select: { emailAlerts: true, pushNotifications: true },
    });

    res.json({
      emailAlerts: employee.emailAlerts,
      pushNotifications: employee.pushNotifications,
    });
  } catch (error) {
    console.error('❌ Update notification preferences error:', error);
    res.status(500).json({ error: 'Failed to update notification preferences' });
  }
});

// PUT /api/user/profile (multipart/form-data)
router.put('/profile', upload.single('avatar'), async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { fullName, employeeId, department, role } = req.body;

    const updateData: Record<string, any> = {};
    if (fullName !== undefined) updateData.name = fullName;
    if (employeeId !== undefined) updateData.employeeId = employeeId;
    if (department !== undefined) updateData.department = department;
    if (role !== undefined) updateData.role = role;

    // If avatar file uploaded, store relative path
    if (req.file) {
      updateData.avatarUrl = `/uploads/avatars/${req.file.filename}`;
    }

    const employee = await prisma.employee.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        employeeId: true,
        department: true,
        role: true,
        avatarUrl: true,
      },
    });

    res.json({
      user: {
        id: employee.id,
        name: employee.name,
        employee_id: employee.employeeId,
        department: employee.department,
        role: employee.role,
        avatarUrl: employee.avatarUrl,
      },
    });
  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/user/chat-stats
router.get('/chat-stats', async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    // Total questions asked (user messages across all sessions)
    const totalQuestions = await prisma.chatMessage.count({
      where: {
        role: 'user',
        session: { userId },
      },
    });

    // Last active session
    const lastSession = await prisma.chatSession.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true },
    });

    // Top topic: most frequent first word from user messages
    const userMessages = await prisma.chatMessage.findMany({
      where: {
        role: 'user',
        session: { userId },
      },
      select: { content: true },
    });

    // Simple frequency count of first words
    const wordFreq: Record<string, number> = {};
    for (const msg of userMessages) {
      const firstWord = msg.content.trim().split(/\s+/)[0]?.toLowerCase();
      if (firstWord && firstWord.length > 1) {
        wordFreq[firstWord] = (wordFreq[firstWord] || 0) + 1;
      }
    }

    let topTopic = 'N/A';
    let maxCount = 0;
    for (const [word, count] of Object.entries(wordFreq)) {
      if (count > maxCount) {
        maxCount = count;
        topTopic = word.charAt(0).toUpperCase() + word.slice(1);
      }
    }

    res.json({
      totalQuestions,
      lastActiveSession: lastSession?.updatedAt || null,
      topTopic,
    });
  } catch (error) {
    console.error('❌ Get chat stats error:', error);
    res.status(500).json({ error: 'Failed to fetch chat stats' });
  }
});

export default router;
