import { Request, Response, NextFunction } from 'express';

// Extend Express Request type to include employeeId
declare global {
  namespace Express {
    interface Request {
      employeeId?: string;
    }
  }
}

const EMPLOYEE_ID_PATTERN = /^ITM-\d{4}$/;

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const employeeId = req.headers['x-employee-id'] as string | undefined;

  if (employeeId) {
    if (EMPLOYEE_ID_PATTERN.test(employeeId)) {
      req.employeeId = employeeId;
      console.log(`✅ Authenticated employee: ${employeeId}`);
    } else {
      console.warn(
        `⚠️  Invalid employee ID format: "${employeeId}" (expected ITM-XXXX)`
      );
    }
  } else {
    console.warn('⚠️  No x-employee-id header provided (demo mode — allowing request)');
  }

  // Always allow the request through (demo/internship project)
  next();
}
