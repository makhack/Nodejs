var path = require('path'),
    routes = require('./routes'),
    exhbs = require('express-handlebars'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler')
    multer = require('multer');
    
    module.exports = function(app){
        //configuration du moteur de vue handlerbars
        // on le creer, puis le rend disponible pour express (via app.engine)
        // en même temps, on configure ses parametres et associe l'extension
        // .handlebars à ce moteur
        app.engine('handlebars', exhbs.create( { 
            defaultLayout: 'main',
            layoutsDir: app.get('views') + '/layouts',      // ici je peu définir directement un repertoir 
            partialsDir: [app.get('views') + '/partials']   // au cas ou plusieur
         }).engine)
         // on selectionne ce moteur
         app.set('view engine', 'handlebars');
         
         // morgan est un filtre (middleware) pour le logging du serveur
         app.use(morgan('dev'));
         
         // mise en place de la gestion simplifiée des formulaires et url encodés
         app.use(bodyParser.urlencoded({'extend' : true}));
         
         //mise en place de multer, qui gere l'upload des fichiers en provenance
         // d'un champ de type file.
         // il peu gerer des uploads multiple.
         // le paramettre dest lui indique ou placer els fichiers temporaires uploadés
         app.use(multer({dest: path.join(__dirname, '../tmp/upload')}).any());
         
         // mise en place de method-override ( gestion des requettes put, delete, etc)
         // même si le navigateur ne le supporte pas
         app.use(methodOverride());
         
         app.use(cookieParser('ma-valeur-secrete'));
         
         routes(app);// mise en place des routes
         
         //serveur de contenu statique (.js, img, css, html ...)
         app.use('/public/', express.static(path.join(__dirname, '../public')));
         
         //error détaillées en mode développement
         if('development' === app.get('env')){
             app.use(errorHandler());
         }
         
         return app;
    }