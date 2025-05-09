import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RawgService {
  private readonly baseUrl = 'https://api.rawg.io/api/games';
  private readonly apiKey: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    // Aseguramos que la clave exista; si no, lanzamos un error al arrancar
    const key = this.config.get<string>('RAWG_API_KEY');
    if (!key) {
      throw new Error('RAWG_API_KEY no está definida en .env');
    }
    this.apiKey = key;
  }

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
