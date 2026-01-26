'use client'

import { useEffect, useState } from 'react'
import { Phone, User, CheckCircle, X, ArrowRight, Clock } from 'lucide-react'

type AnimationPhase = 'request' | 'routing' | 'checking' | 'unavailable' | 'connected' | 'complete'

export function RequestRoutingAnimation() {
  const [phase, setPhase] = useState<AnimationPhase>('request')
  const [responseTime, setResponseTime] = useState(12)

  useEffect(() => {
    const timeline = [
      { phase: 'request' as const, duration: 1500 },
      { phase: 'routing' as const, duration: 1200 },
      { phase: 'checking' as const, duration: 1500 },
      { phase: 'unavailable' as const, duration: 1000 },
      { phase: 'connected' as const, duration: 1200 },
      { phase: 'complete' as const, duration: 2500 },
    ]

    let timeoutId: NodeJS.Timeout
    let currentIndex = 0

    const runPhase = () => {
      const current = timeline[currentIndex]
      setPhase(current.phase)

      if (current.phase === 'complete') {
        setResponseTime(Math.floor(Math.random() * 10) + 8) // 8-17 min
      }

      timeoutId = setTimeout(() => {
        currentIndex = (currentIndex + 1) % timeline.length
        runPhase()
      }, current.duration)
    }

    runPhase()

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <section className="py-16 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              How Requests Get Routed
            </h2>
            <p className="text-slate-600">
              No dead ends. No voicemail purgatory. Just connections that work.
            </p>
          </div>

          {/* Animation Container */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">

              {/* Step 1: Your Request */}
              <div className="flex flex-col items-center text-center">
                <div
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500
                    ${phase === 'request'
                      ? 'bg-blue-600 scale-110 shadow-lg shadow-blue-200 animate-pulse'
                      : 'bg-blue-100'
                    }
                  `}
                >
                  <Phone
                    className={`h-9 w-9 transition-colors duration-500 ${
                      phase === 'request' ? 'text-white' : 'text-blue-600'
                    }`}
                  />
                </div>
                <p className={`mt-3 font-medium transition-colors duration-300 ${
                  phase === 'request' ? 'text-blue-600' : 'text-slate-700'
                }`}>
                  Your Request
                </p>
                <p className={`text-sm transition-opacity duration-300 ${
                  phase === 'request' ? 'text-blue-500 opacity-100' : 'text-slate-400 opacity-70'
                }`}>
                  {phase === 'request' ? 'Submitting...' : 'Received'}
                </p>
              </div>

              {/* Arrow 1 */}
              <div className="hidden md:block">
                <ArrowRight
                  className={`h-6 w-6 transition-all duration-500 ${
                    phase === 'routing' || phase === 'checking' || phase === 'unavailable' || phase === 'connected' || phase === 'complete'
                      ? 'text-blue-500 translate-x-1'
                      : 'text-slate-300'
                  }`}
                />
              </div>

              {/* Step 2: Contractors */}
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-2">
                  {/* Contractor 1 - Will be unavailable */}
                  <div
                    className={`
                      w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 relative
                      ${phase === 'unavailable' || phase === 'connected' || phase === 'complete'
                        ? 'bg-slate-200 scale-90 opacity-50'
                        : phase === 'routing' || phase === 'checking'
                          ? 'bg-slate-100 animate-pulse shadow-md'
                          : 'bg-slate-100'
                      }
                    `}
                  >
                    <User className={`h-6 w-6 ${
                      phase === 'unavailable' || phase === 'connected' || phase === 'complete'
                        ? 'text-slate-400'
                        : 'text-slate-600'
                    }`} />
                    {(phase === 'unavailable' || phase === 'connected' || phase === 'complete') && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-slate-400 rounded-full flex items-center justify-center animate-in fade-in zoom-in duration-300">
                        <X className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Contractor 2 - Will connect */}
                  <div
                    className={`
                      w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 relative
                      ${phase === 'connected' || phase === 'complete'
                        ? 'bg-green-500 scale-110 shadow-lg shadow-green-200'
                        : phase === 'routing' || phase === 'checking' || phase === 'unavailable'
                          ? 'bg-slate-100 animate-pulse shadow-md'
                          : 'bg-slate-100'
                      }
                    `}
                  >
                    <User className={`h-6 w-6 ${
                      phase === 'connected' || phase === 'complete' ? 'text-white' : 'text-slate-600'
                    }`} />
                    {(phase === 'connected' || phase === 'complete') && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center animate-in fade-in zoom-in duration-300">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Contractor 3 - Backup, stays neutral */}
                  <div
                    className={`
                      w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500
                      ${phase === 'routing' || phase === 'checking'
                        ? 'bg-slate-100 animate-pulse shadow-md'
                        : phase === 'connected' || phase === 'complete'
                          ? 'bg-slate-100 opacity-60 scale-90'
                          : 'bg-slate-100'
                      }
                    `}
                  >
                    <User className="h-6 w-6 text-slate-600" />
                  </div>
                </div>
                <p className={`mt-3 font-medium transition-colors duration-300 ${
                  phase === 'routing' || phase === 'checking' ? 'text-blue-600' :
                  phase === 'unavailable' ? 'text-slate-600' :
                  phase === 'connected' || phase === 'complete' ? 'text-green-600' :
                  'text-slate-700'
                }`}>
                  {phase === 'routing' ? 'Finding pros...' :
                   phase === 'checking' ? 'Checking availability...' :
                   phase === 'unavailable' ? 'Routing to next...' :
                   phase === 'connected' || phase === 'complete' ? 'Pro Available!' :
                   'Houston Contractors'}
                </p>
                <p className="text-sm text-slate-400">
                  Verified & ready
                </p>
              </div>

              {/* Arrow 2 */}
              <div className="hidden md:block">
                <ArrowRight
                  className={`h-6 w-6 transition-all duration-500 ${
                    phase === 'connected' || phase === 'complete'
                      ? 'text-green-500 translate-x-1'
                      : 'text-slate-300'
                  }`}
                />
              </div>

              {/* Step 3: Connected */}
              <div className="flex flex-col items-center text-center">
                <div
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500
                    ${phase === 'complete'
                      ? 'bg-green-500 scale-110 shadow-lg shadow-green-200'
                      : phase === 'connected'
                        ? 'bg-green-100 animate-pulse'
                        : 'bg-slate-100'
                    }
                  `}
                >
                  <CheckCircle
                    className={`h-9 w-9 transition-colors duration-500 ${
                      phase === 'complete' ? 'text-white' :
                      phase === 'connected' ? 'text-green-600' :
                      'text-slate-400'
                    }`}
                  />
                </div>
                <p className={`mt-3 font-medium transition-colors duration-300 ${
                  phase === 'connected' || phase === 'complete' ? 'text-green-600' : 'text-slate-700'
                }`}>
                  {phase === 'complete' ? 'Connected!' : 'You\'re Connected'}
                </p>
                <p className={`text-sm transition-all duration-300 ${
                  phase === 'complete'
                    ? 'text-green-500 font-medium'
                    : 'text-slate-400'
                }`}>
                  {phase === 'complete' ? (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {responseTime} min
                    </span>
                  ) : 'No runaround'}
                </p>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mt-10 pt-6 border-t border-slate-100">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
                <div className={`flex items-center gap-2 transition-opacity duration-300 ${
                  phase === 'complete' ? 'opacity-100' : 'opacity-50'
                }`}>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-slate-600">If they don&apos;t respond fast, we route to the next pro</span>
                </div>
                <span className="hidden md:inline text-slate-300">•</span>
                <div className={`flex items-center gap-2 transition-opacity duration-300 ${
                  phase === 'complete' ? 'opacity-100' : 'opacity-50'
                }`}>
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-slate-600">No dead ends. No runaround.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats below animation */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">15</p>
              <p className="text-sm text-slate-500">min avg response</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">3+</p>
              <p className="text-sm text-slate-500">pros per request</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">0</p>
              <p className="text-sm text-slate-500">dead ends</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
