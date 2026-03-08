import React, { useEffect, useRef } from 'react';

const MatrixBackground = ({ theme }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animationId;
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=<>?/\\';
        characters = characters.split('');

        const fontSize = 14;
        let columns;
        let drops = [];

        const setup = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            columns = canvas.width / fontSize;
            drops = [];
            for (let x = 0; x < columns; x++) {
                drops[x] = Math.random() * -100; // Randomize start positions for better look
            }
        };

        setup();

        let lastTime = 0;
        const fps = 25;
        const interval = 1000 / fps;

        const draw = (currentTime) => {
            animationId = requestAnimationFrame(draw);

            const deltaTime = currentTime - lastTime;
            if (deltaTime < interval) return;
            lastTime = currentTime - (deltaTime % interval);

            const fadeColor = theme === 'dark' ? 'rgba(10, 10, 12, 0.05)' : 'rgba(240, 240, 245, 0.1)';
            ctx.fillStyle = fadeColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = characters[Math.floor(Math.random() * characters.length)];

                const isCyan = Math.random() > 0.5;
                const color = theme === 'dark'
                    ? (isCyan ? 'rgba(0, 240, 255, 0.15)' : 'rgba(138, 43, 226, 0.15)')
                    : (isCyan ? 'rgba(0, 150, 255, 0.1)' : 'rgba(100, 43, 200, 0.1)');

                ctx.fillStyle = color;
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        animationId = requestAnimationFrame(draw);

        const handleResize = () => {
            setup();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -5,
                pointerEvents: 'none'
            }}
        />
    );
};

export default React.memo(MatrixBackground);
