var path = require('path'),
    routes = require('./routes'),
    exphbs = require('express-handlebars'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler');

module.exports = function(app) {
    // configuration du moteur de vue handlebars
    // on le creer, puis le rend disponnible pour express (via app.engine)
    // en même temps, on configure ses parametres et associe l'extension
    // .handlebars à ce moteur
    app.engine('handlebars', exphbs.create( {
        defaultLayout: 'main',
        layoutsDir: app.get('views') + '/layouts',  // ici je peu définir directement un réperoire
        partialsDir: [app.get('views') + '/partials'] // au cas ou plusieurs, je peux utiliser un tableau       
    }).engine);
    // on séléctionne ce moteur
    app.set('view engine', 'handlebars');
    
    // morgan est un filtre(middleware) pour le logging du serveur
    app.use(morgan('dev'));
    
    // mise en place de la gestion simplifiée des formulaires et url encodés
    app.use(bodyParser.urlencoded({'extended' : true}));

        
    // mise en place de method-overide (gestion des requettes put, delete, etc)
    // même si le navigateur ne le supporte pas
    app.use(methodOverride());
    
    app.use(cookieParser('ma-valeur-secrete'));
    
    routes(app); // mise en place des routes
    
    // serveur de contenu statique (.js, img, css, html....)
    app.use('/public/', express.static(path.join(__dirname, '../public')));
    
    // erreur détaillées en mode développement
    if ('development' === app.get('env')) {
        app.use(errorHandler());
    }
    
    return app;
}