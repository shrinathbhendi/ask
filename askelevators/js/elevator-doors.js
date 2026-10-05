/**
 * ASK ELEVATORS - Elevator Doors Animation Component (JavaScript Canvas)
 * Client-side animation replacing Python GIF generator scripts.
 */

class ElevatorDoorsAnimation {
    constructor(canvasOrContainer, options = {}) {
        this.container = typeof canvasOrContainer === 'string' ? document.querySelector(canvasOrContainer) : canvasOrContainer;
        if (!this.container) return;

        this.width = options.width || 500;
        this.height = options.height || 320;
        
        this.initCanvas();
        this.openFactor = 0;
        this.state = 'closed'; // closed, opening, open, closing
        this.pauseTimer = 0;
        
        this.animate = this.animate.bind(this);
        this.start();
    }

    initCanvas() {
        if (this.container.tagName && this.container.tagName.toLowerCase() === 'canvas') {
            this.canvas = this.container;
        } else {
            this.canvas = document.createElement('canvas');
            this.container.appendChild(this.canvas);
        }
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
    }

    drawInterior(ctx) {
        const w = this.width;
        const h = this.height;

        const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
        bgGradient.addColorStop(0, '#2d333b');
        bgGradient.addColorStop(0.5, '#1e2228');
        bgGradient.addColorStop(1, '#16191d');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = '#c8a064';
        ctx.lineWidth = 3;
        ctx.strokeRect(20, 20, w - 40, h - 40);

        const lightGlow = ctx.createLinearGradient(0, 20, 0, 80);
        lightGlow.addColorStop(0, 'rgba(255, 245, 200, 0.4)');
        lightGlow.addColorStop(1, 'rgba(255, 245, 200, 0)');
        ctx.fillStyle = lightGlow;
        ctx.fillRect(20, 20, w - 40, 60);
    }

    drawDoorPanel(ctx, x, y, width, height, isLeft) {
        ctx.save();
        ctx.translate(x, y);

        const steelGrad = ctx.createLinearGradient(0, 0, width, 0);
        if (isLeft) {
            steelGrad.addColorStop(0, '#b4b9c0');
            steelGrad.addColorStop(0.7, '#d5dadf');
            steelGrad.addColorStop(1, '#a0a5ad');
        } else {
            steelGrad.addColorStop(0, '#a0a5ad');
            steelGrad.addColorStop(0.3, '#d5dadf');
            steelGrad.addColorStop(1, '#b4b9c0');
        }
        ctx.fillStyle = steelGrad;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        for (let i = 0; i < height; i += 4) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }

        const handleX = isLeft ? width - 28 : 14;
        ctx.fillStyle = '#d5dadf';
        ctx.strokeStyle = '#787d82';
        ctx.lineWidth = 1;
        ctx.fillRect(handleX, 40, 14, height - 80);
        ctx.strokeRect(handleX, 40, 14, height - 80);

        const seamX = isLeft ? width - 4 : 0;
        ctx.fillStyle = '#282a2d';
        ctx.fillRect(seamX, 0, 4, height);

        ctx.restore();
    }

    render() {
        const w = this.width;
        const h = this.height;
        const halfW = w / 2;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, w, h);

        this.drawInterior(ctx);

        const shift = this.openFactor * halfW;
        const leftDoorX = -shift;
        const rightDoorX = halfW + shift;

        this.drawDoorPanel(ctx, leftDoorX, 0, halfW, h, true);
        this.drawDoorPanel(ctx, rightDoorX, 0, halfW, h, false);

        if (this.openFactor > 0 && this.openFactor < 1) {
            const shadowAlpha = 0.35 * (1 - this.openFactor);
            ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
            ctx.fillRect(halfW - shift, 0, 12, h);
            ctx.fillRect(halfW + shift - 12, 0, 12, h);
        }
    }

    update() {
        const step = 0.02;

        if (this.state === 'closed') {
            this.pauseTimer++;
            if (this.pauseTimer > 40) {
                this.state = 'opening';
                this.pauseTimer = 0;
            }
        } else if (this.state === 'opening') {
            this.openFactor += step;
            if (this.openFactor >= 1) {
                this.openFactor = 1;
                this.state = 'open';
            }
        } else if (this.state === 'open') {
            this.pauseTimer++;
            if (this.pauseTimer > 60) {
                this.state = 'closing';
                this.pauseTimer = 0;
            }
        } else if (this.state === 'closing') {
            this.openFactor -= step;
            if (this.openFactor <= 0) {
                this.openFactor = 0;
                this.state = 'closed';
            }
        }
    }

    animate() {
        this.update();
        this.render();
        requestAnimationFrame(this.animate);
    }

    start() {
        requestAnimationFrame(this.animate);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvasElems = document.querySelectorAll('.elevator-canvas');
    canvasElems.forEach(canvas => new ElevatorDoorsAnimation(canvas));
});
