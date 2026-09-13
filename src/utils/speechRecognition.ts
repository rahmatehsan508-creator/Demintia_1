/**
 * Browser Speech Recognition wrapper for elderly hands-free voice navigation.
 */

type SpeechRecognitionInstance = any;

export interface VoiceListenerOptions {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (errorMessage: string) => void;
  onStart: () => void;
  onEnd: () => void;
}

export class VoiceCommander {
  private recognition: SpeechRecognitionInstance | null = null;
  private isListening = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-IN'; // Works well with Indian English & global English
      }
    }
  }

  isSupported(): boolean {
    return Boolean(this.recognition);
  }

  start(options: VoiceListenerOptions, langCode: string = 'en-IN'): void {
    if (!this.recognition) {
      options.onError("Speech recognition is not supported in this browser. You can still tap the buttons or type.");
      return;
    }

    if (this.isListening) {
      this.stop();
    }

    this.recognition.lang = langCode;

    this.recognition.onstart = () => {
      this.isListening = true;
      options.onStart();
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      options.onResult(text, Boolean(finalTranscript));
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      let msg = "Microphone stopped listening.";
      if (event.error === 'not-allowed') {
        msg = "Microphone access was blocked. Please allow microphone permission in your browser.";
      } else if (event.error === 'no-speech') {
        msg = "No speech was heard. Tap the microphone and speak again.";
      }
      options.onError(msg);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      options.onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn("Speech recognition start failed:", e);
      options.onError("Microphone is already active or busy.");
    }
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.isListening = false;
    }
  }
}

export const voiceCommander = new VoiceCommander();
