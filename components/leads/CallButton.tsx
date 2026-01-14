'use client'

import { useState } from 'react'
import { Phone, PhoneCall } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface CallButtonProps {
  phone: string
  contractorName: string
  aivaEnabled?: boolean
}

export function CallButton({ phone, contractorName, aivaEnabled = false }: CallButtonProps) {
  const [showDialog, setShowDialog] = useState(false)

  const handleCall = () => {
    if (aivaEnabled) {
      setShowDialog(true)
      // In production, this would trigger the AIVA call system
      // For now, we'll just show a dialog
    } else {
      // Direct phone call
      window.location.href = `tel:${phone}`
    }
  }

  const handleDirectCall = () => {
    window.location.href = `tel:${phone}`
    setShowDialog(false)
  }

  const handleAivaCall = () => {
    // This would integrate with AIVA/Vapi/Twilio
    // For demo, we'll simulate starting a call
    console.log('Starting AIVA-powered call...')
    // In production: initiate AI voice assistant call
    setShowDialog(false)
    alert('AIVA call feature coming soon! For now, please call directly.')
    window.location.href = `tel:${phone}`
  }

  return (
    <>
      <Button
        onClick={handleCall}
        size="lg"
        className="w-full bg-green-600 hover:bg-green-700"
      >
        <Phone className="h-5 w-5 mr-2" />
        Call {contractorName.split(' ')[0]}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact {contractorName}</DialogTitle>
            <DialogDescription>
              Choose how you&apos;d like to connect
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {aivaEnabled && (
              <Button
                onClick={handleAivaCall}
                className="w-full h-auto py-4 flex-col items-start"
                variant="outline"
              >
                <div className="flex items-center gap-2 mb-1">
                  <PhoneCall className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">AI-Assisted Call</span>
                </div>
                <span className="text-sm text-gray-500 text-left">
                  Our AI assistant will help capture your project details
                  and connect you with {contractorName}
                </span>
              </Button>
            )}

            <Button
              onClick={handleDirectCall}
              className="w-full h-auto py-4 flex-col items-start"
              variant="outline"
            >
              <div className="flex items-center gap-2 mb-1">
                <Phone className="h-5 w-5 text-green-600" />
                <span className="font-semibold">Call Directly</span>
              </div>
              <span className="text-sm text-gray-500 text-left">
                Call {phone} directly from your phone
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
