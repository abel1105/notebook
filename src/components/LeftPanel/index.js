import React from 'react';
import cx from 'classnames';

import s from './index.module.scss';
import { Icon } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeActiveArticle,
  toggleStarArticle,
  toggleStarFilter
} from '../../store/actions/rootActions';

function LeftPanel() {
  const dispatch = useDispatch();
  const isStar = useSelector(state => state.root.isStar);
  const list = useSelector(state => state.root.list);
  const order = useSelector(state => state.root.order);
  const current = useSelector(state => state.root.current);

  const onClickArticle = id => () => {
    dispatch(changeActiveArticle(id));
  };

  const onClickStar = id => () => {
    dispatch(toggleStarArticle(id));
  };

  const onClickStarFilter = () => {
    dispatch(toggleStarFilter());
  };

  return (
    <div className={s.root}>
      <div className={s.top}>
        <b>INBOX</b>
        <div onClick={onClickStarFilter}>
          <Icon>{isStar ? 'star' : 'star_border'}</Icon>
        </div>
      </div>
      <div className={s.container}>
        {order.map(articleId => {
          if (isStar && !list[articleId].isStar) {
            return null;
          }

          return (
            <div
              key={articleId}
              className={cx(s.article, {
                [s.article_active]: articleId === current
              })}
              onClick={onClickArticle(articleId)}
            >
              <div className={s.title}>
                <b className={s.title_text}>
                  {list[articleId].data.document.nodes[0]
                    ? list[articleId].data.document.nodes[0].nodes[0].text
                    : ''}
                </b>
                <div onClick={onClickStar(articleId)}>
                  <Icon>{list[articleId].isStar ? 'star' : 'star_border'}</Icon>
                </div>
              </div>
              <div className={s.time}>2 days ago</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LeftPanel;
