import './main.scss';
import 'moment-duration-format';
import AppSingle from './classes/app/app-single';

const app = new AppSingle();

app.initialize(document.getElementById('app')).then(() => {
    console.log('Initialized');
}).catch(console.error);
