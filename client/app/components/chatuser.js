import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import io from 'socket.io-client';


export default class MessagesListComponent extends Component {
    @tracked messages = [
        {
            userName: 'bot',
            text: 'Hello',
        },
    ]
    @tracked users = [];

    @tracked userName
    @tracked inputText

    constructor(...args) {
        super(...args)

        this.socket = io('http://localhost:3000')


        const userName = localStorage.getItem('userName')

        this.socket.on('nameIsBusy', () => {
            alert('Це імя вже існує. Введіть інше')

            this.initUserName()
        })

        this.socket.on('userInitialized', (userName) => {
            this.userName = userName

            localStorage.setItem('userName', userName)
        })

        this.socket.on('newMessage', this.updateMessages)
        this.socket.on('usersChanged', this.changeUsers)

        if (!userName) {
            this.initUserName()
        } else {
            this.socket.emit('initUser', userName)
        }
    }

    initUserName() {
        const userName = prompt('Введіть ваше імя')

        if (!userName) {
            return this.initUserName()
        }

        this.socket.emit('initUser', userName)
    }



    @action onSendMessage(e) {
        e.preventDefault();
        this.inputText = e.target[0].value;
        this.socket.emit('newMessage', {
            userName: this.userName,
            text: this.inputText,
        })
        e.target[0].value = '';

    }


    @action updateMessages(msg) {
        this.messages = [...this.messages, msg]
    }

    @action changeUsers(newUsers) {
        this.users = newUsers
    }
}

