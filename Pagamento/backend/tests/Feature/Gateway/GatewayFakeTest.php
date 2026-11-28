<?php

namespace Tests\Feature\Gateway;

use App\Enums\MetodoPagamento;
use App\Gateway\GatewayFake;
use App\Gateway\GatewayIndisponivel;
use App\Gateway\GatewayPagamento;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * O gateway simulado decide o resultado pelo FINAL do valor (como os "cartões de teste" da Stripe):
 *   ...02 → recusado
 *   ...03 → cobra, mas a resposta "se perde" (timeout) na primeira chamada
 *   outro → aprovado
 * E, como um gateway real, a mesma chave nunca é cobrada duas vezes.
 */
class GatewayFakeTest extends TestCase
{
    private GatewayPagamento $gateway;

    protected function setUp(): void
    {
        parent::setUp();
        $this->gateway = $this->app->make(GatewayPagamento::class);
    }

    public function test_o_laravel_entrega_o_fake_quando_pedimos_a_interface(): void
    {
        $this->assertInstanceOf(GatewayFake::class, $this->gateway);
        // Sempre a MESMA instância: é ela que os testes inspecionam depois da requisição.
        $this->assertSame($this->gateway, $this->app->make(GatewayPagamento::class));
    }

    public function test_aprova_um_valor_comum(): void
    {
        $resultado = $this->gateway->cobrar($this->chave(), 15990, MetodoPagamento::Cartao);

        $this->assertTrue($resultado->aprovado);
        $this->assertStringStartsWith('TX-', $resultado->transacaoId);
        $this->assertNull($resultado->motivoRecusa);
    }

    public function test_recusa_valor_terminado_em_02(): void
    {
        $resultado = $this->gateway->cobrar($this->chave(), 15902, MetodoPagamento::Cartao);

        $this->assertFalse($resultado->aprovado);
        $this->assertNull($resultado->transacaoId);
        $this->assertSame('saldo insuficiente', $resultado->motivoRecusa);
    }

    public function test_valor_terminado_em_03_da_timeout_mas_o_retry_devolve_a_mesma_cobranca(): void
    {
        $chave = $this->chave();

        try {
            $this->gateway->cobrar($chave, 15903, MetodoPagamento::Pix);
            $this->fail('Deveria ter lançado GatewayIndisponivel');
        } catch (GatewayIndisponivel) {
            // esperado: a cobrança aconteceu, mas a resposta não chegou
        }

        $retry = $this->gateway->cobrar($chave, 15903, MetodoPagamento::Pix);

        $this->assertTrue($retry->aprovado);
        $this->assertSame(1, $this->gateway->totalDeCobrancas(), 'cobrou só uma vez');
    }

    public function test_a_mesma_chave_devolve_a_mesma_transacao_sem_cobrar_de_novo(): void
    {
        $chave = $this->chave();

        $primeira = $this->gateway->cobrar($chave, 15990, MetodoPagamento::Cartao);
        $repetida = $this->gateway->cobrar($chave, 15990, MetodoPagamento::Cartao);

        $this->assertSame($primeira->transacaoId, $repetida->transacaoId);
        $this->assertSame(2, $this->gateway->totalDeChamadas());
        $this->assertSame(1, $this->gateway->totalDeCobrancas());
    }

    public function test_chaves_diferentes_sao_cobrancas_diferentes(): void
    {
        $a = $this->gateway->cobrar($this->chave(), 15990, MetodoPagamento::Cartao);
        $b = $this->gateway->cobrar($this->chave(), 15990, MetodoPagamento::Cartao);

        $this->assertNotSame($a->transacaoId, $b->transacaoId);
        $this->assertSame(2, $this->gateway->totalDeCobrancas());
    }

    private function chave(): string
    {
        return (string) Str::uuid();
    }
}
