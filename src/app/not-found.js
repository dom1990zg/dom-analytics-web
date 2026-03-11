'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function NotFound() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = Math.min(700, window.innerWidth - 40);
    const H = canvas.height = 360;

    let localScore = 0;
    let localLives = 3;
    let frame = 0;
    let difficulty = 1;
    let animId;

    const ship = { x: 60, y: H / 2, w: 28, h: 20, targetY: H / 2 };
    const bullets = [];
    const enemies = [];
    const particles = [];
    const stars = [];
    const powerUps = [];
    let canShoot = true;
    let shootCooldown = 0;
    let powerLevel = 1;
    let shieldActive = false;
    let shieldTimer = 0;
    let screenShake = 0;

    for (let i = 0; i < 60; i++) {
      stars.push({ x: Math.random() * W, y: Math.random() * H, speed: 0.3 + Math.random() * 1.5, size: Math.random() * 1.5 + 0.5 });
    }

    const keys = {};
    const mouse = { y: H / 2, down: false };

    const onKey = (e) => {
      keys[e.key] = e.type === 'keydown';
      if (e.key === ' ' && e.type === 'keydown') { e.preventDefault(); shoot(); }
    };
    const onMouse = (e) => { const rect = canvas.getBoundingClientRect(); mouse.y = e.clientY - rect.top; };
    const onMouseDown = () => { mouse.down = true; shoot(); };
    const onMouseUp = () => { mouse.down = false; };
    const onTouch = (e) => { const rect = canvas.getBoundingClientRect(); mouse.y = e.touches[0].clientY - rect.top; shoot(); e.preventDefault(); };

    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    canvas.addEventListener('mousemove', onMouse);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouch, { passive: false });
    canvas.addEventListener('touchmove', onTouch, { passive: false });

    function shoot() {
      if (!gameStarted || gameOver || !canShoot) return;
      canShoot = false;
      shootCooldown = powerLevel >= 3 ? 6 : powerLevel >= 2 ? 8 : 12;
      bullets.push({ x: ship.x + ship.w, y: ship.y, vx: 8, vy: 0, size: 3 });
      if (powerLevel >= 2) {
        bullets.push({ x: ship.x + ship.w, y: ship.y - 8, vx: 8, vy: -0.8, size: 2 });
        bullets.push({ x: ship.x + ship.w, y: ship.y + 8, vx: 8, vy: 0.8, size: 2 });
      }
      if (powerLevel >= 3) {
        bullets.push({ x: ship.x + ship.w, y: ship.y - 14, vx: 7, vy: -1.5, size: 2 });
        bullets.push({ x: ship.x + ship.w, y: ship.y + 14, vx: 7, vy: 1.5, size: 2 });
      }
      for (let i = 0; i < 4; i++) {
        particles.push({ x: ship.x + ship.w + 4, y: ship.y, vx: 2 + Math.random() * 3, vy: (Math.random() - 0.5) * 2, life: 0.5, color: '#00c2cb', size: 2 });
      }
    }

    function spawnEnemy() {
      const types = [
        { w: 20, h: 16, speed: 0.8 + difficulty * 0.15, hp: 1, score: 10, color: '#ef4444', symbol: '⬡' },
        { w: 24, h: 20, speed: 0.6 + difficulty * 0.1, hp: 2, score: 25, color: '#f59e0b', symbol: '◆' },
        { w: 32, h: 24, speed: 0.4 + difficulty * 0.08, hp: 4, score: 50, color: '#a855f7', symbol: '★' },
      ];
      const type = Math.random() < 0.6 ? types[0] : Math.random() < 0.8 ? types[1] : types[2];
      const y = 30 + Math.random() * (H - 60);
      enemies.push({
        x: W + 20, y, ...type, maxHp: type.hp,
        shootTimer: 120 + Math.random() * 180,
        wave: Math.random() > 0.5,
        waveOffset: Math.random() * Math.PI * 2,
      });
    }

    function spawnPowerUp(x, y) {
      if (Math.random() < 0.25) {
        const types = ['power', 'shield', 'life'];
        const type = types[Math.floor(Math.random() * types.length)];
        powerUps.push({ x, y, type, size: 12, vy: (Math.random() - 0.5) * 0.5, vx: -0.5 });
      }
    }

    function addExplosion(x, y, color, count) {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
        const speed = 1 + Math.random() * 3;
        particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 0.6 + Math.random() * 0.4, color, size: 1 + Math.random() * 3 });
      }
      screenShake = 4;
    }

    function drawShip(x, y) {
      ctx.save();
      if (shieldActive) {
        ctx.strokeStyle = 'rgba(0,194,203,0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = 'rgba(0,194,203,0.15)';
        ctx.beginPath(); ctx.arc(x, y, 26, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.fillStyle = '#00c2cb';
      ctx.shadowColor = '#00c2cb';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(x + 16, y); ctx.lineTo(x - 10, y - 10); ctx.lineTo(x - 6, y); ctx.lineTo(x - 10, y + 10);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = frame % 4 < 2 ? '#6366f1' : '#00c2cb';
      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(x - 6, y - 4); ctx.lineTo(x - 14 - Math.random() * 6, y); ctx.lineTo(x - 6, y + 4);
      ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    const loop = () => {
      if (localLives <= 0 && !gameOver) {
        setGameOver(true);
        setHighScore(prev => Math.max(prev, localScore));
        return;
      }

      frame++;
      difficulty = 1 + Math.floor(localScore / 150) * 0.2;

      ctx.save();
      if (screenShake > 0) {
        ctx.translate((Math.random() - 0.5) * screenShake * 2, (Math.random() - 0.5) * screenShake * 2);
        screenShake *= 0.8;
        if (screenShake < 0.5) screenShake = 0;
      }

      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, W, H);

      stars.forEach(s => {
        s.x -= s.speed;
        if (s.x < 0) { s.x = W; s.y = Math.random() * H; }
        ctx.fillStyle = `rgba(0,194,203,${0.15 + s.speed * 0.15})`;
        ctx.fillRect(s.x, s.y, s.size, s.size * 0.5);
      });

      ctx.strokeStyle = 'rgba(0,194,203,0.02)';
      for (let x = (frame * 0.5) % 40 - 40; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }

      if (gameStarted && !gameOver) {
        if (keys['ArrowUp'] || keys['w']) ship.targetY -= 5;
        if (keys['ArrowDown'] || keys['s']) ship.targetY += 5;
        ship.targetY = mouse.y;
        ship.y += (ship.targetY - ship.y) * 0.12;
        ship.y = Math.max(15, Math.min(H - 15, ship.y));

        if (mouse.down && canShoot) shoot();
        if (!canShoot) { shootCooldown--; if (shootCooldown <= 0) canShoot = true; }
        if (shieldActive) { shieldTimer--; if (shieldTimer <= 0) shieldActive = false; }

        // Spawn enemies - SLOWER spawn rate
        const spawnRate = Math.max(50, 120 - difficulty * 4);
        if (frame % Math.floor(spawnRate) === 0) spawnEnemy();

        // Update player bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          if (b.enemy) continue;
          b.x += b.vx; b.y += b.vy;
          if (b.x > W + 10) { bullets.splice(i, 1); continue; }
          for (let j = enemies.length - 1; j >= 0; j--) {
            const e = enemies[j];
            if (Math.abs(b.x - e.x) < e.w / 2 + b.size && Math.abs(b.y - e.y) < e.h / 2 + b.size) {
              bullets.splice(i, 1);
              e.hp--;
              for (let k = 0; k < 3; k++) {
                particles.push({ x: b.x, y: b.y, vx: -1 - Math.random() * 2, vy: (Math.random() - 0.5) * 3, life: 0.4, color: '#fff', size: 1.5 });
              }
              if (e.hp <= 0) {
                addExplosion(e.x, e.y, e.color, 12);
                spawnPowerUp(e.x, e.y);
                localScore += e.score;
                setScore(localScore);
                enemies.splice(j, 1);
              }
              break;
            }
          }
        }

        // Update enemies - SLOWER movement
        for (let i = enemies.length - 1; i >= 0; i--) {
          const e = enemies[i];
          e.x -= e.speed;
          if (e.wave) e.y += Math.sin(frame * 0.02 + e.waveOffset) * 0.8;
          e.y = Math.max(15, Math.min(H - 15, e.y));
          if (e.x < -30) { enemies.splice(i, 1); continue; }

          // Enemy-ship collision
          if (Math.abs(e.x - ship.x) < (e.w + ship.w) / 2 && Math.abs(e.y - ship.y) < (e.h + ship.h) / 2) {
            if (shieldActive) {
              addExplosion(e.x, e.y, e.color, 10);
              enemies.splice(i, 1);
              localScore += e.score;
              setScore(localScore);
            } else {
              addExplosion(ship.x, ship.y, '#00c2cb', 15);
              localLives--;
              setLives(localLives);
              ship.y = H / 2;
              enemies.splice(i, 1);
              powerLevel = Math.max(1, powerLevel - 1);
            }
            continue;
          }

          // Enemy shooting - SLOWER
          e.shootTimer--;
          if (e.shootTimer <= 0 && e.x < W - 50) {
            e.shootTimer = 150 + Math.random() * 100;
            bullets.push({ x: e.x - e.w / 2, y: e.y, vx: -3, vy: (Math.random() - 0.5) * 0.8, size: 3, enemy: true });
          }
        }

        // Enemy bullets hit ship - SLOWER bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          if (!b.enemy) continue;
          b.x += b.vx; b.y += b.vy;
          if (b.x < -10) { bullets.splice(i, 1); continue; }
          if (Math.abs(b.x - ship.x) < ship.w / 2 + 4 && Math.abs(b.y - ship.y) < ship.h / 2 + 4) {
            bullets.splice(i, 1);
            if (shieldActive) continue;
            addExplosion(ship.x, ship.y, '#00c2cb', 10);
            localLives--;
            setLives(localLives);
            powerLevel = Math.max(1, powerLevel - 1);
          }
        }

        // Power-ups
        for (let i = powerUps.length - 1; i >= 0; i--) {
          const p = powerUps[i];
          p.x += p.vx; p.y += p.vy;
          if (p.x < -20) { powerUps.splice(i, 1); continue; }
          if (Math.abs(p.x - ship.x) < 20 && Math.abs(p.y - ship.y) < 20) {
            if (p.type === 'power') powerLevel = Math.min(3, powerLevel + 1);
            if (p.type === 'shield') { shieldActive = true; shieldTimer = 300; }
            if (p.type === 'life') { localLives = Math.min(5, localLives + 1); setLives(localLives); }
            for (let k = 0; k < 8; k++) {
              particles.push({ x: p.x, y: p.y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, life: 0.6, color: '#22c55e', size: 2 });
            }
            powerUps.splice(i, 1);
          }
        }
      }

      // Draw bullets
      bullets.forEach(b => {
        ctx.shadowColor = b.enemy ? '#ef4444' : '#00c2cb';
        ctx.shadowBlur = 6;
        ctx.fillStyle = b.enemy ? '#ef4444' : '#00c2cb';
        ctx.fillRect(b.x - b.size, b.y - 1, b.size * 2, 2);
        ctx.shadowBlur = 0;
      });

      // Draw enemies
      enemies.forEach(e => {
        ctx.fillStyle = e.color;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 8;
        ctx.font = `${e.w}px Syne, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(e.symbol, e.x, e.y);
        if (e.hp < e.maxHp) {
          ctx.shadowBlur = 0;
          ctx.fillStyle = 'rgba(255,255,255,0.1)';
          ctx.fillRect(e.x - e.w / 2, e.y - e.h / 2 - 6, e.w, 3);
          ctx.fillStyle = e.color;
          ctx.fillRect(e.x - e.w / 2, e.y - e.h / 2 - 6, e.w * (e.hp / e.maxHp), 3);
        }
        ctx.shadowBlur = 0;
      });

      // Draw power-ups
      powerUps.forEach(p => {
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 10;
        ctx.fillStyle = p.type === 'power' ? '#f59e0b' : p.type === 'shield' ? '#3b82f6' : '#22c55e';
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.type === 'power' ? '⚡' : p.type === 'shield' ? '🛡' : '❤', p.x, p.y);
        ctx.shadowBlur = 0;
      });

      // Draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.02;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.globalAlpha = 1;
      }

      if (gameStarted && !gameOver) drawShip(ship.x, ship.y);

      // HUD
      ctx.shadowBlur = 0;
      ctx.font = 'bold 14px Syne, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#00c2cb';
      ctx.fillText(`SCORE: ${localScore}`, 12, 12);
      ctx.fillStyle = '#7a7a8e';
      ctx.fillText('LIVES: ' + '▮'.repeat(localLives) + '▯'.repeat(Math.max(0, 3 - localLives)), 12, 32);
      if (powerLevel > 1) { ctx.fillStyle = '#f59e0b'; ctx.fillText('POWER: ' + '■'.repeat(powerLevel), 12, 52); }
      if (shieldActive) { ctx.fillStyle = '#3b82f6'; ctx.fillText('SHIELD', W - 80, 12); }

      // Scanlines
      ctx.fillStyle = 'rgba(0,0,0,0.03)';
      for (let y = 0; y < H; y += 3) { ctx.fillRect(0, y, W, 1); }

      ctx.restore();
      animId = requestAnimationFrame(loop);
    };

    if (gameStarted && !gameOver) {
      loop();
    } else {
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, W, H);
      stars.forEach(s => {
        ctx.fillStyle = `rgba(0,194,203,${0.15 + s.speed * 0.15})`;
        ctx.fillRect(s.x, s.y, s.size, s.size * 0.5);
      });
      drawShip(W / 2 - 40, H / 2);
      ctx.fillStyle = 'rgba(0,0,0,0.03)';
      for (let y = 0; y < H; y += 3) { ctx.fillRect(0, y, W, 1); }
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
      canvas.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
    };
  }, [gameStarted, gameOver]);

  const startGame = () => { setGameStarted(true); setGameOver(false); setScore(0); setLives(3); };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Syne', sans-serif" }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 6, color: '#00c2cb', marginBottom: 8 }}>ERROR 404</p>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: 8 }}>Page not found</h1>
        <p style={{ fontSize: 15, color: '#7a7a8e' }}>
          {gameOver ? `Game Over! Score: ${score}${score > highScore ? ' — New High Score!' : ''}` :
           !gameStarted ? 'The page got lost in space. Play while we find it?' : 'Move mouse to steer • Click to shoot'}
        </p>
      </div>
      <canvas ref={canvasRef} style={{ borderRadius: 12, border: '1px solid rgba(0,194,203,0.12)', cursor: gameStarted ? 'none' : 'pointer', maxWidth: '100%' }} />
      <div style={{ marginTop: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
        {(!gameStarted || gameOver) && (
          <button onClick={startGame} style={{ fontFamily: "'Syne'", fontSize: 14, fontWeight: 600, letterSpacing: 1, padding: '14px 36px', background: '#00c2cb', color: '#0a0a0f', border: 'none', borderRadius: 60, cursor: 'pointer' }}
          onMouseOver={(e) => e.target.style.boxShadow = '0 0 30px rgba(0,194,203,0.4)'}
          onMouseOut={(e) => e.target.style.boxShadow = 'none'}>
            {gameOver ? 'Play Again' : 'Launch Game'}
          </button>
        )}
        <Link href="/" style={{ fontFamily: "'Syne'", fontSize: 13, fontWeight: 600, letterSpacing: 1, padding: '14px 36px', background: 'transparent', color: '#00c2cb', border: '2px solid rgba(0,194,203,0.3)', borderRadius: 60, textDecoration: 'none' }}
        onMouseOver={(e) => { e.target.style.borderColor = '#00c2cb'; e.target.style.background = 'rgba(0,194,203,0.1)'; }}
        onMouseOut={(e) => { e.target.style.borderColor = 'rgba(0,194,203,0.3)'; e.target.style.background = 'transparent'; }}>
          Go Home
        </Link>
      </div>
    </div>
  );
}
