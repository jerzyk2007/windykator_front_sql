import React, { useEffect, useRef } from "react";
import "./XmasRestaurant.css";

const XmasRestaurant = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width, height;
    let animationId;

    const TABLE_X_POSITIONS = [550, 1150, 1750];
    const START_X = -200;
    const GUEST_DATA = [
      { type: "BLONDIE", order: "Ja wodę niegazowaną… i prosecco.." },
      { type: "BRUNETTE", order: "Ja chciałam to samo co ona, ale odwrotnie." },
      { type: "BALD", order: "Ja setę i śledzia!" },
    ];

    const MUTTER_DATA = [
      "... taaa, ja Ci dam prosecco... już biegnę ...",
      "... tej też się w dupie poprzewracało!",
      "... ten stary dziad też wygląda jakby miał do mnie alibi ...",
    ];

    let state = {
      player: {
        x: START_X,
        targetTableIdx: 0,
        status: "WALKING",
        meltdownStep: 0,
        frame: 0,
        dir: 1,
        isAngry: false,
        isDrinking: false,
        isMuttering: false,
        kickFrame: 0,
        timer: 0,
      },
      chicken: {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        active: false,
        angle: 0,
      },
      dialogue: {
        step: 0,
        timer: 0,
        visible: false,
        text: "",
      },
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    function getLines(ctx, text, maxWidth) {
      let words = text.split(" ");
      let lines = [];
      let currentLine = words[0];
      for (let i = 1; i < words.length; i++) {
        let word = words[i];
        let w = ctx.measureText(currentLine + " " + word).width;
        if (w < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    }

    // --- DYMEK: ZAWSZE PROSTOKĄTNY, ZMIENNA CZCIONKA ---
    function drawSpeechBubble(x, y, text, bubbleWidth = 340, mode = "normal") {
      ctx.save();
      const isMutter = mode === "mutter";
      const isAngry = mode === "angry";

      // Jeśli mamrocze, używamy kursywy (italic)
      ctx.font = isMutter ? "italic bold 18px Arial" : "bold 18px Arial";

      const padding = 20;
      const lineHeight = 24;
      const lines = getLines(ctx, text, bubbleWidth - padding * 2);
      const bubbleHeight = lines.length * lineHeight + padding * 2;
      const bubbleY = y - bubbleHeight - 60;

      // Cień
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.beginPath();
      ctx.roundRect(x + 5, bubbleY + 5, bubbleWidth, bubbleHeight, 15);
      ctx.fill();

      // Dymek
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(x, bubbleY, bubbleWidth, bubbleHeight, 15);
      ctx.fill();
      ctx.stroke();

      // Ogonek (klasyczny trójkąt)
      ctx.beginPath();
      ctx.moveTo(x + 30, bubbleY + bubbleHeight);
      ctx.lineTo(x + 15, bubbleY + bubbleHeight + 35);
      ctx.lineTo(x + 55, bubbleY + bubbleHeight);
      ctx.fill();
      ctx.stroke();

      // Kolor tekstu: czerwony dla złości, ciemny szary dla mamrotania
      ctx.fillStyle = isAngry ? "#d32f2f" : isMutter ? "#444" : "#000";
      ctx.textAlign = "center";
      lines.forEach((line, i) => {
        ctx.fillText(
          line,
          x + bubbleWidth / 2,
          bubbleY + padding + lineHeight * 0.8 + i * lineHeight,
        );
      });
      ctx.restore();
    }

    function drawChickenElement(x, y, angle) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = "#a67c52";
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#a67c52";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(25, -10);
      ctx.stroke();
      ctx.restore();
    }

    function drawWaitress(p, chickenInAir) {
      ctx.save();
      ctx.translate(p.x, -100);
      if (p.dir === -1) ctx.scale(-1, 1);
      const walkCycle =
        p.status === "WALKING" || p.status === "RETURNING"
          ? Math.sin(p.frame * 0.15)
          : 0;
      ctx.strokeStyle = "#e74c3c";
      ctx.lineWidth = 8;
      let legAngle = Math.PI / 2;
      if (p.status === "MELTDOWN" && p.meltdownStep === 1) {
        legAngle -= Math.min(p.kickFrame * 0.3, 1.4);
      }
      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.lineTo(Math.cos(legAngle + walkCycle) * 20, 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.lineTo(Math.cos(Math.PI / 2 - walkCycle) * 20, 2);
      ctx.stroke();
      ctx.fillStyle = "#e74c3c";
      ctx.beginPath();
      ctx.moveTo(0, -60);
      ctx.lineTo(-22, -20);
      ctx.lineTo(22, -20);
      ctx.fill();

      if (!chickenInAir && p.meltdownStep < 2) {
        ctx.fillStyle = "#ffdbac";
        ctx.fillRect(10, -50, 20, 8);
        ctx.fillStyle = "#95a5a6";
        ctx.fillRect(20, -60, 75, 7);
        drawChickenElement(55, -72, 0);
      }
      if (p.isDrinking) {
        ctx.fillStyle = "#ffdbac";
        ctx.fillRect(8, -75, 15, 8);
        ctx.save();
        ctx.translate(15, -85);
        ctx.rotate(-0.8);
        ctx.fillStyle = "#2e7d32";
        ctx.beginPath();
        ctx.roundRect(0, 0, 14, 35, 3);
        ctx.fill();
        ctx.fillRect(4, -12, 6, 15);
        ctx.fillStyle = "white";
        ctx.fillRect(1, 10, 12, 12);
        ctx.fillStyle = "gold";
        ctx.fillRect(4, -14, 6, 3);
        ctx.restore();
      }
      ctx.save();
      ctx.translate(0, -75);
      if (p.isDrinking) ctx.rotate(-0.6);
      ctx.fillStyle = "#ffdbac";
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(0, -5, 15, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.fillRect(-16, -7, 32, 6);
      ctx.beginPath();
      ctx.arc(Math.sin(p.frame * 0.1) * 3, -23, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "black";
      if (p.isAngry || p.isMuttering) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-8, -5);
        ctx.lineTo(-2, -1);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(8, -5);
        ctx.lineTo(2, -1);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 8, 6, 1.1 * Math.PI, 1.9 * Math.PI, false);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(-5, -1, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(5, -1, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 4, 5, 0.1 * Math.PI, 0.9 * Math.PI, false);
        ctx.stroke();
      }
      ctx.restore();
      ctx.restore();
    }

    function drawGuestAndTable(x, data, isActive) {
      ctx.save();
      ctx.translate(x, -100);
      ctx.fillStyle = "#5d4037";
      ctx.fillRect(-35, -50, 10, 50);
      ctx.fillRect(-35, -25, 45, 10);
      ctx.fillStyle =
        data.type === "BALD"
          ? "#2c3e50"
          : data.type === "BLONDIE"
            ? "#bd4ab3"
            : "#991e32";
      const bodyW = data.type === "BALD" ? 36 : 30;
      ctx.fillRect(-bodyW / 2, -65, bodyW, 40);
      ctx.fillStyle = "#ffdbac";
      const headR = data.type === "BALD" ? 14 : 12;
      ctx.beginPath();
      ctx.arc(0, -75, headR, 0, Math.PI * 2);
      ctx.fill();

      if (data.type === "BLONDIE" || data.type === "BRUNETTE") {
        ctx.fillStyle = data.type === "BLONDIE" ? "#FFD700" : "#1a1a1a";
        ctx.fillRect(-15, -88, 30, 12);
        ctx.fillRect(-15, -85, 6, 30);
        ctx.fillRect(9, -85, 6, 30);
      }

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(-4, -77, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(4, -77, 1.5, 0, Math.PI * 2);
      ctx.fill();
      if (isActive) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -68, 5, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = "#8d6e63";
      ctx.fillRect(10, -62, 110, 12);
      ctx.fillStyle = "#5d4037";
      ctx.fillRect(60, -50, 12, 50);
      ctx.restore();
    }

    const update = () => {
      const p = state.player;
      const d = state.dialogue;
      const c = state.chicken;

      if (p.status === "WALKING") {
        p.frame++;
        p.dir = 1;
        if (d.visible && p.isMuttering) {
          d.timer--;
          if (d.timer <= 0) {
            d.visible = false;
            p.isMuttering = false;
          }
        }
        const targetX = TABLE_X_POSITIONS[p.targetTableIdx] - 130;
        if (Math.abs(targetX - p.x) < 5) {
          p.status = "TALKING";
          d.visible = true;
          d.step = 0;
          d.timer = 130;
          d.text = "Kto zamawiał kurczaka po seczułańsku?";
          p.isMuttering = false;
        } else {
          p.x += 4.5;
        }
      } else if (p.status === "TALKING") {
        d.timer--;
        if (d.timer <= 0) {
          if (d.step === 0) {
            d.step = 1;
            d.timer = 160;
            d.text = GUEST_DATA[p.targetTableIdx].order;
          } else if (d.step === 1) {
            d.step = 2;
            d.timer = 110;
            d.text = "^%$^%$ &T&^% !!!";
            p.isAngry = true;
          } else {
            d.text = MUTTER_DATA[p.targetTableIdx];
            d.visible = true;
            d.timer = 140;
            p.isAngry = false;
            p.isMuttering = true;
            if (p.targetTableIdx < TABLE_X_POSITIONS.length - 1) {
              p.targetTableIdx++;
              p.status = "WALKING";
            } else {
              p.status = "RETURNING";
            }
          }
        }
      } else if (p.status === "RETURNING") {
        p.frame++;
        p.dir = -1;
        p.x -= 6;
        if (d.visible && p.isMuttering) {
          d.timer--;
          if (d.timer <= 0) {
            d.visible = false;
            p.isMuttering = false;
          }
        }
        if (p.x <= 150) {
          p.status = "MELTDOWN";
          p.meltdownStep = 0;
          p.timer = 40;
          d.visible = false;
          p.isMuttering = false;
        }
      } else if (p.status === "MELTDOWN") {
        if (p.meltdownStep === 0) {
          p.timer--;
          if (p.timer <= 0) {
            p.meltdownStep = 1;
            p.kickFrame = 0;
            p.isAngry = true;
          }
        } else if (p.meltdownStep === 1) {
          p.kickFrame++;
          if (p.kickFrame === 5) {
            c.active = true;
            c.x = p.x + 40;
            c.y = height * 0.85 - 170;
            c.vx = 8;
            c.vy = -18;
          }
          if (p.kickFrame > 35) {
            p.meltdownStep = 2;
            p.timer = 100;
            p.isDrinking = true;
          }
        } else if (p.meltdownStep === 2) {
          p.timer--;
          if (p.timer <= 0) {
            p.meltdownStep = 3;
            d.visible = true;
            d.text = "Już dwie godziny nie piłam";
            d.timer = 120; // 2 SEKUNDY PAUZY
          }
        } else if (p.meltdownStep === 3) {
          d.timer--;
          if (d.timer <= 0) {
            d.visible = false;
            p.status = "WALKING";
            p.targetTableIdx = 0;
            p.x = START_X;
            p.meltdownStep = 0;
            p.isDrinking = false;
            p.isAngry = false;
            c.active = false;
          }
        }
      }
      if (c.active) {
        c.x += c.vx;
        c.vy += 0.6;
        c.y += c.vy;
        c.angle += 0.15;
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      const p = state.player;
      const d = state.dialogue;
      const camX = p.x - width * 0.3;
      ctx.save();
      ctx.translate(-camX, height * 0.85);
      ctx.fillStyle = "#fdf5e6";
      ctx.fillRect(camX, -height, width, height);
      ctx.strokeStyle = "#faebd7";
      ctx.lineWidth = 1;
      for (let i = 0; i < 40; i++) {
        ctx.beginPath();
        ctx.moveTo(camX + i * 100 - (camX % 100), -height);
        ctx.lineTo(camX + i * 100 - (camX % 100), 0);
        ctx.stroke();
      }
      ctx.fillStyle = "#3e2723";
      ctx.fillRect(camX, 0, width, 500);
      TABLE_X_POSITIONS.forEach((tx, idx) => {
        const isAnswering =
          p.status === "TALKING" && p.targetTableIdx === idx && d.step === 1;
        drawGuestAndTable(tx, GUEST_DATA[idx], isAnswering);
      });
      drawWaitress(p, state.chicken.active);
      if (state.chicken.active) {
        drawChickenElement(
          state.chicken.x,
          state.chicken.y - height * 0.85,
          state.chicken.angle,
        );
      }
      if (d.visible) {
        const bubbleX =
          p.isMuttering || p.status === "MELTDOWN"
            ? p.x - 120
            : d.step === 1
              ? TABLE_X_POSITIONS[p.targetTableIdx] - 60
              : p.x - 60;
        let mode = "normal";
        if (p.isMuttering) mode = "mutter";
        else if (p.isAngry || p.status === "MELTDOWN") mode = "angry";
        drawSpeechBubble(bubbleX, -260, d.text, 360, mode);
      }
      ctx.restore();
      update();
      animationId = requestAnimationFrame(loop);
    };

    resize();
    loop();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="restaurant-container">
      <div className="rest-title">RESTAURACJA "EGZEKUCJA SMAKU" 🥟</div>
      <canvas ref={canvasRef} />
      <div className="rest-status">
        <span className="retro-blink">WINDYKACJA TO STAN UMYSŁU</span>
      </div>
    </div>
  );
};

export default XmasRestaurant;
