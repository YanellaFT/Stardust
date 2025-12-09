document.addEventListener("DOMContentLoaded", () => {
    //color pallete
    const colors = [ //no rgb allowed
        '#ff0000ff',
        '#ff9100ff',
        '#e5ff00ff',
        '#33ff00ff',
        '#0051ffff',
        '#7F3C8D',
        'rgb(214, 142, 187)',
        'rgb(214, 213, 142)',
        'rgb(214, 174, 142)',
        'rgb(154, 214, 142)',
        'rgb(142, 161, 214)',
    ];

    //Define an SVG template for a star shape
    //path uses coordinates to draw a 5-pointed star
    //fill="currentColor" makes it use the current text color
    // SVG template for a circle sparkle
    const circleSVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="5" fill="currentColor"/>
    </svg>`;

    //store cursor position
    const cursorHistory = [];
    const maxHistory = 15;
    let lastEmitTime = 0; //milliseconds

    //Listen for mouse movement events
    document.addEventListener('mousemove', (e) => {
        //current timestamp in milliseconds
        const now = Date.now();

        //Add the current cursor data to the history array: stores x/y position, timestamp, and velocity
        cursorHistory.push({ // e. is event
            x: e.clientX, //cursor x position
            y: e.clientY, //cursor y position
            time: now, //current timestamp
            vx: e.movementX, //cursor velocity x
            vy: e.movementY //cursor velocity y
        });

        //Remove old positions
        if (cursorHistory.length > maxHistory) {
            cursorHistory.shift(); //removes oldest (first) element in array
        }

        //CREATE SPARKLESSS 
        const speed = Math.sqrt((e.movementX)**2 + (e.movementY)**2);
        const sparkleCount = Math.min(20, Math.floor(speed/3));

        if (now - lastEmitTime > 0) {
            for ( let i = 0; i < sparkleCount; i++) {
                createSparkle(
                    e.clientX + (Math.random()-0.5)*20,
                    e.clientY + (Math.random()-0.5)*20,
                    e.movementX * 0.2,
                    e.movementY * 0.2
                );
            }
            lastEmitTime = now;
        }
    });

    function createSparkle(x, y, vx = 0, vy = 0) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';

        //properties
        const size = 8 + Math.random() * 12;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = 500 + Math.random() * 500;
        const rotation = Math.random() * 360;
        const delay = Math.random() * 10;

        //style
        sparkle.style.width = `${size}px`; // ${} converts to string
        sparkle.style.height = `${size}px`;
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.color = color;
        sparkle.style.animationDuration = `${duration}ms`;
        sparkle.style.animationDelay = `${delay}ms`;
        sparkle.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

    //sparkle svg (now a circle)
    sparkle.innerHTML = circleSVG;

        //physics
        let currentX = x;
        let currentY = y;
        let currentVx = vx + (Math.random()-0.5)*3;
        let currentVy = vy + (Math.random()-0.5)*3;
        const friction = 0.93;

        //animation for physics
        const animate = () => {
            currentX += currentVx;
            currentY += currentVy;
            currentVx *= friction;
            currentVy *= friction;

            //set position
            sparkle.style.left = `${currentX}px`;
            sparkle.style.top = `${currentY}px`;

            //continue animation if sparkle is still visible
            if (parseFloat(sparkle.style.opacity) > 0.01) {
                requestAnimationFrame(animate);
            }
        };

        document.body.appendChild(sparkle); //adds another sparkle to make visible on page
        requestAnimationFrame(animate);

        //remove after animation
        setTimeout(() => {
            sparkle.remove();
        }, duration + delay);
    }

  //Hide default cursor
//  document.addEventListener('mouseenter', () => {
//    document.body.style.cursor = 'none';
//  });
//  document.addEventListener('mouseleave', () => {
//    document.body.style.cursor = 'default';
//  });

});

