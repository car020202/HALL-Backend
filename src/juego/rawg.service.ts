import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RawgService {
  private readonly baseUrl = 'https://api.rawg.io/api/games'; // URL base de la API
  // Clave de la API, se obtiene del archivo .env
  private readonly apiKey: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    // Inicializa la clave de la API desde el archivo .env
    const key = this.config.get<string>('RAWG_API_KEY');
    if (!key) {
      throw new Error('RAWG_API_KEY no está definida en .env');
    }
    this.apiKey = key;
  }
  // Método para buscar juegos en la API de RAWG
  // Recibe un query de búsqueda, una página y un tamaño de página
  // Devuelve una promesa con los datos de la búsqueda
  // Si hay un error, lanza una excepción con el estado 502
  async searchGames(query: string, page = 1, pageSize = 20): Promise<any> {
    const url =
      `${this.baseUrl}?key=${this.apiKey}` +
      `&search=${encodeURIComponent(query)}` +
      `&page=${page}&page_size=${pageSize}`;
    try {
      const { data } = await firstValueFrom(this.http.get<any>(url));
      return data;
    } catch (err) {
      throw new HttpException(
        'Error al obtener juegos de RAWG',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
  // Método para obtener un juego por su ID
  // Recibe un ID de juego
  // Devuelve una promesa con los datos del juego
  // Si hay un error, lanza una excepción con el estado 404
  async getGameById(id: number): Promise<any> {
    const url = `${this.baseUrl}/${id}?key=${this.apiKey}`;
    try {
      const { data } = await firstValueFrom(this.http.get<any>(url));
      return data;
    } catch {
      throw new HttpException(
        'Juego no encontrado en RAWG',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
