import * as test_actions from './test_actions';
import * as map_actions from './map_actions';

const rootActions = {
    ...test_actions,
    ...map_actions
}

export default rootActions;