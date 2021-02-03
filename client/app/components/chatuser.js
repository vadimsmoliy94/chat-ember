import Component from '@glimmer/component';
import io from 'socket.io-client';///dist/socket.io';

export default class ChatuserComponent extends Component {
    constructor(...args) {
        super(...args);

        console.log('1')
    }
    socket = io('http://localhost:3000');
}
