let initialState = {
	id: ''
}

export const reducer = (state = initialState, action) => {

	switch (action.type) {

		case 'ADD_ID': return { id: action.payload }

		default: return state
	}


}