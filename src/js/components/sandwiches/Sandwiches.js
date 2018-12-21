import React from 'react';
import { withRouter } from 'react-router-dom';
import Tabs from '@/components/tabs/Tabs';

function Sandwiches({match, history}) {
  return <div>
    <h2>Lazy Sandwiches</h2>
    <Tabs selectedTabIndex={+match.params.id || 0} setSelectedTabIndex={(newTabIndex) => {history.push(`/sandwiches/${newTabIndex}`)}}>
      <p key="tab1" tab-title="Hello world">This is a tab content for the first tab.</p>
      <p key="tab2" tab-title="Foo bar">This is a tab content for the second tab. Some more text. Lorem ipsum dolor sit amet, etc etc etc. Lorem ipsum dolor sit amet, etc etc etc. Lorem ipsum dolor sit amet, etc etc etc. Lorem ipsum dolor sit amet, etc etc etc. Lorem ipsum dolor sit amet, etc etc etc. </p>
      <p key="tab3" tab-title="Tab three">This is a tab content for the <b>third</b> tab!</p>
      <p key="tab4" tab-title="Tab four">This is a tab content for the <b>fourth</b> tab!</p>
      <p key="tab5" tab-title="Tab five">This is a tab content for the <b>fifth</b> tab!</p>
      <p key="tab6" tab-title="Tab size">This is a tab content for the <b>sixth</b> tab!</p>
    </Tabs>
  </div>
}


export default withRouter(Sandwiches);
