import React, { useEffect, useRef, useState } from "react";
import "./FatThursday.css";

const FatThursday = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [calories, setCalories] = useState(0);
  const [loadingText, setLoadingText] = useState("Smażenie danych...");

  // Rotacja zabawnych tekstów ładowania
  useEffect(() => {
    const phrases = [
      "Smażenie danych na głębokim oleju...",
      "Nadziewanie bazy danych konfiturą...",
      "Pudrowanie tabel wynikowych...",
      "Lukrowanie interfejsu...",
      "Sprawdzanie poziomu cukru w zapytaniach...",
      "Ugniatanie pakietów...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % phrases.length;
      setLoadingText(phrases[i]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height;
    let animationFrameId;

    const paczki = [];
    const particles = [];
    const mouth = { x: 0, y: 0, size: 50, targetX: 0, open: 0 };
    const paczekTypes = [
      { color: "#e67e22", icing: "#fff", sprinkle: "#f1c40f" },
      { color: "#d35400", icing: "#3d1f05", sprinkle: "#e74c3c" },
      { color: "#f39c12", icing: "#ff9ff3", sprinkle: "#fff" },
    ];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      mouth.y = height - 120;
      mouth.x = width / 2;
    }

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
        this.alpha = 1;
        this.color = color;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.02;
      }
      draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    class Paczek {
      constructor() {
        this.reset();
      }
      reset() {
        this.type = paczekTypes[Math.floor(Math.random() * paczekTypes.length)];
        this.x = Math.random() * width;
        this.y = -50;
        this.speed = Math.random() * 2 + 2;
        this.rotation = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.1;
        this.size = 35;
      }
      update() {
        this.y += this.speed;
        this.rotation += this.spin;
        if (this.y > height + 50) this.reset();
        const dx = this.x - mouth.x;
        const dy = this.y - mouth.y;
        if (Math.sqrt(dx * dx + dy * dy) < mouth.size + this.size) {
          for (let i = 0; i < 10; i++)
            particles.push(new Particle(this.x, this.y, this.type.icing));
          setScore((s) => s + 1);
          setCalories((c) => c + Math.floor(Math.random() * 50 + 350));
          this.reset();
          mouth.open = 15;
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.type.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = this.type.icing;
        ctx.beginPath();
        ctx.ellipse(0, -5, this.size * 0.7, this.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < 6; i++) paczki.push(new Paczek());

    const handleMouseMove = (e) => {
      mouth.targetX = e.clientX;
    };

    function loop() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#f3e5f5";
      ctx.fillRect(0, height - 100, width, 100);

      particles.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.alpha <= 0) particles.splice(i, 1);
      });

      paczki.forEach((p) => {
        p.update();
        p.draw();
      });

      // Draw Mouth
      mouth.x += (mouth.targetX - mouth.x) * 0.1;
      ctx.save();
      ctx.translate(mouth.x, mouth.y);
      ctx.fillStyle = "#ffcc00";
      ctx.beginPath();
      if (mouth.open > 0) {
        ctx.arc(0, 0, mouth.size, 0.2 * Math.PI, 1.8 * Math.PI);
        ctx.lineTo(0, 0);
        mouth.open--;
      } else {
        ctx.arc(0, 0, mouth.size, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(15, -20, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animationFrameId = requestAnimationFrame(loop);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    resize();
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fat-thursday-container">
      <div className="stats-overlay">
        <div className="stat-box">
          <span className="label">Pączki</span>
          <span className="value">{score}</span>
        </div>
        <div className="stat-box">
          <span className="label">Kalorie</span>
          <span className="value calories">{calories} kcal</span>
        </div>
      </div>

      <div className="loading-central-unit">
        <h1 className="wait-title">PROSZĘ CZEKAĆ...</h1>
        <div className="jam-progress-bar">
          <div className="jam-fill"></div>
        </div>
        <p className="loading-phrase">{loadingText}</p>
      </div>

      <canvas ref={canvasRef} />

      <div className="loading-footer">
        <p className="sub-text">Złap pączka myszką, żeby szybciej leciało!</p>
      </div>
    </div>
  );
};

export default FatThursday;
