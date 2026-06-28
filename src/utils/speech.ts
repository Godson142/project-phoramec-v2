/**
 * Utility for the Audio Assist Engine.
 * Uses window.speechSynthesis to read text aloud for accessibility.
 */

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function speakText(text: string) {
  if (typeof window === 'undefined') return;

  // Check if screen reader is enabled (defaults to true)
  const isEnabled = localStorage.getItem('phoramec_screen_reader_enabled') !== 'false';
  if (!isEnabled) return;

  if (!window.speechSynthesis) return;

  // Cancel any active speech
  window.speechSynthesis.cancel();

  // Create new utterance
  activeUtterance = new SpeechSynthesisUtterance(text);
  
  // Set voice options for maximum clarity
  activeUtterance.rate = 0.95; // Slightly slower for clear comprehension
  activeUtterance.pitch = 1.0;
  
  // Try to find an English voice
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(v => v.lang.startsWith('en-'));
  if (englishVoice) {
    activeUtterance.voice = englishVoice;
  }

  window.speechSynthesis.speak(activeUtterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
