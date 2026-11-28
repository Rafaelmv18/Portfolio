<?php

namespace App\Enums;

/** Formas de pagamento aceitas. Mesmos valores do CHECK no banco. */
enum MetodoPagamento: string
{
    case Pix = 'PIX';
    case Cartao = 'CARTAO';
    case Boleto = 'BOLETO';
}
