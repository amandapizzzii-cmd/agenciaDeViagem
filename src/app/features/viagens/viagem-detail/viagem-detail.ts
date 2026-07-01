import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Viagem } from '../../../core/models/viagem.model';
import { ViagemApi } from '../../../core/services/viagem-api';

@Component({
  selector: 'app-viagem-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './viagem-detail.html',
  styleUrl: './viagem-detail.css',
})
export class ViagemDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private viagemApiService = inject(ViagemApi);

  viagem?: Viagem;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Pacote de viagem não encontrado';
      this.loading = false;
      return;
    }

    this.viagemApiService.getById(id).subscribe({
      next: (response) => {
        this.viagem = response;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar detalhes do pacote';
        this.loading = false;
      },
    });
  }
}
