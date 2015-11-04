import mapValues from 'lodash/object/mapValues';

import Alt from 'alt';
import makeFinalStore from 'alt/utils/makeFinalStore';

import AltResolver from '../../shared/alt-resolver';

import * as stores from './stores/index';
import * as actions from './actions/index';

class Flux extends Alt {

  constructor(client, config = {}) {
    super(config);

    // Use `this.alt.resolve` for async actions
    // needed for SSR
    this.resolver = new AltResolver();

    // Bind the ApiClient to flux instance
    // access to it in actions with `this.alt.request`
    this.request = ::client.request;

    // Load actions into alt
    mapValues(actions, (action, name) => this.addActions(name, action));
    // Load stores into alt
    mapValues(stores, (store, name) => this.addStore(name, store));

    // Our `FinalStore` for using `connect-alt`
    this.FinalStore = makeFinalStore(this);
  }

  resolve(action) {
    this.resolver.resolve(action);
  }

}

export default function(config) { return new Flux(config); }