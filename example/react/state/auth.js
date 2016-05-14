import actions from 'redux-ish';
import { login } from '../lib/api';

export default actions('auth', { initialState }, {
  logout: () => ({}),
  
  login: ({ username, password }) => async (state, dispatch) => {
    if (!state.current.loading) {
      state({ loading: true });
      try {
        let user = await login(username, password);
        state({ user, error: user ? null : 'ERR_LOGINFAILED' });
      } catch(ex) {
        state({ error: ex.message });
      }
    }
  }
});
