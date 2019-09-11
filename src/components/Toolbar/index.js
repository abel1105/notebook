import React, { useRef } from 'react';
import cx from 'classnames';
import { BLOCK, INLINE } from '../../configs/editor';
import { Icon } from '@material-ui/core';
import s from './index.module.scss';
import { useSelector } from 'react-redux';

const inlines = [
  {
    type: INLINE.BOLD,
    icon: 'format_bold'
  },
  {
    type: INLINE.ITALIC,
    icon: 'format_italic'
  },
  {
    type: INLINE.UNDERLINE,
    icon: 'format_underlined'
  }
];

const blocks = [
  {
    type: BLOCK.TITLE,
    icon: 'title'
  },
  {
    type: BLOCK.BULLET_LIST,
    icon: 'format_list_bulleted'
  },
  {
    type: BLOCK.NUMBER_LIST,
    icon: 'format_list_numbered'
  },
  {
    type: BLOCK.BLOCKQUOTE,
    icon: 'format_quote'
  },
  {
    type: BLOCK.IMAGE,
    icon: 'insert_photo'
  }
];

function Toolbar({ editorRef }) {
  const input = useRef();
  const editorState = useSelector(state => state.root.editorState);
  const hasMark = type =>
    editorState.activeMarks.some(mark => mark.type === type);
  const hasBlock = type => editorState.blocks.some(node => node.type === type);

  const onClickMark = (e, type) => {
    e.preventDefault();
    editorRef.current.toggleMark(type);
  };

  const insertImage = (editor, src) => {
    editor.insertBlock({
      type: BLOCK.IMAGE,
      data: { src }
    });
  };

  const onFileInput = e => {
    // eslint-disable-next-line no-unused-vars
    for (let file of e.target.files) {
      const reader = new FileReader();
      const [mime] = file.type.split('/');
      if (mime !== 'image') continue;

      reader.addEventListener('load', () => {
        editorRef.current.command(insertImage, reader.result);
      });

      reader.readAsDataURL(file);
    }
  };

  const onClickBlock = (e, type) => {
    e.preventDefault();
    const editor = editorRef.current;
    const { value } = editor;
    const { document } = value;

    if (type === BLOCK.IMAGE) {
      input.current.click();
    } else if (type !== BLOCK.BULLET_LIST && type !== BLOCK.NUMBER_LIST) {
      // Handle everything but list buttons.
      const isActive = hasBlock(type);
      const isList = hasBlock(BLOCK.LIST_ITEM);

      if (isList) {
        editor
          .setBlocks(isActive ? BLOCK.PARAGRAPH : type)
          .unwrapBlock(BLOCK.BULLET_LIST)
          .unwrapBlock(BLOCK.NUMBER_LIST);
      } else {
        editor.setBlocks(isActive ? BLOCK.PARAGRAPH : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = hasBlock(BLOCK.LIST_ITEM);
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type);
      });

      if (isList && isType) {
        editor
          .setBlocks(BLOCK.PARAGRAPH)
          .unwrapBlock(BLOCK.BULLET_LIST)
          .unwrapBlock(BLOCK.NUMBER_LIST);
      } else if (isList) {
        editor
          .unwrapBlock(
            type === BLOCK.BULLET_LIST ? BLOCK.NUMBER_LIST : BLOCK.BULLET_LIST
          )
          .wrapBlock(type);
      } else {
        editor.setBlocks(BLOCK.LIST_ITEM).wrapBlock(type);
      }
    }
  };

  return (
    <div className={s.root}>
      {inlines.map(inline => {
        return (
          <div
            className={cx(s.button, {
              [s.button_active]: hasMark(inline.type)
            })}
            key={inline.type}
            onMouseDown={e => onClickMark(e, inline.type)}
          >
            <Icon>{inline.icon}</Icon>
          </div>
        );
      })}
      {blocks.map(block => {
        let isActive = hasBlock(block.type);
        if ([BLOCK.NUMBER_LIST, BLOCK.BULLET_LIST].includes(block.type)) {
          const { document, blocks } = editorState;
          if (blocks.size > 0) {
            const parent = document.getParent(blocks.first().key);
            isActive =
              hasBlock(BLOCK.LIST_ITEM) && parent && parent.type === block.type;
          }
        }

        return (
          <div
            className={cx(s.button, {
              [s.button_active]: isActive
            })}
            key={block.type}
            onMouseDown={e => onClickBlock(e, block.type)}
          >
            <Icon>{block.icon}</Icon>
          </div>
        );
      })}
      <input
        ref={input}
        type="file"
        onChange={onFileInput}
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default Toolbar;
