<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:50'],
            'is_private' => ['sometimes', 'boolean'],
            'max_players' => ['required', 'integer', 'min:2', 'max:6'],
        ];
    }
}
