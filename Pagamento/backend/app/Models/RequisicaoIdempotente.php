<?php

namespace App\Models;

use App\Enums\StatusRequisicao;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Uma Idempotency-Key recebida e o resultado guardado dela.
 * A chave é gerada pelo CLIENTE, por isso o model não gera a PK sozinho.
 */
class RequisicaoIdempotente extends Model
{
    protected $table = 'requisicoes_idempotentes';

    protected $primaryKey = 'chave';
    protected $keyType = 'string';   // a PK é um UUID, não um número
    public $incrementing = false;    // e não é autoincremento

    const CREATED_AT = 'criado_em';
    const UPDATED_AT = 'atualizado_em';

    protected $fillable = [
        'chave',
        'endpoint',
        'hash_corpo',
        'status',
        'resposta_http',
        'resposta_corpo',
        'expira_em',
    ];

    protected function casts(): array
    {
        return [
            'status' => StatusRequisicao::class,
            'resposta_http' => 'integer',
            'resposta_corpo' => 'array',     // jsonb no banco ↔ array no PHP
            'criado_em' => 'datetime',
            'atualizado_em' => 'datetime',
            'expira_em' => 'datetime',
        ];
    }

    /** O pagamento criado por esta chave (se ela foi usada em POST /api/pagamentos). */
    public function pagamento(): HasOne
    {
        return $this->hasOne(Pagamento::class, 'chave_idempotente', 'chave');
    }

    /** O estorno criado por esta chave (se ela foi usada em POST /api/pagamentos/{id}/estornos). */
    public function estorno(): HasOne
    {
        return $this->hasOne(Estorno::class, 'chave_idempotente', 'chave');
    }
}
