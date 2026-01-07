import charte from './charte.js'
import displayDialog from '../dialogs/displayDialog.js'

// Set service info
charte.setService({
  service: 'Cartes.gouv.fr ',
  href: './',
  title: 'Accueil - Cartes.gouv.fr - IGN France',
  baseline: 'Le service public des cartes et données du territoire',
  operator: {
    logo: 'https://data.geopf.fr/annexes/ressources/header/cartes-gouv-logo.svg',
    darkLogo: 'https://data.geopf.fr/annexes/ressources/header/cartes-gouv-logo-dark.svg'
  },
  badge: {
    text: 'Créer',
    colorClass: 'fr-badge--yellow-tournesol',
    icon: 'fr-icon-brush-fill'
  }
});

charte.setDescription(`Cartes.gouv.fr est développé par l'Institut national de l'information géographique et forestière (IGN) 
  et ses partenaires. Le site s'appuie sur la Géoplateforme, la nouvelle infrastructure publique, 
  ouverte et collaborative des données géographiques.`
);

// Partner list / logo
charte.addPartner({
  alt: 'IGN',
  url: 'https://www.ign.fr/',
  img: 'https://data.geopf.fr/annexes/ressources/footer/ign.png',
  main: true
});
charte.addPartner({
  alt: 'Ministère de la transformation et de la fonction publiques',
  url: 'https://www.transformation.gouv.fr/',
  img: 'https://data.geopf.fr/annexes/ressources/footer/min_fp.jpg'
});
charte.addPartner({
  alt: 'Ministère de la Transition Écologique et de la Cohésion des Territoires',
  url: 'https://www.ecologie.gouv.fr/',
  img: 'https://data.geopf.fr/annexes/ressources/footer/min_ecologie.jpg'
});
charte.addPartner({
  alt: 'Conseil national de l\'information géolocalisée',
  url: 'https://cnig.gouv.fr/',
  img: 'https://data.geopf.fr/annexes/ressources/footer/rf_cnig.jpg'
});

// Main links
charte.addContentLink({
  href:
    'https://www.info.gouv.fr/'
});
charte.addContentLink({
  href:
    'https://service-public.gouv.fr/'
});
charte.addContentLink({
  href:
    'https://legifrance.gouv.fr/'
});
charte.addContentLink({
  href:
    'https://data.gouv.fr/'
});

// Footer links
charte.addFooterLink({
  title: 'Plan du site',
  href: 'https://cartes.gouv.fr/plan-du-site'
});
charte.addFooterLink({
  title: 'Accessibilité : partiellement conforme',
  href: 'https://cartes.gouv.fr/accessibilite'
});
charte.addFooterLink({
  title: 'Mentions légales',
  href: 'https://cartes.gouv.fr/mentions-legales'
});
charte.addFooterLink({
  title: "Conditions générales d'utilisation",
  href: 'https://cartes.gouv.fr/cgu'
});
charte.addFooterLink({
  title: 'Données personnelles',
  href: 'https://cartes.gouv.fr/donnees-personnelles'
});
charte.addFooterLink({
  title: 'Gestion des cookies',
  href: '#'
});
charte.addFooterButton('Paramètres d\'affichage', {
  icon: 'fr-icon-theme-fill',
  title: "Paramètres d'affichage",
  'aria-controls': displayDialog.id,
  'data-fr-opened': false,
});
