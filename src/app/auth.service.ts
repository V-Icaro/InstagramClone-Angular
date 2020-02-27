import { Usuario } from './acesso/usuario.model'
import * as firebase from 'firebase'

export class Auth {

    public tokei_id: string

    public cadastrarUsuario(usuario: Usuario): Promise<any> {
        console.log('Chegamos até o serviço: ' , usuario)

        return firebase.auth().createUserWithEmailAndPassword(usuario.email, usuario.senha)
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

    public autenticar(email: string, senha: string): void {
    
        firebase.auth().signInWithEmailAndPassword(email, senha)
            .then((resposta: any) => {
                firebase.auth().currentUser.getIdToken()
                    .then((idToken: string) => {
                        this.tokei_id = idToken
                        console.log(this.tokei_id)
                    })
            })
            .catch((error: any) => console.log(error))
    }
}