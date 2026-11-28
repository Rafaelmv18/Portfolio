<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Estorno extends Model
{
    use HasUuids;

    protected $table = 'estornos';

    const CREATED_AT = 'criado_em';
    const UPDATED_AT = null;

    protected $fillable = [
        'chave_idempotente',
        'pagamento_id',
        'valor_centavos',
        'motivo',
    ];

    protected function casts(): array
    {
        return [
            'valor_centavos' => 'integer',
            'criado_em' => 'datetime',
        ];
    }

    public function pagamento(): BelongsTo
    {
        return $this->belongsTo(Pagamento::class);
    }

    /** A Idempotency-Key que criou este estorno. */
    public function requisicao(): BelongsTo
    {
        return $this->belongsTo(RequisicaoIdempotente::class, 'chave_idempotente', 'chave');
    }
}
