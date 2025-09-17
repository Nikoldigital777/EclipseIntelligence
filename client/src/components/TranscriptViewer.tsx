import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Bot, Copy, Download } from "lucide-react";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CosmicButton from "@/components/CosmicButton";
import { type Call } from "@shared/schema";

interface TranscriptViewerProps {
  call: Call | null;
  isOpen: boolean;
  onClose: () => void;
}

interface TranscriptMessage {
  role: 'agent' | 'user';
  content: string;
  timestamp?: number;
}

export default function TranscriptViewer({ call, isOpen, onClose }: TranscriptViewerProps) {
  const [copied, setCopied] = useState(false);

  const parseTranscript = (transcript: string | null): TranscriptMessage[] => {
    if (!transcript) return [];
    
    const messages: TranscriptMessage[] = [];
    const lines = transcript.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      if (line.includes('Agent:')) {
        messages.push({
          role: 'agent',
          content: line.replace('Agent:', '').trim()
        });
      } else if (line.includes('User:')) {
        messages.push({
          role: 'user', 
          content: line.replace('User:', '').trim()
        });
      }
    }
    
    return messages;
  };

  const copyTranscript = async () => {
    if (!call?.transcript) return;
    
    try {
      await navigator.clipboard.writeText(call.transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy transcript:', err);
    }
  };

  const downloadTranscript = () => {
    if (!call?.transcript) return;
    
    const blob = new Blob([call.transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${call.retellCallId || call.sessionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDuration = (durationMs: number | null | undefined) => {
    if (!durationMs) return 'N/A';
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: number | null | undefined) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  const messages = parseTranscript(call?.transcript || null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] bg-gradient-to-br from-black/95 via-gray-900/95 to-black/95 border-white/20 text-white">
        <DialogHeader className="pb-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-white mb-2">
                Call Transcript
              </DialogTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTimestamp(call?.startTimestamp)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{call?.fromNumber || call?.toNumber || 'Unknown'}</span>
                </div>
                <Badge className={`${call?.callSuccessful ? 'bg-green-500' : 'bg-red-500'} text-white border-0`}>
                  {call?.callSuccessful ? 'Successful' : 'Failed'}
                </Badge>
                <span>{formatDuration(call?.durationMs || call?.duration)}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <CosmicButton 
                variant="eclipse" 
                size="sm" 
                onClick={copyTranscript}
                className="flex items-center space-x-2"
                data-testid="copy-transcript-button"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </CosmicButton>
              <CosmicButton 
                variant="remax" 
                size="sm" 
                onClick={downloadTranscript}
                className="flex items-center space-x-2"
                data-testid="download-transcript-button"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </CosmicButton>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          {!call?.transcript ? (
            <div className="flex items-center justify-center h-full">
              <GlassmorphicCard className="p-8 text-center">
                <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Transcript Available</h3>
                <p className="text-gray-400">This call doesn't have a transcript or it hasn't been processed yet.</p>
              </GlassmorphicCard>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <GlassmorphicCard className="p-8 text-center">
                <div className="text-gray-400 mb-4">Raw transcript format detected</div>
                <ScrollArea className="h-96 w-full rounded-md border border-white/20 p-4">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap">{call.transcript}</pre>
                </ScrollArea>
              </GlassmorphicCard>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4" data-testid="transcript-messages">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                      <GlassmorphicCard className={`p-4 ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-br from-[hsl(var(--primary-blue))]/20 to-[hsl(var(--eclipse-glow))]/10 border-[hsl(var(--primary-blue))]/30' 
                          : 'bg-gradient-to-br from-[hsl(var(--lunar-mist))]/20 to-[hsl(var(--manifest-blue))]/10 border-[hsl(var(--lunar-mist))]/30'
                      }`}>
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.role === 'user' 
                              ? 'bg-[hsl(var(--primary-blue))]/30' 
                              : 'bg-[hsl(var(--lunar-mist))]/30'
                          }`}>
                            {message.role === 'user' ? 
                              <User className="w-4 h-4 text-white" /> : 
                              <Bot className="w-4 h-4 text-white" />
                            }
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-white capitalize">
                                {message.role === 'user' ? 'Customer' : 'AI Agent'}
                              </span>
                              {message.timestamp && (
                                <span className="text-xs text-gray-400">
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-200 leading-relaxed" data-testid={`message-${message.role}-${index}`}>
                              {message.content}
                            </p>
                          </div>
                        </div>
                      </GlassmorphicCard>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}