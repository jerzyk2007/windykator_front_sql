import { useEffect, useRef } from "react";
import "./XmasLoading.css";

const XmasLoading = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height;
    let treeX = 0; // Pozycja choinki (i prezentów)

    // --- KONFIGURACJA ŚNIEGU ---
    const snowflakes = [];
    const numFlakes = 250;

    // --- LOGIKA POSTACI ---
    let girl = {
      x: 0,
      y: 0,
      color: "#e74c3c",
      targetIndex: 0,
      state: "walking", // walking -> sharing -> walking_to_presents -> admiring
      waitTimer: 0,
    };
    const family = [];
    const hearts = [];

    // --- RESET I RESPANSYWNOŚĆ ---
    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const floorY = height - 100;

      treeX = width * 0.9; // Ustalenie pozycji choinki

      family.length = 0;
      family.push({ x: width * 0.25, y: floorY, color: "#3498db", height: 70 }); // Tata
      family.push({ x: width * 0.5, y: floorY, color: "#2ecc71", height: 65 }); // Mama
      family.push({ x: width * 0.75, y: floorY, color: "#9b59b6", height: 50 }); // Brat

      // Reset dziewczynki
      girl.x = -50;
      girl.y = floorY;
      girl.state = "walking";
      girl.targetIndex = 0;
    }

    // --- KLASA ŚNIEŻYNKI ---
    class Snowflake {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -10;
        this.r = Math.random() * 3 + 1;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.swaySpeed = Math.random() * 0.05 + 0.01;
        this.swayRange = Math.random() * 2;
        this.swayOffset = Math.random() * Math.PI * 2;
      }
      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * this.swaySpeed + this.swayOffset) * 0.5;
        if (this.y > height) this.reset();
        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
      }
      draw() {
        ctx.fillStyle = `rgba(255,255,255,${this.r / 4})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    for (let i = 0; i < numFlakes; i++) snowflakes.push(new Snowflake());

    // --- RYSOWANIE PREZENTÓW ---
    function drawGift(x, y, w, h, color, ribbonColor) {
      // Pudełko
      ctx.fillStyle = color;
      ctx.fillRect(x, y - h, w, h);

      // Wstążka pionowa
      ctx.fillStyle = ribbonColor;
      ctx.fillRect(x + w / 2 - 3, y - h, 6, h);
      // Wstążka pozioma
      ctx.fillRect(x, y - h / 2 - 3, w, 6);

      // Kokarda (dwa koła)
      ctx.beginPath();
      ctx.arc(x + w / 2 - 5, y - h - 3, 6, 0, Math.PI * 2); // lewe ucho
      ctx.arc(x + w / 2 + 5, y - h - 3, 6, 0, Math.PI * 2); // prawe ucho
      ctx.fill();
    }

    function drawPresents(x, y) {
      // Prezenty są małe i proporcjonalne
      // 1. Niebieski prezent (po lewej)
      drawGift(x - 45, y, 25, 20, "#1abc9c", "#fff");
      // 2. Czerwony prezent (duży w środku)
      drawGift(x - 15, y, 30, 25, "#e74c3c", "#f1c40f");
      // 3. Fioletowy prezent (po prawej)
      drawGift(x + 20, y, 20, 15, "#9b59b6", "#ecf0f1");
    }

    // --- RYSOWANIE CHOINKI ---
    function drawTree(x, y) {
      ctx.fillStyle = "#4e342e";
      ctx.fillRect(x - 15, y - 30, 30, 30);
      ctx.fillStyle = "#2e7d32";
      ctx.beginPath();
      ctx.moveTo(x - 70, y - 30);
      ctx.lineTo(x + 70, y - 30);
      ctx.lineTo(x, y - 140);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x - 60, y - 90);
      ctx.lineTo(x + 60, y - 90);
      ctx.lineTo(x, y - 190);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x - 40, y - 150);
      ctx.lineTo(x + 40, y - 150);
      ctx.lineTo(x, y - 230);
      ctx.fill();
      ctx.fillStyle = "#ffd700";
      ctx.beginPath();
      ctx.arc(x, y - 230, 8, 0, Math.PI * 2);
      ctx.fill();

      // Prezenty RYSOWANE TUTAJ (przed światełkami, żeby były pod drzewem)
      drawPresents(x, y);

      const time = Date.now() / 500;
      const lights = [
        { x: x - 20, y: y - 60, c: "red" },
        { x: x + 30, y: y - 100, c: "blue" },
        { x: x - 10, y: y - 160, c: "gold" },
        { x: x + 15, y: y - 200, c: "red" },
        { x: x - 40, y: y - 50, c: "orange" },
        { x: x + 20, y: y - 130, c: "cyan" },
      ];
      lights.forEach((l, i) => {
        ctx.globalAlpha = Math.abs(Math.sin(time + i));
        ctx.fillStyle = l.c;
        ctx.beginPath();
        ctx.arc(l.x, l.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    // --- POMOCNICZE: RĘKA I TWARZ ---
    function drawArm(startX, startY, endX, endY, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.fillStyle = "#ffdbac";
      ctx.beginPath();
      ctx.arc(endX, endY, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawFace(x, y, isHappy) {
      ctx.fillStyle = "#3e2723";
      ctx.beginPath();
      ctx.arc(x - 4, y - 1, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 4, y - 1, 1.5, 0, Math.PI * 2);
      ctx.fill();
      if (isHappy) {
        ctx.strokeStyle = "#3e2723";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y + 2, 5, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
      } else {
        ctx.fillStyle = "#3e2723";
        ctx.fillRect(x - 2, y + 5, 4, 1);
      }
    }

    // --- RYSOWANIE POSTACI ---
    function drawPerson(p, isGirl, index = -1) {
      ctx.fillStyle = p.color;
      const headOffset = isGirl ? 60 : p.height;
      const headX = p.x;
      const headY = p.y - headOffset - 12;

      if (isGirl) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - 60);
        ctx.lineTo(p.x - 25, p.y);
        ctx.lineTo(p.x + 25, p.y);
        ctx.fill();
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(p.x, p.y - 75, 14, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const bodyW = 36;
        const bodyH = p.height;
        const bX = p.x - 18;
        const bY = p.y - bodyH;
        const r = 12;
        ctx.beginPath();
        ctx.moveTo(bX + r, bY);
        ctx.lineTo(bX + bodyW - r, bY);
        ctx.quadraticCurveTo(bX + bodyW, bY, bX + bodyW, bY + r);
        ctx.lineTo(bX + bodyW, bY + bodyH);
        ctx.lineTo(bX, bY + bodyH);
        ctx.lineTo(bX, bY + r);
        ctx.quadraticCurveTo(bX, bY, bX + r, bY);
        ctx.fill();

        const isSharing =
          girl.state === "sharing" && girl.targetIndex === index;
        const shoulderY = bY + 10;
        if (isSharing) {
          drawArm(p.x - 10, shoulderY, p.x - 25, p.y - bodyH / 2 - 5, p.color);
          drawArm(p.x + 10, shoulderY, p.x - 15, p.y - bodyH / 2 + 5, p.color);
        } else {
          drawArm(p.x - 10, shoulderY, p.x - 15, p.y - bodyH * 0.4, p.color);
          drawArm(p.x + 10, shoulderY, p.x + 15, p.y - bodyH * 0.4, p.color);
        }
      }

      ctx.fillStyle = "#ffdbac";
      ctx.beginPath();
      ctx.arc(headX, headY, 14, 0, Math.PI * 2);
      ctx.fill();

      const isHappyFamily =
        (girl.state === "sharing" && girl.targetIndex === index) ||
        index < girl.targetIndex;
      // Dziewczynka zawsze happy, chyba że reset
      drawFace(headX, headY, isGirl ? true : isHappyFamily);

      // --- RĘCE DZIEWCZYNKI ---
      if (isGirl) {
        if (p.state === "sharing") {
          // Ręka z opłatkiem
          drawArm(p.x, p.y - 45, p.x + 30, p.y - 45, "#ffdbac");
          ctx.fillStyle = "#fff";
          ctx.shadowBlur = 5;
          ctx.shadowColor = "white";
          ctx.fillRect(p.x + 30, p.y - 50, 15, 12);
          ctx.shadowBlur = 0;
        } else if (p.state === "admiring") {
          // Ręce w górę z radości!
          drawArm(p.x - 5, p.y - 45, p.x - 20, p.y - 70, "#ffdbac");
          drawArm(p.x + 5, p.y - 45, p.x + 20, p.y - 70, "#ffdbac");
        } else {
          // Normalnie idzie
          drawArm(p.x, p.y - 45, p.x + 10, p.y - 30, "#ffdbac");
        }
      }
    }

    function drawHeart(x, y, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#e91e63";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x - 15, y - 15, x - 30, y + 15, x, y + 30);
      ctx.bezierCurveTo(x + 30, y + 15, x + 15, y - 15, x, y);
      ctx.fill();
      ctx.restore();
    }

    // --- LOGIKA GRY ---
    function updateLogic() {
      // 1. Chodzenie do rodziny
      if (girl.state === "walking") {
        const target = family[girl.targetIndex];
        const dx = target.x - 50 - girl.x;
        if (Math.abs(dx) > 3) {
          girl.x += Math.sign(dx) * 2.5;
          girl.y = height - 100 - Math.abs(Math.sin(Date.now() / 100) * 5);
        } else {
          girl.y = height - 100;
          girl.state = "sharing";
          girl.waitTimer = 120;
        }
      }
      // 2. Dzielenie się
      else if (girl.state === "sharing") {
        girl.waitTimer--;
        if (girl.waitTimer === 80)
          hearts.push({ x: girl.x + 25, y: girl.y - 90, alpha: 1 });
        if (girl.waitTimer <= 0) {
          girl.targetIndex++;
          // Jeśli obsłużyła wszystkich, idzie do prezentów
          if (girl.targetIndex >= family.length) {
            girl.state = "walking_to_presents";
          } else {
            girl.state = "walking";
          }
        }
      }
      // 3. Chodzenie do prezentów
      else if (girl.state === "walking_to_presents") {
        const targetX = treeX - 70; // Staje przed choinką
        const dx = targetX - girl.x;

        if (Math.abs(dx) > 3) {
          girl.x += Math.sign(dx) * 2.5;
          girl.y = height - 100 - Math.abs(Math.sin(Date.now() / 100) * 5);
        } else {
          girl.y = height - 100;
          girl.state = "admiring";
          girl.waitTimer = 200; // Długie cieszenie się (ponad 3 sekundy)
        }
      }
      // 4. Podziwianie prezentów (Koniec)
      else if (girl.state === "admiring") {
        girl.waitTimer--;

        // Podskakiwanie z radości
        if (girl.waitTimer % 20 < 10) {
          girl.y = height - 100 - 5;
        } else {
          girl.y = height - 100;
        }

        // Kiedy czas minie, reset
        if (girl.waitTimer <= 0) {
          girl.targetIndex = 0;
          girl.x = -50;
          girl.state = "walking";
        }
      }

      for (let i = hearts.length - 1; i >= 0; i--) {
        hearts[i].y -= 0.8;
        hearts[i].alpha -= 0.01;
        if (hearts[i].alpha <= 0) hearts.splice(i, 1);
      }
    }

    // --- PĘTLA GŁÓWNA ---
    function loop() {
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, height - 100, 0, height);
      gradient.addColorStop(0, "#eef");
      gradient.addColorStop(1, "#dde");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, height - 100, width, 100);

      drawTree(treeX, height - 100);
      family.forEach((p, index) => drawPerson(p, false, index));
      drawPerson(girl, true);

      snowflakes.forEach((f) => {
        f.update();
        f.draw();
      });
      hearts.forEach((h) => drawHeart(h.x, h.y, h.alpha));
      updateLogic();
      requestAnimationFrame(loop);
    }

    window.addEventListener("resize", resize);
    resize();
    loop();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <section className="xmas-wrapper">
      <div className="xmas-message-top">❄️ Proszę czekać ... ❄️</div>
      <canvas ref={canvasRef} className="xmas-canvas" />
      <div className="xmas-message-bottom">
        ❄️ Magia Świąt: Podziel się Opłatkiem ❄️
      </div>
    </section>
  );
};

export default XmasLoading;
