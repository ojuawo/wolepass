<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SendchampService
{
    /**
     * Send a WhatsApp message using Sendchamp.
     *
     * @param string $phoneNumber
     * @param string $message
     * @return void
     */
    public function sendWhatsApp($phoneNumber, $message)
    {
        $publicKey = env('SENDCHAMP_PUBLIC_KEY');

        if (!$publicKey) {
            Log::info("Simulating WhatsApp message to {$phoneNumber}: {$message}");
            return;
        }

        try {
            Http::withToken($publicKey)->post('https://api.sendchamp.com/api/v1/whatsapp/message/send', [
                'recipient' => $phoneNumber,
                'message' => $message,
            ]);
        } catch (\Exception $e) {
            Log::error('Sendchamp Service Error: ' . $e->getMessage());
        }
    }
}
