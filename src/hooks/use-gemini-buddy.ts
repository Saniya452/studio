'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { generateOpeningPrompt } from '@/ai/flows/generate-opening-prompt';
import { generateRobotResponse } from '@/ai/flows/generate-robot-response';
import { useToast } from './use-toast';

type Status = 'idle' | 'listening' | 'thinking' | 'speaking';
type Message = {
  author: 'user' | 'robot';
  text: string;
};

// Type guard for SpeechRecognition
const hasSpeechRecognition = (): boolean =>
  typeof window !== 'undefined' &&
  ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

export function useGeminiBuddy() {
  const [status, setStatus] = useState<Status>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [subtitle, setSubtitle] = useState('');
  const { toast } = useToast();

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messageQueueRef = useRef<string[]>([]);
  const isSpeakingRef = useRef(false);

  const processSpeechQueue = useCallback(() => {
    if (isSpeakingRef.current || messageQueueRef.current.length === 0) {
      return;
    }

    isSpeakingRef.current = true;
    const textToSpeak = messageQueueRef.current.shift();
    if (!textToSpeak) {
        isSpeakingRef.current = false;
        return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.onstart = () => {
      setStatus('speaking');
      setSubtitle(textToSpeak);
    };
    utterance.onend = () => {
      setStatus('idle');
      setSubtitle('');
      isSpeakingRef.current = false;
      processSpeechQueue();
    };
    utterance.onerror = (event) => {
        console.error('SpeechSynthesis Error:', event.error);
        toast({ title: 'Speech Error', description: 'Could not play audio.', variant: 'destructive' });
        isSpeakingRef.current = false;
        processSpeechQueue();
    }
    window.speechSynthesis.speak(utterance);
  }, [toast]);

  const speak = useCallback((text: string) => {
    messageQueueRef.current.push(text);
    if (!isSpeakingRef.current) {
      processSpeechQueue();
    }
  }, [processSpeechQueue]);

  useEffect(() => {
    const initialize = async () => {
        try {
            const { openingPrompt } = await generateOpeningPrompt();
            setMessages([{ author: 'robot', text: openingPrompt }]);
            speak(openingPrompt);
        } catch (error) {
            console.error("Failed to generate opening prompt:", error);
            const fallbackPrompt = "Hello! I'm Gemini Buddy. How can I help you today? I can understand your voice and talk back.";
            setMessages([{ author: 'robot', text: fallbackPrompt }]);
            speak(fallbackPrompt);
        }
    };
    initialize();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speak]);


  useEffect(() => {
    if (!hasSpeechRecognition()) {
      toast({
        title: 'Browser Not Supported',
        description: 'Speech recognition is not supported in this browser.',
        variant: 'destructive',
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    recognitionRef.current = rec;
    
    rec.continuous = false;
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setMessages(prev => [...prev, { author: 'user', text: transcript }]);
        setStatus('thinking');
        try {
          const { response } = await generateRobotResponse({ query: transcript });
          setMessages(prev => [...prev, { author: 'robot', text: response }]);
          speak(response);
        } catch (error) {
          console.error("Error generating robot response:", error);
          const errorMsg = "I'm sorry, I had some trouble thinking. Could you try again?";
          setMessages(prev => [...prev, { author: 'robot', text: errorMsg }]);
          speak(errorMsg);
          setStatus('idle');
        }
      }
    };

    rec.onerror = (event) => {
      console.error('Speech Recognition Error:', event.error);
      if(event.error !== 'no-speech') {
        toast({ title: 'Mic Error', description: `Could not listen: ${event.error}`, variant: 'destructive' });
      }
      setStatus('idle');
    };
    
    rec.onend = () => {
        if(status === 'listening') {
            setStatus('idle');
        }
    };

    return () => {
        rec.stop();
    }
  }, [speak, status, toast]);

  const startConversation = () => {
    const rec = recognitionRef.current;
    if (!rec) return;

    if (status === 'listening') {
      rec.stop();
      setStatus('idle');
    } else {
      try {
        rec.start();
        setStatus('listening');
      } catch (e) {
        console.error("Could not start recognition:", e);
      }
    }
  };

  return { status, messages, subtitle, startConversation };
}
