let timerInterval;
let currentPhase = "prepare";
let phaseTime = 0;
let cyclesLeft = 0;

function displayNotification(message) {
    if (Notification.permission === "granted") {
        new Notification(message);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                new Notification(message);
            }
        });
    }
}

function startTimer() {
    const prepareTime = parseInt(document.getElementById("prepareTime").value);
    const exerciseTime = parseInt(document.getElementById("exerciseTime").value);
    const restTime = parseInt(document.getElementById("restTime").value);
    const cooldownTime = parseInt(document.getElementById("cooldownTime").value);
    cyclesLeft = parseInt(document.getElementById("cycles").value);

    phaseTime = prepareTime;
    currentPhase = "prepare";

    timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimer() {
    phaseTime--;

    if (phaseTime === 0) {
        switch (currentPhase) {
            case "prepare":
                phaseTime = parseInt(document.getElementById("exerciseTime").value);
                currentPhase = "exercise";
                displayNotification("開始鍛鍊時間！");
                break;
            case "exercise":
                phaseTime = parseInt(document.getElementById("restTime").value);
                currentPhase = "rest";
                displayNotification("開始休息時間！");
                break;
            case "rest":
                cyclesLeft--;
                if (cyclesLeft === 0) {
                    phaseTime = parseInt(document.getElementById("cooldownTime").value);
                    currentPhase = "cooldown";
                    displayNotification("開始冷卻時間！");
                } else {
                    phaseTime = parseInt(document.getElementById("exerciseTime").value);
                    currentPhase = "exercise";
                    displayNotification("回到鍛鍊時間！");
                }
                break;
            case "cooldown":
                clearInterval(timerInterval);
                displayNotification("計時結束！");
                break;
        }
    }

    updateDisplay();
}

function updateDisplay() {
    const timerDisplay = document.getElementById("timerDisplay");
    timerDisplay.textContent = `${currentPhase.toUpperCase()}倒數計時: ${phaseTime} 秒`;
}

// Request permission for Notifications on page load
document.addEventListener("DOMContentLoaded", () => {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
});
