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
charte.addPartner('IGN', 'https://www.ign.fr/', 'https://data.geopf.fr/annexes/ressources/footer/ign.png', true);
charte.addPartner('Ministère de la transformation et de la fonction publiques', 'https://www.transformation.gouv.fr/', 'https://data.geopf.fr/annexes/ressources/footer/min_fp.jpg');
charte.addPartner('Ministère de la Transition Écologique et de la Cohésion des Territoires', 'https://www.ecologie.gouv.fr/', 'https://data.geopf.fr/annexes/ressources/footer/min_ecologie.jpg');
charte.addPartner('Conseil national de l\'information géolocalisée', 'https://cnig.gouv.fr/', 'https://data.geopf.fr/annexes/ressources/footer/rf_cnig.jpg');

// Main links
charte.addContentLink('https://www.info.gouv.fr/');
charte.addContentLink('https://service-public.gouv.fr/');
charte.addContentLink('https://legifrance.gouv.fr/');
charte.addContentLink('https://data.gouv.fr/');

// Footer links
charte.addFooterLink('Plan du site', 'https://cartes.gouv.fr/plan-du-site');
charte.addFooterLink('Accessibilité : partiellement conforme', 'https://cartes.gouv.fr/accessibilite');
charte.addFooterLink('Mentions légales', 'https://cartes.gouv.fr/mentions-legales');
charte.addFooterLink("Conditions générales d'utilisation", 'https://cartes.gouv.fr/cgu');
charte.addFooterLink('Données personnelles', 'https://cartes.gouv.fr/donnees-personnelles');
charte.addFooterLink('Gestion des cookies', '#');
charte.addFooterButton('Paramètres d\'affichage', {
  icon: 'fr-icon-theme-fill',
  title: "Paramètres d'affichage",
  'aria-controls': displayDialog.id,
  'data-fr-opened': false,
});
