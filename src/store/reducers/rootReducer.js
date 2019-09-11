import {
  ADD_NEW_ARTICLE,
  CHANGE_ACTIVE_ARTICLE,
  SET_EDITOR_STATE,
  TOGGLE_DARK,
  TOGGLE_STAR_ARTICLE,
  TOGGLE_STAR_FILTER
} from '../actions/rootActions';
import { Value } from 'slate';
import moment from 'moment';

const getRandomStr = () =>
  Math.random()
    .toString(36)
    .substr(2, 5);

const getNewArticle = () => {
  return {
    [getRandomStr()]: {
      isStar: false,
      timestamp: moment().unix(),
      data: {
        document: {
          nodes: [
            {
              object: 'block',
              type: 'TITLE',
              nodes: [
                {
                  object: 'text',
                  text: 'Article Title'
                }
              ]
            },
            {
              object: 'block',
              type: 'PARAGRAPH',
              nodes: [
                {
                  object: 'text',
                  text: 'A line of text in a paragraph.'
                }
              ]
            }
          ]
        }
      }
    }
  };
};

const getList = () => {
  if (localStorage.getItem('list')) {
    return JSON.parse(localStorage.getItem('list'));
  }
  const list = getNewArticle();
  localStorage.setItem('list', JSON.stringify(list));
  return list;
};

const getOrder = () => {
  if (localStorage.getItem('order')) {
    return JSON.parse(localStorage.getItem('order'));
  }
  const order = Object.keys(getList());
  localStorage.setItem('order', JSON.stringify(order));
  return order;
};

const saveInLocalStorage = list => {
  const order = Object.keys(list);
  try {
    localStorage.setItem('order', JSON.stringify(order));
    localStorage.setItem('list', JSON.stringify(list));
  } catch (e) {
    console.log(e);
  }
};

const initialState = {
  isStar: false,
  isDark: false,
  list: getList(),
  order: getOrder(),
  editorState: Value.fromJSON(getList()[getOrder()[0]].data),
  current: getOrder()[0]
};

const rootReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case TOGGLE_DARK: {
      return {
        ...state,
        isDark: !state.isDark
      };
    }
    case SET_EDITOR_STATE: {
      const list = {
        ...state.list,
        [state.current]: {
          ...state.list[state.current],
          data: payload.editorState.toJSON()
        }
      };
      saveInLocalStorage(list);
      return {
        ...state,
        editorState: payload.editorState,
        list
      };
    }
    case ADD_NEW_ARTICLE: {
      const article = getNewArticle();
      const id = Object.keys(article)[0];

      const list = {
        ...state.list,
        ...article
      };

      saveInLocalStorage(list);

      return {
        ...state,
        list,
        order: [...state.order, id],
        editorState: Value.fromJSON(article[id].data),
        current: id
      };
    }
    case CHANGE_ACTIVE_ARTICLE: {
      return {
        ...state,
        editorState: Value.fromJSON(state.list[payload.id].data),
        current: payload.id
      };
    }
    case TOGGLE_STAR_ARTICLE: {
      return {
        ...state,
        list: {
          ...state.list,
          [payload.id]: {
            ...state.list[payload.id],
            isStar: !state.list[payload.id].isStar
          }
        }
      };
    }
    case TOGGLE_STAR_FILTER: {
      return {
        ...state,
        isStar: !state.isStar
      };
    }
    default:
      return state;
  }
};

export default rootReducer;
