import charte from './charte.js'
import displasyDialog from '../displayDialog.js'

// Set service info
charte.setService({
  service: 'Cartes.gouv.fr <span class="fr-badge fr-badge--sm fr-badge--green-emeraude">BETA</span>',
  href: '/',
  title: 'Accueil - Cartes.gouv.fr - IGN France',
})
charte.setDescription(`Cartes.gouv.fr est développé par l\'Institut national de l\'information géographique et forestière (IGN) 
  et ses partenaires. Le site s\'appuie sur la Géoplateforme, la nouvelle infrastructure publique, 
  ouverte et collaborative des données géographiques.`
)

// Partner list / logo
charte.addPartner('IGN', 'https://www.ign.fr/', './icon/logo-ign.png', true)
charte.addPartner('Ministère de la transformation et de la fonction publiques', 'https://www.transformation.gouv.fr/', './icon/logo-transformation-fonction-publiques.png')
charte.addPartner('Ministère de la transition écologique et de la cohésion des territoires', 'https://www.ecologie.gouv.fr/', './icon/logo-transition-ecologique.png')
charte.addPartner('Conseil National de l’Information Géolocalisée', 'https://cnig.gouv.fr/', './icon/logo-cnig.png')

// Main links
charte.addContentLink('https://www.info.gouv.fr/')
charte.addContentLink('https://service-public.fr/')
charte.addContentLink('https://legifrance.gouv.fr/')
charte.addContentLink('https://data.gouv.fr/')

// Footer links
charte.addFooterLink('Plan du site', 'https://cartes.gouv.fr/plan-du-site')
charte.addFooterLink('Accessibilité : partiellement conforme', 'https://cartes.gouv.fr/accessibilite')
charte.addFooterLink('Mentions légales', 'https://cartes.gouv.fr/mentions-legales')
charte.addFooterLink('Données personnelles', 'https://cartes.gouv.fr/donnees-personnelles')
charte.addFooterLink('Gestion des cookies', '#')
charte.addFooterButton('Paramètres d\'affichage', {
  icon: 'fr-icon-theme-fill',
  title: "Paramètres d'affichage",
  'aria-controls': 'display-modal',
  'data-fr-opened': false,
})
