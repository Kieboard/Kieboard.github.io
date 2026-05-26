// Terminal Audio Manager
// Keyboard click sounds only

const TerminalAudio = {
  enabled: true,
  keyClickSounds: [],
  currentKeyClickIndex: 0,

  init() {
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

    // Set up keyboard input listener
    this.setupKeyboardListener();

    // Set up mute toggle
    this.setupMuteToggle();
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
