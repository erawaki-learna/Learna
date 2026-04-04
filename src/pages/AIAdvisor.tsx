import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const AI_URL = 'https://api.anthropic.com/v1/messages'

const SYSTEM_PROMPT = `You are the Learna AI Learning Needs Advisor for HNB Assurance PLC, a life insurance company in Sri Lanka.

Divisions: ATC, Bancassurance Retail, Bancassurance Corporate, Head Office Operations, Claims, Underwriting, IT, Finance, HR & Admin, Marketing.

Your role: Help sales leaders and managers think through their learning needs through a guided conversation.

CONVERSATION STYLE:
- Professional but warm — like a trusted L&D consultant
- Ask ONE question at a time — never overwhelm
- Keep responses to 2-3 sentences before your question
- Acknowledge what they share before asking next
- Use plain language, no jargon

GUIDE THROUGH THESE AREAS (in order):
1. WHAT — What business problem or performance gap are they seeing?
2. WHO — Who specifically is affected? How many people? Which roles?
3. WHY — Why is this happening? Is it a knowledge gap, skill gap, motivation issue, or system/process problem?
4. IMPACT — What's the business impact if this isn't addressed?
5. SUCCESS — How would they know if the problem was solved? What does good look like?
6. URGENCY — How urgent is this? Is there a deadline or trigger event?
7. COMMITMENT — Are they willing to brief their team before and follow up after the programme?

IMPORTANT RULES:
- If the problem is NOT a training issue (e.g., system problem, policy issue, resource constraint), politely explain why and suggest who they should contact instead
- If you identify the root cause as something other than a knowledge/skill gap, say so honestly
- After gathering ALL information, generate a STRUCTURED SUMMARY in this exact format:

---SUMMARY---
BUSINESS PROBLEM: [clear statement]
TARGET AUDIENCE: [who and how many]
ROOT CAUSE: [knowledge gap / skill gap / motivation / system issue / mixed]
BUSINESS IMPACT: [what happens if unaddressed]
SUCCESS METRIC: [measurable outcome]
URGENCY: [within 2 weeks / within 1 month / within 3 months / flexible]
L&D RECOMMENDATION: [what type of intervention would work best]
MANAGER COMMITMENT: [confirmed / not confirmed]
---END SUMMARY---

Start by greeting them warmly and asking what challenge they're facing with their team.`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Summary {
  [key: string]: string;
}

function parseSummary(text: string): Summary | null {
  if (!text.includes('---SUMMARY---')) return null;
  const summaryText = text.split('---SUMMARY---')[1]?.split('---END SUMMARY---')[0];
  if (!summaryText) return null;
  const fields: Summary = {};
  summaryText.trim().split('\n').forEach(line => {
    const match = line.match(/^([A-Z\s&]+):\s*(.+)/);
    if (match) fields[match[1].trim()] = match[2].trim();
  });
  return Object.keys(fields).length > 0 ? fields : null;
}

export default function AIAdvisor({ onBack }: { onBack: () => void }) {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Welcome to the Learna AI Learning Advisor. I'm here to help you think through your team's development needs.\n\nI'll ask you a few questions to understand the situation, and together we'll build a clear picture of what your team needs.\n\nSo tell me — what's the challenge you're seeing with your team right now?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

       recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        if (finalTranscript) {
          setInput(finalTranscript);
        } else {
          setInput(interimTranscript);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    try {
      const apiMessages = newMessages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'YREMOVED',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content
          })),
        }),

      const data = await response.json();
      const text = data.content?.[0]?.text ||
        "I'm having trouble connecting right now. Could you please repeat that?";

      const assistantMsg: Message = { role: 'assistant', content: text };
      setMessages([...newMessages, assistantMsg]);

      const parsed = parseSummary(text);
      if (parsed) setSummary(parsed);
    } catch (error) {
      console.error('AI error:', error);
      setMessages([...newMessages, {
        role: 'assistant',
        content: "I'm having trouble connecting to the AI service. Please try again in a moment."
      }]);
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  const handleSubmitToLD = async () => {
    if (!summary || !user) return;

    const { data: countData } = await supabase
      .from('requests')
      .select('id', { count: 'exact' });
    const seq = String((countData?.length || 0) + 1).padStart(3, '0');
    const requestId = `QR-AI-2026-${seq}`;

    const { error } = await supabase.from('requests').insert({
      user_id: user.id,
      request_id: requestId,
      requestor_name: profile?.full_name || '',
      division: profile?.division || 'Not specified',
      contact: profile?.email || '',
      business_problem: summary['BUSINESS PROBLEM'] || '',
      audience: summary['TARGET AUDIENCE'] || '',
      urgency: summary['URGENCY'] || 'Within 1 month',
      manager_commitment: summary['MANAGER COMMITMENT']?.toLowerCase().includes('confirmed'),
      status: 'D1 Received',
      ai_analysis: summary,
      priority: summary['URGENCY']?.includes('2 weeks') ? 'High' : 'Medium',
    });

    if (error) {
      console.error('Submit error:', error);
      alert('Error submitting: ' + error.message);
      return;
    }

    setSubmitted(true);
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-navy/60 hover:text-navy text-sm font-medium mb-6 transition-colors"
      >
        ← Back to options
      </button>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center">
            <span className="text-2xl">🧠</span>
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-navy">AI Learning Advisor</h2>
            <p className="text-sm text-navy/50">Speak or type — I'll guide you through the analysis</p>
          </div>
          {speechSupported && (
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-700">Voice enabled</span>
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-navy/5 rounded-xl p-4 mb-6 flex gap-3">
          <span className="text-lg flex-shrink-0">💡</span>
          <div>
            <p className="text-sm font-semibold text-navy mb-1">How this works</p>
            <p className="text-xs text-navy/60 leading-relaxed">
              {speechSupported
                ? "Tap the microphone button and speak naturally — or type if you prefer. I'll ask you a series of questions to understand your team's learning needs. At the end, I'll generate a structured analysis that goes directly to the L&D team."
                : "I'll ask you a series of questions to understand your team's learning needs. Type your responses below. At the end, I'll generate a structured analysis for L&D."
              }
            </p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="bg-white rounded-2xl border border-navy/10 p-6 mb-4 min-h-[400px] max-h-[500px] overflow-y-auto">
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            const displayContent = msg.content.split('---SUMMARY---')[0].trim();

            return (
              <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-gold text-xs font-bold mr-3 flex-shrink-0 mt-1">
                    LA
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-navy text-white rounded-br-sm'
                      : 'bg-cream text-navy rounded-bl-sm'
                  }`}
                >
                  {displayContent}
                </div>
                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-navy/20 flex items-center justify-center text-navy text-xs font-bold ml-3 flex-shrink-0 mt-1">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-gold text-xs font-bold">LA</div>
              <div className="bg-cream rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-navy/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-navy/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-navy/30 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {/* Summary Card */}
          {summary && !submitted && (
            <div className="mt-4 bg-white rounded-xl border-2 border-gold p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-lg">✓</div>
                <div>
                  <h3 className="font-serif font-bold text-navy">Needs Analysis Complete</h3>
                  <p className="text-xs text-navy/50">Review the summary and submit to L&D</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {Object.entries(summary).map(([key, val]) => (
                  <div
                    key={key}
                    className={
                      ['BUSINESS PROBLEM', 'BUSINESS IMPACT', 'SUCCESS METRIC', 'L&D RECOMMENDATION'].includes(key)
                        ? 'col-span-2'
                        : ''
                    }
                  >
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-1">{key}</div>
                    <div className="text-xs font-medium text-navy bg-cream rounded-lg px-3 py-2">{val}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-4 border-t border-navy/10">
                <button
                  onClick={handleSubmitToLD}
                  className="flex-1 bg-gold hover:bg-gold/90 text-navy font-bold py-3 rounded-lg transition-colors text-sm"
                >
                  ✓ Submit to L&D Pipeline
                </button>
                <button
                  onClick={() => setSummary(null)}
                  className="px-6 bg-navy/10 hover:bg-navy/20 text-navy font-semibold py-3 rounded-lg transition-colors text-sm"
                >
                  Continue Chat
                </button>
              </div>
            </div>
          )}

          {/* Submitted Confirmation */}
          {submitted && (
            <div className="mt-4 bg-green-50 rounded-xl border border-green-200 p-6 text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-serif font-bold text-navy text-lg mb-1">Request Submitted to L&D!</h3>
              <p className="text-sm text-navy/60 mb-1">
                Reference: <span className="font-mono font-bold text-navy">QR-AI-2026-{String(Math.floor(Math.random() * 900) + 100)}</span>
              </p>
              <p className="text-xs text-navy/40 mt-3">
                Because you used the AI Advisor, your request includes a detailed needs analysis — which means faster triage and better programme design.
              </p>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        {!submitted && (
          <div className="bg-white rounded-2xl border border-navy/10 p-2 flex items-end gap-2">
            {/* Voice Button */}
            {speechSupported && (
              <button
                onClick={toggleVoice}
                className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200'
                    : 'bg-navy/5 hover:bg-navy/10 text-navy/60'
                }`}
                title={isListening ? 'Stop listening' : 'Tap to speak'}
              >
                {isListening ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                  </svg>
                )}
              </button>
            )}

            {/* Text Input */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={isListening ? '🎙️ Listening... speak now' : 'Type or tap the mic to speak...'}
              rows={1}
              className={`flex-1 resize-none border-none outline-none text-sm text-navy bg-transparent px-3 py-2.5 max-h-24 overflow-auto ${
                isListening ? 'placeholder-red-400' : 'placeholder-navy/30'
              }`}
            />

            {/* Send Button */}
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                input.trim() && !loading
                  ? 'bg-navy text-gold hover:bg-navy/90'
                  : 'bg-navy/5 text-navy/20'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        )}

        {/* Voice Instructions */}
        {speechSupported && !submitted && (
          <p className="text-center text-[11px] text-navy/30 mt-3">
            {isListening
              ? '🔴 Recording... tap the red button to stop, then press send'
              : 'Tap 🎙️ to speak · Press Enter or tap ↑ to send'
            }
          </p>
        )}
      </div>
    </div>
  );
}
