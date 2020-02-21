import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';

@Component({
  selector: 'app-acesso',
  templateUrl: './acesso.component.html',
  styleUrls: ['./acesso.component.css'],
  animations: [
    trigger('animacao-banner', [
      state('criado', style({
        opacity: 1
      })),
      transition('void => criado', [
        style({
          opacity: 0,
          transform: 'translate(-50px, 0)'
        }),
        animate('500ms 0s ease-in-out') //duraçao, delay e aceleracao
      ])
    ]),

    trigger('animacao-painel', [
      state('criado', style({
        opacity: 1
      })),
      transition('void => criado', [
        style({
          opacity: 0,
          transform: 'translate(50px, 0)'
        }),
        animate('500ms 0s ease-in-out') //duraçao, delay e aceleracao
      ])
    ])
  ]
})
export class AcessoComponent implements OnInit {

  public estadoBanner: string = 'criado'

  public cadastro: boolean = true

  constructor() { }

  ngOnInit() {
  }

}
