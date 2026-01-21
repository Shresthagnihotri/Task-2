// Stopwatch Class
class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.laps = [];
        this.lapCounter = 0;
    }

    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.timerInterval = setInterval(() => {
                this.elapsedTime = Date.now() - this.startTime;
                this.updateDisplay();
            }, 10);
            this.isRunning = true;
        }
    }

    pause() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
        }
    }

    reset() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.elapsedTime = 0;
        this.laps = [];
        this.lapCounter = 0;
        this.updateDisplay();
        this.clearLaps();
    }

    lap() {
        if (this.isRunning) {
            this.lapCounter++;
            const lapTime = this.elapsedTime;
            const previousLapTime = this.laps.length > 0 
                ? this.laps[this.laps.length - 1].totalTime 
                : 0;
            
            const currentLapTime = lapTime - previousLapTime;
            
            this.laps.push({
                number: this.lapCounter,
                lapTime: currentLapTime,
                totalTime: lapTime
            });
            
            this.displayLaps();
        }
    }

    clearLaps() {
        this.laps = [];
        this.lapCounter = 0;
        this.displayLaps();
    }

    formatTime(ms) {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);

        return {
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
            milliseconds: milliseconds.toString().padStart(2, '0')
        };
    }

    updateDisplay() {
        const time = this.formatTime(this.elapsedTime);
        
        document.querySelector('.hours').textContent = time.hours;
        document.querySelector('.minutes').textContent = time.minutes;
        document.querySelector('.seconds').textContent = time.seconds;
        document.querySelector('.milliseconds').textContent = `.${time.milliseconds}`;
        
        document.getElementById('lapCount').textContent = this.lapCounter;
    }

    displayLaps() {
        const lapsList = document.getElementById('lapsList');
        
        if (this.laps.length === 0) {
            lapsList.innerHTML = `
                <div class="no-laps">
                    <i class="fas fa-flag-checkered"></i>
                    <p>No lap times recorded yet</p>
                </div>
            `;
            return;
        }

        // Find fastest and slowest lap times
        let fastestLap = Infinity;
        let slowestLap = 0;
        
        this.laps.forEach(lap => {
            if (lap.lapTime < fastestLap) fastestLap = lap.lapTime;
            if (lap.lapTime > slowestLap) slowestLap = lap.lapTime;
        });

        let lapsHTML = '';
        
        this.laps.forEach(lap => {
            const lapTime = this.formatTime(lap.lapTime);
            const totalTime = this.formatTime(lap.totalTime);
            
            let lapClass = 'lap-item';
            if (lap.lapTime === fastestLap && this.laps.length > 1) {
                lapClass += ' fastest';
            } else if (lap.lapTime === slowestLap && this.laps.length > 1) {
                lapClass += ' slowest';
            }
            
            lapsHTML += `
                <div class="${lapClass}">
                    <div class="col-lap">Lap ${lap.number}</div>
                    <div class="col-time">${lapTime.minutes}:${lapTime.seconds}.${lapTime.milliseconds}</div>
                    <div class="col-total">${totalTime.hours}:${totalTime.minutes}:${totalTime.seconds}</div>
                </div>
            `;
        });

        // Reverse to show newest lap first
        lapsList.innerHTML = lapsHTML;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const stopwatch = new Stopwatch();
    
    // DOM Elements
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const lapBtn = document.getElementById('lapBtn');
    const resetBtn = document.getElementById('resetBtn');
    const clearLapsBtn = document.getElementById('clearLapsBtn');
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Event Listeners
    startBtn.addEventListener('click', () => {
        stopwatch.start();
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        lapBtn.disabled = false;
        startBtn.innerHTML = '<i class="fas fa-play"></i> Running';
    });
    
    pauseBtn.addEventListener('click', () => {
        stopwatch.pause();
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
    });
    
    lapBtn.addEventListener('click', () => {
        stopwatch.lap();
    });
    
    resetBtn.addEventListener('click', () => {
        stopwatch.reset();
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        lapBtn.disabled = true;
        startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
    });
    
    clearLapsBtn.addEventListener('click', () => {
        stopwatch.clearLaps();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                if (stopwatch.isRunning) {
                    pauseBtn.click();
                } else {
                    startBtn.click();
                }
                break;
            case 'KeyL':
                if (!lapBtn.disabled) {
                    lapBtn.click();
                }
                break;
            case 'KeyR':
                resetBtn.click();
                break;
            case 'KeyC':
                if (document.activeElement !== startBtn && 
                    document.activeElement !== pauseBtn && 
                    document.activeElement !== lapBtn && 
                    document.activeElement !== resetBtn) {
                    clearLapsBtn.click();
                }
                break;
        }
    });
    
    // Add keyboard shortcut hints
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.className = 'shortcuts-info';
    shortcutsInfo.innerHTML = `
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.9rem;">
            <p><i class="fas fa-keyboard"></i> Keyboard Shortcuts: 
            <kbd>Space</kbd> Start/Pause • 
            <kbd>L</kbd> Lap • 
            <kbd>R</kbd> Reset • 
            <kbd>C</kbd> Clear Laps</p>
        </div>
    `;
    
    document.querySelector('.laps-container').insertAdjacentElement('afterend', shortcutsInfo);
    
    // Initialize display
    stopwatch.updateDisplay();
});
