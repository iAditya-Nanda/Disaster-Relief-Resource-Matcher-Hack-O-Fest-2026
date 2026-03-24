import { describe, it, expect, vi } from 'vitest';

// Pre-set environment variables before requiring the module
process.env.SUPABASE_URL = 'http://localhost:54321';
process.env.SUPABASE_ANON_KEY = 'dummy_key';

const { authenticateUser, authorizeRole } = require('./auth');

// Mocking Supabase Client with robust chaining
const mockSupabase = {
  auth: {
    getUser: vi.fn(async (token) => {
      if (token === 'valid_token') return { data: { user: { id: 'user_1' } }, error: null };
      return { data: { user: null }, error: new Error('Invalid') };
    })
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(async () => {
          return { data: { role: 'NGO' }, error: null };
        })
      }))
    }))
  }))
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabase
}));

describe('Auth & Role Middleware', () => {
  it('should block unauthenticated requests (missing token)', async () => {
    const req = { headers: {} };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    await authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing access token' });
  });

  it('should allow valid tokens to pass authentication', async () => {
    const req = { headers: { authorization: 'Bearer valid_token' } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    await authenticateUser(req, res, next);

    expect(req.user.id).toBe('user_1');
    expect(next).toHaveBeenCalled();
  });

  it('should block users with incorrect roles', async () => {
    const req = { user: { id: 'user_1' } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    // Check for 'Doctor' role when user is 'NGO'
    const middleware = authorizeRole(['Doctor']);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden: Insufficient permissions' });
  });

  it('should allow users with correct roles', async () => {
    const req = { user: { id: 'user_1' } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    const middleware = authorizeRole(['NGO']);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
