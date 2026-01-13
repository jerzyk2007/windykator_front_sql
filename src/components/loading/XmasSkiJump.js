import React, { useEffect, useRef } from "react";
import "./XmasSkiJump.css";

const XmasSkiJump = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width, height;
    let animationId;

    // --- PARAMETRY ŚWIATA ---
    const SLOPE_ANGLE = 0.85;
    const TAKEOFF_X = 600;
    const FLIGHT_TIME = 150; // ok. 2.5 sekundy lotu
    const LANDING_X_START = 2200;
    const JUDGE_X = 5200; // Sędziowie na końcu długiego zjazdu
    const gravity = 0.08;

    let player = {
      x: 20,
      y: 0,
      vx: 0,
      vy: 0,
      state: "INRUN",
      frame: 0,
      flightTimer: 0,
      waitTimer: 0,
      scores: ["20.0", "20.0", "20.0"],
    };

    let camera = { x: 0, y: 0 };
    const stars = Array.from({ length: 250 }, () => ({
      x: Math.random() * 12000,
      y: Math.random() * 2000,
      size: Math.random() * 2,
    }));

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const getSlopeY = (x) => {
      if (x < TAKEOFF_X) {
        return 200 + x * SLOPE_ANGLE;
      } else if (x >= LANDING_X_START) {
        const dx = x - LANDING_X_START;
        const takeoffY = 200 + TAKEOFF_X * SLOPE_ANGLE;
        const landingStartY = takeoffY + 600;
        return landingStartY + dx * SLOPE_ANGLE;
      }
      return 20000; // Przepaść
    };

    const getSlopeAngle = (x) => {
      const p1 = getSlopeY(x);
      const p2 = getSlopeY(x + 1);
      return Math.atan2(p2 - p1, 1);
    };

    // --- RYSOWANIE DZIEWCZYNKI (TWOJA POSTAĆ) ---
    function drawLimber(
      startX,
      startY,
      angle,
      length,
      thickness,
      color,
      hasHand = true
    ) {
      const endX = startX + Math.cos(angle) * length;
      const endY = startY + Math.sin(angle) * length;
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      if (hasHand) {
        ctx.fillStyle = "#ffdbac";
        ctx.beginPath();
        ctx.arc(endX, endY, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      return { x: endX, y: endY };
    }

    function drawSki(x, y, angle, length) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-length * 0.4, 0);
      ctx.lineTo(length * 0.6, 0);
      ctx.stroke();
      ctx.restore();
    }

    function drawGirl(p) {
      ctx.save();
      ctx.translate(p.x, p.y);

      const isFlying = p.state === "FLIGHT";
      const isTelemark = p.state !== "INRUN" && p.state !== "FLIGHT";

      if (isFlying) {
        ctx.rotate(Math.sin(p.frame * 0.1) * 0.3);
      } else {
        ctx.rotate(getSlopeAngle(p.x));
      }

      const headY = -72;
      const bodyY = -50;
      const armLen = 28;

      let legAngleL, legAngleR, skiAngleL, skiAngleR;
      if (isFlying) {
        legAngleL = Math.PI / 2 + Math.sin(p.frame * 0.15) * 0.7;
        legAngleR = Math.PI / 2 + Math.cos(p.frame * 0.15) * 0.7;
        skiAngleL = -0.7 + Math.sin(p.frame * 0.2) * 0.5;
        skiAngleR = 0.7 + Math.cos(p.frame * 0.2) * 0.5;
      } else if (isTelemark) {
        legAngleL = Math.PI / 2.0;
        legAngleR = Math.PI / 1.5;
        skiAngleL = 0;
        skiAngleR = 0;
      } else {
        legAngleL = legAngleR = Math.PI / 2;
        skiAngleL = skiAngleR = 0;
      }

      const fL = drawLimber(0, -20, legAngleL, 22, 8, "#e74c3c", false);
      const fR = drawLimber(0, -20, legAngleR, 22, 8, "#e74c3c", false);
      drawSki(fL.x, fL.y, skiAngleL, 65);
      drawSki(fR.x, fR.y, skiAngleR, 65);

      ctx.fillStyle = "#e74c3c"; // Sukienka
      ctx.beginPath();
      ctx.moveTo(0, headY + 12);
      ctx.lineTo(-25, -20);
      ctx.lineTo(25, -20);
      ctx.fill();

      if (isFlying) {
        const wave = p.frame * 0.15;
        drawLimber(
          -10,
          bodyY,
          Math.PI + Math.sin(wave) * 2.2,
          armLen,
          6,
          "#ffdbac"
        );
        drawLimber(10, bodyY, Math.cos(wave) * 2.2, armLen, 6, "#ffdbac");
      } else if (isTelemark) {
        drawLimber(-10, bodyY, Math.PI + 0.3, armLen, 6, "#ffdbac");
        drawLimber(10, bodyY, -0.3, armLen, 6, "#ffdbac");
      } else {
        drawLimber(10, bodyY, Math.PI / 3, armLen, 6, "#ffdbac");
      }

      ctx.fillStyle = "#5d4037";
      ctx.beginPath();
      ctx.arc(-12, headY, 6, 0, Math.PI * 2);
      ctx.arc(12, headY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffdbac";
      ctx.beginPath();
      ctx.arc(0, headY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(0, headY - 5, 14, Math.PI, 0);
      ctx.fill();
      const pomT = p.frame * 0.05;
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(
        Math.sin(pomT) * 6,
        headY - 20 - Math.abs(Math.sin(pomT)) * 8,
        4,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.fillStyle = "#3e2723";
      ctx.beginPath();
      ctx.arc(-4, headY - 1, 1.5, 0, Math.PI * 2);
      ctx.arc(4, headY - 1, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#3e2723";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, headY + 2, 5, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();

      ctx.restore();
    }

    const update = () => {
      player.frame++;
      const groundY = getSlopeY(player.x);

      if (player.state === "INRUN") {
        player.vx += 0.22;
        player.x += player.vx;
        player.y = groundY;
        if (player.x >= TAKEOFF_X) {
          player.state = "FLIGHT";
          player.vy = -5.5;
          player.flightTimer = FLIGHT_TIME;
        }
      } else if (player.state === "FLIGHT") {
        player.x += player.vx;
        player.vy += gravity;
        player.y += player.vy;
        player.flightTimer--;
        if (player.flightTimer <= 0 && player.x >= LANDING_X_START) {
          if (player.y >= groundY - 20) {
            player.y = groundY;
            player.state = "LANDING";
            player.waitTimer = 30;
          }
        }
      } else if (player.state === "LANDING") {
        player.x += player.vx;
        player.y = getSlopeY(player.x);
        player.waitTimer--;
        if (player.waitTimer <= 0) player.state = "SLIDING";
      } else if (player.state === "SLIDING") {
        player.x += player.vx;
        player.vx *= 0.998;
        player.y = getSlopeY(player.x);
        if (player.x >= JUDGE_X) {
          player.state = "SCORES";
          player.waitTimer = 180;
        }
      } else if (player.state === "SCORES") {
        player.vx *= 0.8;
        player.x += player.vx;
        player.y = getSlopeY(player.x);
        player.waitTimer--;
        if (player.waitTimer <= 0) {
          player.x = 20;
          player.vx = 0;
          player.vy = 0;
          player.state = "INRUN";
        }
      }
      camera.x = player.x - width * 0.35;
      camera.y = player.y - height * 0.6;
    };

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "white";
      stars.forEach((s) => {
        let sx = (s.x - camera.x * 0.1) % width;
        let sy = (s.y - camera.y * 0.1) % height;
        ctx.beginPath();
        ctx.arc(
          sx < 0 ? sx + width : sx,
          sy < 0 ? sy + height : sy,
          s.size,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      ctx.save();
      ctx.translate(-camera.x, -camera.y);

      // Najazd
      ctx.beginPath();
      ctx.moveTo(camera.x - 200, 10000);
      for (let x = camera.x - 200; x <= TAKEOFF_X; x += 20)
        ctx.lineTo(x, getSlopeY(x));
      ctx.lineTo(TAKEOFF_X, 10000);
      ctx.fillStyle = "white";
      ctx.fill();

      // Próg
      ctx.fillStyle = "#bdc3c7";
      ctx.fillRect(TAKEOFF_X - 40, getSlopeY(TAKEOFF_X), 40, 5000);
      ctx.strokeStyle = "#c0392b";
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(TAKEOFF_X - 80, getSlopeY(TAKEOFF_X - 80));
      ctx.lineTo(TAKEOFF_X, getSlopeY(TAKEOFF_X));
      ctx.stroke();

      // Zeskok (SOLIDNY I DŁUGI)
      const endX = Math.max(JUDGE_X + 2000, camera.x + width + 500);
      ctx.beginPath();
      ctx.moveTo(LANDING_X_START, 10000);
      for (let x = LANDING_X_START; x <= endX; x += 40) {
        const sy = getSlopeY(x);
        if (sy < 20000) ctx.lineTo(x, sy);
      }
      ctx.lineTo(endX, 10000);
      ctx.fillStyle = "white";
      ctx.fill();

      // --- SĘDZIOWIE ---
      const dy = getSlopeY(JUDGE_X);
      if (dy < 20000) {
        ctx.save();
        ctx.translate(JUDGE_X, dy);
        ctx.rotate(getSlopeAngle(JUDGE_X));
        ctx.fillStyle = "#4e342e";
        ctx.fillRect(-100, -40, 200, 40);
        ctx.strokeStyle = "white";
        ctx.strokeRect(-100, -40, 200, 40);
        for (let i = 0; i < 3; i++) {
          const jx = -60 + i * 60;
          ctx.fillStyle = "#2c3e50";
          ctx.fillRect(jx - 12, -65, 24, 25);
          ctx.fillStyle = "#ffdbac";
          ctx.beginPath();
          ctx.arc(jx, -72, 9, 0, Math.PI * 2);
          ctx.fill();
          if (player.state === "SCORES") {
            ctx.save();
            ctx.translate(jx, -100);
            ctx.fillStyle = "white";
            ctx.fillRect(-22, -26, 44, 26);
            ctx.strokeStyle = "black";
            ctx.strokeRect(-22, -26, 44, 26);
            ctx.fillStyle = "black";
            ctx.font = "bold 18px Courier New";
            ctx.textAlign = "center";
            ctx.fillText(player.scores[i], 0, -6);
            ctx.restore();
          }
        }
        ctx.restore();
      }

      drawGirl(player);
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
    <div className="ski-jump-container">
      <div className="ski-title">ZAKOPANE: LOT W KOSMOS ❄️</div>
      <canvas ref={canvasRef} />
      <div className="ski-status">
        <span className="retro-blink">ŁADOWANIE... POWIETRZE!</span>
      </div>
    </div>
  );
};

export default XmasSkiJump;
