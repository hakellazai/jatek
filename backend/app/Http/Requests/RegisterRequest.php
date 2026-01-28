<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => ['required', 'string', 'unique:users', 'min:3', 'max:20', 'regex:/^[a-zA-Z0-9_]+$/'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ];
    }

    public function messages(): array
    {
        return [
            'username.regex' => 'A felhasználónév csak betűket, számokat és aláhúzást tartalmazhat.',
            'password.confirmed' => 'A jelszavak nem egyeznek.',
        ];
    }
}
