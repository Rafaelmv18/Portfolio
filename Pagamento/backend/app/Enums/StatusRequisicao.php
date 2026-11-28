<?php

namespace App\Enums;

/** Situação de uma Idempotency-Key. Mesmos valores do CHECK no banco. */
enum StatusRequisicao: string
{
    case Processando = 'PROCESSANDO'; // a primeira requisição ainda não terminou
    case Concluido = 'CONCLUIDO';     // terminou com sucesso, a resposta está guardada
    case Falhou = 'FALHOU';           // terminou com erro DEFINITIVO (ex.: cartão recusado)
}
