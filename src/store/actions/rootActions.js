export const TOGGLE_DARK = 'TOGGLE_DARK';
export const SET_EDITOR_STATE = 'SET_EDITOR_STATE';
export const ADD_NEW_ARTICLE = 'ADD_NEW_ARTICLE';
export const CHANGE_ACTIVE_ARTICLE = 'CHANGE_ACTIVE_ARTICLE';
export const TOGGLE_STAR_ARTICLE = 'TOGGLE_STAR_ARTICLE';
export const TOGGLE_STAR_FILTER = 'TOGGLE_STAR_FILTER';

export const toggleDark = () => ({
  type: TOGGLE_DARK
});

export const setEditorState = editorState => ({
  type: SET_EDITOR_STATE,
  payload: {
    editorState
  }
});

export const addNewArticle = () => ({
  type: ADD_NEW_ARTICLE
});

export const changeActiveArticle = id => ({
  type: CHANGE_ACTIVE_ARTICLE,
  payload: {
    id
  }
});

export const toggleStarArticle = id => ({
  type: TOGGLE_STAR_ARTICLE,
  payload: {
    id
  }
});

export const toggleStarFilter = () => ({
  type: TOGGLE_STAR_FILTER
});
