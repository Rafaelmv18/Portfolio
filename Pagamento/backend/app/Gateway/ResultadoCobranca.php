<?php

namespace App\Gateway;

/** Resposta do gateway: aprovado (com o id da transação) ou recusado (com o motivo). */
final readonly class ResultadoCobranca
{
    private function __construct(
        public bool $aprovado,
        public ?string $transacaoId,
        public ?string $motivoRecusa,
    ) {}

    public static function aprovado(string $transacaoId): self
    {
        return new self(true, $transacaoId, null);
    }

    public static function recusado(string $motivo): self
    {
        return new self(false, null, $motivo);
    }
}
