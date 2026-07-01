import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = 'https://agenciaviagem-d8f8a-default-rtdb.firebaseio.com/usuarios';
  private sufix = '.json';

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<Record<string, Usuario> | null>(this.apiUrl + this.sufix).pipe(
      map((response) => {
        if (!response) {
          throw new Error('Usuário inválido!');
        }
        const usuarios = Object.values(response);

        console.log(usuarios);
        const usuario = usuarios.find((item) => item.email === email && item.password === password);

        if (!usuario) {
          throw new Error('Usuário inválido!');
        }
        localStorage.setItem('token', usuario.token);
        localStorage.setItem('usuario', JSON.stringify(usuario));
        return true;
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  isAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserName(): string {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      return '';
    }
    return JSON.parse(usuario).nome;
  }
}
