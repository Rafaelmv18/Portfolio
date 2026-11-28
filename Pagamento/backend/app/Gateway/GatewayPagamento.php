<?php

namespace App\Gateway;

use App\Enums\MetodoPagamento;

/**
 * Contrato de qualquer gateway de pagamento (o simulado hoje, um real amanhã).
 * O resto do sistema depende SÓ desta interface, nunca de uma implementação.
 */
interface GatewayPagamento
{
    /**
     * Cobra o valor. A MESMA chave nunca é cobrada duas vezes: repetir a chamada
     * devolve o mesmo resultado da primeira.
     *
     * @throws GatewayIndisponivel quando o gateway está fora do ar ou não respondeu a tempo.
     *         Atenção: isso NÃO garante que a cobrança não aconteceu. Por isso o retry
     *         precisa usar a mesma chave.
     */
    public function cobrar(string $chave, int $valorCentavos, MetodoPagamento $metodo): ResultadoCobranca;
}
