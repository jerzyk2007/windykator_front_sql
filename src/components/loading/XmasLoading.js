import { useEffect, useRef } from "react";
import "./XmasLoading.css";

const XmasLoading = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height;
    let treeX = 0;

    // --- KONFIGURACJA ŚNIEGU ---
    const snowflakes = [];
    const numFlakes = 250;

    // --- ZMIENNE BUTELKI (RZUT) ---
    let thrownBottle = null;
    const FINAL_TEXT = "✨ Voucher na Święty spokój ✨";
    const TEXT_STEP = 10; // Krok (odstęp) między literami na śladzie

    // --- LOGIKA POSTACI ---
    let girl = {
      x: 0,
      y: 0,
      color: "#e74c3c",
      targetIndex: 0,
      state: "walking",
      waitTimer: 0,
    };
    const family = [];
    const hearts = [];
    const bubbles = [];

    // --- RESET I RESPANSYWNOŚĆ ---
    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const floorY = height - 100;

      treeX = width * 0.9;

      family.length = 0;
      family.push({ x: width * 0.25, y: floorY, color: "#3498db", height: 70 });
      family.push({ x: width * 0.5, y: floorY, color: "#2ecc71", height: 65 });
      family.push({ x: width * 0.75, y: floorY, color: "#9b59b6", height: 50 });

      // Reset dziewczynki
      girl.x = -50;
      girl.y = floorY;
      girl.state = "walking";
      girl.targetIndex = 0;
      girl.waitTimer = 0;

      // Reset butelki
      thrownBottle = null;
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
        this.swayOffset = Math.random() * Math.PI * 2;
      }
      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * this.swaySpeed + this.swayOffset) * 0.5;
        if (this.y > height) this.reset();
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
      ctx.fillStyle = color;
      ctx.fillRect(x, y - h, w, h);
      ctx.fillStyle = ribbonColor;
      ctx.fillRect(x + w / 2 - 3, y - h, 6, h);
      ctx.fillRect(x, y - h / 2 - 3, w, 6);
      ctx.beginPath();
      ctx.arc(x + w / 2 - 5, y - h - 3, 6, 0, Math.PI * 2);
      ctx.arc(x + w / 2 + 5, y - h - 3, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawPresents(x, y) {
      drawGift(x - 45, y, 25, 20, "#1abc9c", "#fff");
      if (
        girl.state !== "drinking" &&
        girl.state !== "opening_done" &&
        girl.state !== "throwing"
      ) {
        drawGift(x - 15, y, 30, 25, "#e74c3c", "#f1c40f");
      } else {
        ctx.fillStyle = "rgba(0,0,0,0.1)";
        ctx.beginPath();
        ctx.ellipse(x, y, 15, 5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      drawGift(x + 20, y, 20, 15, "#9b59b6", "#ecf0f1");
    }

    // --- RYSOWANIE BUTELKI SZAMPANA ---
    function drawChampagne(x, y, angle) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.fillStyle = "#4a148c";
      ctx.beginPath();
      ctx.moveTo(-6, -10);
      ctx.lineTo(6, -10);
      ctx.lineTo(7, 18);
      ctx.lineTo(-7, 18);
      ctx.fill();

      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.beginPath();
      ctx.moveTo(-3, -8);
      ctx.lineTo(-1, -8);
      ctx.lineTo(-2, 16);
      ctx.lineTo(-4, 16);
      ctx.fill();

      ctx.fillStyle = "#38006b";
      ctx.fillRect(-3, -22, 6, 12);

      ctx.fillStyle = "#ffd700";
      ctx.beginPath();
      ctx.arc(0, -22, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#fff59d";
      ctx.fillRect(-5, 0, 10, 10);
      ctx.fillStyle = "#f44336";
      ctx.fillRect(-5, 2, 10, 3);

      ctx.restore();
    }

    // --- RYSOWANIE CHOINKI ---
    function drawTree(x, y) {
      ctx.fillStyle = "#4e342e";
      ctx.fillRect(x - 15, y - 30, 30, 30);

      const drawLayer = (offsetY, widthBase, heightTri) => {
        ctx.fillStyle = "#2e7d32";
        ctx.beginPath();
        ctx.moveTo(x - widthBase, y - offsetY);
        ctx.lineTo(x + widthBase, y - offsetY);
        ctx.lineTo(x, y - offsetY - heightTri);
        ctx.fill();
      };
      drawLayer(30, 70, 110);
      drawLayer(90, 60, 100);
      drawLayer(150, 40, 80);

      ctx.fillStyle = "#ffd700";
      ctx.beginPath();
      ctx.arc(x, y - 230, 8, 0, Math.PI * 2);
      ctx.fill();

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

    // --- RĘKA I TWARZ ---
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
      ctx.arc(x + 4, y - 1, 1.5, 0, Math.PI * 2);
      ctx.fill();
      if (isHappy) {
        ctx.strokeStyle = "#3e2723";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y + 2, 5, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
      } else {
        ctx.fillRect(x - 2, y + 5, 4, 1);
      }
    }

    // --- RYSOWANIE POSTACI ---
    function drawPerson(p, isGirl, index = -1) {
      ctx.fillStyle = p.color;
      let headY = p.y - (isGirl ? 60 : p.height) - 12;
      let headX = p.x;

      if (isGirl && p.state === "opening") headY += 20;

      if (isGirl) {
        // Kucyki
        ctx.fillStyle = "#5d4037";
        ctx.beginPath();
        ctx.arc(headX - 12, headY, 6, 0, Math.PI * 2);
        ctx.arc(headX + 12, headY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Sukienka
        ctx.fillStyle = p.color;
        ctx.beginPath();
        if (p.state === "opening") {
          ctx.moveTo(p.x, headY + 12);
          ctx.lineTo(p.x - 30, p.y);
          ctx.lineTo(p.x + 30, p.y);
        } else {
          ctx.moveTo(p.x, p.y - 60);
          ctx.lineTo(p.x - 25, p.y);
          ctx.lineTo(p.x + 25, p.y);
        }
        ctx.fill();

        // Głowa
        ctx.fillStyle = "#ffdbac";
        ctx.beginPath();
        ctx.arc(headX, headY, 14, 0, Math.PI * 2);
        ctx.fill();

        // Czapeczka
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(headX, headY - 5, 14, Math.PI, 0);
        ctx.fill();

        // Pomponik
        let pompomY = 0;
        let pompomX = 0;
        if (p.state === "walking" || p.state === "walking_to_presents") {
          const time = Date.now() / 60;
          pompomY = Math.abs(Math.sin(time)) * 5;
          pompomX = Math.sin(time) * 4;
        }
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(headX + pompomX, headY - 19 - pompomY, 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Rodzina
        const bodyW = 36;
        const bodyH = p.height;
        const bX = p.x - 18;
        const bY = p.y - bodyH;
        const r = 10;
        ctx.beginPath();
        ctx.moveTo(bX + r, bY);
        ctx.lineTo(bX + bodyW - r, bY);
        ctx.quadraticCurveTo(bX + bodyW, bY, bX + bodyW, bY + r);
        ctx.lineTo(bX + bodyW, bY + bodyH);
        ctx.lineTo(bX, bY + bodyH);
        ctx.lineTo(bX, bY + r);
        ctx.quadraticCurveTo(bX, bY, bX + r, bY);
        ctx.fill();
        ctx.fillStyle = "#ffdbac";
        ctx.beginPath();
        ctx.arc(headX, headY, 14, 0, Math.PI * 2);
        ctx.fill();

        const shoulderY = p.y - bodyH + 10;
        const isSharing =
          girl.state === "sharing" && girl.targetIndex === index;
        if (isSharing) {
          drawArm(p.x - 10, shoulderY, p.x - 25, p.y - bodyH / 2, p.color);
          drawArm(p.x + 10, shoulderY, p.x - 15, p.y - bodyH / 2, p.color);
        } else {
          drawArm(p.x - 10, shoulderY, p.x - 15, p.y - bodyH * 0.4, p.color);
          drawArm(p.x + 10, shoulderY, p.x + 15, p.y - bodyH * 0.4, p.color);
        }
      }

      const isHappyFamily =
        (girl.state === "sharing" && girl.targetIndex === index) ||
        index < girl.targetIndex ||
        girl.state === "throwing";
      drawFace(headX, headY, isGirl ? true : isHappyFamily);

      // Ręce dziewczynki
      if (isGirl) {
        if (p.state === "sharing") {
          drawArm(p.x, p.y - 45, p.x + 30, p.y - 45, "#ffdbac");
          ctx.fillStyle = "#fff";
          ctx.fillRect(p.x + 30, p.y - 50, 15, 12);
        } else if (p.state === "admiring") {
          drawArm(p.x - 5, p.y - 45, p.x - 20, p.y - 70, "#ffdbac");
          drawArm(p.x + 5, p.y - 45, p.x + 20, p.y - 70, "#ffdbac");
        } else if (p.state === "opening") {
          drawArm(p.x - 5, p.y - 25, p.x - 15, p.y - 5, "#ffdbac");
          drawArm(p.x + 5, p.y - 25, p.x + 15, p.y - 5, "#ffdbac");
        } else if (p.state === "drinking") {
          drawArm(p.x + 5, p.y - 45, p.x + 15, p.y - 30, "#ffdbac");
          ctx.strokeStyle = "#ffdbac";
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(p.x - 10, p.y - 45);
          ctx.lineTo(p.x - 20, p.y - 65);
          ctx.stroke();
          drawChampagne(p.x - 22, p.y - 70, Math.PI / 1.4);
        } else if (p.state === "throwing") {
          drawArm(p.x - 10, p.y - 45, p.x - 30, p.y - 75, "#ffdbac");
          drawArm(p.x + 10, p.y - 45, p.x + 25, p.y - 35, "#ffdbac");
        } else {
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
      const floorY = height - 100;

      if (girl.state === "walking") {
        const target = family[girl.targetIndex];
        const dx = target.x - 50 - girl.x;
        if (Math.abs(dx) > 3) {
          girl.x += Math.sign(dx) * 2.5;
          girl.y = floorY - Math.abs(Math.sin(Date.now() / 100) * 5);
        } else {
          girl.y = floorY;
          girl.state = "sharing";
          girl.waitTimer = 80;
        }
      } else if (girl.state === "sharing") {
        girl.waitTimer--;
        if (girl.waitTimer === 40)
          hearts.push({ x: girl.x + 25, y: girl.y - 90, alpha: 1 });
        if (girl.waitTimer <= 0) {
          girl.targetIndex++;
          if (girl.targetIndex >= family.length) {
            girl.state = "walking_to_presents";
          } else {
            girl.state = "walking";
          }
        }
      } else if (girl.state === "walking_to_presents") {
        const targetX = treeX - 50;
        const dx = targetX - girl.x;
        if (Math.abs(dx) > 3) {
          girl.x += Math.sign(dx) * 2.5;
          girl.y = floorY - Math.abs(Math.sin(Date.now() / 100) * 5);
        } else {
          girl.y = floorY;
          girl.state = "admiring";
          girl.waitTimer = 60;
        }
      } else if (girl.state === "admiring") {
        girl.waitTimer--;
        if (girl.waitTimer % 20 < 10) girl.y = floorY - 10;
        else girl.y = floorY;

        if (girl.waitTimer <= 0) {
          girl.y = floorY;
          girl.state = "opening";
          girl.waitTimer = 60;
        }
      } else if (girl.state === "opening") {
        girl.waitTimer--;
        if (girl.waitTimer <= 0) {
          girl.state = "drinking";
          girl.waitTimer = 100;
        }
      } else if (girl.state === "drinking") {
        girl.waitTimer--;
        if (girl.waitTimer % 5 === 0) {
          bubbles.push({
            x: girl.x - 15 + Math.random() * 5,
            y: girl.y - 80,
            r: Math.random() * 2 + 1,
            alpha: 1,
          });
        }
        if (girl.waitTimer <= 0) {
          girl.state = "throwing";
          // --- FIZYKA SZYBOWANIA ---
          thrownBottle = {
            x: girl.x - 20,
            y: girl.y - 70,
            vx: -2.0,
            vy: -9,
            angle: 0,
            trail: [],
          };
        }
      } else if (girl.state === "throwing") {
        if (thrownBottle) {
          thrownBottle.x += thrownBottle.vx;
          thrownBottle.y += thrownBottle.vy;
          thrownBottle.vy += 0.05;
          thrownBottle.angle -= 0.05;

          thrownBottle.trail.push({ x: thrownBottle.x, y: thrownBottle.y });

          // --- WARUNEK RESETU (NAPRAWIONY) ---
          // Obliczamy index punktu, w którym znajduje się OSTATNIA litera napisu
          const lastTextPointIndex =
            thrownBottle.trail.length - 1 - FINAL_TEXT.length * TEXT_STEP;

          let shouldReset = false;

          // 1. Sprawdzamy, czy "ogon" (ostatnia litera) już istnieje w historii (bo na początku lotu jeszcze go nie ma)
          if (lastTextPointIndex >= 0) {
            const lastLetterPoint = thrownBottle.trail[lastTextPointIndex];
            // 2. Resetujemy dopiero, gdy OSTATNIA litera spadnie poniżej ekranu (+ margines 100px)
            if (lastLetterPoint.y > height + 100) {
              shouldReset = true;
            }
          } else {
            // Zabezpieczenie: jeśli butelka spadnie w otchłań (np. 10k pixeli), a tekst jest jakoś zbugowany, zresetuj
            if (thrownBottle.y > height + 10000) shouldReset = true;
          }

          if (shouldReset) {
            girl.targetIndex = 0;
            girl.x = -50;
            girl.state = "walking";
            thrownBottle = null;
          }
        }
      }

      for (let i = hearts.length - 1; i >= 0; i--) {
        hearts[i].y -= 0.8;
        hearts[i].alpha -= 0.02;
        if (hearts[i].alpha <= 0) hearts.splice(i, 1);
      }
      for (let i = bubbles.length - 1; i >= 0; i--) {
        bubbles[i].y -= 1.5;
        bubbles[i].x += Math.random() - 0.5;
        bubbles[i].alpha -= 0.02;
        if (bubbles[i].alpha <= 0) bubbles.splice(i, 1);
      }
    }

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
      bubbles.forEach((b) => {
        ctx.fillStyle = `rgba(255, 215, 0, ${b.alpha})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      if (thrownBottle) {
        ctx.font = "bold 24px Arial";
        ctx.fillStyle = "#FFD700";
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 4;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const text = FINAL_TEXT;
        const trailLen = thrownBottle.trail.length;
        const step = TEXT_STEP;

        for (let i = 0; i < text.length; i++) {
          const pointIndex = trailLen - 1 - i * step;
          if (pointIndex >= 0 && pointIndex < trailLen) {
            const point = thrownBottle.trail[pointIndex];
            ctx.save();
            ctx.translate(point.x, point.y);
            ctx.fillText(text[i], 0, -25);
            ctx.restore();
          }
        }
        ctx.shadowBlur = 0;
        drawChampagne(thrownBottle.x, thrownBottle.y, thrownBottle.angle);
      }

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
        ❄️ Magia Świąt: Weź opłatek od biednej dziewczynki ... ❄️
      </div>
    </section>
  );
};

export default XmasLoading;
