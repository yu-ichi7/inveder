class PomodoroTimer {
    constructor() {
        this.workMinutes = 25;
        this.breakMinutes = 5;
        this.isWorking = true;
        this.isRunning = false;
        this.interval = null;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeElements() {
        this.timerElement = document.getElementById('timer');
        this.startButton = document.getElementById('start');
        this.stopButton = document.getElementById('stop');
        this.resetButton = document.getElementById('reset');
        this.workTimeInput = document.getElementById('work-time');
        this.breakTimeInput = document.getElementById('break-time');
    }

    initializeEventListeners() {
        this.startButton.addEventListener('click', () => this.start());
        this.stopButton.addEventListener('click', () => this.stop());
        this.resetButton.addEventListener('click', () => this.reset());
        this.workTimeInput.addEventListener('change', () => this.updateWorkTime());
        this.breakTimeInput.addEventListener('change', () => this.updateBreakTime());
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.interval = setInterval(() => this.tick(), 1000);
        
        this.startButton.disabled = true;
        this.stopButton.disabled = false;
        this.resetButton.disabled = false;
    }

    stop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        clearInterval(this.interval);
        
        this.startButton.disabled = false;
        this.stopButton.disabled = true;
        this.resetButton.disabled = false;
    }

    reset() {
        this.stop();
        this.isWorking = true;
        this.workMinutes = parseInt(this.workTimeInput.value) || 25;
        this.breakMinutes = parseInt(this.breakTimeInput.value) || 5;
        this.updateDisplay();
        
        this.startButton.disabled = false;
        this.stopButton.disabled = true;
        this.resetButton.disabled = true;
    }

    updateWorkTime() {
        this.workMinutes = parseInt(this.workTimeInput.value) || 25;
        if (!this.isRunning) {
            this.updateDisplay();
        }
    }

    updateBreakTime() {
        this.breakMinutes = parseInt(this.breakTimeInput.value) || 5;
    }

    tick() {
        let minutes = this.isWorking ? this.workMinutes : this.breakMinutes;
        let seconds = 0;

        if (minutes === 0 && seconds === 0) {
            this.isWorking = !this.isWorking;
            minutes = this.isWorking ? this.workMinutes : this.breakMinutes;
            this.updateDisplay();
            this.playSound();
        } else if (seconds === 0) {
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }

        this.updateDisplay(minutes, seconds);
    }

    updateDisplay(minutes = null, seconds = null) {
        if (minutes === null) {
            minutes = this.isWorking ? this.workMinutes : this.breakMinutes;
            seconds = 0;
        }
        
        this.timerElement.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    playSound() {
        const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
        audio.play();
    }
}

// インスタンスの作成
const pomodoroTimer = new PomodoroTimer();
