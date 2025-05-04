import { Injectable, UnauthorizedException } from '@nestjs/common';

export type User = {
  id: number;
  email: string;
  password: string;
  role: string;
};

@Injectable()
export class AuthService {
  // Usuarios “en memoria”
  private users: User[] = [
    { id: 1, email: 'test@example.com', password: '1234', role: 'USER' },
  ];

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'>> {
    const user = this.users.find(
      (u) => u.email === email && u.password === pass,
    );
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    // no devolvemos el password
    const { password, ...result } = user;
    return result;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    // para ahora, devolvemos solo el usuario simulado
    return { accessToken: 'fake-jwt-token', user };
  }

  async register(email: string, password: string) {
    const exists = this.users.find((u) => u.email === email);
    if (exists) throw new UnauthorizedException('Usuario ya existe');
    const newUser: User = {
      id: this.users.length + 1,
      email,
      password,
      role: 'USER',
    };
    this.users.push(newUser);
    const { password: _, ...user } = newUser;
    return user;
  }
}
