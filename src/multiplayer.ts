import './main.scss';
import 'moment-duration-format';
import AppMulti from './classes/app/app-multi';

const app = new AppMulti();

app.initialize(document.getElementById('app')).then(() => {
    console.log('Initialized');
}).catch(console.error);
