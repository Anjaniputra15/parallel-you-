"use client";

import { useEffect, useState, useRef } from "react";

interface VoiceCommand {
  command: string;
  action: () => void;
  aliases?: string[];
}

interface UseVoiceCommandsProps {
  commands: VoiceCommand[];
  enabled: boolean;
}

export function useVoiceCommands({ commands, enabled }: UseVoiceCommandsProps) {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .toLowerCase()
        .trim();

      setLastCommand(transcript);

      // Match command
      for (const cmd of commands) {
        const allCommands = [cmd.command, ...(cmd.aliases || [])];
        if (allCommands.some((c) => transcript.includes(c.toLowerCase()))) {
          cmd.action();
          break;
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Voice command error:", event.error);
      if (event.error === "no-speech") {
        // Restart if no speech detected
        recognition.stop();
        setTimeout(() => recognition.start(), 1000);
      }
    };

    recognition.onend = () => {
      if (enabled) {
        // Auto-restart if still enabled
        setTimeout(() => recognition.start(), 500);
      }
      setIsListening(false);
    };

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current = recognition;
    recognition.start();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [commands, enabled]);

  return {
    isListening,
    lastCommand,
  };
}
