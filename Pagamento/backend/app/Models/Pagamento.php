<?php

namespace App\Models;

use App\Enums\MetodoPagamento;
use App\Enums\StatusPagamento;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pagamento extends Model
{
    use HasUuids; // gera o UUID do id automaticamente ao criar

    protected $table = 'pagamentos';

    const CREATED_AT = 'criado_em';
    const UPDATED_AT = null; // a tabela não tem coluna de atualização

    protected $fillable = [
        'chave_idempotente',
        'pedido_id',
        'valor_centavos',
        'moeda',
        'metodo',
        'status',
        'gateway_transacao_id',
        'motivo_recusa',
    ];

    protected function casts(): array
    {
        return [
            'valor_centavos' => 'integer',
            'metodo' => MetodoPagamento::class,
            'status' => StatusPagamento::class,
            'criado_em' => 'datetime',
        ];
    }

    /** A Idempotency-Key que criou este pagamento. */
    public function requisicao(): BelongsTo
    {
        return $this->belongsTo(RequisicaoIdempotente::class, 'chave_idempotente', 'chave');
    }

    public function estornos(): HasMany
    {
        return $this->hasMany(Estorno::class);
    }
}
