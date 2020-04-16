import { UserActions, UserState } from "./index";
import { UserActionsTypes } from './user.actions';

const INITIAL_STATE: UserState | null = null;

const userReducer = ( state = INITIAL_STATE, action: UserActions ): UserState | null => {
    switch (action.type) {
	    case UserActionsTypes.SET_USER:
	    	return action.payload
	    case UserActionsTypes.CLEAR_USER:
	    	return null;
	    default:
            return state;
    }
};

export default userReducer;