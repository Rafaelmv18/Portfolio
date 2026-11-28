<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Uma linha por Idempotency-Key recebida. A chave é a PK: o PostgreSQL não deixa
 * gravar a mesma chave duas vezes, e é isso que impede a cobrança dupla.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('requisicoes_idempotentes', function (Blueprint $table) {
            $table->uuid('chave')->primary();
            $table->string('endpoint', 100);
            $table->char('hash_corpo', 64);              // SHA-256 do corpo, em hexadecimal
            $table->string('status', 20);
            $table->smallInteger('resposta_http')->nullable();
            $table->jsonb('resposta_corpo')->nullable();  // devolvida idêntica nas repetições
            $table->timestampTz('criado_em')->useCurrent();
            $table->timestampTz('atualizado_em')->useCurrent();
            $table->timestampTz('expira_em')->default(DB::raw("now() + interval '24 hours'"));
        });

        DB::statement("ALTER TABLE requisicoes_idempotentes ADD CONSTRAINT requisicoes_status_valido
            CHECK (status IN ('PROCESSANDO', 'CONCLUIDO', 'FALHOU'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('requisicoes_idempotentes');
    }
};
