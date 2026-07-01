import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ViagemApi } from '../../../core/services/viagem-api';

@Component({
  selector: 'app-viagem-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './viagem-form.html',
  styleUrl: './viagem-form.css',
})
export class ViagemForm implements OnInit {
  private fb = inject(FormBuilder);
  private viagemApiService = inject(ViagemApi);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  editingId: string | null = null;
  loading = false;
  loadingData = false;
  successMessage = '';
  errorMessage = '';

  form = this.fb.nonNullable.group({
    destino: ['', [Validators.required, Validators.minLength(3)]],
    duracao: ['', [Validators.required]],
    preco: [0, [Validators.required, Validators.min(1)]],
    tipoViagem: ['', [Validators.required]],
    descricao: ['', [Validators.required, Validators.minLength(10)]],
    imagem: ['', [Validators.required]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.editingId = id;
      this.loadViagem(this.editingId);
    }
  }

  loadViagem(id: string): void {
    this.loadingData = true;
    this.viagemApiService.getById(id).subscribe({
      next: (viagem) => {
        this.form.patchValue({
          destino: viagem.destino,
          duracao: viagem.duracao,
          preco: viagem.preco,
          tipoViagem: viagem.tipoViagem,
          descricao: viagem.descricao,
          imagem: viagem.imagem,
        });
        this.loadingData = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar os dados da viagem.';
        this.loadingData = false;
      },
    });
  }

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.form.getRawValue();

    const viagemData = {
      destino: formValue.destino,
      duracao: formValue.duracao,
      preco: formValue.preco,
      tipoViagem: formValue.tipoViagem,
      descricao: formValue.descricao,
      imagem: formValue.imagem,
    };

    if (this.editingId !== null) {
      this.viagemApiService.update(this.editingId, viagemData).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Viagem atualizada com sucesso!';
          setTimeout(() => {
            this.router.navigate(['/viagens']);
          }, 1000);
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Erro ao atualizar a viagem.';
        },
      });
      return;
    }

    this.viagemApiService.create(viagemData).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Viagem cadastrada com sucesso!';
        this.form.reset();

        setTimeout(() => {
          this.router.navigate(['/viagens']);
        }, 1000);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Erro ao cadastrar viagem.';
      },
    });
  }
}
