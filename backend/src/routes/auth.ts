import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Middleware to authenticate JWT
export const authenticateJWT = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Authorization header missing' });
  }
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, employee_id, department, password } = req.body;

  if (!name || !employee_id || !department || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const employeeIdRegex = /^ITM-\d{4}$/;
  if (!employeeIdRegex.test(employee_id)) {
    return res.status(400).json({ error: 'employee_id must follow the format ITM-XXXX' });
  }

  try {
    const existingUser = await prisma.employee.findUnique({
      where: { employeeId: employee_id },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Employee ID already exists' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await prisma.employee.create({
      data: {
        name,
        employeeId: employee_id,
        department,
        role: 'Employee',
        passwordHash,
      },
    });

    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { employee_id, password } = req.body;

  if (!employee_id || !password) {
    return res.status(400).json({ error: 'Employee ID and password are required' });
  }

  try {
    const employee = await prisma.employee.findUnique({
      where: { employeeId: employee_id },
    });

    if (!employee) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, employee.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = {
      id: employee.id,
      employee_id: employee.employeeId,
      name: employee.name,
      department: employee.department,
      role: employee.role,
      avatarUrl: (employee as any).avatarUrl || null,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: payload,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateJWT, async (req: any, res: any) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: req.user.id },
    });

    if (!employee) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: employee.id,
        employee_id: employee.employeeId,
        name: employee.name,
        department: employee.department,
        role: employee.role,
        avatarUrl: (employee as any).avatarUrl || null,
      },
    });
  } catch (error) {
    console.error('Fetch me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
