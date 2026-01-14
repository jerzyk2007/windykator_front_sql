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
    const TAKEOFF_X = 2000;
    const LANDING_X_START = 4000;
    const FLAT_START = 8000;
    const JUDGE_X = 9000;
    const gravity = 0.12;

    let player = {
      x: 20,
      y: 0,
      vx: 0,
      vy: 0,
      state: "INRUN",
      frame: 0,
      waitTimer: 0,
      scores: ["7.5", "7.0", "6.5"],
    };

    let camera = { x: 0, y: 0 };
    const stars = Array.from({ length: 600 }, () => ({
      x: Math.random() * 15000,
      y: Math.random() * 4000,
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
        const takeoffY = 200 + TAKEOFF_X * SLOPE_ANGLE;
        const landingStartY = takeoffY + 600;
        if (x < FLAT_START) {
          return landingStartY + (x - LANDING_X_START) * SLOPE_ANGLE;
        } else {
          return landingStartY + (FLAT_START - LANDING_X_START) * SLOPE_ANGLE;
        }
      }
      return 20000;
    };

    const getSlopeAngle = (x) => {
      if (x < TAKEOFF_X) return Math.atan(SLOPE_ANGLE);
      if (x >= LANDING_X_START && x < FLAT_START) return Math.atan(SLOPE_ANGLE);
      return 0;
    };

    // --- RYSOWANIE CZĘŚCI CIAŁA ---
    function drawLimber(startX, startY, angle, length, thickness, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";
      ctx.beginPath();
      const endX = startX + Math.cos(angle) * length;
      const endY = startY + Math.sin(angle) * length;
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      return { x: endX, y: endY };
    }

    function drawSki(x, y, angle, length) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.strokeStyle = "#111";
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
      const isStopped = p.state === "SCORES";
      const isInrun = p.state === "INRUN";

      ctx.rotate(isFlying ? Math.sin(p.frame * 0.1) * 0.2 : getSlopeAngle(p.x));

      const headY = -72;
      const bodyY = -50;

      const fL = drawLimber(
        0,
        -20,
        Math.PI / 2 + (isFlying ? 0.5 : 0),
        22,
        8,
        "#e74c3c"
      );
      const fR = drawLimber(
        0,
        -20,
        Math.PI / 2 - (isFlying ? 0.5 : 0),
        22,
        8,
        "#e74c3c"
      );
      drawSki(fL.x, fL.y, isFlying ? -0.5 : 0, 65);
      drawSki(fR.x, fR.y, isFlying ? 0.5 : 0, 65);

      ctx.fillStyle = "#e74c3c";
      ctx.beginPath();
      ctx.moveTo(0, headY + 12);
      ctx.lineTo(-25, -20);
      ctx.lineTo(25, -20);
      ctx.fill();

      if (isInrun) {
        drawLimber(10, bodyY, Math.PI / 2.5, 25, 6, "#ffdbac");
      } else if (isFlying) {
        drawLimber(
          -10,
          bodyY,
          Math.PI + Math.sin(p.frame * 0.2) * 1.5,
          25,
          6,
          "#ffdbac"
        );
        drawLimber(10, bodyY, Math.cos(p.frame * 0.2) * 1.5, 25, 6, "#ffdbac");
      } else if (isStopped) {
        drawLimber(-15, bodyY, Math.PI + 0.5, 25, 6, "#ffdbac");
        drawLimber(15, bodyY, -0.5, 25, 6, "#ffdbac");
      } else {
        drawLimber(
          10,
          bodyY,
          -0.4 + Math.sin(p.frame * 0.1) * 0.6,
          25,
          6,
          "#ffdbac"
        );
      }

      ctx.fillStyle = "#ffdbac";
      ctx.beginPath();
      ctx.arc(0, headY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(0, headY - 5, 14, Math.PI, 0);
      ctx.fill();
      const pomT = p.frame * 0.12;
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(
        Math.sin(pomT) * 4,
        headY - 22 - Math.abs(Math.sin(pomT)) * 6,
        5,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.fillStyle = "#3e2723";
      ctx.beginPath();
      ctx.arc(-5, headY - 2, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(5, headY - 2, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#3e2723";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, headY + 3, 8, 0.1 * Math.PI, 0.9 * Math.PI, false);
      ctx.stroke();

      ctx.restore();
    }

    const update = () => {
      player.frame++;
      const groundY = getSlopeY(player.x);

      if (player.state === "INRUN") {
        player.vx += 0.09;
        player.x += player.vx;
        player.y = groundY;
        if (player.x >= TAKEOFF_X) {
          player.state = "FLIGHT";
          player.vy = -7;
        }
      } else if (player.state === "FLIGHT") {
        player.x += player.vx;
        player.vy += gravity;
        player.y += player.vy;
        if (player.y >= groundY - 20 && player.x > LANDING_X_START) {
          player.y = groundY;
          player.state = "SLIDING";
        }
      } else if (player.state === "SLIDING") {
        player.x += player.vx;
        player.y = getSlopeY(player.x);
        player.vx *= player.x > FLAT_START ? 0.98 : 0.999;
        if (player.x >= JUDGE_X) {
          player.state = "SCORES";
          player.waitTimer = 180;
          player.vx = 0;
        }
      } else if (player.state === "SCORES") {
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
        let sx = (s.x - camera.x * 0.1) % (width + 3000);
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

      // Śnieg
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.moveTo(-2000, 15000);
      for (let x = -2000; x <= TAKEOFF_X; x += 100) ctx.lineTo(x, getSlopeY(x));
      ctx.lineTo(TAKEOFF_X, 15000);
      ctx.fill();
      ctx.fillStyle = "#bdc3c7";
      ctx.fillRect(TAKEOFF_X - 15, getSlopeY(TAKEOFF_X), 30, 2500);
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.moveTo(LANDING_X_START, 15000);
      for (let x = LANDING_X_START; x <= JUDGE_X + 2000; x += 100)
        ctx.lineTo(x, getSlopeY(x));
      ctx.lineTo(JUDGE_X + 2000, 15000);
      ctx.fill();

      // SĘDZIOWIE I BIURKO
      const jy = getSlopeY(JUDGE_X);
      ctx.save();
      ctx.translate(JUDGE_X + 150, jy);

      // Biurko
      ctx.fillStyle = "#5d4037";
      ctx.fillRect(0, -60, 180, 60);
      ctx.strokeStyle = "white";
      ctx.strokeRect(0, -60, 180, 60);
      ctx.fillRect(10, 0, 10, -60);
      ctx.fillRect(160, 0, 10, -60);

      // Napis na biurku
      ctx.fillStyle = "#fbff00";
      ctx.font = "bold 24px 'Courier New', Courier, monospace";
      ctx.textAlign = "center";
      ctx.fillText("DKiKN", 90, -30);

      // Rysowanie sędziów
      for (let i = 0; i < 3; i++) {
        const sx = 40 + i * 50;

        // --- TUŁÓW ---
        ctx.fillStyle = "#2c3e50";
        if (i === 2) {
          // Łysy gruby facet
          ctx.fillRect(sx - 16, -85, 32, 25);
        } else {
          ctx.fillRect(sx - 12, -85, 24, 25);
        }

        // --- GŁOWA ---
        ctx.fillStyle = "#ffdbac";
        ctx.beginPath();
        const headRadius = i === 2 ? 12 : 10;
        ctx.arc(sx, -90, headRadius, 0, Math.PI * 2);
        ctx.fill();

        // --- WŁOSY ---
        if (i === 0) {
          // Blondynka
          ctx.fillStyle = "#FFD700";
          ctx.beginPath();
          ctx.arc(sx, -92, 11, Math.PI, 0); // Grzywka
          ctx.fill();
          ctx.fillRect(sx - 11, -92, 4, 15); // Bok lewy
          ctx.fillRect(sx + 7, -92, 4, 15); // Bok prawy
        } else if (i === 1) {
          // Brunetka
          ctx.fillStyle = "#1a1a1a";
          ctx.beginPath();
          ctx.arc(sx, -92, 11, Math.PI * 1.1, Math.PI * 1.9);
          ctx.fill();
          ctx.fillRect(sx - 11, -92, 5, 22); // Długie włosy lewe
          ctx.fillRect(sx + 6, -92, 5, 22); // Długie włosy prawe
        }
        // i === 2 jest łysy, nic nie rysujemy

        // --- TWARZ (Oczy i Miny) ---
        ctx.fillStyle = "#3e2723";
        ctx.beginPath();
        ctx.arc(sx - 3, -93, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(sx + 3, -93, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#3e2723";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (player.state === "SCORES") {
          ctx.arc(sx, -89, 5, 0.1 * Math.PI, 0.9 * Math.PI, false); // Uśmiech
        } else {
          ctx.arc(sx, -83, 4, 1.1 * Math.PI, 1.9 * Math.PI, false); // Smutek
        }
        ctx.stroke();

        // --- NOTY ---
        if (player.state === "SCORES") {
          ctx.fillStyle = "white";
          ctx.fillRect(sx - 22, -145, 44, 30);
          ctx.strokeStyle = "black";
          ctx.lineWidth = 2;
          ctx.strokeRect(sx - 22, -145, 44, 30);
          ctx.fillStyle = "black";
          ctx.font = "bold 18px Arial";
          ctx.textAlign = "center";
          ctx.fillText(player.scores[i], sx, -123);
        }
      }
      ctx.restore();

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
      <div className="ski-title">ZAKOPANE ❄️ WIADOMO - CZEKAĆ ... ❄️</div>
      <canvas ref={canvasRef} />
      <div className="ski-status">
        <span className="retro-blink">PRÓBA SKOKU NA PODWYŻKĘ</span>
      </div>
    </div>
  );
};

export default XmasSkiJump;
