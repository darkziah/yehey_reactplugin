import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Redirect } from "react-router-dom";
import App from './App';
import * as serviceWorker from './serviceWorker';
import { IonApp, IonRouterOutlet, } from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';

import Create from './views/Create'

import "./assets/vendor/nucleo/css/nucleo.css";
import "./assets/vendor/font-awesome/css/font-awesome.min.css";
import "./assets/css/argon-design-system-react.min.css";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

ReactDOM.render(
    <IonApp>
        <IonReactRouter>
            <IonRouterOutlet>
                <Route path="/plugin" render={() => <Redirect to="/" />} exact={true} />
                <Route path="/plugin" component={App} exact={true} />
                <Route path="/create" component={Create} exact={true} />
            </IonRouterOutlet>
        </IonReactRouter>
    </IonApp>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register(); 