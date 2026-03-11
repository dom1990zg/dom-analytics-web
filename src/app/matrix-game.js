'use client';
import { useState, useEffect, useRef } from 'react';

export default function MatrixGame({ onClose }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const playerRef = useRef({ x: 0, w: 60, h: 10 });
  const dropsRef = useRef([]);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = Math.min(600, window.innerWidth - 40);
    canvas.height = 400;
    playerRef.current.x = canvas.width / 2 - 30;

    const symbols = ['01', 'AI', '{}', 'fn', '<<', '>>', '&&', '||', '+=', '=>', 'ML', 'NLP', 'API', 'SQL', 'DOM'];
    let localScore = 0;
    let localLives = 3;

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      playerRef.current.x = (e.clientX || e.touches?.[0]?.clientX || 0) - rect.left - playerRef.current.w / 2;
      playerRef.current.x = Math.max(0, Math.min(canvas.width - playerRef.current.w, playerRef.current.x));
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('touchmove', (e) => { onMove(e); e.preventDefault(); }, { passive: false });

    let animId;
    const loop = () => {
      if (localLives <= 0) {
        setGameOver(true);
        return;
      }

      const W = canvas.width, H = canvas.height;
      ctx.fillStyle = 'rgba(10,10,15,0.15)';
      ctx.fillRect(0, 0, W, H);

      frameRef.current++;

      // Spawn drops - SLOWER: every 40 frames instead of 25
      if (frameRef.current % 40 === 0) {
        const isBad = Math.random() < 0.15;
        dropsRef.current.push({
          x: Math.random() * (W - 30),
          y: -20,
          speed: 0.8 + Math.random() * 1.2 + localScore * 0.01,
          symbol: isBad ? '❌' : symbols[Math.floor(Math.random() * symbols.length)],
          bad: isBad,
          size: 14,
        });
      }

      // Update and draw drops
      dropsRef.current = dropsRef.current.filter(d => {
        d.y += d.speed;

        ctx.font = `bold ${d.size}px Syne, monospace`;
        ctx.fillStyle = d.bad ? '#ef4444' : '#00c2cb';
        ctx.shadowColor = d.bad ? '#ef4444' : '#00c2cb';
        ctx.shadowBlur = 8;
        ctx.textAlign = 'center';
        ctx.fillText(d.symbol, d.x + 15, d.y);
        ctx.shadowBlur = 0;

        // Collision with player
        const p = playerRef.current;
        if (d.y + 10 > H - 20 && d.y < H && d.x + 15 > p.x && d.x + 15 < p.x + p.w) {
          if (d.bad) {
            localLives--;
            setLives(localLives);
            ctx.fillStyle = 'rgba(239,68,68,0.1)';
            ctx.fillRect(0, 0, W, H);
          } else {
            localScore++;
            setScore(localScore);
          }
          return false;
        }

        // Missed good drop - only lose life if it was good
        if (d.y > H) {
          if (!d.bad) {
            localLives--;
            setLives(localLives);
          }
          return false;
        }
        return true;
      });

      // Draw player paddle
      const p = playerRef.current;
      ctx.shadowColor = '#00c2cb';
      ctx.shadowBlur = 15;
      const gradient = ctx.createLinearGradient(p.x, H - 20, p.x + p.w, H - 20);
      gradient.addColorStop(0, '#00c2cb');
      gradient.addColorStop(1, '#6366f1');
      ctx.fillStyle = gradient;
      ctx.fillRect(p.x, H - 20, p.w, p.h);
      ctx.shadowBlur = 0;

      // Background matrix rain (decorative)
      if (frameRef.current % 3 === 0) {
        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(0,194,203,0.06)';
        for (let i = 0; i < 3; i++) {
          ctx.fillText(
            String.fromCharCode(0x30A0 + Math.random() * 96),
            Math.random() * W,
            Math.random() * H
          );
        }
      }

      animId = requestAnimationFrame(loop);
    };

    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    loop();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', onMove);
    };
  }, []);

  const restart = () => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    dropsRef.current = [];
    frameRef.current = 0;
    window.location.reload();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(10,10,15,0.95)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(20px)', fontFamily: "'Syne', sans-serif",
    }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 11, letterSpacing: 4, color: '#00c2cb', marginBottom: 8, fontWeight: 600 }}>SECRET MODE ACTIVATED</p>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Data Rain Catcher</h2>
        <p style={{ fontSize: 13, color: '#7a7a8e' }}>Catch the data symbols, avoid the ❌</p>
      </div>

      <div style={{ display: 'flex', gap: 32, marginBottom: 16, fontSize: 14 }}>
        <span style={{ color: '#00c2cb', fontWeight: 700 }}>Score: {score}</span>
        <span style={{ color: lives <= 1 ? '#ef4444' : '#7a7a8e', fontWeight: 700 }}>Lives: {'💚'.repeat(lives)}{'🖤'.repeat(Math.max(0, 3 - lives))}</span>
      </div>

      <canvas ref={canvasRef} style={{ borderRadius: 12, border: '1px solid rgba(0,194,203,0.15)', cursor: 'none' }} />

      {gameOver && (
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Game Over!</p>
          <p style={{ fontSize: 14, color: '#00c2cb', marginBottom: 20 }}>Final Score: {score}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={restart} style={{ fontFamily: "'Syne'", fontSize: 13, fontWeight: 600, padding: '12px 28px', background: '#00c2cb', color: '#0a0a0f', border: 'none', borderRadius: 30, cursor: 'pointer' }}>
              Play Again
            </button>
            <button onClick={onClose} style={{ fontFamily: "'Syne'", fontSize: 13, fontWeight: 600, padding: '12px 28px', background: 'transparent', color: '#7a7a8e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 30, cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {!gameOver && (
        <button onClick={onClose} style={{
          marginTop: 20, fontFamily: "'Syne'", fontSize: 12, fontWeight: 600, letterSpacing: 1,
          padding: '10px 24px', background: 'transparent', color: '#7a7a8e',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 30, cursor: 'pointer',
        }}>
          ESC to close
        </button>
      )}
    </div>
  );
}
