import story, { carte } from "./story";

// Titre
story.on("change:title", (e) => {
  const title = e.target.get(e.key);
  // La méthode story.setTitle modifie aussi le nom du document
  // Ce qu'on ne souhaite pas
  document.title = "Éditeur de cartes | Cartes.gouv.fr";
})
