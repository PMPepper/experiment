import React from 'react';

import defaultStyles from './styles.scss';

import combineProps from '@/helpers/react/combine-props';

export default function Panel({
  title, headerBtns, footer, children, styles,
  component: Component,
  headerComponent: HeaderComponent,
  bodyComponent: BodyComponent,
  footerComponent: FooterComponent,
  titleComponent: TitleComponent,
  headerProps,
  footerProps,
  ...rest
}) {
  return <Component {...combineProps(rest, {className: styles.panel})}>
    <HeaderComponent {...combineProps({className: styles.header}, headerProps)}>
      <TitleComponent className={styles.title}>{title}</TitleComponent>
      {headerBtns && <div className={styles.headerBtns}>{headerBtns}</div>}
    </HeaderComponent>
    <BodyComponent className={styles.body}>{children}</BodyComponent>
    {footer && <FooterComponent {...combineProps({className: styles.footer}, footerProps)}>{footer}</FooterComponent>}
  </Component>
}

Panel.defaultProps = {
  styles: defaultStyles,
  component: 'article',
  headerComponent: 'header',
  bodyComponent: 'div',
  footerComponent: 'footer',
  titleComponent: 'h1',
  header: null,
  footer: null,
  headerProps: null,
  footerProps: null,
};
