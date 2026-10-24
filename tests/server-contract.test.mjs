import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as pause } from 'node:timers/promises';

test('REMEMBER never substitutes canned answers when AI is unavailable', async () => {
  const port = 42000 + Math.floor(Math.random() * 10000);
  const origin = `http://127.0.0.1:${port}`;
  let output = '';
  const child = spawn(process.execPath, ['server.js'], {
    env: { ...process.env, PORT: String(port), NODE_ENV: 'production', GEMINI_API_KEY: '' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout.on('data', chunk => { output += chunk.toString(); });
  child.stderr.on('data', chunk => { output += chunk.toString(); });

  try {
    let ready = false;
    for (let i = 0; i < 60; i++) {
      if (child.exitCode !== null) break;
      try {
        const health = await fetch(`${origin}/api/health`);
        if (health.ok) { ready = true; break; }
      } catch {}
      await pause(200);
    }
    assert.ok(ready, `Server did not start: ${output.slice(-1000)}`);

    const examples = await fetch(`${origin}/api/same-story/curated`);
    assert.equal(examples.status, 200);
    const curated = await examples.json();
    assert.ok(curated.success && Array.isArray(curated.stories));

    const calls = [
      ['/api/same-story/analyze', { userInput: 'Why does a metal hinge squeak at different temperatures?' }],
      ['/api/same-story/predict', { currentDilemma: 'A metal hinge squeaks at different temperatures' }],
      ['/api/same-story/simulate-what-if', { currentDilemma: 'A metal hinge squeaks', whatIfQuestion: 'What if it gets warmer?' }],
    ];
    for (const [route, body] of calls) {
      const response = await fetch(origin + route, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      assert.equal(response.status, 503, `${route} must fail honestly`);
      const payload = await response.json();
      assert.equal(payload.success, false);
      assert.ok(!payload.result && !payload.prediction && !payload.scenario, `${route} must not fabricate a result`);
    }
  } finally {
    child.kill();
  }
});
