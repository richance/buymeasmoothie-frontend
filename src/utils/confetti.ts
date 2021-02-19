import confetti from 'canvas-confetti';

const colors = ['#FFFF51', '#FFB532', '#3D8BFC', '#F43368'];

export default function doubleConfetti() {
    confetti({
        particleCount: 100,
        angle: 60,
        spread: 50,
        origin: { x: 0 },
        colors,
    });
    confetti({
        particleCount: 100,
        angle: 120,
        spread: 50,
        origin: { x: 1 },
        colors,
    });
}
