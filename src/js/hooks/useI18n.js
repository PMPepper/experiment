import React, {useContext} from 'react';

export const I18nContext = React.createContext(null);


export default function useI18n() {
  return useContext(I18nContext);
}
