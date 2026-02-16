import ol_style_FontSymbol from 'ol-ext/style/FontSymbol.js';
import rawFont from '/data/remix-icons-font.def.json?url&raw';

const font = JSON.parse(rawFont);

/* Copyright (c) 2014 by Jean-Marc.Viglino [at]ign.fr
* Dual-licensed under the CeCILL-B Licence (http://www.cecill.info/)
* and the Beerware license (http://en.wikipedia.org/wiki/Beerware),
* feel free to use and abuse it in your projects (the code, not the beer ;-).
*
* Font definiton to use with fontsymbols
*/
ol_style_FontSymbol.addDefs ({
  'font': font.meta.font,
  'name': font.meta.name,
  'copyright': font.meta.copyright,
  'prefix': font.meta.prefix,
}, font.icons);