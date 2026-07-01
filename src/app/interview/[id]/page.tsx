"use client";

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';

export default function InterviewRoom({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [statusText, setStatusText] = useState('Loading session...');
  const [errorMessage, setErrorMessage] = useState('');
  const [micError, setMicError] = useState(false);
  const [fallbackText, setFallbackText] = useState('');
  const [sessionLanguage, setSessionLanguage] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const isEndingRef = useRef(false);
  const isRecordingRef = useRef(false);
  const silenceTimerRef = useRef<any>(null);
  const transcriptAccumulatorRef = useRef('');

  useEffect(() => {
    // Fetch session details
    fetch(`/api/interviews/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.interview?.language) {
          setSessionLanguage(data.interview.language);
        } else {
          setSessionLanguage('en-US'); // Fallback
        }
      })
      .catch(err => {
        console.error(err);
        setSessionLanguage('en-US');
      });
  }, [id]);

  useEffect(() => {
    if (!sessionLanguage) return;
    
    // Check if browser supports Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = sessionLanguage;

        recognitionRef.current.onresult = async (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
            transcriptAccumulatorRef.current += finalTranscript;
          }
          
          const currentText = transcriptAccumulatorRef.current + interimTranscript;
          
          if (currentText.trim()) {
            setStatusText('Listening... (Waiting for you to finish)');
            
            // Reset the silence timer every time we detect speech
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            
            silenceTimerRef.current = setTimeout(() => {
               const textToSend = transcriptAccumulatorRef.current.trim() || currentText.trim();
               if (textToSend) {
                 handleCandidateSpeech(textToSend);
               }
            }, 3000); // Wait 3 seconds of silence before sending
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          // Suppress noise for common non-fatal errors
          if (event.error !== 'no-speech' && event.error !== 'network') {
            console.error('Speech recognition error:', event.error);
          }
          
          switch (event.error) {
            case 'no-speech':
              setStatusText("Listening... (no speech detected yet)");
              break;
            case 'network':
              // Network drops are usually micro-disconnects. 
              // Do nothing here so `onend` can automatically seamlessly restart the mic.
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
          let greeting = "Hello, I am your AI interviewer today. I have your profile in front of me. Are you ready to begin?";
          if (sessionLanguage.startsWith('es')) greeting = "Hola, soy tu entrevistador de IA. Tengo tu perfil aquí. ¿Estás listo para empezar?";
          else if (sessionLanguage.startsWith('fr')) greeting = "Bonjour, je suis votre recruteur IA. J'ai votre profil devant moi. Êtes-vous prêt ?";
          else if (sessionLanguage.startsWith('de')) greeting = "Hallo, ich bin Ihr KI-Interviewer. Ich habe Ihr Profil hier. Sind Sie bereit zu beginnen?";
          else if (sessionLanguage.startsWith('hi')) greeting = "नमस्ते, मैं आपका एआई साक्षात्कारकर्ता हूं। क्या आप शुरू करने के लिए तैयार हैं?";
          else if (sessionLanguage.startsWith('ur')) greeting = "ہیلو، میں آپ کا اے آئی انٹرویوور ہوں۔ کیا آپ شروع کرنے کے لیے تیار ہیں؟";
          
          speakAiResponse(greeting);
        }, 1000);
        
        // Save timeout to ref for cleanup
        (recognitionRef as any).greetingTimeout = greetingTimeout;
      } else {
        setStatusText('Web Speech API not supported in this browser. Please use Chrome.');
      }
    }
    
    return () => {
      if (recognitionRef.current?.greetingTimeout) {
        clearTimeout(recognitionRef.current.greetingTimeout);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, [sessionLanguage]);

  const handleCandidateSpeech = async (transcript: string) => {
    if (!transcript.trim()) return;
    
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) recognitionRef.current.stop();
    transcriptAccumulatorRef.current = '';
    
    setStatusText('AI is thinking...');
    setErrorMessage('');
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
      } else if (res.status === 429) {
        setStatusText('Paused');
        setErrorMessage('Google AI Rate Limit Exceeded: You have spoken too many times within a minute on the free tier. Please wait 60 seconds before speaking again.');
        speakAiResponse("I am receiving too many requests. Please wait a minute before answering.");
      } else {
        setStatusText('Error');
        setErrorMessage('Failed to connect to the AI engine. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setStatusText('Network Error');
      setErrorMessage('A network error occurred while contacting the AI server.');
    }
  };

  const speakAiResponse = (text: string) => {
    setIsAiSpeaking(true);
    setStatusText('AI is speaking...');
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Pick a voice that matches the selected language
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = sessionLanguage ? sessionLanguage.split('-')[0] : 'en';
    
    // Try to find a premium voice in the target language first, otherwise just any voice in that language
    let selectedVoice = voices.find(v => v.lang.startsWith(langPrefix) && (v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Natural')));
    if (!selectedVoice) selectedVoice = voices.find(v => v.lang.startsWith(langPrefix));
    
    if (selectedVoice) utterance.voice = selectedVoice;
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onend = () => {
      setIsAiSpeaking(false);
      setStatusText('Waiting...');
      
      // Check if it's the end of the interview based on text
      if (text.toLowerCase().includes("that's all") || text.toLowerCase().includes('conclude') || text.toLowerCase().includes('goodbye')) {
         handleEndInterview();
      } else {
         // Add a small natural delay before turning the mic back on
         setTimeout(() => {
           if (!isEndingRef.current) {
             startRecording();
           }
         }, 1500);
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
      transcriptAccumulatorRef.current = '';
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
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vh] h-[80vh] bg-indigo-50 opacity-50 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="z-10 text-center flex flex-col items-center">
        {/* Pulsating Orb Visualizer */}
        <div className={`w-40 h-40 rounded-full mb-12 flex items-center justify-center transition-all duration-500 shadow-[0_0_50px_rgba(79,70,229,0.1)] border-2 border-indigo-100 bg-white ${isAiSpeaking ? 'scale-110 shadow-[0_0_80px_rgba(79,70,229,0.3)] border-[var(--color-primary)]' : 'scale-100'} ${isRecording ? 'border-[var(--color-primary)] shadow-[0_0_40px_rgba(79,70,229,0.2)]' : ''}`}>
          
          {isAiSpeaking && (
            <div className="flex gap-2 items-center h-16">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-2 bg-[var(--color-primary)] rounded-full visualizer-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
          )}
          
          {!isAiSpeaking && (
            <div className="w-4 h-4 rounded-full bg-[var(--color-primary)] opacity-50 animate-pulse"></div>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{statusText}</h2>
        <p className="text-gray-500 max-w-md text-sm mb-6 font-medium">
          {isAiSpeaking ? 'AI is speaking. Please listen.' : (isRecording ? 'Speak now. The AI is listening to your answer.' : 'Microphone is inactive.')}
        </p>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-8 max-w-md w-full shadow-sm">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-left">
                <h3 className="text-sm font-bold text-red-800">Connection Error</h3>
                <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

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
              className="btn-primary px-4 py-2 rounded-xl text-sm font-medium"
            >
              Send
            </button>
          </div>
        )}
        
        <div className="flex gap-6">
          <button 
            onClick={toggleRecording} 
            disabled={isAiSpeaking}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'}`}
          >
            {isRecording ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
            )}
          </button>
          
          <button 
            onClick={handleEndInterview} 
            className="px-6 py-4 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
          >
            End Interview
          </button>
        </div>
      </div>
    </div>
  );
}
