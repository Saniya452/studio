'use client';

import { RobotAvatar } from '@/components/ui/robot-avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGeminiBuddy } from '@/hooks/use-gemini-buddy';
import { ChatMessage } from '@/components/ui/chat-message';
import { Mic, MicOff } from 'lucide-react';

export default function Home() {
  const { status, messages, subtitle, startConversation } = useGeminiBuddy();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl flex flex-col items-center space-y-4">
        <RobotAvatar status={status} />
        
        <div className="h-8 text-center">
            <p className="text-lg text-muted-foreground animate-pulse">
                {status === 'listening' && 'Listening...'}
                {status === 'thinking' && 'Thinking...'}
            </p>
            <p className="text-xl text-primary font-medium">
                {status === 'speaking' && subtitle}
            </p>
        </div>

        <ScrollArea className="h-64 w-full rounded-lg border bg-card/50 p-4">
          <div className="flex flex-col space-y-4">
            {messages.map((msg, index) => (
              <ChatMessage key={index} author={msg.author} text={msg.text} />
            ))}
          </div>
        </ScrollArea>

        <div className="flex flex-col items-center space-y-2">
            <Button
              onClick={startConversation}
              size="icon"
              className="rounded-full h-20 w-20 bg-primary hover:bg-primary/90 disabled:opacity-50 transition-transform duration-200 ease-in-out data-[status=listening]:scale-110"
              disabled={status === 'speaking' || status === 'thinking'}
              data-status={status}
              aria-label={status === 'listening' ? 'Stop Listening' : 'Start Listening'}
            >
              {status === 'listening' ? (
                <MicOff className="h-10 w-10 text-primary-foreground" />
              ) : (
                <Mic className="h-10 w-10 text-primary-foreground" />
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              {status === 'idle' ? 'Tap to speak' : status === 'listening' ? 'Tap to stop' : ' '}
            </p>
        </div>
      </div>
    </main>
  );
}
