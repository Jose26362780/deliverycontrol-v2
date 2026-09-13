import { EmployeeService } from '../../employees/services/employee.service';
import { Employee } from '../../../types';
import { EmployeeFormValues } from '../../employees/schemas/employee.schema';

export class ServicoFuncionario {
  public static async listar(): Promise<Employee[]> {
    return EmployeeService.list();
  }

  public static async obterPorId(id: string): Promise<Employee> {
    return EmployeeService.getById(id);
  }

  public static async criar(dados: EmployeeFormValues): Promise<Employee> {
    return EmployeeService.create(dados);
  }

  public static async atualizar(id: string, dados: EmployeeFormValues): Promise<Employee> {
    return EmployeeService.update(id, dados);
  }

  public static async excluir(id: string): Promise<{ success: boolean }> {
    return EmployeeService.delete(id);
  }
}

export const servicoFuncionario = ServicoFuncionario;
export const employeeService = ServicoFuncionario;
export default ServicoFuncionario;
