import './main.scss';
import AppList from './classes/app/app-list';

const app = new AppList();

app.initialize(document.getElementById('app')).then(() => {
    console.log('Initialized');
}).catch(console.error);
