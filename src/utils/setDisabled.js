/**
 * Active / désactive un input (ou id d'input) et applique la classe DSFR
 * `fr-xxxxx-group--disabled` sur le parent `fr-xxxxx-group`.
 * @param {HTMLInputElement|string} inputOrId Input ciblé ou son id
 * @param {boolean} disabled Etat disabled à appliquer
 */
function setDisabled (inputOrId, disabled) {
  const input = typeof inputOrId === 'string'
    ? document.getElementById(inputOrId)
    : inputOrId;

  if (!input || !('disabled' in input)) {
    return;
  }

  input.disabled = disabled;

  const parent = input.parentElement;
  if (!parent) {
    return;
  }

  const groupClassName = Array.from(parent.classList)
    .find((className) => /^fr-[a-z0-9-]+-group$/.test(className));

  if (!groupClassName) {
    return;
  }

  parent.classList.toggle(`${groupClassName}--disabled`, disabled);
}

export default setDisabled;