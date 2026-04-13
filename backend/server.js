// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
});
app.use('/api/sync', limiter);
app.get("/", (req, res) => {
  res.send("CP Tracker Backend is Running 🚀");
});
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const PROBLEMS_FILE = path.join(__dirname, 'data', 'problems.json');

// Helper to write JSON
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));
// Helper to read JSON
const readJSON = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

// Initialize mock solved status in-memory
// In a real app this might be saved to DB per user
let solvedStatus = {
  codeforces: [],
  atcoder: [],
  leetcode: [],
  codechef: []
};

app.get('/api/settings', (req, res) => {
  res.json(readJSON(USERS_FILE));
});

app.post('/api/settings', (req, res) => {
  writeJSON(USERS_FILE, req.body);
  res.json({ success: true });
});

app.get('/api/problems', (req, res) => {
  const problems = readJSON(PROBLEMS_FILE);
  res.json({ problems, solved: solvedStatus });
});

async function syncCodeforces(handle) {
  if (!handle) return;
  try {
    const res = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
    const submissions = res.data.result;
    const solved = submissions
      .filter(s => s.verdict === 'OK')
      .map(s => `${s.problem.contestId}${s.problem.index}`); // e.g., 4A
    solvedStatus.codeforces = [...new Set(solved)];
  } catch (err) {
    console.error('CF Sync error:', err.message);
  }
}

async function syncAtcoder(handle) {
  if (!handle) return;
  try {
    const res = await axios.get(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${handle}&from_second=0`);
    const submissions = res.data;
    const solved = submissions
      .filter(s => s.result === 'AC')
      .map(s => s.problem_id);
    solvedStatus.atcoder = [...new Set(solved)];
  } catch (err) {
    console.error('AtCoder Sync error:', err.message);
  }
}

async function syncLeetcode(handle) {
  if (!handle) return;
  try {
    const query = `
      query recentAcSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
          titleSlug
        }
      }
    `;
    const res = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { username: handle, limit: 50 }
    });
    const submissions = res.data.data.recentAcSubmissionList || [];
    const solved = submissions.map(s => s.titleSlug);
    // Append to existing, GraphQL limits to recent 50
    const combinedList = [...(solvedStatus.leetcode || []), ...solved];
    solvedStatus.leetcode = [...new Set(combinedList)];
  } catch (err) {
    console.error('LeetCode Sync error:', err.message);
  }
}

async function syncCodechef(handle) {
  if (!handle) return;
  try {
    // There is no proper public API, we scrape public profile
    const res = await axios.get(`https://www.codechef.com/users/${handle}`);
    const $ = cheerio.load(res.data);
    const solvedIds = [];
    $('.rating-data-section.problems-solved a').each((i, el) => {
      solvedIds.push($(el).text().trim());
    });
    solvedStatus.codechef = [...new Set(solvedIds)];
  } catch (err) {
    console.error('CodeChef Sync error:', err.message);
    solvedStatus.codechef = [];
  }
}

app.post('/api/sync', async (req, res) => {
  const handles = req.body;
  await Promise.all([
    syncCodeforces(handles.codeforces),
    syncAtcoder(handles.atcoder),
    syncLeetcode(handles.leetcode),
    syncCodechef(handles.codechef)
  ]);

  res.json({ success: true, solved: solvedStatus });
});

app.get('/api/contests', async (req, res) => {
  try {
    const response = await axios.get('https://kontests.net/api/v1/all');
    // Filter for the main platforms we care about if possible, or return all
    const relevant = response.data.filter(c =>
      ['CodeForces', 'AtCoder', 'LeetCode', 'CodeChef'].some(site => c.site.includes(site))
    );
    res.json(relevant.length > 0 ? relevant : response.data.slice(0, 50));
  } catch (err) {
    console.error('Contest fetch error:', err.message);
    res.json([]);
  }
});

// const PORT = 3001;
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
