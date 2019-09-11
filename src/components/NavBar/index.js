import React from 'react';
import cx from 'classnames';

import s from './index.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { addNewArticle, toggleDark } from '../../store/actions/rootActions';
import { Icon } from '@material-ui/core';
import Toolbar from '../Toolbar';

function NavBar({ editorRef }) {
  const dispatch = useDispatch();
  const isDark = useSelector(state => state.root.isDark);
  const onClick = () => {
    dispatch(toggleDark());
  };

  const onClickNew = () => {
    dispatch(addNewArticle());
  };

  return (
    <div className={s.root}>
      <div className={s.left}>
        <button className={s.button} onClick={onClickNew}>New</button>
        <div
          className={cx(s.color, { [s.color_active]: isDark })}
          onClick={onClick}
        >
          <Icon>invert_colors</Icon>
        </div>
      </div>
      <div className={s.right}>
        <Toolbar editorRef={editorRef} />
      </div>
    </div>
  );
}

export default NavBar;
