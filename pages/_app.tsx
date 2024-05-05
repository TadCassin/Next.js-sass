import '@root/global.scss';
import '@root/animations.scss';

import * as React from 'react';

import Providers from '@components/Providers';

function MyApp({ Component, pageProps }) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}

export default MyApp;
