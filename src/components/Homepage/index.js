import React, { useRef } from 'react';
import cx from 'classnames';

import s from './index.module.scss';
import NavBar from '../NavBar';
import { useSelector } from 'react-redux';
import LeftPanel from '../LeftPanel';
import RichEditor from '../RichEditor';

function Homepage() {
  const isDark = useSelector(state => state.root.isDark);
  const editor = useRef();
  return (
    <div className={cx(s.root, { [s.root_dark]: isDark })}>
      <NavBar editorRef={editor} />
      <div className={s.container}>
        <LeftPanel />
        <RichEditor forwardedRef={editor} />
      </div>
    </div>
  );
}

export default Homepage;
