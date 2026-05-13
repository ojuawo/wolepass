<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaystackService
{
    protected string $secretKey;
    protected string $baseUrl = 'https://api.paystack.co';

    public function __construct()
    {
        $this->secretKey = env('PAYSTACK_SECRET_KEY', '');
    }

    /**
     * Initialize a Paystack payment and return the authorization URL.
     *
     * @param  string  $email      Customer's email address
     * @param  int     $amount     Amount in kobo (e.g. 5000000 = ₦50,000)
     * @param  string  $tenantId   UUID of the tenant — embedded in metadata for webhook lookup
     * @return string|null         Paystack authorization URL
     */
    public function initializePayment(string $email, int $amount, string $tenantId): ?string
    {
        if (! $this->secretKey) {
            Log::info("[PaystackService] No secret key — simulating payment init for tenant {$tenantId}.");
            return 'https://paystack.com/simulated?tenant=' . $tenantId;
        }

        try {
            $response = Http::withToken($this->secretKey)
                ->post("{$this->baseUrl}/transaction/initialize", [
                    'email'     => $email,
                    'amount'    => $amount,
                    'reference' => 'WOLEPASS-' . strtoupper(Str::random(12)),
                    'metadata'  => [
                        'tenant_id'   => $tenantId,
                        'custom_fields' => [
                            [
                                'display_name' => 'Estate ID',
                                'variable_name' => 'tenant_id',
                                'value' => $tenantId,
                            ],
                        ],
                    ],
                ]);

            if ($response->successful()) {
                return $response->json('data.authorization_url');
            }

            Log::error('[PaystackService] Initialization failed.', [
                'status'   => $response->status(),
                'body'     => $response->json(),
            ]);

            return null;

        } catch (\Exception $e) {
            Log::error('[PaystackService] Exception during payment initialization: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Verify that an incoming webhook request genuinely came from Paystack.
     * Uses HMAC-SHA512 of the raw request body signed with the secret key.
     */
    public function verifyWebhookSignature(string $rawBody, string $paystackSignature): bool
    {
        if (! $this->secretKey) {
            return false;
        }

        $expected = hash_hmac('sha512', $rawBody, $this->secretKey);
        return hash_equals($expected, $paystackSignature);
    }
}
