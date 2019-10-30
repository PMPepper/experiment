import {useContext} from 'react';
import {StyleContext} from './contexts';

//Helpers
import css from '@/helpers/css/class-list-to-string';


//The hook
export default function useGetLayoutClasses(component, columns = 1, width = 1) {
  const styles = useContext(StyleContext);

  const componentStyle = styles[component];
  const columnsStyle = styles[`columns-${columns}`]
  const widthStyle = styles[`width-${width}`];

  return css(componentStyle, columnsStyle, widthStyle);
}
