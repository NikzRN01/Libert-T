/* eslint-disable no-console */

// Creates demo verification requests:
// - student@skillxintell.com -> educator@skillxintell.com
// - employee@skillxintell.com -> educator@skillxintell.com
//
// Run: node backend/scripts/create-demo-verification-requests.js

const BASE_URL = process.env.API_URL || 'http://localhost:5000';

async function requestJson(path, { method = 'GET', token, body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      data && typeof data === 'object' && data
        ? data.message || data.error || res.statusText
        : res.statusText;
    throw new Error(`${method} ${path} -> ${res.status} ${msg}`);
  }

  return data;
}

async function login(email, password) {
  const data = await requestJson('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });

  if (!data?.token || !data?.user?.id) {
    throw new Error(`Login response missing token/user for ${email}`);
  }

  return { token: data.token, user: data.user };
}

async function loginAny(emails, password) {
  let lastError;
  for (const email of emails) {
    try {
      return await login(email, password);
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

async function createSkill(token, { name, category, sector, proficiencyLevel, description }) {
  const resp = await requestJson('/api/skills', {
    method: 'POST',
    token,
    body: { name, category, sector, proficiencyLevel, description },
  });

  const skillId = resp?.skill?.id;
  if (!skillId) throw new Error('Skill creation did not return skill.id');
  return skillId;
}

async function createVerificationRequest(token, skillId, { reviewerId, message, evidenceUrl }) {
  const resp = await requestJson(`/api/verification/skills/${skillId}/requests`, {
    method: 'POST',
    token,
    body: { reviewerId, message, evidenceUrl },
  });

  const requestId = resp?.request?.id;
  if (!requestId) throw new Error('Verification request creation did not return request.id');
  return requestId;
}

async function main() {
  console.log('Using API:', BASE_URL);

  console.log('\nLogging in as educator (mentor)...');
  const educator = await login('educator@skillxintell.com', 'Educator@123');
  const reviewerId = educator.user.id;
  console.log('Educator userId:', reviewerId);

  console.log('\nLogging in as student...');
  const student = await login('student@skillxintell.com', 'Student@123');

  console.log('Creating a demo skill for student...');
  const studentSkillId = await createSkill(student.token, {
    name: 'Demo Skill (Student) - HL7 Basics',
    category: 'GENERAL',
    sector: 'HEALTHCARE',
    proficiencyLevel: 3,
    description: 'Seeded demo skill to create a verification request.',
  });
  console.log('Student skillId:', studentSkillId);

  console.log('Creating verification request from student -> educator...');
  const studentRequestId = await createVerificationRequest(student.token, studentSkillId, {
    reviewerId,
    message: 'Please verify my Healthcare skill (demo request).',
    evidenceUrl: 'https://example.com/evidence/student-skill',
  });
  console.log('Student requestId:', studentRequestId);

  console.log('\nLogging in as employee...');
  const employee = await loginAny(['employee@skillxintell.com', 'Employee@skillxintell.com'], 'Employee@123');

  console.log('Creating a demo skill for employee...');
  const employeeSkillId = await createSkill(employee.token, {
    name: 'Demo Skill (Employee) - Urban GIS',
    category: 'GENERAL',
    sector: 'URBAN',
    proficiencyLevel: 4,
    description: 'Seeded demo skill to create a verification request.',
  });
  console.log('Employee skillId:', employeeSkillId);

  console.log('Creating verification request from employee -> educator...');
  const employeeRequestId = await createVerificationRequest(employee.token, employeeSkillId, {
    reviewerId,
    message: 'Please verify my Urban skill (demo request).',
    evidenceUrl: 'https://example.com/evidence/employee-skill',
  });
  console.log('Employee requestId:', employeeRequestId);

  console.log('\nFetching educator inbox (PENDING)...');
  const inbox = await requestJson('/api/verification/requests/received?status=PENDING', {
    method: 'GET',
    token: educator.token,
  });

  console.log('Educator received count:', inbox?.count ?? '(unknown)');
  for (const r of (inbox?.requests || []).slice(0, 10)) {
    console.log('-', r.skill?.name, 'from', r.requester?.email, 'status', r.status);
  }

  console.log('\nDone.');
}

main().catch((e) => {
  console.error('\nFAILED:', e?.message || e);
  process.exit(1);
});
