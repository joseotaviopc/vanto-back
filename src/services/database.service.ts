import { query } from "../config/database";
import { Titulo, Usuario, Automovel, AutomovelModalidade, PaginatedResponse, TitulosByUser } from "../types/index";

export class DatabaseService {
  static async getAllTitulos(page: number, limit: number): Promise<PaginatedResponse<Titulo>> {
    const offset = (page - 1) * limit;
    
    const [results, totalResults] = await Promise.all([
      query<Titulo[]>('SELECT * FROM view_app_titulos LIMIT ? OFFSET ?', [limit, offset]),
      query<[{total: number}]>('SELECT COUNT(*) as total FROM view_app_titulos', [])
    ]);

    return {
      data: results,
      pagination: {
        total: totalResults[0].total,
        page,
        limit,
        totalPages: Math.ceil(totalResults[0].total / limit)
      }
    };
  }

  static async getAllTitulosGroupedByUser(page: number, limit: number): Promise<PaginatedResponse<TitulosByUser>> {
    const offset = (page - 1) * limit;

    // const [results, totalResults] = await Promise.all([
    //   query<Titulo[]>('SELECT * FROM view_app_titulos GROUP BY id_usuario LIMIT ? OFFSET ?', [limit, offset]),
    //   query<[{total: number}]>('SELECT COUNT(DISTINCT id_usuario) as total FROM view_app_titulos', [])
    // ]);
    const [results, totalResults] = await Promise.all([
      query<TitulosByUser[]>('SELECT id_usuario, COUNT(*) as titulo_count FROM view_app_titulos GROUP BY id_usuario ORDER BY titulo_count DESC LIMIT ? OFFSET ?', [limit, offset]),
      query<[{total: number}]>('SELECT COUNT(DISTINCT id_usuario) as total FROM view_app_titulos', [])
    ]);

    return {
      data: results,
      pagination: {
        total: totalResults[0].total,
        page,
        limit,
        totalPages: Math.ceil(totalResults[0].total / limit)
      }
    };
}

  static async getTitulos(userId: number, page: number, limit: number): Promise<PaginatedResponse<Titulo>> {
    const offset = (page - 1) * limit;
    
    const [results, totalResults] = await Promise.all([
      query<Titulo[]>('SELECT * FROM view_app_titulos WHERE id_usuario = ? LIMIT ? OFFSET ?', [userId, limit, offset]),
      query<[{total: number}]>('SELECT COUNT(*) as total FROM view_app_titulos WHERE id_usuario = ?', [userId])
    ]);

    return {
      data: results,
      pagination: {
        total: totalResults[0].total,
        page,
        limit,
        totalPages: Math.ceil(totalResults[0].total / limit)
      }
    };
  }

  static async getUsuarios(page: number, limit: number): Promise<PaginatedResponse<Usuario>> {
    const offset = (page - 1) * limit;
    
    const [results, totalResults] = await Promise.all([
      query<Usuario[]>('SELECT * FROM view_app_usuarios LIMIT ? OFFSET ?', [limit, offset]),
      query<[{total: number}]>('SELECT COUNT(*) as total FROM view_app_usuarios')
    ]);

    return {
      data: results,
      pagination: {
        total: totalResults[0].total,
        page,
        limit,
        totalPages: Math.ceil(totalResults[0].total / limit)
      }
    };
  }

  static async getUsuarioByCpf(cpf_cnpj: string): Promise<Usuario> {
    const [results] = await Promise.all([
      query<Usuario[]>('SELECT * FROM view_app_usuarios WHERE cpf_cnpj = ?', [cpf_cnpj]),
    ]);

    return results[0];
  }

  static async getUsuarioById(id: number): Promise<Usuario> {
    const [results] = await Promise.all([
      query<Usuario[]>('SELECT * FROM view_app_usuarios WHERE id_usuario = ?', [id]),
    ]);

    return results[0];
  }

  static async getAutomoveisById(id_usuario: number, page: number, limit: number): Promise<PaginatedResponse<Automovel>> {
    const offset = (page - 1) * limit;
    
    const [results, totalResults] = await Promise.all([
      query<Automovel[]>('SELECT * FROM view_app_automoveis WHERE id_usuario = ? LIMIT ? OFFSET ?', [id_usuario, limit, offset]),
      query<[{total: number}]>('SELECT COUNT(*) as total FROM view_app_automoveis WHERE id_usuario = ?', [id_usuario])
  ]);

    return {
      data: results,
      pagination: {
        total: totalResults[0].total,
        page,
        limit,
        totalPages: Math.ceil(totalResults[0].total / limit)
      }
    };
  }

  static async getAutomoveisModalidade(page: number, limit: number): Promise<PaginatedResponse<AutomovelModalidade>> {
    const offset = (page - 1) * limit;
    
    const [results, totalResults] = await Promise.all([
      query<AutomovelModalidade[]>('SELECT * FROM view_app_automoveis_modalidade LIMIT ? OFFSET ?', [limit, offset]),
      query<[{total: number}]>('SELECT COUNT(*) as total FROM view_app_automoveis_modalidade')
    ]);

    return {
      data: results,
      pagination: {
        total: totalResults[0].total,
        page,
        limit,
        totalPages: Math.ceil(totalResults[0].total / limit)
      }
    };
  }

  // Add methods for filtering and searching
  static async searchAutomoveis(search: string, page: number, limit: number): Promise<PaginatedResponse<Automovel>> {
    const offset = (page - 1) * limit;
    const searchPattern = `%${search}%`;
    
    const [results, totalResults] = await Promise.all([
      query<Automovel[]>(
        'SELECT * FROM view_app_automoveis WHERE placa LIKE ? OR marca LIKE ? OR modelo LIKE ? LIMIT ? OFFSET ?',
        [searchPattern, searchPattern, searchPattern, limit, offset]
      ),
      query<[{total: number}]>(
        'SELECT COUNT(*) as total FROM view_app_automoveis WHERE placa LIKE ? OR marca LIKE ? OR modelo LIKE ?',
        [searchPattern, searchPattern, searchPattern]
      )
    ]);

    return {
      data: results,
      pagination: {
        total: totalResults[0].total,
        page,
        limit,
        totalPages: Math.ceil(totalResults[0].total / limit)
      }
    };
  }

  static async authenticateUser(cpf_cnpj: string, data_nascimento: string): Promise<Usuario | null> {
    // Extract the date part from the input
    const datePart = data_nascimento;

    const results = await query<Usuario[]>(
        'SELECT * FROM view_app_usuarios WHERE cpf_cnpj = ? AND data_nascimento LIKE ?',
        [cpf_cnpj, `${datePart}%`] // Use the date part for comparison
    );
    
    return results.length > 0 ? results[0] : null;
  }
}
