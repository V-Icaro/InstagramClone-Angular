import * as firebase from 'firebase'
import { Injectable } from '@angular/core'
import { Progresso } from './progresso.service'

@Injectable()
export class Bd {
    
    constructor(private progresso: Progresso){}



    public publicar(publicacao: any): void {

        firebase.database().ref(`publicacoes/${btoa(publicacao.email)}`)
        .push( { titulo: publicacao.titulo } )
        .then((resposta: any) => {

            let nomeImagem = resposta.key

            firebase.storage().ref()
                .child(`imagens/${nomeImagem}`)
                .put(publicacao.imagem)
                .on(firebase.storage.TaskEvent.STATE_CHANGED,
                    //acompanhamento do progresso do upload
                    (snapshot: any) => {
                        this.progresso.status = 'andamento'
                        this.progresso.estado = snapshot
                        //console.log(snapshot)
                    },
                    (error) => {
                        this.progresso.status = 'erro'
                    // console.log(error)
                    },
                    () => {
                        //finalização do processo
                        this.progresso.status = 'concluido'
                    // console.log('upload completo')
                
                    }
                )
            })
    }

    public consultaPublicacoes(email: string): any {

        firebase.database().ref(`publicacoes/${btoa(email)}`)
            .once('value')
            .then((snapshot: any) => {
                //console.log(snapshot.val())

                let publicacoes: Array<any> = []

                snapshot.forEach((childSnapshot: any) => {

                    let publicacao = childSnapshot.val()

                    //consultar url da imagem
                    firebase.storage().ref()
                        .child(`imagens/${childSnapshot.key}`)
                        .getDownloadURL()
                        .then((url: string) => {
                            publicacao.url_imagem = url

                            //consulta o nome do usuario
                            firebase.database().ref(`usuario_detalhe/${btoa(email)}`)
                                .once('value')
                                .then((snapshot: any) => {

                                    publicacao.nome_usuario = snapshot.val().nome_usuario

                                    publicacoes.push(publicacao)

                                })

                            publicacoes.push(publicacao)
                        })
                })
            })
    }
}