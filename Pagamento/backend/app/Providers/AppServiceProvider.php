<?php

namespace App\Providers;

use App\Gateway\GatewayFake;
use App\Gateway\GatewayPagamento;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Quem pedir a interface GatewayPagamento recebe o gateway simulado.
        // Para usar um gateway real, basta trocar a classe aqui.
        // singleton: a mesma instância durante toda a execução (os testes a inspecionam).
        $this->app->singleton(GatewayPagamento::class, GatewayFake::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
