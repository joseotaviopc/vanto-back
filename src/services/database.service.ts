import { query } from "../config/database";
import { Titulo, Usuario, Automovel, AutomovelModalidade, PaginatedResponse, TitulosByUser } from "../types/index";

export class DatabaseService {
  static async getAllTitulos(page: number, limit: number): Promise<PaginatedResponse<Titulo>> {
    const offset = (page - 1) * limit;

    const [results, totalResults] = await Promise.all([
      query<Titulo[]>('SELECT * FROM view_app_titulos GROUP BY id_contrato LIMIT ? OFFSET ?', [limit, offset]),
      query<[{ total: number }]>('SELECT COUNT(*) as total FROM view_app_titulos', [])
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
    const results = await query<Titulo[]>('SELECT * FROM view_app_titulos')
    // query<[{total: number}]>('SELECT COUNT(DISTINCT id_usuario) as total FROM view_app_titulos', [])

    const groupedResults = results.reduce((acc, titulo) => {
      const { id_contrato, id_usuario } = titulo;
      const existingGroup = acc.find(group => group.id_contrato === id_contrato);

      if (existingGroup) {
        existingGroup.titulos.push(titulo);
        existingGroup.total_titulos += 1;
      } else {
        acc.push({ id_contrato, id_usuario, total_titulos: 1, titulos: [titulo] });
      }

      return acc;
    }, [] as { id_usuario: number, id_contrato: number, total_titulos: number, titulos: Titulo[] }[]);

    console.log(groupedResults.length);


    return {
      data: groupedResults.slice(0, 9),
      pagination: {
        total: groupedResults.length,
        page,
        limit,
        totalPages: Math.ceil(groupedResults.length / limit)
      }
    };
  }

  static async getTitulos(userId: number, page: number, limit: number): Promise<PaginatedResponse<Titulo>> {
    const offset = (page - 1) * limit;

    const [results, totalResults] = await Promise.all([
      query<Titulo[]>('SELECT * FROM view_app_titulos WHERE id_usuario = ? LIMIT ? OFFSET ?', [userId, limit, offset]),
      query<[{ total: number }]>('SELECT COUNT(*) as total FROM view_app_titulos WHERE id_usuario = ?', [userId])
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
      query<[{ total: number }]>('SELECT COUNT(*) as total FROM view_app_usuarios')
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
      query<[{ total: number }]>('SELECT COUNT(*) as total FROM view_app_automoveis WHERE id_usuario = ?', [id_usuario])
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

  static async getAutomoveisModalidadeById(id_usuario: number, page: number, limit: number): Promise<PaginatedResponse<AutomovelModalidade>> {
    const offset = (page - 1) * limit;

    const [results, totalResults] = await Promise.all([
      query<AutomovelModalidade[]>('SELECT * FROM view_app_automoveis_modalidade WHERE id_usuario = ? LIMIT ? OFFSET ?', [id_usuario, limit, offset]),
      query<[{ total: number }]>('SELECT COUNT(*) as total FROM view_app_automoveis_modalidade WHERE id_usuario = ?', [id_usuario])
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
      query<[{ total: number }]>(
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
