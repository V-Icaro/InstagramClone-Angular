import { Usuario } from './acesso/usuario.model'
import * as firebase from 'firebase'

export class Auth {
    public cadastrarUsuario(usuario: Usuario): void {
        console.log('Chegamos até o serviço: ' , usuario)

        firebase.auth().createUserWithEmailAndPassword(usuario.email, usuario.senha)
            .then((resposta: any) => {

                //remover a senha do atributo senha do objeto usuario
                delete usuario.senha

                //registrando dados complementares do usuario no path email na base 64
                firebase.database().ref(`usuario_detalhe/${btoa(usuario.email)}`)
                    .set( usuario )
                

            })
            .catch((error: Error) => {
                console.log(error)
            })
    }
}