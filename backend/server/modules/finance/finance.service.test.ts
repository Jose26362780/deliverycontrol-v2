import { FinanceService } from './finance.service';

/**
 * Testes das regras de negócio financeiras
 * Exemplo especificado no documento:
 * Entrada:
 * Receita: R$ 1.000
 * Gasolina: R$ 100
 * 
 * Resultado esperado:
 * Receita líquida: R$ 900
 * Carro:         R$ 450 (50%)
 * Funcionário A: R$ 225 (25%)
 * Funcionário B: R$ 225 (25%)
 */
export function runFinanceRuleTests(): boolean {
  console.log('--- Executando Testes de Regras Financeiras ---');
  
  // Test 1: Standard rule 50/25/25 with R$ 1000 gross and R$ 100 gasoline
  const result1 = FinanceService.calculateFinancialSplit(1000, 100, {
    userId: 'test',
    carPercentage: 50,
    employeeAPercentage: 25,
    employeeBPercentage: 25
  });

  const passed1 = 
    result1.grossRevenue === 1000 &&
    result1.gasolineExpense === 100 &&
    result1.netRevenue === 900 &&
    result1.carAmount === 450 &&
    result1.employeeAAmount === 225 &&
    result1.employeeBAmount === 225;

  if (!passed1) {
    console.error('❌ Teste 1 Falhou:', result1);
    return false;
  }
  console.log('✅ Teste 1 Passou: Divisão padrão 50/25/25 (R$ 1000 - R$ 100 = R$ 900 -> R$ 450 / R$ 225 / R$ 225)');

  // Test 2: Custom percentage rule (e.g. 40% Carro, 30% Func A, 30% Func B)
  const result2 = FinanceService.calculateFinancialSplit(2000, 200, {
    userId: 'test',
    carPercentage: 40,
    employeeAPercentage: 30,
    employeeBPercentage: 30
  });

  const passed2 =
    result2.netRevenue === 1800 &&
    result2.carAmount === 720 &&
    result2.employeeAAmount === 540 &&
    result2.employeeBAmount === 540;

  if (!passed2) {
    console.error('❌ Teste 2 Falhou:', result2);
    return false;
  }
  console.log('✅ Teste 2 Passou: Divisão customizada 40/30/30 (R$ 1800 -> R$ 720 / R$ 540 / R$ 540)');

  // Test 3: Edge case: Zero revenue or gasoline > revenue
  const result3 = FinanceService.calculateFinancialSplit(50, 100);
  const passed3 = result3.netRevenue === 0 && result3.carAmount === 0;

  if (!passed3) {
    console.error('❌ Teste 3 Falhou:', result3);
    return false;
  }
  console.log('✅ Teste 3 Passou: Despesa de gasolina maior que receita evita valores negativos');

  console.log('--- Todos os Testes Financeiros Passaram com Sucesso! ---');
  return true;
}
