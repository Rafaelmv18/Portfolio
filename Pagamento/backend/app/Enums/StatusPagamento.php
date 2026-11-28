<?php

namespace App\Enums;

/** Situação de um pagamento. Mesmos valores do CHECK no banco. */
enum StatusPagamento: string
{
    case Aprovado = 'APROVADO';
    case Recusado = 'RECUSADO';
    case Estornado = 'ESTORNADO';
    case EstornadoParcial = 'ESTORNADO_PARCIAL';
}
