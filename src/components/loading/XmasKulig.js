import { useEffect, useRef, useState } from "react";
import "./XmasKulig.css";

const XmasKulig = () => {
  const canvasRef = useRef(null);
  const [currentPhase, setCurrentPhase] = useState("HORSE_PULLS");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height;

    const snowflakes = [];
    const numFlakes = 200;
    let animationFrame;

    let animState = {
      x: -300,
      phase: "HORSE_PULLS",
      speed: 3,
    };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    class Snowflake {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -10;
        this.r = Math.random() * 3 + 1;
        this.speedY = Math.random() * 1.5 + 0.5;
      }
      update() {
        this.y += this.speedY;
        if (this.y > height) this.reset();
      }
      draw() {
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    for (let i = 0; i < numFlakes; i++) snowflakes.push(new Snowflake());

    function drawChampagne(x, y) {
      ctx.save();
      ctx.translate(x, y);

      // Butelka (ciemnozielona/czarna)
      ctx.fillStyle = "#1a3a3a";
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(8, 0);
      ctx.lineTo(8, -25);
      ctx.quadraticCurveTo(8, -35, 3, -40);
      ctx.lineTo(3, -55);
      ctx.lineTo(-3, -55);
      ctx.lineTo(-3, -40);
      ctx.quadraticCurveTo(-8, -35, -8, -25);
      ctx.closePath();
      ctx.fill();

      // Etykieta (złota)
      ctx.fillStyle = "#d4af37";
      ctx.fillRect(-6, -25, 12, 10);

      // Srebrna/Złota folia na korku
      ctx.fillStyle = "#f1c40f";
      ctx.fillRect(-3.5, -57, 7, 8);

      // Blask na butelce
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-4, -10);
      ctx.lineTo(-4, -25);
      ctx.stroke();

      ctx.restore();
    }

    function drawHorse(x, y, isSitting, facingLeft) {
      ctx.save();
      ctx.translate(x, y);
      if (facingLeft) ctx.scale(-1, 1);
      ctx.fillStyle = "#6d4c41";
      if (isSitting) {
        ctx.fillRect(-25, -45, 50, 35);
        ctx.fillStyle = "#4e342e";
        ctx.beginPath();
        ctx.ellipse(-20, -55, 18, 12, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(-25, -70, 6, 12);
        ctx.strokeStyle = "#3e2723";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(25, -30);
        ctx.lineTo(40, -10);
        ctx.stroke();
      } else {
        const legMove = Math.sin(Date.now() / 100) * 12;
        ctx.fillRect(-35, -55, 70, 35);
        ctx.fillStyle = "#4e342e";
        ctx.fillRect(-30, -20, 12, 25 + legMove);
        ctx.fillRect(15, -20, 12, 25 - legMove);
        ctx.fillStyle = "#6d4c41";
        ctx.beginPath();
        ctx.moveTo(35, -45);
        ctx.lineTo(55, -80);
        ctx.lineTo(80, -75);
        ctx.lineTo(50, -35);
        ctx.fill();
        ctx.fillStyle = "#3e2723";
        ctx.fillRect(45, -85, 20, 6);
      }
      ctx.restore();
    }

    function drawGirl(x, y, isPushing) {
      ctx.save();
      ctx.translate(x, y);
      const time = Date.now() / 150;
      const bounce = Math.abs(Math.sin(time)) * 6;
      const headBounceY = isPushing ? 0 : bounce / 2;

      // Sukienka
      ctx.fillStyle = "#e74c3c";
      ctx.beginPath();
      if (isPushing) {
        ctx.moveTo(0, -50);
        ctx.lineTo(25, 0);
        ctx.lineTo(-15, 0);
      } else {
        ctx.moveTo(0, -50);
        ctx.lineTo(-25, 0);
        ctx.lineTo(25, 0);
      }
      ctx.fill();

      // Głowa
      const headX = isPushing ? -5 : 0;
      const headY = -60 - headBounceY;
      ctx.fillStyle = "#ffdbac";
      ctx.beginPath();
      ctx.arc(headX, headY, 14, 0, Math.PI * 2);
      ctx.fill();

      // --- TWARZ ---
      ctx.fillStyle = "#000"; // Oczy
      ctx.beginPath();
      ctx.arc(headX - 4, headY - 2, 1.5, 0, Math.PI * 2);
      ctx.arc(headX + 4, headY - 2, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#c0392b"; // Uśmiech
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(headX, headY + 3, 5, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();

      // Czapka
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(headX, -65 - headBounceY, 14, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(headX + Math.sin(time) * 4, -85 - bounce, 6, 0, Math.PI * 2);
      ctx.fill();

      // Ręka
      ctx.strokeStyle = "#ffdbac";
      ctx.lineWidth = 5;
      if (isPushing) {
        ctx.beginPath();
        ctx.moveTo(-5, -35);
        ctx.lineTo(-35, -25);
        ctx.stroke();
      } else {
        const wave = Math.sin(Date.now() / 200) * 0.8;
        ctx.save();
        ctx.translate(12, -35);
        ctx.rotate(wave - 0.5);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(25, 0);
        ctx.stroke();
        ctx.fillStyle = "#ffdbac";
        ctx.beginPath();
        ctx.arc(25, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }

    function drawSleigh(x, y) {
      ctx.fillStyle = "#2c3e50";
      ctx.fillRect(x - 70, y - 5, 140, 6);
      ctx.fillStyle = "#c0392b";
      ctx.beginPath();
      ctx.moveTo(x - 60, y - 5);
      ctx.lineTo(x + 60, y - 5);
      ctx.lineTo(x + 80, y - 45);
      ctx.lineTo(x - 50, y - 45);
      ctx.fill();
      ctx.strokeStyle = "#f1c40f";
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    function loop() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#f8f9fa";
      ctx.fillRect(0, height - 100, width, 100);
      const floorY = height - 105;

      if (animState.phase === "HORSE_PULLS") {
        animState.x += animState.speed;

        drawHorse(animState.x + 120, floorY, false, false);
        drawSleigh(animState.x, floorY);

        // Sanie w pierwszą stronę: Szampan + Dziewczynka
        drawChampagne(animState.x + 30, floorY - 35);
        drawGirl(animState.x - 15, floorY - 45, false);

        ctx.strokeStyle = "#5d4037";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(animState.x + 60, floorY - 25);
        ctx.lineTo(animState.x + 100, floorY - 45);
        ctx.stroke();

        if (animState.x > width + 300) {
          animState.phase = "GIRL_PUSHES";
          setCurrentPhase("GIRL_PUSHES");
        }
      } else {
        animState.x -= animState.speed;
        drawGirl(animState.x + 100, floorY, true);
        drawSleigh(animState.x, floorY);
        drawHorse(animState.x, floorY - 15, true, false);

        if (animState.x < -300) {
          animState.phase = "HORSE_PULLS";
          setCurrentPhase("HORSE_PULLS");
        }
      }

      snowflakes.forEach((f) => {
        f.update();
        f.draw();
      });
      animationFrame = requestAnimationFrame(loop);
    }

    window.addEventListener("resize", resize);
    resize();
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section className="xmas-wrapper">
      <div className="xmas-header-container">
        <div className="xmas-message-top">❄️ Proszę czekać... ❄️</div>
      </div>
      <canvas ref={canvasRef} className="xmas-canvas" />
    </section>
  );
};

export default XmasKulig;
