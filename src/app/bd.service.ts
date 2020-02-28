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

    public consultaPublicacoes(emailUsuario: string): Promise<any> {

        return new Promise((resolve, reject) => {

            //consultar as publicações (database)
            firebase.database().ref(`publicacoes/${btoa(emailUsuario)}`)
            .orderByKey()
            .once('value')
            .then((snapshot: any) => {
                //console.log(snapshot.val())

                let publicacoes: Array<any> = [];

                snapshot.forEach((childSnapshot: any) => {

                    let publicacao = childSnapshot.val()
                    publicacao.key = childSnapshot.key

                    
                    publicacoes.push(publicacao)                   
                })

                //console.log(publicacoes)
                //resolve(publicacoes)

                return publicacoes.reverse()
            })
            .then((publicacoes: any) => {
                
                publicacoes.forEach((publicacao) => {

                    //consultar a url da imagem (storage)
                    firebase.storage().ref()
                        .child(`imagens/${publicacao.key}`)
                        .getDownloadURL()
                        .then((url: string) => {
                            
                            publicacao.url_imagem = url

                            //consultar o nome do usuário
                            firebase.database().ref(`usuario_detalhe/${btoa(emailUsuario)}`)
                                .once('value')
                                .then((snapshot: any) => {
                                    
                                    publicacao.nome_usuario = snapshot.val().nome_usuario
                                })
                        })
                })

                resolve(publicacoes)

            })

        })

    }
}