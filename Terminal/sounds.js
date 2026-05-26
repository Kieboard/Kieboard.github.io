// Terminal Audio Manager
// CRT hum ambient sound + keyboard click feedback

const TerminalAudio = {
  enabled: true,
  ambientSound: null,
  keyClickSounds: [],
  currentKeyClickIndex: 0,

  init() {
    // Load continuous CRT hum sound
    this.ambientSound = new Audio('Terminal/sounds/ambient/crt-hum-loop.mp3');
    this.ambientSound.volume = 0.3;
    this.ambientSound.loop = true;

    // Load keyboard click sounds
    const keyClickFiles = [
      'Terminal/sounds/keyboard/key-1.mp3',
      'Terminal/sounds/keyboard/key-2.mp3',
      'Terminal/sounds/keyboard/key-3.mp3',
      'Terminal/sounds/keyboard/key-4.mp3'
    ];

    keyClickFiles.forEach(file => {
      const audio = new Audio(file);
      audio.volume = 0.5;
      this.keyClickSounds.push(audio);
    });

    // Set up mute toggle
    this.setupMuteToggle();

    // Set up keyboard input listener
    this.setupKeyboardListener();

    // Set up terminal open/close handlers
    this.setupTerminalHandlers();
  },

  startAmbientSound() {
    if (this.enabled && this.ambientSound) {
      this.ambientSound.currentTime = 0;
      this.ambientSound.play().catch(err => {
        console.log('Ambient sound play failed:', err.message);
      });
    }
  },

  stopAmbientSound() {
    if (this.ambientSound) {
      this.ambientSound.pause();
      this.ambientSound.currentTime = 0;
    }
  },

  playKeyClick() {
    if (this.enabled && this.keyClickSounds.length > 0) {
      const sound = this.keyClickSounds[this.currentKeyClickIndex];
      this.currentKeyClickIndex = (this.currentKeyClickIndex + 1) % this.keyClickSounds.length;

      // Reset and play
      sound.currentTime = 0;
      sound.play().catch(err => {
        // Silently fail if audio can't play
      });
    }
  },

  setupTerminalHandlers() {
    // Start ambient sound when terminal opens
    const originalLaunchTerminal = window.launchTerminal;
    if (originalLaunchTerminal) {
      window.launchTerminal = () => {
        this.startAmbientSound();
        return originalLaunchTerminal.apply(this, arguments);
      };
    }

    // Stop ambient sound when terminal closes
    document.addEventListener('click', (e) => {
      if (e.target?.id === 'term-close-btn' || e.target?.closest('#term-close-btn')) {
        this.stopAmbientSound();
      }
    }, true);
  },

  setupKeyboardListener() {
    const cmdInput = document.getElementById('cmd-input');
    if (cmdInput) {
      cmdInput.addEventListener('keydown', (e) => {
        // Play sound on actual key presses (not special keys like Ctrl, Shift, etc)
        if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete') {
          this.playKeyClick();
        }
      });
    }
  },

  setupMuteToggle() {
    // Listen for mute command from Terminal
    window.addEventListener('terminalMute', () => {
      this.enabled = !this.enabled;
      this.updateMuteButton();
      if (!this.enabled) {
        this.stopAmbientSound();
      }
    });

    // Set up mute button - retry if not found immediately
    const setupButton = () => {
      const muteBtn = document.getElementById('term-mute-btn');
      if (muteBtn) {
        muteBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.toggleMute();
        });
      } else {
        // Retry in 100ms if button not found
        setTimeout(setupButton, 100);
      }
    };
    setupButton();
  },

  toggleMute() {
    this.enabled = !this.enabled;
    this.updateMuteButton();
    if (!this.enabled) {
      this.stopAmbientSound();
    }
    return this.enabled ? 'Sound enabled' : 'Sound disabled';
  },

  updateMuteButton() {
    const muteBtn = document.getElementById('term-mute-btn');
    if (muteBtn) {
      if (this.enabled) {
        muteBtn.classList.remove('muted');
        muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        muteBtn.title = 'Mute sound';
      } else {
        muteBtn.classList.add('muted');
        muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        muteBtn.title = 'Unmute sound';
      }
    }
  }
};

// Expose TerminalAudio globally for onclick handlers
window.TerminalAudio = TerminalAudio;

// Initialize audio when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    TerminalAudio.init();
    TerminalAudio.updateMuteButton();
  });
} else {
  TerminalAudio.init();
  TerminalAudio.updateMuteButton();
}
