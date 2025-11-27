/*******************************************************************************
 *  RESPONSIVE SPIN WHEEL — FULL SCRIPT
 *  (2025.11 완전체 / 반응형 적용 + 극적 연출 + 12시 포인터 + 6시 당첨 보정)
 ******************************************************************************/

// ====== STEP ELEMENTS ======
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const labelsContainer = document.getElementById("labelsContainer");

// ====== GLOBAL STATE ======
let count = 6;
let angle = 0;
let spinning = false;
let items = [];

let CX = 200;
let CY = 200;
let RADIUS = 190;
let POINTER_H = 25;
let POINTER_GAP = 6;

// ====== COUNT CONTROL ======
document.getElementById("btnPlus").onclick = () => {
    if (count < 10) {
        count++;
        document.getElementById("itemCount").textContent = count;
    }
};

document.getElementById("btnMinus").onclick = () => {
    if (count > 2) {
        count--;
        document.getElementById("itemCount").textContent = count;
    }
};

document.getElementById("btnStart").onclick = () => {
    step1.classList.add("hidden");
    step2.classList.remove("hidden");
    initWheel();
};

document.getElementById("backBtn").onclick = () => {
    step2.classList.add("hidden");
    step1.classList.remove("hidden");
};

document.getElementById("retryBtn").onclick = () => {
    step3.classList.add("hidden");
    step2.classList.remove("hidden");
};

document.getElementById("resetBtn").onclick = () => {
    location.reload();
};

// ====== INITIALIZE WHEEL ======
function initWheel() {
    labelsContainer.innerHTML = "";
    items = Array(count).fill("");

    resizeCanvas();
    drawWheel();
    createLabelInputs();
}

// ====== RESPONSIVE CANVAS ======
function resizeCanvas() {
    const newSize = Math.min(window.innerWidth * 0.7, 450);

    canvas.width = newSize;
    canvas.height = newSize;

    CX = newSize / 2;
    CY = newSize / 2;
    RADIUS = newSize / 2 - 10;

    POINTER_H = newSize * 0.06;   // 포인터 크기 비율
    POINTER_GAP = newSize * 0.015;

    drawWheel();
    updateLabelPositions();
}

// 창 크기 바뀌면 자동 리사이즈
window.addEventListener("resize", () => {
    resizeCanvas();
});

// ====== LABEL INPUT CREATION ======
function createLabelInputs() {
    const r = RADIUS * 0.68;   // 입력칸 반경

    for (let i = 0; i < count; i++) {
        const theta = (360 / count) * (i + 0.5) * Math.PI / 180 + angle * Math.PI / 180;

        const x = CX + r * Math.cos(theta);
        const y = CY + r * Math.sin(theta);

        const div = document.createElement("div");
        div.className = "labelInput";
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;

        const input = document.createElement("input");
        input.value = `옵션${i + 1}`;
        input.oninput = () => items[i] = input.value;

        div.appendChild(input);
        labelsContainer.appendChild(div);
    }
}

function updateLabelPositions() {
    const r = RADIUS * 0.68;
    const divs = document.querySelectorAll(".labelInput");

    divs.forEach((div, i) => {
        const theta = (360 / count) * (i + 0.5) * Math.PI / 180 + angle * Math.PI / 180;

        div.style.left = `${CX + r * Math.cos(theta)}px`;
        div.style.top  = `${CY + r * Math.sin(theta)}px`;
    });
}

// ====== DRAW WHEEL ======
function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const colors = ["#ff7675", "#ffeaa7", "#55efc4", "#74b9ff", "#a29bfe", "#fab1a0"];

    // --- Wheel Slices ---
    for (let i = 0; i < count; i++) {
        const start = (angle + (360 / count) * i) * Math.PI / 180;
        const end   = (angle + (360 / count) * (i + 1)) * Math.PI / 180;

        ctx.beginPath();
        ctx.moveTo(CX, CY);
        ctx.arc(CX, CY, RADIUS, start, end);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();

        ctx.strokeStyle = "#444";
        ctx.lineWidth = canvas.width * 0.003;
        ctx.stroke();
    }

    // --- Pointer (12시 방향 역삼각형) ---
    const topY = CY - RADIUS;

    const tipX = CX;
    const tipY = topY - POINTER_GAP + POINTER_H;

    const leftX  = CX - POINTER_H * 0.6;
    const leftY  = topY - POINTER_GAP;

    const rightX = CX + POINTER_H * 0.6;
    const rightY = topY - POINTER_GAP;

    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(leftX, leftY);
    ctx.lineTo(rightX, rightY);
    ctx.closePath();

    ctx.fillStyle = "#e74c3c";
    ctx.fill();
}

// ====== SPIN BUTTON ======
document.getElementById("spinBtn").onclick = spin;

// ====== SPIN WITH DRAMA ======
// function spin() {
//     if (spinning) return;
//     spinning = true;

//     let speed = Math.random() * 20 + 30;
//     const decel = 0.10;

//     let lastTick = 0;
//     const tickGap = 12;

//     function rotate() {
//         angle += speed;
//         drawWheel();
//         updateLabelPositions();

//         // // tick-tick sound
//         // const tick = Math.floor(angle / tickGap);
//         // if (tick !== lastTick) {
//         //     lastTick = tick;
//         //     playTick();
//         // }

//         if (speed > 0) {
//             speed -= decel;
//             requestAnimationFrame(rotate);
//         } else {
//             spinning = false;
//             finalizeStopping();
//         }
//     }
//     rotate();
// }

function spin() {
    if (spinning) return;
    spinning = true;

    let speed = Math.random() * 20 + 25;
    const decel = 0.12;

    function rotate() {
        angle += speed;
        drawWheel();
        updateLabelPositions();

        if (speed > 0) {
            speed -= decel;
            requestAnimationFrame(rotate);
        } else {
            spinning = false;
            showResult();
        }
    }

    rotate();
}

// (option) Tick sound
function playTick() {
    // 효과음 넣고 싶으면 여기에 audio.play()
}

// ====== SHAKE EFFECT ======
// function finalizeStopping() {
//     const original = angle;

//     let shake = 4;
//     let counter = 0;

//     function shakeAnim() {
//         if (counter < 6) {
//             angle = original + (counter % 2 === 0 ? shake : -shake);
//             drawWheel();
//             updateLabelPositions();
//             shake *= 0.5;
//             counter++;
//             requestAnimationFrame(shakeAnim);
//         } else {
//             angle = original;
//             drawWheel();
//             updateLabelPositions();
//             showResult();
//         }
//     }
//     shakeAnim();
// }

// ====== RESULT (6시 방향 보정 유지) ======
function showResult() {
    let deg = (angle % 360 + 360) % 360;
    const slice = 360 / count;

    // 6시 방향 보정
    const pointerDeg = (360 - deg + 90 + 180) % 360;

    const idx = Math.floor(pointerDeg / slice);

    step2.classList.add("hidden");
    step3.classList.remove("hidden");

    document.getElementById("finalResult").textContent = `"${items[idx]}"`;
}
