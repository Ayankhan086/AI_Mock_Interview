"use client";

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';

export default function InterviewRoom({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [statusText, setStatusText] = useState('Initializing AI...');
  const [micError, setMicError] = useState(false);
  const [fallbackText, setFallbackText] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const isEndingRef = useRef(false);
  const isRecordingRef = useRef(false);

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = async (event: any) => {
          const transcript = event.results[0][0].transcript;
          handleCandidateSpeech(transcript);
        };

        recognitionRef.current.onerror = (event: any) => {
          if (event.error !== 'no-speech') {
            console.error('Speech recognition error:', event.error);
          }
          
          switch (event.error) {
            case 'no-speech':
              setStatusText("Listening... (no speech detected yet)");
              // We do not setMicError(true) because the mic works, it's just quiet
              break;
            case 'audio-capture':
            case 'not-allowed':
              setStatusText(event.error === 'not-allowed' ? 'Microphone blocked.' : 'Microphone error.');
              setIsRecording(false);
              isRecordingRef.current = false;
              setMicError(true);
              break;
            default:
              setStatusText(`Microphone error: ${event.error}`);
              setIsRecording(false);
              isRecordingRef.current = false;
              break;
          }
        };
        
        recognitionRef.current.onstart = () => {
          setIsRecording(true);
          isRecordingRef.current = true;
          setStatusText('Listening...');
        };

        recognitionRef.current.onend = () => {
          if (isRecordingRef.current && !isEndingRef.current) {
            // Auto restart listening safely with a short delay
            setTimeout(() => {
              try {
                if (isRecordingRef.current && !isEndingRef.current) {
                  recognitionRef.current.start();
                }
              } catch(e) {}
            }, 300);
          }
        };

        // Start session greeting
        const greetingTimeout = setTimeout(() => {
          speakAiResponse("Hello, I am your AI interviewer today. I have your profile in front of me. Are you ready to begin?");
        }, 1000);
        
        // Save timeout to ref for cleanup
        (recognitionRef as any).greetingTimeout = greetingTimeout;
      } else {
        setStatusText('Web Speech API not supported in this browser. Please use Chrome.');
      }
    }
    
    return () => {
      if ((recognitionRef as any).greetingTimeout) {
        clearTimeout((recognitionRef as any).greetingTimeout);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleCandidateSpeech = async (transcript: string) => {
    if (!transcript.trim()) return;
    
    setStatusText('AI is thinking...');
    setIsRecording(false);
    isRecordingRef.current = false;
    
    try {
      const res = await fetch('/api/llm/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: id, message: transcript })
      });
      
      if (res.ok) {
        const data = await res.json();
        speakAiResponse(data.response);
      } else {
        setStatusText('Error connecting to AI.');
      }
    } catch (err) {
      console.error(err);
      setStatusText('Network error.');
    }
  };

  const speakAiResponse = (text: string) => {
    setIsAiSpeaking(true);
    setStatusText('AI is speaking...');
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Pick a good English voice if available
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.lang === 'en-US' && (v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Natural')));
    if (premiumVoice) utterance.voice = premiumVoice;
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onend = () => {
      setIsAiSpeaking(false);
      
      // Check if it's the end of the interview based on text
      if (text.toLowerCase().includes("that's all") || text.toLowerCase().includes('conclude') || text.toLowerCase().includes('goodbye')) {
         handleEndInterview();
      } else {
         startRecording();
      }
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = () => {
    if (!recognitionRef.current || isEndingRef.current) return;
    try {
      // Update state first so we don't desync if start() throws
      setIsRecording(true);
      isRecordingRef.current = true;
      setStatusText('Listening...');
      recognitionRef.current.start();
    } catch (e) {
      console.error('Ignored start error:', e);
    }
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      isRecordingRef.current = false;
      setStatusText('Microphone muted.');
    } else {
      startRecording();
    }
  };

  const handleEndInterview = async () => {
    isEndingRef.current = true;
    if (recognitionRef.current) recognitionRef.current.stop();
    window.speechSynthesis.cancel();
    setStatusText('Generating report...');
    
    try {
      await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: id })
      });
      router.push('/dashboard');
    } catch (e) {
      console.error(e);
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vh] h-[80vh] bg-[var(--color-gold)] opacity-5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="z-10 text-center flex flex-col items-center">
        {/* Pulsating Orb Visualizer */}
        <div className={`w-40 h-40 rounded-full mb-12 flex items-center justify-center transition-all duration-500 shadow-[0_0_50px_rgba(203,163,88,0.2)] border-2 border-white/5 bg-black/50 ${isAiSpeaking ? 'scale-110 shadow-[0_0_80px_rgba(203,163,88,0.5)] border-[var(--color-gold)]/50' : 'scale-100'} ${isRecording ? 'border-[var(--color-gold)]/20 shadow-[0_0_40px_rgba(255,255,255,0.1)]' : ''}`}>
          
          {isAiSpeaking && (
            <div className="flex gap-2 items-center h-16">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-2 bg-[var(--color-gold)] rounded-full visualizer-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
          )}
          
          {!isAiSpeaking && (
            <div className="w-4 h-4 rounded-full bg-[var(--color-gold)] opacity-50 animate-pulse"></div>
          )}
        </div>
        
        <h2 className="text-2xl font-light text-white mb-2">{statusText}</h2>
        <p className="text-gray-400 max-w-md text-sm mb-8">
          {isAiSpeaking ? 'AI is speaking. Please listen.' : (isRecording ? 'Speak now. The AI is listening to your answer.' : 'Microphone is inactive.')}
        </p>

        {micError && !isAiSpeaking && (
          <div className="flex w-full max-w-md gap-2 mb-8">
            <input 
              type="text" 
              value={fallbackText}
              onChange={(e) => setFallbackText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && fallbackText.trim()) {
                  handleCandidateSpeech(fallbackText);
                  setFallbackText('');
                }
              }}
              placeholder="Mic unavailable. Type your answer here..."
              className="input-field flex-grow p-3 rounded-xl text-sm"
            />
            <button 
              onClick={() => {
                if (fallbackText.trim()) {
                  handleCandidateSpeech(fallbackText);
                  setFallbackText('');
                }
              }}
              className="btn-gold px-4 py-2 rounded-xl text-sm font-medium"
            >
              Send
            </button>
          </div>
        )}
        
        <div className="flex gap-6">
          <button 
            onClick={toggleRecording} 
            disabled={isAiSpeaking}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30' : 'glass-panel text-white hover:bg-white/10'}`}
          >
            {isRecording ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
            )}
          </button>
          
          <button 
            onClick={handleEndInterview} 
            className="px-6 py-4 rounded-full glass-panel text-gray-300 hover:text-white hover:bg-white/10 transition-all font-medium text-sm"
          >
            End Interview
          </button>
        </div>
      </div>
    </div>
  );
}
