import { Component } from '@angular/core';
import { PostForm } from './components/post-form/post-form';

@Component({
  imports: [PostForm],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
