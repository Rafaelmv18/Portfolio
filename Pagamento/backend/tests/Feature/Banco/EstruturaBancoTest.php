<?php

namespace Tests\Feature\Banco;

use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * Garante que as regras mais importantes ficam no PRÓPRIO banco (PK, UNIQUE, CHECK, FK),
 * e não só no código PHP. Assim nem um bug no código consegue gravar dado inválido.
 */
class EstruturaBancoTest extends TestCase
{
    use RefreshDatabase;

    // Códigos SQLSTATE do PostgreSQL. Exigir o código certo evita que o teste passe
    // por outro motivo (ex.: "tabela não existe" também é uma QueryException).
    private const VIOLA_UNIQUE = '23505';
    private const VIOLA_CHECK = '23514';
    private const VIOLA_FK = '23503';

    // ---------- requisicoes_idempotentes ----------

    public function test_a_mesma_chave_nao_pode_ser_gravada_duas_vezes(): void
    {
        $chave = $this->criarRequisicao();

        $this->esperarViolacao(self::VIOLA_UNIQUE);
        $this->criarRequisicao(['chave' => $chave]);
    }

    public function test_requisicao_rejeita_status_desconhecido(): void
    {
        $this->esperarViolacao(self::VIOLA_CHECK);
        $this->criarRequisicao(['status' => 'QUALQUER']);
    }

    public function test_requisicao_preenche_datas_automaticamente(): void
    {
        $chave = $this->criarRequisicao();

        $requisicao = DB::table('requisicoes_idempotentes')->where('chave', $chave)->first();

        $this->assertNotNull($requisicao->criado_em);
        $this->assertNotNull($requisicao->atualizado_em);
        $this->assertNotNull($requisicao->expira_em);
    }

    // ---------- pagamentos ----------

    public function test_pagamento_usa_brl_como_moeda_padrao(): void
    {
        $id = $this->criarPagamento();

        $this->assertSame('BRL', DB::table('pagamentos')->where('id', $id)->value('moeda'));
    }

    public function test_pagamento_rejeita_valor_zero_ou_negativo(): void
    {
        $this->esperarViolacao(self::VIOLA_CHECK);
        $this->criarPagamento(['valor_centavos' => 0]);
    }

    public function test_pagamento_rejeita_metodo_desconhecido(): void
    {
        $this->esperarViolacao(self::VIOLA_CHECK);
        $this->criarPagamento(['metodo' => 'CHEQUE']);
    }

    public function test_pagamento_rejeita_status_desconhecido(): void
    {
        $this->esperarViolacao(self::VIOLA_CHECK);
        $this->criarPagamento(['status' => 'QUALQUER']);
    }

    public function test_pagamento_exige_que_a_chave_exista_em_requisicoes(): void
    {
        $this->esperarViolacao(self::VIOLA_FK);
        $this->criarPagamento(['chave_idempotente' => (string) Str::uuid()]);
    }

    public function test_uma_chave_gera_no_maximo_um_pagamento(): void
    {
        $chave = $this->criarRequisicao();
        $this->criarPagamento(['chave_idempotente' => $chave]);

        $this->esperarViolacao(self::VIOLA_UNIQUE);
        $this->criarPagamento(['chave_idempotente' => $chave]);
    }

    // ---------- estornos ----------

    public function test_estorno_rejeita_valor_zero_ou_negativo(): void
    {
        $this->esperarViolacao(self::VIOLA_CHECK);
        $this->criarEstorno(['valor_centavos' => -100]);
    }

    public function test_estorno_exige_pagamento_existente(): void
    {
        $this->esperarViolacao(self::VIOLA_FK);
        $this->criarEstorno(['pagamento_id' => (string) Str::uuid()]);
    }

    public function test_uma_chave_gera_no_maximo_um_estorno(): void
    {
        $chave = $this->criarRequisicao();
        $this->criarEstorno(['chave_idempotente' => $chave]);

        $this->esperarViolacao(self::VIOLA_UNIQUE);
        $this->criarEstorno(['chave_idempotente' => $chave]);
    }

    // ---------- ajudantes ----------

    private function esperarViolacao(string $sqlstate): void
    {
        $this->expectException(QueryException::class);
        $this->expectExceptionCode($sqlstate);
    }

    private function criarRequisicao(array $dados = []): string
    {
        $dados = array_merge([
            'chave' => (string) Str::uuid(),
            'endpoint' => 'POST /api/pagamentos',
            'hash_corpo' => hash('sha256', '{}'),
            'status' => 'PROCESSANDO',
        ], $dados);

        DB::table('requisicoes_idempotentes')->insert($dados);

        return $dados['chave'];
    }

    private function criarPagamento(array $dados = []): string
    {
        $dados = array_merge([
            'id' => (string) Str::uuid(),
            'chave_idempotente' => $dados['chave_idempotente'] ?? $this->criarRequisicao(),
            'pedido_id' => 'PED-1001',
            'valor_centavos' => 15990,
            'metodo' => 'CARTAO',
            'status' => 'APROVADO',
        ], $dados);

        DB::table('pagamentos')->insert($dados);

        return $dados['id'];
    }

    private function criarEstorno(array $dados = []): string
    {
        $dados = array_merge([
            'id' => (string) Str::uuid(),
            'chave_idempotente' => $dados['chave_idempotente'] ?? $this->criarRequisicao(),
            'pagamento_id' => $dados['pagamento_id'] ?? $this->criarPagamento(),
            'valor_centavos' => 5000,
        ], $dados);

        DB::table('estornos')->insert($dados);

        return $dados['id'];
    }
}
