import http from 'http';
import crypto from 'crypto';
import { createReadStream, existsSync } from 'fs';
import { mkdir, readFile, stat, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'db.json');
const port = Number(process.env.BACKEND_PORT || process.env.PORT || 3001);
const frontendUrl = process.env.FRONTEND_URL || '';
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jfif': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
};

const seedUsers = [
  { id: '1', email: 'admin@council.gov', password: 'admin123', name: 'Admin User', role: 'Admin' },
  { id: '2', email: 'manager@council.gov', password: 'manager123', name: 'Sarah Johnson', role: 'Project Manager' },
  { id: '3', email: 'staff@council.gov', password: 'staff123', name: 'Staff Member', role: 'Staff Member' },
];

const seedProjects = [
  {
    id: '1',
    name: 'Community Centre Renovation',
    description: 'Complete renovation of the downtown community centre including accessibility improvements',
    status: 'Active',
    priority: 'High',
    phase: 'Execution',
    startDate: '2026-01-15',
    endDate: '2026-08-30',
    budget: '$2,500,000',
    projectManager: 'Sarah Johnson',
    department: 'Community Services',
    approvalStatus: 'Pending',
    risks: [
      {
        id: 'r1',
        title: 'Asbestos Discovery',
        description: 'Potential asbestos in old building materials',
        likelihood: 'Medium',
        impact: 'High',
        mitigation: 'Complete asbestos survey before demolition work',
        status: 'Open',
        owner: 'Sarah Johnson',
        dateIdentified: '2026-02-01',
      },
    ],
    issues: [
      {
        id: 'i1',
        title: 'Permit Delay',
        description: 'Building permit approval delayed by 2 weeks',
        priority: 'High',
        status: 'Resolved',
        assignedTo: 'Mike Chen',
        dateRaised: '2026-02-10',
        dateResolved: '2026-02-24',
      },
    ],
    scopeChanges: [],
    benefits: [
      {
        id: 'b1',
        title: 'Increased Accessibility',
        description: 'Provide wheelchair access to all areas',
        category: 'Social',
        targetValue: '100% accessibility compliance',
        currentValue: '60% complete',
        status: 'In Progress',
      },
    ],
    grantMilestones: [
      {
        id: 'g1',
        title: 'Phase 1 Completion',
        description: 'Complete demolition and structural work',
        dueDate: '2026-04-30',
        status: 'In Progress',
        deliverables: ['Demolition report', 'Structural certification', 'Safety inspection'],
        grantAmount: '$500,000',
      },
    ],
    approvals: [],
  },
  {
    id: '2',
    name: 'Park Improvement Program',
    description: 'Upgrade playground equipment and facilities across 5 local parks',
    status: 'Planning',
    priority: 'Medium',
    phase: 'Planning',
    startDate: '2026-04-01',
    endDate: '2026-10-31',
    budget: '$850,000',
    projectManager: 'David Martinez',
    department: 'Parks & Recreation',
    approvalStatus: 'Pending',
    risks: [],
    issues: [],
    scopeChanges: [],
    benefits: [],
    grantMilestones: [],
    approvals: [],
  },
  {
    id: '3',
    name: 'Digital Services Platform',
    description: 'Launch new online platform for council services and payments',
    status: 'Active',
    priority: 'Critical',
    phase: 'Monitoring',
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    budget: '$1,200,000',
    projectManager: 'Emily Watson',
    department: 'IT Services',
    approvalStatus: 'Approved',
    risks: [],
    issues: [],
    scopeChanges: [],
    benefits: [],
    grantMilestones: [],
    approvals: [
      {
        id: 'ap1',
        phase: 'Monitoring',
        decision: 'Approved',
        approverName: 'Admin User',
        notes: 'Approved for monitoring stage review.',
        decidedAt: '2026-05-01T09:15:00.000Z',
      },
    ],
  },
];

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':');
  const passwordHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(passwordHash, 'hex'));
}

function createDefaultDatabase() {
  return {
    users: seedUsers.map(({ password, ...user }) => ({ ...user, passwordHash: hashPassword(password) })),
    projects: seedProjects,
    auditLogs: [],
    notifications: [],
    publicUpdates: [],
    passwordResetTokens: [],
  };
}

async function loadDatabase() {
  await mkdir(dataDir, { recursive: true });

  if (!existsSync(dbPath)) {
    const database = createDefaultDatabase();
    await writeDatabase(database);
    return database;
  }

  return JSON.parse(await readFile(dbPath, 'utf8'));
}

async function writeDatabase(database) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dbPath, JSON.stringify(database, null, 2));
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function getFrontendUrl(request) {
  if (frontendUrl) return frontendUrl;

  const protocol = request.headers['x-forwarded-proto'] || 'http';
  return `${protocol}://${request.headers.host}`;
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  response.end(JSON.stringify(payload));
}

async function sendStaticFile(response, filePath) {
  try {
    const fileStat = await stat(filePath);

    if (!fileStat.isFile()) return false;

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      'Content-Type': mimeTypes[extension] || 'application/octet-stream',
      'Content-Length': fileStat.size,
    });
    createReadStream(filePath).pipe(response);
    return true;
  } catch {
    return false;
  }
}

async function serveFrontend(request, response, pathname) {
  if (!existsSync(distDir)) {
    return sendJson(response, 404, {
      message: 'Frontend build not found. Run npm run build before starting the production server.',
    });
  }

  const requestedPath = decodeURIComponent(pathname);
  const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, '');
  const staticPath = path.join(distDir, safePath === '/' ? 'index.html' : safePath);
  const isInsideDist = path.resolve(staticPath).startsWith(path.resolve(distDir));

  if (isInsideDist && await sendStaticFile(response, staticPath)) return;

  await sendStaticFile(response, path.join(distDir, 'index.html'));
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function createAuditLog({ user, action, entityType, entityId, entityName, description }) {
  return {
    id: `al-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    timestamp: new Date().toISOString(),
    userId: user?.id || 'system',
    userName: user?.name || 'System',
    userRole: user?.role || 'System',
    action,
    entityType,
    entityId,
    entityName,
    description,
  };
}

async function handleLogin(request, response, database) {
  const { email, password } = await readBody(request);
  if (!email || !password) return sendJson(response, 400, { message: 'Email and password are required' });

  const user = database.users.find((item) => item.email.toLowerCase() === String(email).toLowerCase());
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return sendJson(response, 401, { message: 'Invalid email or password' });
  }

  return sendJson(response, 200, { user: publicUser(user) });
}

async function handleForgotPassword(request, response, database) {
  const { email } = await readBody(request);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return sendJson(response, 400, { message: 'A valid email address is required' });
  }

  const user = database.users.find((item) => item.email.toLowerCase() === String(email).toLowerCase());
  let resetLink = null;

  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    database.passwordResetTokens = database.passwordResetTokens.filter((item) => item.userId !== user.id);
    database.passwordResetTokens.push({ token, userId: user.id, expiresAt, usedAt: null, createdAt: new Date().toISOString() });
    resetLink = `${getFrontendUrl(request)}/reset-password?token=${token}`;
    console.log(`Password reset link for ${user.email}: ${resetLink}`);
    await writeDatabase(database);
  }

  return sendJson(response, 200, {
    message: 'If an account exists for that email, a password reset link has been sent.',
    resetLink,
  });
}

async function handleResetPassword(request, response, database) {
  const { token, newPassword, confirmPassword } = await readBody(request);
  if (!token) return sendJson(response, 400, { message: 'Reset token is required' });
  if (!newPassword || !String(newPassword).trim()) return sendJson(response, 400, { message: 'New password is required' });
  if (!confirmPassword || !String(confirmPassword).trim()) return sendJson(response, 400, { message: 'Confirm password is required' });
  if (newPassword !== confirmPassword) return sendJson(response, 400, { message: 'Passwords do not match' });

  const resetToken = database.passwordResetTokens.find((item) => item.token === token && !item.usedAt);
  if (!resetToken || new Date(resetToken.expiresAt).getTime() < Date.now()) {
    return sendJson(response, 400, { message: 'Invalid or expired reset token' });
  }

  const user = database.users.find((item) => item.id === resetToken.userId);
  if (!user) return sendJson(response, 400, { message: 'Invalid or expired reset token' });

  user.passwordHash = hashPassword(newPassword);
  resetToken.usedAt = new Date().toISOString();
  database.auditLogs.unshift(createAuditLog({
    user,
    action: 'Updated',
    entityType: 'User',
    entityId: user.id,
    entityName: user.email,
    description: `Password reset completed for ${user.email}`,
  }));
  await writeDatabase(database);

  return sendJson(response, 200, { message: 'Password reset successfully. Please log in with your new password.' });
}

async function handleApproval(request, response, database, projectId) {
  const { phase, decision, approverId, approverName, notes } = await readBody(request);
  const project = database.projects.find((item) => item.id === projectId);
  if (!project) return sendJson(response, 404, { message: 'Project not found' });
  if (!['Approved', 'Rejected'].includes(decision)) return sendJson(response, 400, { message: 'Decision must be Approved or Rejected' });

  const user = database.users.find((item) => item.id === approverId) || {
    id: approverId || 'manual',
    name: approverName || 'Project Manager',
    role: 'Project Manager',
  };
  const approval = {
    id: `ap-${Date.now()}`,
    phase: phase || project.phase,
    decision,
    approverName: user.name,
    notes: notes || '',
    decidedAt: new Date().toISOString(),
  };

  project.approvals.push(approval);
  project.approvalStatus = decision;
  database.auditLogs.unshift(createAuditLog({
    user,
    action: 'Updated',
    entityType: 'Project',
    entityId: project.id,
    entityName: project.name,
    description: `${decision} ${project.name} for ${approval.phase}`,
  }));
  await writeDatabase(database);
  return sendJson(response, 200, { approval, project });
}

async function handleRequest(request, response) {
  if (request.method === 'OPTIONS') return sendJson(response, 204, {});

  const database = await loadDatabase();
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = url.pathname;

  try {
    if (request.method === 'GET' && pathname === '/api/health') return sendJson(response, 200, { status: 'ok' });
    if (request.method === 'POST' && pathname === '/api/auth/login') return handleLogin(request, response, database);
    if (request.method === 'POST' && pathname === '/api/auth/forgot-password') return handleForgotPassword(request, response, database);
    if (request.method === 'POST' && pathname === '/api/auth/reset-password') return handleResetPassword(request, response, database);
    if (request.method === 'GET' && pathname === '/api/projects') return sendJson(response, 200, { projects: database.projects });
    if (request.method === 'GET' && pathname === '/api/audit-logs') return sendJson(response, 200, { auditLogs: database.auditLogs });

    const projectMatch = pathname.match(/^\/api\/projects\/([^/]+)$/);
    if (projectMatch && request.method === 'GET') {
      const project = database.projects.find((item) => item.id === projectMatch[1]);
      return project ? sendJson(response, 200, { project }) : sendJson(response, 404, { message: 'Project not found' });
    }

    const approvalMatch = pathname.match(/^\/api\/projects\/([^/]+)\/approval$/);
    if (approvalMatch && request.method === 'POST') return handleApproval(request, response, database, approvalMatch[1]);

    if (pathname.startsWith('/api/')) {
      return sendJson(response, 404, { message: 'Route not found' });
    }

    if (request.method === 'GET' || request.method === 'HEAD') {
      return serveFrontend(request, response, pathname);
    }

    return sendJson(response, 404, { message: 'Route not found' });
  } catch (error) {
    console.error(error);
    return sendJson(response, 500, { message: 'Internal server error' });
  }
}

http.createServer(handleRequest).listen(port, () => {
  console.log(`Council P3M API running at http://localhost:${port}`);
  console.log(`Frontend reset links use ${frontendUrl || 'the current request host'}`);
});
