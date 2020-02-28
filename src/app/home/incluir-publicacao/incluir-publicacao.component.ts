import { Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Bd } from 'src/app/bd.service';
import * as firebase from 'firebase'
import { Progresso } from 'src/app/progresso.service';
import { Observable, Subject } from 'rxjs';
import { interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-incluir-publicacao',
  templateUrl: './incluir-publicacao.component.html',
  styleUrls: ['./incluir-publicacao.component.css']
})
export class IncluirPublicacaoComponent implements OnInit {

  @Output() public atualizarTimeLine: EventEmitter<any> = new EventEmitter

  public email: string

  private imagem: any

  public progressoPublicacao: string = 'pendente'
  public porcetagemUpload: number

  public formulario: FormGroup = new FormGroup({
    'titulo': new FormControl(null)
  })

  constructor(
    private bd: Bd,
    private progresso: Progresso
  ) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email
    })
  }

  

  public publicar(): void {
    this.bd.publicar({
      email: this.email,
      titulo: this.formulario.value.titulo,
      imagem: this.imagem[0]
    })

    let acompanhamentoUpload = interval(1500);
    let continua = new Subject<boolean>();
    continua.next (true);
 
    acompanhamentoUpload.pipe (
      takeUntil (continua)
    ).subscribe (() => {
      //console.log (this.progresso.estado);
      //console.log (this.progresso.status);
      this.progressoPublicacao = 'andamento'

      this.porcetagemUpload = Math.round((this.progresso.estado.bytesTranferred / this.progresso.estado.totalBytes) * 100)

      if (this.progresso.status === 'concluido') {
        this.progressoPublicacao = 'concluido'
        //emitir evento
        this.atualizarTimeLine.emit()
        continua.next (false);
      }
      
    });

  }

  preparaimagemUpload($event: Event): void {
    this.imagem = (<HTMLInputElement>event.target).files
  }

}
