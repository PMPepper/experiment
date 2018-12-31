import React from 'react';

import defaultStyles from './styles.scss';

//Helpers
import combineProps from '@/helpers/react/combine-props';
import isDOMComponent from '@/helpers/react/is-dom-component';


//The component
export default function Panel({
  title, headerBtns, footer, children, styles,
  component: Component,
  headerComponent: HeaderComponent,
  bodyComponent: BodyComponent,
  footerComponent: FooterComponent,
  titleComponent: TitleComponent,
  headerProps,
  footerProps,
  getRef,
  ...rest
}) {
  return <Component {...combineProps(rest, {className: styles.panel, [isDOMComponent(Component) ? 'ref' : 'getRef']: getRef})}>
    <HeaderComponent {...combineProps({className: styles.header}, headerProps)}>
      <TitleComponent className={styles.title}>{title}</TitleComponent>
      {headerBtns && <div className={`${styles.headerBtns} alignEnd`} onMouseDown={stopPropagation}>{headerBtns}</div>}
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

function stopPropagation(e) {
  e.stopPropagation();
}
