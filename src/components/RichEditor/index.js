import React from 'react';
import cx from 'classnames';
import { Editor } from 'slate-react';
import { Block } from 'slate';
import s from './index.module.scss';
import { BLOCK, INLINE } from '../../configs/editor';
import { useDispatch, useSelector } from 'react-redux';
import { setEditorState } from '../../store/actions/rootActions';

const renderMark = (props, editor, next) => {
  const { children, mark, attributes } = props;
  switch (mark.type) {
    case INLINE.BOLD:
      return <strong {...attributes}>{children}</strong>;
    case INLINE.ITALIC:
      return <em {...attributes}>{children}</em>;
    case INLINE.UNDERLINE:
      return <u {...attributes}>{children}</u>;
    default:
      return next();
  }
};

const renderBlock = (props, editor, next) => {
  const { attributes, children, node, isFocused } = props;

  switch (node.type) {
    case BLOCK.BLOCKQUOTE:
      return (
        <blockquote className={s.blockquote} {...attributes}>
          {children}
        </blockquote>
      );
    case BLOCK.BULLET_LIST:
      return <ul {...attributes}>{children}</ul>;
    case BLOCK.TITLE:
      return <h1 {...attributes}>{children}</h1>;
    case BLOCK.LIST_ITEM:
      return <li {...attributes}>{children}</li>;
    case BLOCK.NUMBER_LIST:
      return <ol {...attributes}>{children}</ol>;
    case BLOCK.IMAGE: {
      const src = node.data.get('src');
      return (
        <img
          {...attributes}
          alt=""
          src={src}
          className={cx(s.img, { [s.img_focused]: isFocused })}
        />
      );
    }
    default:
      return next();
  }
};

const schema = {
  document: {
    last: { type: BLOCK.PARAGRAPH },
    normalize: (editor, { code, node, child }) => {
      if (code === 'last_child_type_invalid') {
        const paragraph = Block.create(BLOCK.PARAGRAPH);
        return editor.insertNodeByKey(node.key, node.nodes.size, paragraph);
      }
    }
  },
  blocks: {
    [BLOCK.IMAGE]: {
      isVoid: true
    }
  }
};

function RichEditor({ forwardedRef }) {
  const dispatch = useDispatch();
  const editorState = useSelector(state => state.root.editorState);

  const editorOnChange = ({ value }) => {
    dispatch(setEditorState(value));
  };

  return (
    <div className={s.root}>
      <Editor
        ref={forwardedRef}
        value={editorState}
        schema={schema}
        onChange={editorOnChange}
        renderMark={renderMark}
        renderBlock={renderBlock}
      />
    </div>
  );
}

export default RichEditor;
