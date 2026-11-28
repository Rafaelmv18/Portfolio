<?php

namespace App\Gateway;

use App\Enums\MetodoPagamento;
use Illuminate\Contracts\Cache\Repository as Cache;
use Illuminate\Support\Str;

/**
 * Gateway simulado. O resultado depende do FINAL do valor em centavos:
 *
 *   ...02 → recusado ("saldo insuficiente")
 *   ...03 → cobra, mas a resposta "se perde": a 1ª chamada lança GatewayIndisponivel
 *           e o retry com a mesma chave recebe a cobrança que já tinha sido feita
 *   outro → aprovado
 *
 * Como um gateway real, ele é idempotente pela chave: guarda o resultado de cada chave
 * (no cache do Laravel, para valer entre requisições) e o devolve nas repetições.
 */
class GatewayFake implements GatewayPagamento
{
    private int $chamadas = 0;
    private int $cobrancas = 0;

    public function __construct(private Cache $cache) {}

    public function cobrar(string $chave, int $valorCentavos, MetodoPagamento $metodo): ResultadoCobranca
    {
        $this->chamadas++;
        $nome = "gateway-fake:{$chave}";

        // Chave já vista → devolve o MESMO resultado, sem cobrar de novo.
        if ($guardado = $this->cache->get($nome)) {
            return $this->paraResultado($guardado);
        }

        $this->cobrancas++;
        $resultado = match ($valorCentavos % 100) {
            2 => ResultadoCobranca::recusado('saldo insuficiente'),
            default => ResultadoCobranca::aprovado('TX-'.Str::upper(Str::random(12))),
        };
        // Guarda um array simples (e não o objeto): o cache do Laravel pode recusar
        // desserializar objetos, por segurança.
        $this->cache->put($nome, [
            'aprovado' => $resultado->aprovado,
            'transacao_id' => $resultado->transacaoId,
            'motivo_recusa' => $resultado->motivoRecusa,
        ], now()->addDay());

        // Timeout simulado: a cobrança foi feita e guardada, mas a resposta não chega.
        if ($valorCentavos % 100 === 3) {
            throw new GatewayIndisponivel('Gateway não respondeu a tempo');
        }

        return $resultado;
    }

    private function paraResultado(array $guardado): ResultadoCobranca
    {
        return $guardado['aprovado']
            ? ResultadoCobranca::aprovado($guardado['transacao_id'])
            : ResultadoCobranca::recusado($guardado['motivo_recusa']);
    }

    /** Quantas vezes o gateway foi chamado (inclui repetições). Usado nos testes. */
    public function totalDeChamadas(): int
    {
        return $this->chamadas;
    }

    /** Quantas cobranças NOVAS foram feitas (repetições não contam). Usado nos testes. */
    public function totalDeCobrancas(): int
    {
        return $this->cobrancas;
    }
}
