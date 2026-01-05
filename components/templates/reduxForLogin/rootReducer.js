import { combineReducers } from 'redux'
import { modulesData} from './reducer'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'

const persistConfig = {
    key: 'root',
    storage
}
const rootReducer = combineReducers({
    login: modulesData,
})

export default persistReducer(persistConfig, rootReducer)