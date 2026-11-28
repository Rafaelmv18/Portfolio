<?php

namespace Tests\Feature\Models;

use App\Enums\MetodoPagamento;
use App\Enums\StatusPagamento;
use App\Enums\StatusRequisicao;
use App\Models\Estorno;
use App\Models\Pagamento;
use App\Models\RequisicaoIdempotente;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * Os models só mapeiam as tabelas: PK, conversão de campos e relacionamentos.
 * As regras de negócio ficam no middleware e nos serviços (próximas fases).
 */
class ModelsTest extends TestCase
{
    use RefreshDatabase;

    public function test_requisicao_usa_a_chave_como_pk(): void
    {
        $chave = (string) Str::uuid();
        $this->criarRequisicao($chave);

        $requisicao = RequisicaoIdempotente::find($chave);

        $this->assertNotNull($requisicao);
        $this->assertSame($chave, $requisicao->chave);
    }

    public function test_requisicao_converte_os_campos(): void
    {
        $requisicao = $this->criarRequisicao(dados: [
            'status' => StatusRequisicao::Concluido,
            'resposta_http' => 201,
            'resposta_corpo' => ['id' => 'abc', 'status' => 'APROVADO'],
        ])->fresh();

        $this->assertSame(StatusRequisicao::Concluido, $requisicao->status);
        $this->assertSame(201, $requisicao->resposta_http);
        $this->assertSame(['id' => 'abc', 'status' => 'APROVADO'], $requisicao->resposta_corpo);
        $this->assertInstanceOf(Carbon::class, $requisicao->expira_em);
        $this->assertTrue($requisicao->expira_em->greaterThan($requisicao->criado_em));
    }

    public function test_pagamento_gera_o_proprio_uuid_e_converte_os_campos(): void
    {
        $pagamento = $this->criarPagamento()->fresh();

        $this->assertTrue(Str::isUuid($pagamento->id));
        $this->assertSame(15990, $pagamento->valor_centavos);
        $this->assertSame(MetodoPagamento::Cartao, $pagamento->metodo);
        $this->assertSame(StatusPagamento::Aprovado, $pagamento->status);
        $this->assertSame('BRL', $pagamento->moeda);
        $this->assertInstanceOf(Carbon::class, $pagamento->criado_em);
    }

    public function test_requisicao_e_pagamento_se_conhecem(): void
    {
        $requisicao = $this->criarRequisicao();
        $pagamento = $this->criarPagamento($requisicao);

        $this->assertTrue($requisicao->pagamento->is($pagamento));
        $this->assertTrue($pagamento->requisicao->is($requisicao));
    }

    public function test_pagamento_tem_varios_estornos(): void
    {
        $pagamento = $this->criarPagamento();
        $primeiro = $this->criarEstorno($pagamento, 3000);
        $segundo = $this->criarEstorno($pagamento, 2000);

        $this->assertCount(2, $pagamento->estornos);
        $this->assertTrue($primeiro->pagamento->is($pagamento));
        $this->assertSame(2000, $segundo->fresh()->valor_centavos);
    }

    public function test_estorno_conhece_a_propria_requisicao(): void
    {
        $estorno = $this->criarEstorno($this->criarPagamento(), 1000);

        $this->assertInstanceOf(RequisicaoIdempotente::class, $estorno->requisicao);
        $this->assertTrue($estorno->requisicao->estorno->is($estorno));
    }

    // ---------- ajudantes ----------

    private function criarRequisicao(?string $chave = null, array $dados = []): RequisicaoIdempotente
    {
        return RequisicaoIdempotente::create(array_merge([
            'chave' => $chave ?? (string) Str::uuid(),
            'endpoint' => 'POST /api/pagamentos',
            'hash_corpo' => hash('sha256', '{}'),
            'status' => StatusRequisicao::Processando,
        ], $dados));
    }

    private function criarPagamento(?RequisicaoIdempotente $requisicao = null): Pagamento
    {
        return Pagamento::create([
            'chave_idempotente' => ($requisicao ?? $this->criarRequisicao())->chave,
            'pedido_id' => 'PED-1001',
            'valor_centavos' => 15990,
            'metodo' => MetodoPagamento::Cartao,
            'status' => StatusPagamento::Aprovado,
        ]);
    }

    private function criarEstorno(Pagamento $pagamento, int $valorCentavos): Estorno
    {
        return Estorno::create([
            'chave_idempotente' => $this->criarRequisicao(dados: ['endpoint' => 'POST /api/pagamentos/{id}/estornos'])->chave,
            'pagamento_id' => $pagamento->id,
            'valor_centavos' => $valorCentavos,
        ]);
    }
}
