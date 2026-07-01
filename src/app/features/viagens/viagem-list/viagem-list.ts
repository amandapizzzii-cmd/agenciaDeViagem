import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Viagem } from '../../../core/models/viagem.model';
import { ViagemApi } from '../../../core/services/viagem-api';

@Component({
  selector: 'app-viagem-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './viagem-list.html',
  styleUrl: './viagem-list.css',
})
export class ViagemList implements OnInit {
  private viagemApiService = inject(ViagemApi);
  private router = inject(Router);

  viagens: Viagem[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadViagens();
  }

  loadViagens(): void {
    this.loading = true;
    this.errorMessage = '';

    this.viagemApiService.getAll().subscribe({
      next: (response) => {
        this.viagens = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar viagens:', error);
        this.errorMessage = 'Erro ao carregar os pacotes de viagem...';
        this.loading = false;
      },
    });
  }

  detail(id: string): void {
    this.router.navigate(['/viagens', id]);
  }

  edit(id: string): void {
    this.router.navigate(['/cadastrar-viagem'], {
      queryParams: { id },
    });
  }

  remove(id: string): void {
    const confirmDelete = confirm('Tem certeza que quer excluir este pacote de viagem?');

    if (!confirmDelete) {
      return;
    }

    this.viagemApiService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Pacote excluído com sucesso!';
        this.loadViagens();
        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
      },
      error: () => {
        this.errorMessage = 'Erro ao excluir o pacote.';
      },
    });
  }
}
