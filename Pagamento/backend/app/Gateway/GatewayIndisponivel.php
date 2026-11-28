<?php

namespace App\Gateway;

use RuntimeException;

/**
 * Erro TEMPORÁRIO: o gateway caiu ou não respondeu a tempo.
 * Diferente de uma recusa (resultado definitivo), aqui o cliente pode tentar de novo
 * com a mesma chave.
 */
class GatewayIndisponivel extends RuntimeException {}
