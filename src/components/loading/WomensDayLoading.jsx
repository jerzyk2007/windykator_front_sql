import { useEffect, useRef } from "react";
import "./WomensDayLoading.css";

const WomensDayLoading = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height;

    const petals = [];
    const numPetals = 70;
    const sparkles = [];

    // --- LOGIKA POSTACI ---
    let boy = {
      x: 0,
      y: 0,
      color: "#4facfe",
      targetIndex: 0,
      state: "walking", // walking, giving, exiting, riding
      waitTimer: 0,
      width: 48,
    };

    const girls = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const floorY = height - 100;

      girls.length = 0;
      // 1. Blondynka | 2. Czarna/Czerwona | 3. Czarna/Zielona
      girls.push({
        x: width * 0.25,
        y: floorY,
        color: "#9b59b6",
        height: 65,
        hair: "#f1c40f",
      });
      girls.push({
        x: width * 0.5,
        y: floorY,
        color: "#ff4757",
        height: 75,
        hair: "#000000",
      });
      girls.push({
        x: width * 0.75,
        y: floorY,
        color: "#2ecc71",
        height: 60,
        hair: "#000000",
      });

      boy.x = -100;
      boy.y = floorY;
      boy.state = "walking";
      boy.targetIndex = 0;
    }

    // --- KLASA PŁATKÓW ---
    class Petal {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -20;
        this.r = Math.random() * 3 + 2;
        this.speedY = Math.random() * 0.5 + 0.5;
        this.sway = Math.random() * 0.02;
        this.phase = Math.random() * Math.PI * 2;
      }
      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * this.sway + this.phase) * 0.5;
        if (this.y > height) this.reset();
      }
      draw() {
        ctx.fillStyle = "#fff0f5";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    for (let i = 0; i < numPetals; i++) petals.push(new Petal());

    function drawStar(x, y, size, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#ffd700";
      ctx.translate(x, y);
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.fillRect(-size / 2, -size / 8, size, size / 4);
        ctx.fillRect(-size / 8, -size / 2, size / 4, size);
      }
      ctx.restore();
    }

    function drawFlower(x, y) {
      ctx.strokeStyle = "#2ecc71";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - 20);
      ctx.stroke();
      ctx.fillStyle = "#ff7f50";
      ctx.beginPath();
      ctx.arc(x, y - 22, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawPerson(p, isBoy, index = -1, isRiding = false) {
      const headX = p.x;
      const hOffset = isRiding ? 85 : isBoy ? 75 : p.height;
      let headY = p.y - hOffset - 15;

      // Ciało
      ctx.fillStyle = p.color;
      if (isBoy) {
        ctx.beginPath();
        ctx.roundRect(p.x - 24, p.y - (isRiding ? 85 : 55), 48, 55, 12);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - 50);
        ctx.lineTo(p.x - 30, p.y);
        ctx.lineTo(p.x + 30, p.y);
        ctx.fill();
      }

      // Głowa
      ctx.fillStyle = "#ffdbac";
      ctx.beginPath();
      ctx.arc(headX, headY, 18, 0, Math.PI * 2);
      ctx.fill();

      // Włosy
      ctx.fillStyle = isBoy ? "#4e342e" : p.hair;
      if (isBoy) {
        ctx.fillRect(headX - 18, headY - 22, 36, 12);
      } else {
        ctx.beginPath();
        ctx.arc(headX, headY - 8, 20, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(headX - 20, headY - 8, 8, 28);
        ctx.fillRect(headX + 12, headY - 8, 8, 28);
      }

      // Twarz
      ctx.fillStyle = "#3e2723";
      ctx.beginPath();
      ctx.arc(headX - 6, headY - 2, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(headX + 6, headY - 2, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#3e2723";
      ctx.beginPath();
      ctx.arc(headX, headY + 5, 5, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Kwiaty
      if (isBoy && !isRiding) {
        if (p.state === "giving") {
          ctx.strokeStyle = "#ffdbac";
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(p.x + 10, p.y - 40);
          ctx.lineTo(p.x + 35, p.y - 40);
          ctx.stroke();
          drawFlower(p.x + 35, p.y - 40);
        } else if (p.state === "walking" || p.state === "exiting") {
          drawFlower(p.x + 20, p.y - 35);
        }
      } else if (!isBoy) {
        const received =
          boy.targetIndex > index ||
          (boy.state !== "walking" && boy.targetIndex === index);
        if (received) drawFlower(p.x - 25, p.y - 30);
      }
    }

    function drawBicycle(x, y) {
      ctx.strokeStyle = "#34495e";
      ctx.lineWidth = 4;
      // Koła
      ctx.beginPath();
      ctx.arc(x - 45, y - 25, 25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + 45, y - 25, 25, 0, Math.PI * 2);
      ctx.stroke();
      // Rama
      ctx.beginPath();
      ctx.moveTo(x - 45, y - 25);
      ctx.lineTo(x, y - 25);
      ctx.lineTo(x + 35, y - 65);
      ctx.lineTo(x - 10, y - 65);
      ctx.closePath();
      ctx.stroke();
      // Kierownica i siodełko
      ctx.beginPath();
      ctx.moveTo(x + 35, y - 65);
      ctx.lineTo(x + 45, y - 80);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 10, y - 65);
      ctx.lineTo(x - 10, y - 75);
      ctx.stroke();
    }

    function updateLogic() {
      const floorY = height - 100;

      if (boy.state === "walking") {
        const target = girls[boy.targetIndex];
        const dx = target.x - 70 - boy.x;
        if (Math.abs(dx) > 3) {
          boy.x += 2.5;
          boy.y = floorY - Math.abs(Math.sin(Date.now() / 120) * 5);
        } else {
          boy.y = floorY;
          boy.state = "giving";
          boy.waitTimer = 80;
        }
      } else if (boy.state === "giving") {
        boy.waitTimer--;
        if (boy.waitTimer === 40) {
          for (let j = 0; j < 6; j++) {
            sparkles.push({
              x: boy.x + 60 + (Math.random() - 0.5) * 30,
              y: boy.y - 80 + (Math.random() - 0.5) * 30,
              size: Math.random() * 10 + 5,
              alpha: 1,
            });
          }
        }
        if (boy.waitTimer <= 0) {
          boy.targetIndex++;
          if (boy.targetIndex >= girls.length) boy.state = "exiting";
          else boy.state = "walking";
        }
      } else if (boy.state === "exiting") {
        boy.x += 3;
        boy.y = floorY - Math.abs(Math.sin(Date.now() / 120) * 5);
        if (boy.x > width + 100) {
          boy.state = "riding";
          boy.x = width + 150; // Startuje z prawej na rowerze
        }
      } else if (boy.state === "riding") {
        boy.x -= 6; // Szybki powrót rowerem
        boy.y = floorY;
        if (boy.x < -200) {
          boy.state = "walking";
          boy.x = -100;
          boy.targetIndex = 0;
        }
      }

      for (let i = sparkles.length - 1; i >= 0; i--) {
        sparkles[i].y -= 0.6;
        sparkles[i].alpha -= 0.02;
        if (sparkles[i].alpha <= 0) sparkles.splice(i, 1);
      }
    }

    function loop() {
      ctx.clearRect(0, 0, width, height);

      // Podłoże
      const grad = ctx.createLinearGradient(0, height - 100, 0, height);
      grad.addColorStop(0, "#e8f5e9");
      grad.addColorStop(1, "#c8e6c9");
      ctx.fillStyle = grad;
      ctx.fillRect(0, height - 100, width, 100);

      petals.forEach((p) => {
        p.update();
        p.draw();
      });
      girls.forEach((g, i) => drawPerson(g, false, i));

      if (boy.state === "riding") {
        drawBicycle(boy.x, boy.y);
        drawPerson(boy, true, -1, true);
      } else {
        drawPerson(boy, true);
      }

      sparkles.forEach((s) => drawStar(s.x, s.y, s.size, s.alpha));

      updateLogic();
      requestAnimationFrame(loop);
    }

    window.addEventListener("resize", resize);
    resize();
    loop();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <section className="womens-day-wrapper">
      <div className="message-top">
        🌸 Trwa przygotowanie niespodzianki... 🌸
      </div>
      <canvas ref={canvasRef} className="womens-day-canvas" />
      <div className="message-bottom">
        💐 Dzień Kobiet: Chwila radości dla każdej z Pań! 💐
      </div>
    </section>
  );
};

export default WomensDayLoading;
