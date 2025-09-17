
<line_number>1</line_number>
import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX } from 'lucide-react';
import CosmicButton from './CosmicButton';
import GlassmorphicCard from './GlassmorphicCard';
import { useToast } from '@/hooks/use-toast';

interface WebCallInterfaceProps {
  accessToken: string;
  agentName: string;
  onCallEnd: () => void;
  onTranscriptUpdate: (transcript: string[]) => void;
}

export default function WebCallInterface({ 
  accessToken, 
  agentName, 
  onCallEnd, 
  onTranscriptUpdate 
}: WebCallInterfaceProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  
  const webClientRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext>();
  const analyserRef = useRef<AnalyserNode>();
  const streamRef = useRef<MediaStream>();
  
  const { toast } = useToast();

  useEffect(() => {
    initializeWebCall();
    return () => {
      cleanup();
    };
  }, [accessToken]);

  const initializeWebCall = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      streamRef.current = stream;

      // Set up audio level monitoring
      setupAudioLevelMonitoring(stream);

      // Load Retell Web SDK
      await loadRetellSDK();
      
    } catch (error: any) {
      console.error('❌ Failed to initialize web call:', error);
      setError(`Microphone access denied: ${error.message}`);
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use voice calls.",
        variant: "destructive",
      });
    }
  };

  const setupAudioLevelMonitoring = (stream: MediaStream) => {
    try {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const updateAudioLevel = () => {
        if (analyserRef.current && isConnected) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(Math.min(100, (average / 128) * 100));
          requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
    } catch (error) {
      console.warn('Audio level monitoring setup failed:', error);
    }
  };

  const loadRetellSDK = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if SDK is already loaded
      if ((window as any).RetellWebClient) {
        initializeRetellClient();
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/retell-web-client@latest/dist/index.js';
      script.onload = () => {
        initializeRetellClient();
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Retell SDK'));
      };
      document.head.appendChild(script);
    });
  };

  const initializeRetellClient = () => {
    try {
      const RetellWebClient = (window as any).RetellWebClient;
      if (!RetellWebClient) {
        throw new Error('Retell Web Client not available');
      }

      webClientRef.current = new RetellWebClient();

      // Set up event listeners
      webClientRef.current.on('call_started', () => {
        console.log('📞 Call started successfully');
        setIsConnected(true);
        setIsConnecting(false);
        setTranscript(prev => {
          const updated = [...prev, '✅ Call connected! Start speaking...'];
          onTranscriptUpdate(updated);
          return updated;
        });
      });

      webClientRef.current.on('call_ended', () => {
        console.log('📞 Call ended');
        setIsConnected(false);
        setTranscript(prev => {
          const updated = [...prev, '📞 Call ended'];
          onTranscriptUpdate(updated);
          return updated;
        });
        onCallEnd();
      });

      webClientRef.current.on('error', (error: any) => {
        console.error('❌ Call error:', error);
        setError(error.message);
        setIsConnecting(false);
        toast({
          title: "Call Error",
          description: error.message || "An error occurred during the call",
          variant: "destructive",
        });
      });

      webClientRef.current.on('update', (update: any) => {
        console.log('📊 Call update:', update);
        if (update.transcript && update.transcript.length > 0) {
          const newMessages = update.transcript.map((t: any) => 
            `${t.role === 'agent' ? '🤖 Agent' : '👤 You'}: ${t.content}`
          );
          setTranscript(prev => {
            const updated = [...prev, ...newMessages];
            onTranscriptUpdate(updated);
            return updated;
          });
        }
      });

      webClientRef.current.on('conversationStarted', () => {
        console.log('🎯 Conversation started');
        setTranscript(prev => {
          const updated = [...prev, '🎯 Agent is listening. You can start speaking now!'];
          onTranscriptUpdate(updated);
          return updated;
        });
      });

      webClientRef.current.on('audio', (audio: any) => {
        console.log('🔊 Audio data received:', audio);
      });

      // Start the call
      webClientRef.current.startCall({
        accessToken: accessToken,
        callType: 'web_call',
        customConfig: {
          audioDeviceId: 'default'
        }
      });

    } catch (error: any) {
      console.error('❌ Error initializing Retell Web Client:', error);
      setError(`Failed to initialize call: ${error.message}`);
      setIsConnecting(false);
    }
  };

  const handleMuteToggle = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
      
      if (webClientRef.current) {
        webClientRef.current.setMuted(!isMuted);
      }
    }
  };

  const handleEndCall = () => {
    if (webClientRef.current) {
      webClientRef.current.hangup();
    }
    cleanup();
    onCallEnd();
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (webClientRef.current) {
      webClientRef.current = null;
    }
  };

  if (error) {
    return (
      <GlassmorphicCard className="border-red-500/30 bg-red-500/10">
        <div className="p-4 text-center">
          <div className="text-red-400 mb-2">❌ Call Failed</div>
          <div className="text-red-300 text-sm">{error}</div>
          <CosmicButton 
            variant="remax" 
            size="sm" 
            onClick={onCallEnd}
            className="mt-3"
          >
            Close
          </CosmicButton>
        </div>
      </GlassmorphicCard>
    );
  }

  return (
    <GlassmorphicCard className="border-green-500/30 bg-green-500/10">
      <div className="p-4 space-y-4">
        {/* Call Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isConnecting ? 'bg-yellow-500 animate-pulse' : isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <span className="text-white font-medium">
              {isConnecting ? 'Connecting...' : isConnected ? `Live Call with ${agentName}` : 'Call Ended'}
            </span>
          </div>
          {isConnected && (
            <CosmicButton 
              variant="remax" 
              size="sm"
              onClick={handleEndCall}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Call</span>
            </CosmicButton>
          )}
        </div>

        {/* Audio Controls */}
        {isConnected && (
          <div className="flex items-center justify-between p-3 bg-[hsl(var(--lunar-glass))]/30 rounded-lg">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleMuteToggle}
                className={`p-2 rounded-full ${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} transition-colors`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-white" />}
              </button>
              
              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`p-2 rounded-full ${isSpeakerOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'} transition-colors`}
                title={isSpeakerOn ? 'Speaker On' : 'Speaker Off'}
              >
                {isSpeakerOn ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-white" />}
              </button>
            </div>

            {/* Audio Level Indicator */}
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm">🎤</span>
              <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-100"
                  style={{ width: `${audioLevel}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Status Messages */}
        <div className="space-y-2">
          {isConnecting && (
            <div className="text-center text-yellow-300 text-sm">
              🔄 Establishing connection to agent...
            </div>
          )}
          {isConnected && (
            <div className="text-center text-green-300 text-sm">
              🎉 Connected! Speak naturally to chat with {agentName}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <div className="text-blue-200 text-xs space-y-1">
            <p>💬 Speak naturally - the agent can hear you</p>
            <p>🎯 Wait for responses before speaking again</p>
            <p>🔇 Use mute button if needed</p>
          </div>
        </div>
      </div>
    </GlassmorphicCard>
  );
}
