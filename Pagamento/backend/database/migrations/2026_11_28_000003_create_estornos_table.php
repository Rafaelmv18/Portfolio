<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('estornos', function (Blueprint $table) {
            $table->uuid('id')->primary();

            // Estorno também é protegido por Idempotency-Key: uma chave, no máximo um estorno.
            $table->uuid('chave_idempotente')->unique();
            $table->foreign('chave_idempotente')
                ->references('chave')->on('requisicoes_idempotentes')
                ->restrictOnDelete();

            $table->foreignUuid('pagamento_id')->constrained('pagamentos')->restrictOnDelete();
            $table->bigInteger('valor_centavos');
            $table->text('motivo')->nullable();
            $table->timestampTz('criado_em')->useCurrent();
        });

        DB::statement('ALTER TABLE estornos ADD CONSTRAINT estornos_valor_positivo
            CHECK (valor_centavos > 0)');
    }

    public function down(): void
    {
        Schema::dropIfExists('estornos');
    }
};
