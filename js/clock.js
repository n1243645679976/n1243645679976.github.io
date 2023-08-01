let timerInterval;
let currentPhase = "prepare";
let phaseTime = 0;
let cyclesLeft = 0;
let isPaused = false; // New variable to track the paused state
let startTime; // New variable to store the start time
let prepareTime; // Declare as global variables
let exerciseTime;
let restTime;
let cooldownTime;
let pausedTime = 0;

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
    prepareTime = parseInt(document.getElementById("prepareTime").value);
    exerciseTime = parseInt(document.getElementById("exerciseTime").value);
    restTime = parseInt(document.getElementById("restTime").value);
    cooldownTime = parseInt(document.getElementById("cooldownTime").value);
    cyclesLeft = parseInt(document.getElementById("cycles").value);

	isPaused = false; // Set isPaused to false to indicate the timer is not paused

	phaseTime = prepareTime;
	currentPhase = "prepare";

	timerInterval = setInterval(updateTimer, 100);
	if (!timerInterval) { // Only reset the timer if it's not already running
		timerInterval = setInterval(updateTimer, 100);
	}


	startTime = new Date(); // Store the start time

}


function stopTimer() {
    clearInterval(timerInterval);
}
function pauseTimer() {
    clearInterval(timerInterval);
    isPaused = true; // Set isPaused to true to indicate the timer is paused
	pausedTime = new Date(); // Store the timestamp when the timer is paused
}
function continueTimer() {
    if (isPaused) {
      isPaused = false;
      const currentTime = new Date();
      const timePaused = Math.floor((currentTime - pausedTime) / 1000); // Calculate time passed during pause in seconds
      startTime = new Date(startTime.getTime() + timePaused * 1000); // Adjust the startTime by adding the paused time
      timerInterval = setInterval(updateTimer, 100);
    }
}
function updateTimer() {
	if (isPaused) return; // If timer is paused, do nothing and exit early

    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000); // Calculate elapsed time in seconds
    phaseTime = getRemainingTime(currentPhase, elapsedTime); // Calculate remaining time for the current phase


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
function getRemainingTime(phase, elapsedTime) {
	switch (phase) {
	  case "prepare":
		return Math.max(0, prepareTime - elapsedTime);
	  case "exercise":
		return Math.max(0, exerciseTime - elapsedTime);
	  case "rest":
		return Math.max(0, restTime - elapsedTime);
	  case "cooldown":
		return Math.max(0, cooldownTime - elapsedTime);
	  default:
		return 0;
	}
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
