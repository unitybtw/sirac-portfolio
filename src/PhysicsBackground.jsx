import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const PhysicsBackground = ({ theme, isPaused }) => {
    const sceneRef = useRef(null);
    const engineRef = useRef(null);

    useEffect(() => {
        if (isPaused) return;

        // module aliases
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            MouseConstraint = Matter.MouseConstraint,
            Mouse = Matter.Mouse,
            Composite = Matter.Composite,
            Bodies = Matter.Bodies;

        // create engine
        const engine = Engine.create();
        engineRef.current = engine;

        // adjust gravity for a floating/slow effect
        engine.gravity.y = 0.15;

        // create renderer
        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                background: 'transparent',
                wireframes: false, // Solid glowing bodies
            }
        });

        const wallOptions = { isStatic: true, render: { visible: false } };
        const walls = [
            Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth * 2, 100, wallOptions), // Bottom
            Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight * 2, wallOptions), // Left
            Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight * 2, wallOptions) // Right
        ];

        Composite.add(engine.world, walls);

        const isDark = theme === 'dark';

        // Glowy neon colors
        const colors = isDark ? [
            { fill: 'rgba(0, 240, 255, 0.15)', stroke: '#00f0ff' }, // Cyan
            { fill: 'rgba(138, 43, 226, 0.15)', stroke: '#8a2be2' }, // Violet
            { fill: 'rgba(255, 102, 178, 0.15)', stroke: '#ff66b2' } // Pink
        ] : [
            { fill: 'rgba(0, 150, 255, 0.15)', stroke: '#0096ff' },
            { fill: 'rgba(100, 43, 200, 0.15)', stroke: '#642bc8' },
            { fill: 'rgba(255, 50, 150, 0.15)', stroke: '#ff3296' }
        ];

        // add some random drifting geometric shapes
        const shapes = [];
        const numShapes = window.innerWidth > 768 ? 40 : 20; // Less shapes on mobile

        for (let i = 0; i < numShapes; i++) {
            const radius = Math.random() * 25 + 15;
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * -window.innerHeight * 2; // Start way above screen so they fall

            const color = colors[Math.floor(Math.random() * colors.length)];

            const renderOptions = {
                fillStyle: color.fill,
                strokeStyle: color.stroke,
                lineWidth: 2
            };

            const type = Math.random();
            if (type > 0.6) {
                shapes.push(Bodies.circle(x, y, radius, { render: renderOptions, restitution: 0.9, friction: 0.05, density: 0.001 }));
            } else if (type > 0.3) {
                shapes.push(Bodies.rectangle(x, y, radius * 1.8, radius * 1.8, { render: renderOptions, restitution: 0.8, friction: 0.05, density: 0.001 }));
            } else {
                shapes.push(Bodies.polygon(x, y, Math.floor(Math.random() * 3) + 3, radius * 1.4, { render: renderOptions, restitution: 0.8, friction: 0.05, density: 0.001 }));
            }
        }

        Composite.add(engine.world, shapes);

        // add mouse control (so user can throw them around)
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.1,
                render: {
                    visible: false
                }
            }
        });

        Composite.add(engine.world, mouseConstraint);

        // keep the mouse in sync with rendering
        render.mouse = mouse;

        // Explode effect on click
        const handleMouseUp = () => {
            if (!mouseConstraint.body) {
                // Apply a radial explosion force to items around the mouse
                const mosPos = mouse.position;
                const bodies = Composite.allBodies(engine.world);
                for (let i = 0; i < bodies.length; i++) {
                    const body = bodies[i];
                    if (!body.isStatic) {
                        const mpos = body.position;
                        const dx = mpos.x - mosPos.x;
                        const dy = mpos.y - mosPos.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 300) {
                            const forceMag = 0.04 * body.mass * (300 - dist) / 300;
                            Matter.Body.applyForce(body, body.position, {
                                x: (dx / dist) * forceMag,
                                y: (dy / dist) * forceMag
                            });
                        }
                    }
                }
            }
        };

        window.addEventListener('mouseup', handleMouseUp);

        // Handle Resize
        const handleResize = () => {
            render.canvas.width = window.innerWidth;
            render.canvas.height = window.innerHeight;
            render.options.width = window.innerWidth;
            render.options.height = window.innerHeight;

            // Move bottom wall
            Matter.Body.setPosition(walls[0], { x: window.innerWidth / 2, y: window.innerHeight + 50 });
            Matter.Body.setPosition(walls[2], { x: window.innerWidth + 50, y: window.innerHeight / 2 });
        };

        window.addEventListener('resize', handleResize);

        // run the engine & renderer
        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mouseup', handleMouseUp);
            Render.stop(render);
            Runner.stop(runner);
            if (engineRef.current) {
                Composite.clear(engineRef.current.world, false);
                Engine.clear(engineRef.current);
            }
            if (render.canvas) render.canvas.remove();
        };
    }, [theme, isPaused]);

    return (
        <div
            ref={sceneRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -5,
                // We allow pointer events on the physics background so the user can flick the blocks!
            }}
        />
    );
};

export default PhysicsBackground;
