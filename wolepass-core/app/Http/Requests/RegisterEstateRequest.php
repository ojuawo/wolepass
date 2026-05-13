<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterEstateRequest extends FormRequest
{
    /**
     * Public registration — no auth required.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'estate_name'    => 'required|string|max:255',
            'admin_full_name'=> 'required|string|max:255',
            'admin_email'    => 'required|email|unique:users,email',
            'admin_phone'    => 'required|string|max:20',
            'password'       => 'required|string|min:8|confirmed',
        ];
    }

    public function messages(): array
    {
        return [
            'admin_email.unique'   => 'An account with this email already exists.',
            'password.confirmed'   => 'Password confirmation does not match.',
        ];
    }
}
