import Charte from './objects/Charte.js';

// DSFR
import 'dsfrign/dist/core/core.module.min.js';
import 'dsfrign/dist/scheme/scheme.module.min.js';
import 'dsfrign/dist/component/header/header.module.min.js';
import 'dsfrign/dist/component/navigation/navigation.module.min.js';
import 'dsfrign/dist/component/button/button.module.min.js';
import 'dsfrign/dist/component/modal/modal.module.min.js';
import "dsfrign/dist/component/display/display.module.min.js";
import "dsfrign/dist/component/password/password.module.min.js";

import 'dsfrign/dist/dsfr.min.css';
import 'dsfrign/dist/utility/icons/icons.min.css';

import './charte.scss'

/** Singleton */
const charte = new Charte;

export default charte;