import React, { useRef, useEffect } from "react";

const Breakout = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    // Paddle settings
    let paddleWidth = 100;
    let paddleHeight = 10;
    let paddleX = (WIDTH - paddleWidth) / 2;
    let paddleSpeed = 7;
    let leftArrowPressed = false;
    let rightArrowPressed = false;

    // Ball settings
    let ballX = WIDTH / 2;
    let ballY = HEIGHT - 40;
    let ballRadius = 10;
    let ballDX = 4;
    let ballDY = -4;

    // Bricks settings
    const brickRows = 5;
    const brickCols = 8;
    const brickWidth = WIDTH / brickCols;
    const brickHeight = 20;
    const bricks = [];
    for (let row = 0; row < brickRows; row++) {
      bricks[row] = [];
      for (let col = 0; col < brickCols; col++) {
        bricks[row][col] = { x: col * brickWidth, y: row * brickHeight, visible: true };
      }
    }

    // Game loop
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      // Draw paddle
      ctx.fillStyle = "white";
      ctx.fillRect(paddleX, HEIGHT - paddleHeight - 10, paddleWidth, paddleHeight);

      // Draw ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();

      // Draw bricks
      bricks.forEach((row) => {
        row.forEach((brick) => {
          if (brick.visible) {
            ctx.fillStyle = "blue";
            ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);
          }
        });
      });

      // Paddle movement
      if (leftArrowPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
      }
      if (rightArrowPressed && paddleX < WIDTH - paddleWidth) {
        paddleX += paddleSpeed;
      }

      // Ball movement
      ballX += ballDX;
      ballY += ballDY;

      // Wall collisions
      if (ballX + ballRadius > WIDTH || ballX - ballRadius < 0) ballDX *= -1;
      if (ballY - ballRadius < 0) ballDY *= -1;

      // Paddle collision (bounce off the paddle)
      if (
        ballY + ballRadius >= HEIGHT - paddleHeight - 10 && // Ball is near the paddle
        ballX >= paddleX && // Ball is within paddle's left edge
        ballX <= paddleX + paddleWidth // Ball is within paddle's right edge
      ) {
        ballDY *= -1; // Ball bounces upwards
        ballY = HEIGHT - paddleHeight - 10 - ballRadius; // Prevent sticking to the paddle
      }

      // Reset ball when it hits the floor
      if (ballY - ballRadius > HEIGHT) {
        ballX = WIDTH / 2; // Reset ball to the center
        ballY = HEIGHT - 40;
        ballDY = -4; // Reset ball's upward movement
      }

      // Brick collision
      bricks.forEach((row) => {
        row.forEach((brick) => {
          if (brick.visible) {
            if (
              ballX > brick.x &&
              ballX < brick.x + brickWidth &&
              ballY - ballRadius < brick.y + brickHeight &&
              ballY + ballRadius > brick.y
            ) {
              ballDY *= -1;
              brick.visible = false;
            }
          }
        });
      });

      requestAnimationFrame(draw);
    };

    draw();

    // Paddle controls
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") leftArrowPressed = true;
      if (e.key === "ArrowRight") rightArrowPressed = true;
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft") leftArrowPressed = false;
      if (e.key === "ArrowRight") rightArrowPressed = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={600} style={{ background: "black" }}></canvas>
    </div>
  );
};

export default Breakout;
