<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pagamentos', function (Blueprint $table) {
            $table->uuid('id')->primary();

            // UNIQUE: uma chave gera no máximo UM pagamento.
            // FK: o pagamento só existe se a chave foi registrada antes.
            $table->uuid('chave_idempotente')->unique();
            $table->foreign('chave_idempotente')
                ->references('chave')->on('requisicoes_idempotentes')
                ->restrictOnDelete();

            $table->string('pedido_id', 50)->index();     // índice: busca por pedido
            $table->bigInteger('valor_centavos');         // dinheiro em centavos, nunca float
            $table->char('moeda', 3)->default('BRL');
            $table->string('metodo', 10);
            $table->string('status', 20);
            $table->string('gateway_transacao_id', 100)->nullable();
            $table->string('motivo_recusa', 100)->nullable();
            $table->timestampTz('criado_em')->useCurrent();
        });

        DB::statement('ALTER TABLE pagamentos ADD CONSTRAINT pagamentos_valor_positivo
            CHECK (valor_centavos > 0)');
        DB::statement("ALTER TABLE pagamentos ADD CONSTRAINT pagamentos_metodo_valido
            CHECK (metodo IN ('PIX', 'CARTAO', 'BOLETO'))");
        DB::statement("ALTER TABLE pagamentos ADD CONSTRAINT pagamentos_status_valido
            CHECK (status IN ('APROVADO', 'RECUSADO', 'ESTORNADO', 'ESTORNADO_PARCIAL'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('pagamentos');
    }
};
