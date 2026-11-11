import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Post } from '../../interfaces/post.interface';

@Component({
  selector: 'app-post-form',
  imports: [ReactiveFormsModule, NgbDatepickerModule],
  templateUrl: './post-form.html',
  styleUrl: './post-form.css',
})
export class PostForm {
  // Opciones del select de categoría
  categorias: string[] = ['Tecnología', 'Diseño', 'Programación', 'Novedades'];

  // Ahora todos los controles van agrupados en un FormGroup
  postForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    category: new FormControl('', Validators.required),
    tags: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    publishNow: new FormControl(true),
    publishDate: new FormControl<NgbDateStruct | null>({ value: null, disabled: true }),
  });

  // Lista donde guardo los posts creados
  posts: Post[] = [];

  constructor() {
    // Si marco "Programar fecha" la fecha pasa a ser obligatoria
    const fecha = this.postForm.controls.publishDate;
    this.postForm.controls.publishNow.valueChanges.subscribe((valor) => {
      if (valor) {
        fecha.reset();
        fecha.clearValidators();
        fecha.disable();
      } else {
        fecha.setValidators(Validators.required);
        fecha.enable();
      }
      fecha.updateValueAndValidity();
    });
  }

  // Fecha mínima del datepicker = hoy
  hoy(): NgbDateStruct {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  }

  // Muestra el error si el campo se ha tocado o se ha intentado enviar
  mostrarError(campo: string): boolean {
    const control = this.postForm.get(campo);
    return !!control && control.invalid && control.touched;
  }

  guardar() {
    if (this.postForm.invalid) {
      // Marco todo como tocado para que salgan los errores
      this.postForm.markAllAsTouched();
      return;
    }

    // getRawValue() incluye también los controles deshabilitados
    const valores = this.postForm.getRawValue();

    let fecha: string | null = null;
    const f = valores.publishDate;
    if (!valores.publishNow && f) {
      fecha = `${f.year}-${String(f.month).padStart(2, '0')}-${String(f.day).padStart(2, '0')}`;
    }

    // Paso las etiquetas de "a, b, c" a un array sin espacios ni vacíos
    const listaTags = (valores.tags ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '');

    const post: Post = {
      id: this.posts.length + 1,
      title: valores.title!,
      description: valores.description!,
      category: valores.category!,
      tags: listaTags,
      email: valores.email!,
      publishNow: valores.publishNow!,
      publishDate: fecha,
    };

    this.posts.push(post);
    console.log('Post guardado:', post);
    this.limpiar();
  }

  limpiar() {
    this.postForm.reset({
      title: '',
      description: '',
      category: '',
      tags: '',
      email: '',
      publishNow: true,
      publishDate: null,
    });
  }
}
